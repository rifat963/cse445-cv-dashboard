"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, GraduationCap, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { labModules } from "@/data/labs";
import { modules } from "@/data/modules";
import { tutorialSeries } from "@/data/tutorials";
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

const tutorialNavItems = tutorialSeries.map((series) => ({
  href: `/tutorials/${series.slug}`,
  label: series.title,
  description: series.subtitle,
}));

const dropdownNavItems: Record<string, Array<{ href: string; label: string; description: string }>> = {
  "/lectures": modules.map((mod) => ({
    href: `/lectures/${mod.slug}`,
    label: `Module ${mod.moduleNo}: ${mod.shortTitle}`,
    description: `${mod.lectureNos.length} lectures - ${mod.title}`,
  })),
  "/lab-manual": labModules.map((mod) => ({
    href: `/lab-manual/${mod.slug}`,
    label: `Module ${mod.moduleNo}: ${mod.title}`,
    description: `${mod.labIds.length} labs - ${mod.level}`,
  })),
  "/tutorials": tutorialNavItems,
};

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
            const dropdownItems = dropdownNavItems[link.href];

            if (dropdownItems) {
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm transition-colors border-b-2",
                      active
                        ? "border-[var(--accent)] text-[var(--ink)] font-semibold"
                        : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                      aria-hidden="true"
                    />
                  </Link>
                  <div className="invisible absolute left-0 top-full w-72 translate-y-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block rounded px-3 py-2 text-sm transition-colors",
                          pathname.startsWith(item.href)
                            ? "bg-[var(--surface-2)] text-[var(--ink)] font-semibold"
                            : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                        )}
                      >
                        <span className="block">{item.label}</span>
                        <span className="mt-1 block text-xs font-normal leading-snug text-[var(--muted)]">
                          {item.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

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
            const dropdownItems = dropdownNavItems[link.href];

            if (dropdownItems) {
              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                      active
                        ? "bg-[var(--surface-2)] text-[var(--ink)] font-semibold"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    )}
                  >
                    {link.label}
                    <ChevronDown size={14} aria-hidden="true" />
                  </Link>
                  <div className="mt-1 ml-3 flex flex-col gap-1 border-l border-[var(--border)] pl-3">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded px-3 py-2 text-sm transition-colors",
                          pathname.startsWith(item.href)
                            ? "bg-[var(--surface-2)] text-[var(--ink)] font-semibold"
                            : "text-[var(--muted)] hover:text-[var(--ink)]"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

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
