import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  // Evaluated at build time; the deploy workflow rebuilds (incl. a weekly cron),
  // so the year stays current.
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
        <div>
          <Image
            src="/bridge-logo.svg"
            alt="BRIDGE"
            width={324}
            height={177}
            className="h-12 w-auto"
          />
          <p className="mt-4 font-serif text-lg font-semibold text-ink">
            {SITE_NAME}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Part of BRIDGE, School of Geographical Sciences, University of
            Bristol. Founded 2002.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted">
            Links
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://www.bristol.ac.uk/geography/research/bridge/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-brand"
              >
                BRIDGE research group
              </a>
            </li>
            <li>
              <a
                href="https://www.bristol.ac.uk/geography/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-brand"
              >
                School of Geographical Sciences
              </a>
            </li>
            <li>
              <a
                href="https://www.bristol.ac.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-brand"
              >
                University of Bristol
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-5 py-4 text-xs text-muted sm:px-8">
          © {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
