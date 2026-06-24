import type { Metadata } from "next";
import {
  Container,
  PageHero,
  Card,
  Badge,
  EmptyState,
  LinkButton,
} from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { getVacancies, getPageContent } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Vacancies" };

export default function VacanciesPage() {
  const vacancies = getVacancies();
  const joinUs = getPageContent("join-us");

  return (
    <>
      <PageHero eyebrow="Vacancies" title={joinUs.title} intro={joinUs.body} />
      <Container className="py-12">
        {vacancies.length === 0 ? (
          <EmptyState title="No open vacancies right now.">
            We&rsquo;re still keen to hear from prospective researchers and
            visitors — please get in touch to discuss possibilities.
          </EmptyState>
        ) : (
          <div className="space-y-6">
            {vacancies.map((v) => (
              <Card key={v.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-ink">
                      {v.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
                      {v.kind ? <Badge tone="brand">{v.kind}</Badge> : null}
                      {v.closingDate ? (
                        <span>Closes {formatDate(v.closingDate)}</span>
                      ) : null}
                    </div>
                  </div>
                  {v.applyUrl ? (
                    <LinkButton href={v.applyUrl} external>
                      Apply / details
                    </LinkButton>
                  ) : null}
                </div>
                <div className="mt-4">
                  <Markdown>{v.body}</Markdown>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
