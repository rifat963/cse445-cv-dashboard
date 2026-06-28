import Link from "next/link";
import { ChevronLeft, ChevronRight, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";

type InternalNavDirection = "previous" | "next" | "back";

interface InternalNavButtonProps {
  href: string;
  direction: InternalNavDirection;
  label: string;
  title: string;
  className?: string;
}

export default function InternalNavButton({
  href,
  direction,
  label,
  title,
  className,
}: InternalNavButtonProps) {
  const isNext = direction === "next";
  const Icon = direction === "back" ? ListTree : isNext ? ChevronRight : ChevronLeft;

  return (
    <Link
      href={href}
      aria-label={`${label}: ${title}`}
      className={cn(
        "group inline-flex min-h-14 w-full min-w-0 items-center gap-3 rounded-md border border-[var(--border)]",
        "bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:border-[var(--academic)]/40 hover:bg-[var(--surface-2)] hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--academic)]",
        isNext ? "justify-end text-right" : "justify-start",
        className
      )}
    >
      {!isNext && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--surface-2)] text-[var(--academic)] transition-transform group-hover:-translate-x-0.5">
          <Icon size={17} aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">
          {label}
        </span>
        <span className="block truncate font-semibold leading-snug">{title}</span>
      </span>
      {isNext && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--surface-2)] text-[var(--academic)] transition-transform group-hover:translate-x-0.5">
          <Icon size={17} aria-hidden="true" />
        </span>
      )}
    </Link>
  );
}
