import type { MemberRole } from "@/lib/types";

export const SITE_NAME = "Bristol Paleo Modelling Group";
export const SITE_SHORT = "Bristol PMG";

// Production URL of the deployed GitHub Pages site. Used for metadata.
export const SITE_URL =
  process.env.SITE_URL ?? "https://paleo-modelling-bristol.github.io";

// Public navigation — mirrors the sections agreed in the brief.
export const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/people", label: "People" },
  { href: "/group-meetings", label: "Group Meetings" },
  { href: "/research-outputs", label: "Research Outputs" },
  { href: "/social-events", label: "Social Events" },
  { href: "/vacancies", label: "Vacancies" },
];

// Suggested maximum bio length (words). Not enforced at runtime (no backend);
// documented for editors in MAINTAINERS.md.
export const BIO_WORD_LIMIT = 150;

// Current-member sub-groups, in display order.
export const MEMBER_ROLE_ORDER: MemberRole[] = [
  "PI",
  "POSTDOC",
  "PGR",
  "VISITOR",
];

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  PI: "Principal Investigators",
  POSTDOC: "Postdocs",
  PGR: "Postgraduate Researchers",
  VISITOR: "Visitors",
};

export const MEMBER_ROLE_LABELS_SINGULAR: Record<MemberRole, string> = {
  PI: "Principal Investigator",
  POSTDOC: "Postdoc",
  PGR: "Postgraduate Researcher",
  VISITOR: "Visitor",
};

// Vacancy categories.
export const VACANCY_KINDS = ["PhD", "Postdoc", "Fellowship", "Faculty", "Other"];

// Known social/academic link keys stored on a Person's `links` map.
export const PERSON_LINK_KEYS = [
  "website",
  "scholar",
  "orcid",
  "twitter",
  "github",
] as const;
export type PersonLinkKey = (typeof PERSON_LINK_KEYS)[number];

export const PERSON_LINK_LABELS: Record<PersonLinkKey, string> = {
  website: "Website",
  scholar: "Google Scholar",
  orcid: "ORCID",
  twitter: "X / Twitter",
  github: "GitHub",
};
