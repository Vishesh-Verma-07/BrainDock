"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Eye,
  ExternalLink,
  FolderLock,
  Globe,
  Link2,
  Lock,
  ShieldCheck,
  X,
} from "lucide-react";
import { ApiError, authApi, brainApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/dashboard/modal";
import { ItemShell } from "@/components/dashboard/item-shell";

const STORAGE_KEY = "brain-dock-share-link";
const STORAGE_EVENT = "brain-dock-share-link-change";

const subscribeLink = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
};
const readLink = () => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
};
const writeLink = (value: string) => {
  try {
    if (value) window.sessionStorage.setItem(STORAGE_KEY, value);
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

const sees = [
  "Every note and link you've saved",
  "Your collections and tags",
  "The name on your account",
];
const never = ["Your password and login details", "Any way to edit or delete your items"];

export default function ShareBrainPage() {
  const router = useRouter();
  const link = useSyncExternalStore(subscribeLink, readLink, () => "");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);
  const isPublic = Boolean(link);

  useEffect(() => {
    authApi.currentUser().catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const closeConfirm = useCallback(() => setConfirmStop(false), []);

  async function setSharing(enabled: boolean) {
    setLoading(true);
    try {
      const result = await brainApi.share(enabled);
      if (!enabled) {
        writeLink("");
        setConfirmStop(false);
        setNotice("Sharing turned off. The old link no longer works.");
        return;
      }
      const nextLink =
        result.shareLink ||
        (result.hash ? `${window.location.origin}/brain/${result.hash}` : "");
      if (!nextLink) throw new Error("The server did not return a share link.");
      writeLink(nextLink);
      setNotice("Your Brain Dock is now public.");
    } catch (error) {
      setConfirmStop(false);
      if (
        enabled &&
        error instanceof ApiError &&
        error.data &&
        typeof error.data === "object" &&
        "hash" in error.data
      ) {
        writeLink(`${window.location.origin}/brain/${String(error.data.hash)}`);
        setNotice("Sharing was already on. Here is your link.");
      } else {
        setNotice(error instanceof Error ? error.message : "Could not update sharing.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setNotice("Couldn't copy automatically. Select the link and copy it.");
    }
  }

  return (
    <ItemShell crumb={<span className="font-medium text-foreground">Share your Brain Dock</span>}>
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Share Brain Dock
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Share your <span className="text-gradient">knowledge.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Turn on a public link so anyone you choose can browse what you&apos;ve saved. You can turn it
          off at any time.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="space-y-6">
            <section
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
              aria-label="Sharing status"
            >
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      isPublic ? "bg-accent-soft text-accent" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isPublic ? <Globe className="h-5 w-5" aria-hidden /> : <Lock className="h-5 w-5" aria-hidden />}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 text-lg font-semibold">
                      {isPublic ? "Public" : "Private"}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                          isPublic ? "bg-accent-soft text-accent" : "bg-muted text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", isPublic ? "bg-accent" : "bg-muted-foreground/60")}
                          aria-hidden
                        />
                        {isPublic ? "Live" : "Off"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {isPublic
                        ? "Anyone with the link can view your entire Brain Dock."
                        : "Your Brain Dock is only visible to you."}
                    </p>
                  </div>
                </div>
                {isPublic ? (
                  <Button variant="secondary" showArrow={false} disabled={loading} onClick={() => setConfirmStop(true)}>
                    Make private
                  </Button>
                ) : (
                  <Button showArrow={false} icon={Globe} disabled={loading} onClick={() => setSharing(true)}>
                    {loading ? "Creating link…" : "Make public"}
                  </Button>
                )}
              </div>

              {isPublic && (
                <div className="mt-6 border-t border-border pt-6">
                  <label htmlFor="share-url" className="text-sm font-medium">
                    Your public link
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                      <Link2
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <input
                        id="share-url"
                        readOnly
                        value={link}
                        onFocus={(event) => event.currentTarget.select()}
                        className="h-11 w-full truncate rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-accent/30"
                      />
                    </div>
                    <Button showArrow={false} icon={copied ? Check : Copy} onClick={copy} className="h-11">
                      {copied ? "Copied!" : "Copy link"}
                    </Button>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium hover:border-foreground/20"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden /> Open
                    </a>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm" aria-label="What to share">
              <h2 className="text-lg font-semibold tracking-[-0.01em]">What are you sharing?</h2>
              <div className="mt-4 space-y-2.5" role="radiogroup" aria-label="Share scope">
                <div
                  role="radio"
                  aria-checked="true"
                  className="flex items-start gap-3 rounded-xl border border-accent/40 bg-accent-soft/60 p-4"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Entire Brain Dock</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      All notes, links, collections and tags are included.
                    </p>
                  </div>
                </div>
                {[
                  ["Selected collections", "Share only the collections you pick."],
                  ["Individual items", "Share a single note or link."],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    role="radio"
                    aria-checked="false"
                    aria-disabled="true"
                    className="flex items-start gap-3 rounded-xl border border-border p-4 opacity-60"
                  >
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-border" aria-hidden />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Coming soon
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-24" aria-label="How sharing works">
            <div>
              <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                <Eye className="h-4 w-4" aria-hidden /> What people see
              </h2>
              <ul className="mt-3 space-y-2.5">
                {sees.map((text) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden /> {text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                <FolderLock className="h-4 w-4" aria-hidden /> What stays private
              </h2>
              <ul className="mt-3 space-y-2.5">
                {never.map((text) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> {text}
                  </li>
                ))}
              </ul>
            </div>
            <p className="flex items-start gap-2.5 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              Turning sharing off disables the link straight away.
            </p>
          </aside>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[80] flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-xl bg-foreground px-4 py-3 text-sm text-background shadow-xl"
        >
          {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="text-background/70 hover:text-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {confirmStop && (
        <Modal eyebrow="Stop sharing" title="Make it" accent="private?" onClose={closeConfirm}>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The public link will stop working straight away. Anyone who has it will no longer be able
            to view your Brain Dock.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" showArrow={false} onClick={closeConfirm}>
              Keep sharing
            </Button>
            <Button showArrow={false} disabled={loading} onClick={() => setSharing(false)}>
              {loading ? "Updating…" : "Make private"}
            </Button>
          </div>
        </Modal>
      )}
    </ItemShell>
  );
}
