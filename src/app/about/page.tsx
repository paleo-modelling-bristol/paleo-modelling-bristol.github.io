import type { Metadata } from "next";
import { Container, PageHero, LinkButton } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const about = getPageContent("about");

  return (
    <>
      <PageHero
        eyebrow="About"
        title={about.title}
        intro="Paleoclimate modelling across multiple timescales of Earth's history."
      />
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <article className="max-w-3xl">
            <Markdown>{about.body}</Markdown>
          </article>

          <aside className="space-y-6">
            <div className="rounded-card border border-border bg-surface p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted">
                At a glance
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-muted">Founded</dt>
                  <dd className="font-medium text-ink">2002</dd>
                </div>
                <div>
                  <dt className="text-muted">Part of</dt>
                  <dd className="font-medium text-ink">
                    BRIDGE, School of Geographical Sciences
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Institution</dt>
                  <dd className="font-medium text-ink">
                    University of Bristol
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-card border border-border bg-paper p-6">
              <p className="font-serif text-lg font-semibold text-ink">
                Interested in joining?
              </p>
              <p className="mt-2 text-sm text-muted">
                We welcome prospective researchers and visiting scientists from
                across the world.
              </p>
              <LinkButton href="/vacancies" className="mt-4 w-full">
                See vacancies
              </LinkButton>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
