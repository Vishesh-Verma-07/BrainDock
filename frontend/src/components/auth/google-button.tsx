"use client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

function GoogleMark() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l4-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.99 11.99 0 0 0 1.29 6.63l4 3.09C6.23 6.88 8.88 4.77 12 4.77Z"
      />
    </svg>
  );
}

/**
 * Starts the server-side Google OAuth flow. The backend handles the code
 * exchange and redirects back to the dashboard with the session cookie set.
 */
export function GoogleButton({
  label = "Continue with Google",
  returnTo = "/login",
  disabled = false,
}: {
  label?: string;
  returnTo?: "/login" | "/signup";
  disabled?: boolean;
}) {
  const href = `${API_URL}/user/google?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <a
      href={href}
      aria-disabled={disabled}
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-disabled:pointer-events-none aria-disabled:opacity-50"
    >
      <GoogleMark />
      {label}
    </a>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
