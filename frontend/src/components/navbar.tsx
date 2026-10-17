"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { AnchorButton } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    authApi
      .currentUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  async function logout() {
    setIsLoggingOut(true);
    try {
      await authApi.signout();
      setIsLoggedIn(false);
      setMobileOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          backgroundColor: scrolled ? "rgba(251, 249, 245, 0.85)" : "rgba(251, 249, 245, 0)",
          borderBottomColor: scrolled ? "var(--border)" : "transparent",
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b transition-shadow",
          scrolled && "shadow-sm"
        )}
      >
        <Container>
          <nav
            className="flex items-center justify-between h-16 md:h-18"
            aria-label="Primary"
          >
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Brain className="w-4 h-4" aria-hidden />
              </div>
              <span className="text-base font-semibold tracking-[-0.01em]">
                Brain Dock
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                >
                  {link.label}
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left" />
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2.5">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={logout}
                    disabled={isLoggingOut}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </button>
                  <AnchorButton href="/dashboard" size="sm" showArrow>
                    Dashboard
                  </AnchorButton>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 cursor-pointer">
                    Sign in
                  </Link>
                  <AnchorButton href="/signup" size="sm" showArrow>
                    Get started
                  </AnchorButton>
                </>
              )}
            </div>

            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-foreground/[0.05] transition-colors cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>
        </Container>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-sm"
          >
            <Container padded className="py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 text-base font-medium text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-border my-1" />
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={logout}
                    disabled={isLoggingOut}
                    className="px-3 py-2.5 text-left text-base font-medium text-muted-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </button>
                  <div className="pt-2">
                    <AnchorButton href="/dashboard" className="w-full justify-center" showArrow>
                      Dashboard
                    </AnchorButton>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2.5 text-base font-medium text-muted-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                  <div className="pt-2">
                    <AnchorButton href="/signup" className="w-full justify-center" showArrow>
                      Get started
                    </AnchorButton>
                  </div>
                </>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}