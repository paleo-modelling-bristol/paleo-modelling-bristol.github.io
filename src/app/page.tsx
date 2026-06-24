import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Card,
  SectionTitle,
  LinkButton,
  CardEyebrow,
} from "@/components/ui/primitives";
import { PublicationItem } from "@/components/public/PublicationItem";
import { getHomeHighlights, getPageContent } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const hero = getPageContent("home-hero");
  const {
    nextMeeting,
    latestPublications,
    openVacancies,
    recentPhotos,
    memberCount,
  } = getHomeHighlights();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-light opacity-95" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 80% at 85% 15%, rgba(217,164,65,0.28), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <Container className="relative py-20 sm:py-28">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/80">
            University of Bristol · Since 2002
          </p>
          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            {hero.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/about" tone="inverse">
              About the group
            </LinkButton>
            <LinkButton href="/vacancies" tone="inverse-outline">
              {openVacancies > 0
                ? `Join us — ${openVacancies} open ${
                    openVacancies === 1 ? "vacancy" : "vacancies"
                  }`
                : "Join us"}
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Next meeting */}
          <Card className="flex flex-col p-6">
            <CardEyebrow tone="brand">Group meetings</CardEyebrow>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink">
              Next speaker
            </h2>
            {nextMeeting ? (
              <div className="mt-3 flex-1">
                <p className="text-sm text-muted">
                  {formatDate(nextMeeting.date)}
                </p>
                <p className="mt-1 font-medium text-ink">
                  {nextMeeting.speaker}
                </p>
                {nextMeeting.affiliation ? (
                  <p className="text-sm text-muted">
                    {nextMeeting.affiliation}
                  </p>
                ) : null}
                {nextMeeting.title ? (
                  <p className="mt-2 text-sm italic text-ink/80">
                    “{nextMeeting.title}”
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 flex-1 text-sm text-muted">
                No upcoming meetings scheduled yet — check back soon.
              </p>
            )}
            <Link
              href="/group-meetings"
              className="mt-4 text-sm font-semibold text-brand hover:underline"
            >
              View all meetings →
            </Link>
          </Card>

          {/* Latest research */}
          <Card className="flex flex-col p-6">
            <CardEyebrow tone="accent">Research</CardEyebrow>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink">
              Recent outputs
            </h2>
            {latestPublications.length > 0 ? (
              <ul className="mt-2 flex-1">
                {latestPublications.map((p) => (
                  <PublicationItem key={p.id} publication={p} />
                ))}
              </ul>
            ) : (
              <p className="mt-3 flex-1 text-sm text-muted">
                Publications will appear here.
              </p>
            )}
            <Link
              href="/research-outputs"
              className="mt-4 text-sm font-semibold text-brand hover:underline"
            >
              All research outputs →
            </Link>
          </Card>

          {/* About the group */}
          <Card className="flex flex-col p-6">
            <CardEyebrow tone="muted">About</CardEyebrow>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink">
              An international group
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              We study paleoclimate across multiple timescales of Earth&rsquo;s
              history, working closely with the paleo data community. We are{" "}
              {memberCount > 0 ? `${memberCount} researchers` : "a group"}{" "}
              within BRIDGE, and we welcome visiting scientists from across the
              world.
            </p>
            <Link
              href="/people"
              className="mt-4 text-sm font-semibold text-brand hover:underline"
            >
              Meet the people →
            </Link>
          </Card>
        </div>
      </Container>

      {/* Recent social events */}
      {recentPhotos.length > 0 ? (
        <section className="border-t border-border bg-surface py-16">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <SectionTitle>Life in the group</SectionTitle>
              <Link
                href="/social-events"
                className="text-sm font-semibold text-brand hover:underline"
              >
                More social events →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {recentPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-surface-2"
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.caption ?? photo.eventTitle}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
