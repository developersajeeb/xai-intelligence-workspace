"use client";

import { NavItem } from "@/components/ui/NavItem";
import { scrollToSection } from "@/lib/scrollToSection";

const PRODUCT_LINKS = [
  { label: "Platform", id: "platform" },
  { label: "How it works", id: "how-it-works" },
  { label: "Dashboard", id: "dashboard" },
  { label: "Insights", id: "insights" },
];
const COMPANY_LINKS = [{ label: "About" }, { label: "Careers" }, { label: "Contact" }];
const LEGAL_LINKS = [{ label: "Privacy" }, { label: "Terms" }];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full min-w-0 border-t border-border-subtle bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="flex max-w-xs flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="8" stroke="var(--accent)" strokeWidth="1.5" />
                <circle cx="9" cy="9" r="2.5" fill="var(--accent)" />
              </svg>
              <span className="text-sm font-semibold tracking-wide text-text-primary">
                Xai
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              Turn raw data into decisive intelligence — structured, analyzed, and
              actionable.
            </p>
            <span className="mt-1 inline-flex w-fit items-center gap-2 text-xs text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn title="Product" links={PRODUCT_LINKS} anchor />
            <FooterColumn title="Company" links={COMPANY_LINKS} />
            <FooterColumn title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border-subtle pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Xai, Inc. All rights reserved.</p>
          <p>Made for decision-makers, not dashboards.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  anchor = false,
}: {
  title: string;
  links: { label: string; id?: string }[];
  anchor?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <NavItem
              href={anchor && link.id ? `#${link.id}` : "#"}
              onClick={(e) => {
                e.preventDefault();
                if (anchor && link.id) scrollToSection(link.id);
              }}
              className="text-text-secondary hover:text-text-primary"
            >
              {link.label}
            </NavItem>
          </li>
        ))}
      </ul>
    </div>
  );
}
