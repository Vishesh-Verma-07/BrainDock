import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/index";
import { issueSession, jwtSecret } from "../utility/session";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPES = ["openid", "email", "profile"];
const STATE_TTL = "10m";

const googleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return null;
  return new OAuth2Client(clientId);
};

type GoogleProfile = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  picture?: string;
};

function requireGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured on the server");
  }

  return { clientId, clientSecret };
}

/**
 * The redirect URI must exactly match one registered in Google Cloud Console.
 * `GOOGLE_CALLBACK_URL` should be set in production; the derived value keeps
 * local development working without extra configuration.
 */
/**
 * The redirect URI must exactly match one registered in Google Cloud Console,
 * and it must lead back to the host the browser used to start the flow —
 * otherwise the short-lived state cookie is never sent to this API.
 *
 * `GOOGLE_CALLBACK_URL` is honoured when its host matches the host the browser
 * is talking to. If it does not (for example it still points at the frontend
 * domain after moving the API to another host), the value derived from the
 * request is used instead and a warning is logged, so a stale variable cannot
 * silently break sign-in.
 */
function callbackUrl(req: Request) {
  const requestHost = req.get("host") || "";
  const forwardedHost =
    req.get("x-forwarded-host")?.split(",")[0]?.trim() || "";
  const browserHost = forwardedHost || requestHost;
  const derived = `${req.protocol}://${browserHost}/api/v1/user/google/callback`;

  const configured = process.env.GOOGLE_CALLBACK_URL?.trim().replace(
    /\/+$/,
    "",
  );
  if (!configured) return derived;

  let configuredHost = "";
  try {
    configuredHost = new URL(configured).host;
  } catch {
    configuredHost = "";
  }

  if (configuredHost && configuredHost === browserHost) return configured;

  console.warn(
    `GOOGLE_CALLBACK_URL points at "${configuredHost || configured}", but this ` +
      `request arrived on "${browserHost}". Using ${derived} so the OAuth ` +
      `state cookie can be returned; update GOOGLE_CALLBACK_URL to match.`,
  );
  return derived;
}

function frontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:3000")
    .trim()
    .replace(/\/+$/, "");
}

/**
 * `reason` is a coarse code (never an error message) so the login page can
 * show something useful without leaking server details.
 */
function frontendError(returnTo: string, reason: string) {
  const separator = returnTo.includes("?") ? "&" : "?";
  return `${frontendUrl()}${returnTo}${separator}error=google&reason=${encodeURIComponent(reason)}`;
}

/** Short-lived signed value that protects the OAuth redirect against CSRF. */
function createState(returnTo: string, redirectUri: string) {
  return jwt.sign(
    { purpose: "google-oauth", returnTo, redirectUri },
    jwtSecret(),
    { expiresIn: STATE_TTL },
  );
}

function readState(state: string) {
  try {
    const payload = jwt.verify(state, jwtSecret());
    if (typeof payload === "string" || payload.purpose !== "google-oauth") {
      return null;
    }
    return payload as jwt.JwtPayload & {
      returnTo?: string;
      redirectUri?: string;
    };
  } catch {
    return null;
  }
}

async function exchangeCode(code: string, redirectUri: string) {
  const { clientId, clientSecret } = requireGoogleConfig();

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const payload = (await response.json()) as {
    id_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !payload.id_token) {
    throw new Error(
      payload.error_description || payload.error || "Google sign-in failed",
    );
  }

  return payload.id_token;
}

async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const client = googleClient();
  if (!client) throw new Error("Google OAuth is not configured on the server");

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const profile = ticket.getPayload();
  if (!profile?.sub) throw new Error("Google account could not be verified");

  return profile as GoogleProfile;
}

/** Builds a username that is unique in the database. */
async function uniqueUsername(candidate: string, email: string) {
  const base = (candidate || email.split("@")[0] || "user")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 40);

  const root = base.length >= 3 ? base : `user-${base}`.slice(0, 40);

  let username = root;
  let suffix = 1;
  // The email is unique, so this loop always terminates.
  while (await UserModel.exists({ username })) {
    username = `${root.slice(0, 36)}-${suffix++}`;
  }
  return username;
}

async function findOrCreateGoogleUser(profile: GoogleProfile) {
  const email = profile.email?.toLowerCase();
  if (!email) throw new Error("Google account did not share an email address");

  const existingByGoogleId = await UserModel.findOne({ googleId: profile.sub });
  if (existingByGoogleId) return existingByGoogleId;

  const existingByEmail = await UserModel.findOne({ email });

  if (existingByEmail) {
    // Only link an existing password account when Google vouches for the
    // address; otherwise someone could pre-register another person's email.
    if (profile.email_verified === false) {
      throw new Error("Your Google email address is not verified");
    }
    existingByEmail.googleId = profile.sub;
    if (profile.picture) existingByEmail.profileImage = profile.picture;
    await existingByEmail.save();
    return existingByEmail;
  }

  return UserModel.create({
    username: await uniqueUsername(
      profile.name || profile.given_name || "",
      email,
    ),
    email,
    googleId: profile.sub,
    profileImage: profile.picture,
    // A random password keeps the account from ever being signed into with an
    // empty or guessable password; Google is the only way in.
    password: await bcrypt.hash(crypto.randomUUID(), 5),
  });
}

/**
 * Starts the Google OAuth flow by redirecting the browser to Google.
 * The client secret never reaches the browser.
 */
export const googleStart = (req: Request, res: Response) => {
  const returnTo = req.query.returnTo === "/signup" ? "/signup" : "/login";

  try {
    const { clientId } = requireGoogleConfig();

    // A signed state carries the page to return to after the callback, and the
    // exact redirect URI used for this request so the token exchange can reuse
    // it even if the host headers differ later.
    const redirectUri = callbackUrl(req);
    const state = createState(returnTo, redirectUri);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: GOOGLE_SCOPES.join(" "),
      state,
      access_type: "online",
      prompt: "select_account",
    });

    // Keep a copy of the state in a short-lived cookie so the callback can
    // prove the flow started in this browser (login CSRF protection).
    res.cookie("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
      path: "/api/v1/user/google",
    });

    res.redirect(`${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`);
  } catch (error) {
    console.error(
      "Google sign-in could not start:",
      error instanceof Error ? error.message : error,
    );
    res.redirect(frontendError(returnTo, "config"));
  }
};

/** Completes the flow: verifies Google's code, starts a session, redirects back. */
export const googleCallback = async (req: Request, res: Response) => {
  const code = typeof req.query.code === "string" ? req.query.code : "";
  const state = typeof req.query.state === "string" ? req.query.state : "";
  const oauthError = typeof req.query.error === "string" ? req.query.error : "";
  const cookieState = req.cookies?.google_oauth_state;

  res.clearCookie("google_oauth_state", {
    path: "/api/v1/user/google",
  });

  const statePayload = readState(state);
  const returnTo = statePayload?.returnTo === "/signup" ? "/signup" : "/login";

  const stateIsValid =
    Boolean(statePayload) &&
    typeof cookieState === "string" &&
    cookieState === state;

  if (oauthError || !code || !stateIsValid) {
    if (!oauthError && !cookieState) {
      // The usual cause is a callback URL on the frontend host that is not
      // proxied to this API, so the state cookie from the start request was
      // never sent here.
      console.warn(
        "Google callback arrived without the OAuth state cookie. " +
          `Request host: ${req.get("host")}; GOOGLE_CALLBACK_URL: ` +
          `${process.env.GOOGLE_CALLBACK_URL || "(derived)"}. If the callback ` +
          "points at the frontend domain, make sure /api is proxied to this API.",
      );
    }
    res.redirect(frontendError(returnTo, oauthError ? "cancelled" : "state"));
    return;
  }

  let step = "exchange";
  try {
    const idToken = await exchangeCode(
      code,
      typeof statePayload?.redirectUri === "string"
        ? statePayload.redirectUri
        : callbackUrl(req),
    );
    step = "verify";
    const profile = await verifyGoogleIdToken(idToken);
    step = "account";
    const user = await findOrCreateGoogleUser(profile);
    step = "session";
    issueSession(res, user._id);
    res.redirect(`${frontendUrl()}/dashboard`);
  } catch (error) {
    console.error(
      `Google sign-in failed during ${step}:`,
      error instanceof Error ? error.message : error,
    );
    res.redirect(frontendError(returnTo, step));
  }
};
