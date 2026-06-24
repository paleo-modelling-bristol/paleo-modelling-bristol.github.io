# Bristol Paleo Modelling Group — website

The public website for the Bristol Paleo Modelling Group (part of BRIDGE, School
of Geographical Sciences, University of Bristol).

It is a **static site**: there is no server, database, or login. All content
lives in Markdown + YAML files under `content/`, is read at **build time**, and
is published to **GitHub Pages** by a GitHub Actions workflow. Editors maintain
the site by editing those files on GitHub — see **[MAINTAINERS.md](MAINTAINERS.md)**.

> Looking to edit people, meetings, vacancies, or text? You almost certainly
> want **[MAINTAINERS.md](MAINTAINERS.md)**, not this file.

## Sections

- **About** — editable group description.
- **People** — current members grouped into PIs, Postdocs, Postgraduate
  researchers and Visitors, plus an *Old Friends* list.
- **Group Meetings** — upcoming and past speakers (split computed from the date).
- **Research Outputs** — publications, grouped by year.
- **Social Events** — photo galleries of past events.
- **Vacancies** — open positions (Markdown descriptions).

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript), **static export** (`output: "export"`) |
| Styling | Tailwind CSS v4 |
| Content | Markdown (`gray-matter`) + YAML (`js-yaml`), read at build time |
| Markdown rendering | `react-markdown` + `remark-gfm` |
| Images | Committed WebP; `sharp` script + Action for conversion |
| Hosting | GitHub Pages via GitHub Actions |

## Local development

Prerequisites: Node 20+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export -> ./out (what gets published)
npm run lint
npm run images:webp   # convert public/images/** rasters to WebP
```

## Project structure

```
content/
  pages/         home-hero.md, about.md, join-us.md  (editable page copy)
  people/        one Markdown file per person (bio = the body)
  meetings.yml   group meetings
  publications.yml
  vacancies/     one Markdown file per open position
  events/        one Markdown file per social event (+ photo list)
public/
  images/        people/ and events/ photos (WebP), plus the logo
src/
  app/           one folder per route; root layout wraps header/footer
  components/     public/ (site UI) and ui/ (primitives + Markdown)
  lib/
    content.ts   reads every content file at build time (the "data layer")
    types.ts     content types (replaces the old Prisma types)
    constants.ts nav, labels, site URL
    utils.ts     cn(), formatDate(), slugify(), ...
scripts/
  optimize-images.mjs   raster -> WebP
.github/workflows/
  deploy.yml            build + deploy to GitHub Pages
  optimize-images.yml   auto-convert uploaded images to WebP
```

## How it deploys

Every push to `main` (plus a weekly cron and manual runs) triggers
`.github/workflows/deploy.yml`, which builds the static export and publishes
`out/` to GitHub Pages. Configure once at **Settings → Pages → Source = GitHub
Actions**. Full details, including how to restore previous versions, are in
[MAINTAINERS.md](MAINTAINERS.md).

## Notes for contributors

This is a static export, so server-only Next.js features are intentionally
**not** used (Server Actions, request-time Route Handlers, cookies, middleware,
the default `next/image` loader). Content is read from `content/` at build time
by `src/lib/content.ts`; there is no runtime data fetching.
