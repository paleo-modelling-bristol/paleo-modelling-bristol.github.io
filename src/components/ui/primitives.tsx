import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** Standard page banner used at the top of each public section. */
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <header className="border-b border-border bg-surface">
      <Container className="py-14 sm:py-20">
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-dark">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {intro ? (
          <div className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
            {intro}
          </div>
        ) : null}
      </Container>
    </header>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-serif text-3xl font-bold text-ink sm:text-4xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-paper shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small section label / eyebrow used to title cards consistently. */
export function CardEyebrow({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "accent" | "muted";
}) {
  const tones: Record<string, string> = {
    brand: "text-brand",
    accent: "text-accent-dark",
    muted: "text-muted",
  };
  return (
    <p
      className={cn(
        "text-xs font-bold uppercase tracking-widest",
        tones[tone],
      )}
    >
      {children}
    </p>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "accent" | "muted";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-surface-2 text-ink",
    brand: "bg-brand/10 text-brand",
    accent: "bg-accent/10 text-accent-dark",
    muted: "bg-surface-2 text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <p className="font-serif text-lg font-medium text-ink">{title}</p>
      {children ? <p className="mt-2 text-muted">{children}</p> : null}
    </div>
  );
}

type ButtonTone =
  | "brand"
  | "accent"
  | "outline"
  | "ghost"
  | "inverse"
  | "inverse-outline";

const buttonTones: Record<ButtonTone, string> = {
  // On light backgrounds
  brand: "bg-brand text-white hover:bg-brand-dark",
  accent: "bg-accent text-white hover:bg-accent-dark",
  outline:
    "border-2 border-brand bg-paper text-brand hover:bg-brand hover:text-white",
  ghost: "text-brand hover:bg-brand/10",
  // On dark/brand backgrounds (e.g. the home hero)
  inverse: "bg-white text-brand shadow-sm hover:bg-white/90",
  "inverse-outline":
    "border-2 border-white/70 text-white hover:border-white hover:bg-white/10",
};

export const buttonClass = (tone: ButtonTone = "brand", className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    buttonTones[tone],
    className,
  );

export function LinkButton({
  href,
  children,
  tone = "brand",
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  className?: string;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(tone, className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(tone, className)}>
      {children}
    </Link>
  );
}
