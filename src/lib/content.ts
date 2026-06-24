// Build-time content layer.
//
// Everything the site renders is read from files under `content/` while the
// static export is built. There is no database and no runtime fetching. This
// module replaces what used to be Prisma queries + the database-backed page
// copy. It must only be imported by Server Components (it uses `fs`).

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { MEMBER_ROLE_ORDER } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type {
  Person,
  Membership,
  MemberRole,
  Publication,
  GroupMeeting,
  SocialEvent,
  EventPhoto,
  Vacancy,
  PageContent,
} from "@/lib/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

// ---------- low-level helpers ----------

function str(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

/** Normalise a YAML date (which js-yaml may parse to a Date) to "YYYY-MM-DD". */
function toDateString(v: unknown): string | null {
  if (v == null || v === "") return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim().slice(0, 10);
}

/** Today's date as "YYYY-MM-DD" (UTC). Evaluated at build time. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function byOrderThenName(a: Person, b: Person): number {
  return a.order - b.order || a.name.localeCompare(b.name);
}

type Frontmatter = Record<string, unknown>;

/** Parse every Markdown file in a content sub-directory. */
function readMarkdownDir(
  dir: string,
): { slug: string; data: Frontmatter; body: string }[] {
  const full = path.join(CONTENT_DIR, dir);
  let names: string[];
  try {
    names = fs.readdirSync(full);
  } catch {
    return [];
  }
  return names
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(full, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        data: data as Frontmatter,
        body: content.trim(),
      };
    });
}

/** Parse a top-level YAML list file (returns [] if missing). */
function readYamlList(file: string): Frontmatter[] {
  let raw: string;
  try {
    raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  } catch {
    return [];
  }
  const parsed = yaml.load(raw);
  return Array.isArray(parsed) ? (parsed as Frontmatter[]) : [];
}

/** Resolve an image reference: pass through absolute/URL, else prefix a folder. */
function resolveImage(v: unknown, folder: string): string | null {
  const s = str(v);
  if (!s) return null;
  if (s.startsWith("/") || s.startsWith("http")) return s;
  return `/images/${folder}/${s}`;
}

// ---------- editable page copy ----------

export type ContentKey = "home-hero" | "about" | "join-us";

const DEFAULT_CONTENT: Record<ContentKey, PageContent> = {
  "home-hero": {
    title: "Paleoclimate modelling across the history of Earth's climate",
    body: "We are an international research group using climate models to understand Earth's climate history — and to make tomorrow's climate projections better.",
  },
  about: {
    title: "About the Bristol Paleo Modelling Group",
    body: "Our main focus is on paleoclimate modelling across multiple timescales of Earth's history.",
  },
  "join-us": {
    title: "Join us",
    body: "We are an exciting, active and friendly group, and we are always keen to hear from prospective postgraduate researchers, postdocs and visitors.",
  },
};

export function getPageContent(key: ContentKey): PageContent {
  let raw: string;
  try {
    raw = fs.readFileSync(path.join(CONTENT_DIR, "pages", `${key}.md`), "utf8");
  } catch {
    return DEFAULT_CONTENT[key];
  }
  const { data, content } = matter(raw);
  return {
    title: str(data.title) ?? DEFAULT_CONTENT[key].title,
    body: content.trim() || DEFAULT_CONTENT[key].body,
  };
}

// ---------- people ----------

function parsePerson(slug: string, data: Frontmatter, body: string): Person {
  const membership: Membership = String(data.membership ?? "current")
    .toLowerCase()
    .startsWith("old")
    ? "OLD_FRIEND"
    : "CURRENT";

  const roleRaw = data.role ? String(data.role).toUpperCase() : null;
  const role =
    roleRaw && (MEMBER_ROLE_ORDER as string[]).includes(roleRaw)
      ? (roleRaw as MemberRole)
      : null;

  const links =
    data.links && typeof data.links === "object"
      ? (data.links as Record<string, string>)
      : null;

  return {
    id: slug,
    slug,
    name: str(data.name) ?? slug,
    membership,
    role,
    title: str(data.title),
    bio: body || null,
    photoUrl: resolveImage(data.photo, "people"),
    email: str(data.email),
    externalUrl: str(data.website) ?? str(data.externalUrl),
    links,
    order: Number(data.order ?? 0),
    active: bool(data.active, true),
  };
}

export function getAllPeople(): Person[] {
  return readMarkdownDir("people").map(({ slug, data, body }) =>
    parsePerson(slug, data, body),
  );
}

/** Current members grouped by role (in display order) + old friends. */
export function getPeople() {
  const all = getAllPeople();
  const current = all
    .filter((p) => p.membership === "CURRENT" && p.active)
    .sort(byOrderThenName);
  const oldFriends = all
    .filter((p) => p.membership === "OLD_FRIEND")
    .sort(byOrderThenName);

  const grouped = MEMBER_ROLE_ORDER.map((role) => ({
    role,
    members: current.filter((p) => p.role === role),
  })).filter((g) => g.members.length > 0);

  return { grouped, oldFriends };
}

// ---------- publications ----------

export function getPublications(): Publication[] {
  return readYamlList("publications.yml")
    .map((p, i) => ({
      id: str(p.doi) ?? str(p.url) ?? `pub-${i}`,
      title: str(p.title) ?? "",
      authors: str(p.authors) ?? "",
      venue: str(p.venue),
      year: Number(p.year ?? 0),
      doi: str(p.doi),
      url: str(p.url),
      featured: bool(p.featured, false),
    }))
    // Newest year first; order within a year follows the file (stable sort).
    .sort((a, b) => b.year - a.year);
}

// ---------- group meetings ----------

export function getAllMeetings(): GroupMeeting[] {
  return readYamlList("meetings.yml").map((m) => {
    const date = toDateString(m.date) ?? "";
    const speaker = str(m.speaker) ?? "";
    return {
      id: `${date}-${slugify(speaker)}`,
      date,
      speaker,
      affiliation: str(m.affiliation),
      title: str(m.title),
      abstract: str(m.abstract),
      location: str(m.location),
      isExternal: bool(m.external ?? m.isExternal, true),
    };
  });
}

/** Split meetings into upcoming (asc) and past (desc), relative to build day. */
export function getMeetings() {
  const t = today();
  const all = getAllMeetings().filter((m) => m.date);
  const upcoming = all
    .filter((m) => m.date >= t)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = all
    .filter((m) => m.date < t)
    .sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

// ---------- social events ----------

export function getEvents(): SocialEvent[] {
  return readMarkdownDir("events")
    .map(({ slug, data, body }) => {
      const photosRaw = Array.isArray(data.photos) ? data.photos : [];
      const photos: EventPhoto[] = photosRaw
        .map((ph, i) => {
          const obj =
            typeof ph === "string" ? { src: ph } : (ph as Frontmatter);
          return {
            id: `${slug}-${i}`,
            imageUrl: resolveImage(obj.src, "events") ?? "",
            caption: str(obj.caption),
          };
        })
        .filter((p) => p.imageUrl);

      return {
        id: slug,
        slug,
        title: str(data.title) ?? slug,
        date: toDateString(data.date) ?? "",
        description: str(data.description) ?? (body || null),
        photos,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ---------- vacancies ----------

export function getVacancies({ includeInactive = false } = {}): Vacancy[] {
  return readMarkdownDir("vacancies")
    .map(({ slug, data, body }) => ({
      id: slug,
      slug,
      title: str(data.title) ?? slug,
      body,
      kind: str(data.kind),
      closingDate: toDateString(data.closingDate),
      applyUrl: str(data.applyUrl),
      active: bool(data.active, true),
      postedAt: toDateString(data.postedAt) ?? "",
    }))
    .filter((v) => includeInactive || v.active)
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

// ---------- home page highlights ----------

export function getHomeHighlights() {
  const t = today();

  const nextMeeting =
    getAllMeetings()
      .filter((m) => m.date && m.date >= t)
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;

  const latestPublications = getPublications().slice(0, 3);
  const openVacancies = getVacancies().length;

  const recentPhotos = getEvents()
    .flatMap((e) => e.photos.map((p) => ({ ...p, eventTitle: e.title })))
    .slice(0, 6);

  const memberCount = getAllPeople().filter(
    (p) => p.membership === "CURRENT" && p.active,
  ).length;

  return { nextMeeting, latestPublications, openVacancies, recentPhotos, memberCount };
}
