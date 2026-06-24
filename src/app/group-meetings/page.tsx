import type { Metadata } from "next";
import type { GroupMeeting } from "@/lib/types";
import {
  Container,
  PageHero,
  SectionTitle,
  EmptyState,
  Badge,
} from "@/components/ui/primitives";
import { getMeetings } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Group Meetings" };

function MeetingTable({ meetings }: { meetings: GroupMeeting[] }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
      {meetings.map((m) => (
        <li
          key={m.id}
          className="grid gap-1 bg-paper p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5"
        >
          <div className="text-sm font-medium text-brand">
            {formatDate(m.date)}
          </div>
          <div>
            <p className="font-medium text-ink">
              {m.speaker}
              {m.affiliation ? (
                <span className="font-normal text-muted"> · {m.affiliation}</span>
              ) : null}
              {!m.isExternal ? (
                <span className="ml-2 align-middle">
                  <Badge tone="muted">Internal</Badge>
                </span>
              ) : null}
            </p>
            {m.title ? (
              <p className="mt-0.5 text-sm italic text-ink/80">“{m.title}”</p>
            ) : null}
            {m.location ? (
              <p className="mt-0.5 text-sm text-muted">{m.location}</p>
            ) : null}
            {m.abstract ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {m.abstract}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function GroupMeetingsPage() {
  const { upcoming, past } = getMeetings();

  return (
    <>
      <PageHero
        eyebrow="Group Meetings"
        title="Group Meetings"
        intro="Our regular meetings bring together internal and invited speakers. Here are the upcoming and past talks."
      />
      <Container className="py-12">
        {upcoming.length === 0 && past.length === 0 ? (
          <EmptyState title="No meetings listed yet.">
            Past and future speakers will appear here.
          </EmptyState>
        ) : null}

        <div className="space-y-12">
          {upcoming.length > 0 ? (
            <section>
              <SectionTitle className="mb-5">Upcoming</SectionTitle>
              <MeetingTable meetings={upcoming} />
            </section>
          ) : null}

          {past.length > 0 ? (
            <section>
              <SectionTitle className="mb-5">Past speakers</SectionTitle>
              <MeetingTable meetings={past} />
            </section>
          ) : null}
        </div>
      </Container>
    </>
  );
}
