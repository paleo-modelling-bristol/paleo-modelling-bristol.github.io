import type { Publication } from "@/lib/types";

export function PublicationItem({ publication }: { publication: Publication }) {
  const link =
    publication.url ??
    (publication.doi ? `https://doi.org/${publication.doi}` : null);

  return (
    <li className="border-b border-border py-4 last:border-b-0">
      <p className="font-medium leading-snug text-ink">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand hover:underline"
          >
            {publication.title}
          </a>
        ) : (
          publication.title
        )}
      </p>
      <p className="mt-1 text-sm text-muted">{publication.authors}</p>
      <p className="mt-0.5 text-sm text-muted">
        {publication.venue ? <em>{publication.venue}</em> : null}
        {publication.venue ? " · " : ""}
        {publication.year}
        {publication.doi ? (
          <>
            {" · "}
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              doi:{publication.doi}
            </a>
          </>
        ) : null}
      </p>
    </li>
  );
}
