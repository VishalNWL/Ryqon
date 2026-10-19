"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/questions", label: "Questions" },
  { href: "/papers", label: "PYQ Papers" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-[family-name:var(--font-sora)] font-bold text-lg tracking-tight">
              Ry<span className="text-indigo-600">qon</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/admin"
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                  pathname.startsWith("/admin")
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {!isSignedIn ? (
              <>
                <SignInButton mode="redirect" forceRedirectUrl="/questions">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </SignInButton>
                <SignUpButton mode="redirect" forceRedirectUrl="/questions">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            {isSignedIn && (
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            )}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}

          {isSignedIn && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          )}

          {!isSignedIn && (
            <div className="flex gap-2 pt-2 border-t border-border">
              <SignInButton mode="redirect" forceRedirectUrl="/questions">
                <Button variant="outline" size="sm" className="flex-1">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="redirect" forceRedirectUrl="/questions">
                <Button
                  size="sm"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      )}
    </header>
  );
}