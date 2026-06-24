import Image from "next/image";
import type { Person } from "@/lib/types";
import {
  PERSON_LINK_KEYS,
  PERSON_LINK_LABELS,
  type PersonLinkKey,
} from "@/lib/constants";
import { Card } from "@/components/ui/primitives";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function readLinks(value: unknown): { key: PersonLinkKey; url: string }[] {
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  return PERSON_LINK_KEYS.filter(
    (k) => typeof record[k] === "string" && record[k],
  ).map((k) => ({ key: k, url: record[k] as string }));
}

export function PersonCard({ person }: { person: Person }) {
  const links = readLinks(person.links);

  return (
    <Card className="flex gap-4 p-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-2">
        {person.photoUrl ? (
          <Image
            src={person.photoUrl}
            alt={person.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-serif text-2xl font-semibold text-brand/60">
            {initials(person.name)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-serif text-lg font-semibold text-ink">
          {person.name}
        </h3>
        {person.title ? (
          <p className="text-sm text-muted">{person.title}</p>
        ) : null}
        {person.bio ? (
          <p className="mt-2 text-sm leading-relaxed text-ink/90">
            {person.bio}
          </p>
        ) : null}

        {(links.length > 0 || person.externalUrl || person.email) && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {person.externalUrl ? (
              <a
                href={person.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                Website
              </a>
            ) : null}
            {links.map((l) => (
              <a
                key={l.key}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                {PERSON_LINK_LABELS[l.key]}
              </a>
            ))}
            {person.email ? (
              <a
                href={`mailto:${person.email}`}
                className="font-medium text-brand hover:underline"
              >
                Email
              </a>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
}
