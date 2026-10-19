"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthError, AuthField } from "@/components/auth/auth-field";
import {
  AuthDivider,
  GoogleButton,
  googleErrorMessage,
} from "@/components/auth/google-button";

export function SignupForm({
  googleFailed = false,
  googleReason = "",
}: {
  googleFailed?: boolean;
  googleReason?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(
    googleFailed ? googleErrorMessage(googleReason, "up") : "",
  );
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password"));
    if (password.length < 8)
      return setError("Use at least 8 characters for your password.");
    setLoading(true);
    setError("");
    try {
      const email = String(fd.get("email"));
      await authApi.signup({
        username: String(fd.get("username")),
        email,
        password,
      });
      // Signup doesn't start a session, so sign the new user in right away.
      await authApi.signin({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Start your collection"
      title="A place for every"
      accent="good idea."
      lead="Create your personal knowledge space in seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-foreground hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <GoogleButton label="Sign up with Google" returnTo="/signup" />
        <AuthDivider />
        <AuthField
          label="Name"
          icon={User}
          required
          name="username"
          autoComplete="name"
          placeholder="Alex Morgan"
        />
        <AuthField
          label="Email"
          icon={Mail}
          required
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <AuthField
          label="Password"
          icon={Lock}
          required
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <AuthError message={error} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
