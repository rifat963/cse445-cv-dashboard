"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/lectures", label: "Lectures" },
  { href: "/lab-manual", label: "Lab Manual" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/assessment", label: "Assessment" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-5">
        <Link href="/" className="flex items-center gap-3 shrink-0 text-[var(--ink)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--academic)] text-white">
            <GraduationCap size={20} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">CSE445</span>
            <span className="block text-[11px] uppercase tracking-wide text-[var(--muted)]">Computer Vision</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 border-l border-[var(--border)] pl-4">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm transition-colors border-b-2",
                  active
                    ? "border-[var(--accent)] text-[var(--ink)] font-semibold"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button
            className="lg:hidden p-2 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-[var(--surface-2)] text-[var(--ink)] font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
