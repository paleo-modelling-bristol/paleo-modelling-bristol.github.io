import type { Metadata } from "next";
import {
  Container,
  PageHero,
  SectionTitle,
  EmptyState,
} from "@/components/ui/primitives";
import { PhotoGrid } from "@/components/public/PhotoGrid";
import { getEvents } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Social Events" };

export default function SocialEventsPage() {
  const events = getEvents();

  return (
    <>
      <PageHero
        eyebrow="Social Events"
        title="Social Events"
        intro="We work hard and we have fun — here are some snapshots from group socials, conferences and fieldwork."
      />
      <Container className="py-12">
        {events.length === 0 ? (
          <EmptyState title="No events posted yet.">
            Photos from past events will appear here.
          </EmptyState>
        ) : (
          <div className="space-y-14">
            {events.map((event) => (
              <section key={event.id}>
                <div className="mb-4">
                  <SectionTitle>{event.title}</SectionTitle>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(event.date)}
                  </p>
                  {event.description ? (
                    <p className="mt-3 max-w-3xl leading-relaxed text-ink/90">
                      {event.description}
                    </p>
                  ) : null}
                </div>
                <PhotoGrid photos={event.photos} alt={event.title} />
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
