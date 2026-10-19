import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const FALLBACK_JWT_SECRET = "jasdklfjawofnwaeoign";

export function jwtSecret() {
  return process.env.JWT_SECRETE || FALLBACK_JWT_SECRET;
}

/**
 * Fails fast on boot instead of silently signing tokens with the committed
 * development fallback secret in production.
 */
export function assertProductionSecrets() {
  if (process.env.NODE_ENV !== "production") return;
  if (!process.env.JWT_SECRETE) {
    throw new Error("JWT_SECRETE must be set in production");
  }
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google sign-in is disabled: GOOGLE_CLIENT_ID/SECRET missing");
  }
}

const isProduction = () => process.env.NODE_ENV === "production";

/**
 * Session cookies are cross-site in production (frontend and API live on
 * different hosts), so they need SameSite=None + Secure there. Locally both
 * run over http on localhost, where SameSite=Lax works and Secure is not
 * required.
 */
export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/",
  };
}

export function signSessionToken(userId: Types.ObjectId | string) {
  return jwt.sign({ userId }, jwtSecret());
}

/** Sets the http-only session cookie for a signed-in user. */
export function issueSession(res: Response, userId: Types.ObjectId | string) {
  res.cookie("token", signSessionToken(userId), sessionCookieOptions());
}
