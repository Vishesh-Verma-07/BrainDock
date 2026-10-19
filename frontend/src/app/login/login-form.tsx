"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthError, AuthField } from "@/components/auth/auth-field";
import {
  AuthDivider,
  GoogleButton,
  googleErrorMessage,
} from "@/components/auth/google-button";

export function LoginForm({
  googleFailed = false,
  googleReason = "",
}: {
  googleFailed?: boolean;
  googleReason?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(
    googleFailed ? googleErrorMessage(googleReason, "in") : "",
  );
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await authApi.signin({
        email: String(fd.get("email")),
        password: String(fd.get("password")),
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where"
      accent="you left off."
      lead="Your saved ideas are waiting for you."
      footer={
        <>
          New to Brain Dock?{" "}
          <Link
            href="/signup"
            className="font-semibold text-foreground hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <GoogleButton label="Continue with Google" returnTo="/login" />
        <AuthDivider />
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
          autoComplete="current-password"
          placeholder="Your password"
        />
        <AuthError message={error} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
