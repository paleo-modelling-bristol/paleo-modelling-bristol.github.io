import { Container, LinkButton } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-dark">
        404
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-ink">
        Page not found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Sorry, we couldn&rsquo;t find that page. It may have moved, or the link
        may be out of date.
      </p>
      <div className="mt-8">
        <LinkButton href="/">Back to home</LinkButton>
      </div>
    </Container>
  );
}
