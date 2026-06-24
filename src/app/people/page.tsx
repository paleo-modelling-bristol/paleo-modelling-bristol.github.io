import type { Metadata } from "next";
import {
  Container,
  PageHero,
  SectionTitle,
  EmptyState,
} from "@/components/ui/primitives";
import { PersonCard } from "@/components/public/PersonCard";
import { getPeople } from "@/lib/content";
import { MEMBER_ROLE_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  const { grouped, oldFriends } = getPeople();

  return (
    <>
      <PageHero
        eyebrow="People"
        title="People"
        intro="A very international group — from principal investigators and postdocs to postgraduate researchers and visiting scientists."
      />
      <Container className="py-12">
        {grouped.length === 0 && oldFriends.length === 0 ? (
          <EmptyState title="People will be listed here soon.">
            Members can be added by creating a file in content/people.
          </EmptyState>
        ) : null}

        <div className="space-y-14">
          {/* Current members, grouped by role */}
          {grouped.map((group) => (
            <section key={group.role}>
              <SectionTitle className="mb-6">
                {MEMBER_ROLE_LABELS[group.role]}
              </SectionTitle>
              <div className="grid gap-5 md:grid-cols-2">
                {group.members.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </section>
          ))}

          {/* Old friends */}
          {oldFriends.length > 0 ? (
            <section>
              <SectionTitle className="mb-2">Old Friends</SectionTitle>
              <p className="mb-6 max-w-2xl text-muted">
                Former members who have moved on — we wish them well, and you
                can follow their work below.
              </p>
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {oldFriends.map((person) => (
                  <li
                    key={person.id}
                    className="border-b border-border py-2 text-ink"
                  >
                    {person.externalUrl ? (
                      <a
                        href={person.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-brand hover:underline"
                      >
                        {person.name}
                        <span aria-hidden> ↗</span>
                      </a>
                    ) : (
                      <span className="font-medium">{person.name}</span>
                    )}
                    {person.title ? (
                      <span className="block text-sm text-muted">
                        {person.title}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </Container>
    </>
  );
}
