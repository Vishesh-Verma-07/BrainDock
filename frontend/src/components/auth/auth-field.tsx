"use client";

import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

const inputClass =
  "h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-foreground/40 focus:ring-2 focus:ring-accent/30";

export function AuthField({
  label,
  icon: Icon,
  type = "text",
  ...props
}: {
  label: string;
  icon: LucideIcon;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <span className="relative block">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          {...props}
          type={isPassword && show ? "text" : type}
          className={`${inputClass} ${isPassword ? "pr-11" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-1 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </span>
    </label>
  );
}

export function AuthError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {message}
    </p>
  );
}
