import type { Metadata } from "next";
import {
  Container,
  PageHero,
  SectionTitle,
  EmptyState,
} from "@/components/ui/primitives";
import { PublicationItem } from "@/components/public/PublicationItem";
import { getPublications } from "@/lib/content";

export const metadata: Metadata = { title: "Research Outputs" };

export default function ResearchOutputsPage() {
  const publications = getPublications();

  // Group by year, newest first (publications are already sorted year-desc).
  const byYear = new Map<number, typeof publications>();
  for (const pub of publications) {
    const list = byYear.get(pub.year) ?? [];
    list.push(pub);
    byYear.set(pub.year, list);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <>
      <PageHero
        eyebrow="Research Outputs"
        title="Research Outputs"
        intro="A selection of our recent peer-reviewed publications, with links to the original articles."
      />
      <Container className="py-12">
        {publications.length === 0 ? (
          <EmptyState title="No publications listed yet.">
            Papers will be listed here.
          </EmptyState>
        ) : (
          <div className="max-w-3xl space-y-10">
            {years.map((year) => (
              <section key={year}>
                <SectionTitle className="mb-3">{year}</SectionTitle>
                <ul>
                  {byYear.get(year)!.map((pub) => (
                    <PublicationItem key={pub.id} publication={pub} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
