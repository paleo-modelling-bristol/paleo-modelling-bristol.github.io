# Maintainers' guide

How the Bristol Paleo Modelling Group website is hosted, edited, deployed and
recovered. This replaces the old admin login / CMS — **all editing now happens
on GitHub**, and access is controlled by GitHub permissions instead of site
accounts.

---

## 1. Repository location

| Thing | Where |
| --- | --- |
| **Live site** | <https://paleo-modelling-bristol.github.io> |
| **Source repository** | <https://github.com/paleo-modelling-bristol/paleo-modelling-bristol.github.io> |
| **GitHub organisation** | `paleo-modelling-bristol` |
| **Default branch** | `main` (this is what is published) |

> The repository name `paleo-modelling-bristol.github.io` is special: GitHub
> serves it as the organisation's website at the domain root. If the project is
> ever moved (different org/owner or a project page like
> `https://<owner>.github.io/<repo>/`), update the URLs above, set `BASE_PATH`
> (see `.env.example` / `next.config.ts`), and update `SITE_URL` in
> `src/lib/constants.ts`.

---

## 2. Who can edit, and how access works (permissions)

There is no website login any more. Editing rights come **entirely from GitHub
organisation / repository permissions**:

| GitHub role | Can do |
| --- | --- |
| **Organisation owner / Admin** | Everything: manage members & teams, repository settings, GitHub Pages settings, branch protection. |
| **Write (maintainer)** | Edit content files directly, create branches, open and merge pull requests. |
| **Read / outside contributor** | Propose changes via a pull request (fork or branch); a maintainer reviews and merges. |

To give someone editing access: add them to the organisation (or the repository)
with at least **Write** access — Organisation → *People* / repository →
*Settings → Collaborators and teams*. Removing their GitHub access removes their
ability to edit; nothing else to revoke.

---

## 3. How the content is stored

Everything the site shows comes from plain text files in this repo, read when
the site is built. No database.

| Section on the site | File(s) to edit |
| --- | --- |
| Home hero text | `content/pages/home-hero.md` |
| About page text | `content/pages/about.md` |
| "Join us" intro (top of Vacancies) | `content/pages/join-us.md` |
| **People** (one file per person) | `content/people/<name>.md` |
| **Group meetings** | `content/meetings.yml` |
| **Research outputs** (publications) | `content/publications.yml` |
| **Vacancies / positions** (one file each) | `content/vacancies/<slug>.md` |
| **Social events** (one file each) | `content/events/<slug>.md` |
| Photos & the logo | `public/images/...`, `public/bridge-logo.svg` |

- `.md` files have a **frontmatter** block between `---` lines (structured
  fields) followed by free Markdown text (the bio / description / body).
- `.yml` files are simple lists; each file starts with a comment explaining the
  fields. Copy an existing entry as a template.

---

## 4. Editing content from the GitHub website (no tools needed)

1. Go to the repository and open the file you want to change (see the table
   above).
2. Click the **pencil ✏️ (Edit this file)** button.
3. Make your change. Keep the frontmatter field names the same; only change the
   values and the text below.
4. Scroll down to **Commit changes**:
   - If you have Write access you can **commit directly to `main`** — the site
     rebuilds and republishes automatically (usually live within ~1–2 minutes).
   - Otherwise choose **Create a new branch and start a pull request** and a
     maintainer will review it (see §6).

**Common tasks**

- **Add a person** — In `content/people/`, click *Add file → Create new file*,
  name it `firstname-lastname.md`, and copy the structure of an existing person
  (e.g. `alex-rivers.md`). `role` is one of `PI`, `POSTDOC`, `PGR`, `VISITOR`;
  the text under the frontmatter is their bio (keep it to ~150 words). For an
  *Old Friend*, set `membership: old-friend` and a `website:` link instead of a
  role.
- **Edit your own bio** — open your own `content/people/<you>.md` and edit the
  text below the frontmatter.
- **Add a meeting / publication** — edit `content/meetings.yml` /
  `content/publications.yml` and copy an existing block. Upcoming vs past
  meetings is decided automatically from the date.
- **Add a vacancy/position** — add a file in `content/vacancies/`. Set
  `active: false` (or delete the file) to take it down.
- **Add a social event** — add a file in `content/events/`, upload photos to
  `public/images/events/` (see §5), and list them under `photos:`.

---

## 5. Images

Images are committed to the repo (no uploads server). The site expects
**WebP** for photos.

- **Easiest:** upload your `.jpg`/`.png` straight into `public/images/people/`
  or `public/images/events/` via *Add file → Upload files*. A GitHub Action
  (`.github/workflows/optimize-images.yml`) automatically converts it to a
  compressed `.webp` and commits the result.
- **Or do it yourself first** (recommended for many images): run
  `npm run images:webp` locally, which converts and resizes everything under
  `public/images/`. Then commit only the `.webp` files.
- Reference an image by its file name: a person's `photo: alex-rivers.webp`, or
  an event photo `- src: summer-bbq-1.webp`.

---

## 6. Deployment method & review responsibility

**Deployment** is fully automated via **GitHub Actions → GitHub Pages**
(`.github/workflows/deploy.yml`):

- Triggers on every push to `main`, on a **weekly schedule** (keeps the
  upcoming/past meeting split fresh), and on manual *Run workflow*.
- It runs `npm ci` + `npm run build` (a static export to `out/`) and publishes
  that to GitHub Pages.
- One-time setup: repository **Settings → Pages → Build and deployment →
  Source = GitHub Actions**.
- Watch a deploy under the repository's **Actions** tab; the green checkmark and
  the deployment URL confirm it is live.

**Review responsibility:**

- **Content edits** (people, meetings, publications, vacancies, events, page
  copy): maintainers with Write access may commit directly to `main`.
- **Contributions from non-maintainers**: come in as pull requests and must be
  reviewed and merged by a **repository maintainer / group PI**.
- **Code or workflow changes** (anything under `src/`, `.github/`,
  `next.config.ts`, dependencies): should go through a **pull request reviewed by
  the technical maintainer** before merging.
- Optional hardening: enable **Settings → Branches → Branch protection** on
  `main` to require pull-request review for everyone. Recommended once the team
  is comfortable with the workflow.

> Designate at least two people as maintainers/reviewers so the site is never
> blocked on one person. Record their names here:
>
> - Technical maintainer: _<add name>_
> - Content reviewer (PI): _<add name>_

---

## 7. Adding a brand-new section (developer task)

Content edits need no code. Adding a *new navigable section* does. Roughly:

1. Add the link to `NAV_ITEMS` in `src/lib/constants.ts`.
2. Decide how the data is stored and add a loader to `src/lib/content.ts`
   (follow `getVacancies` / `getMeetings` as patterns) plus a type in
   `src/lib/types.ts`.
3. Create the content files under `content/<section>/`.
4. Create the page at `src/app/<section>/page.tsx` (copy an existing page).
5. Run `npm run dev` to preview, `npm run build` to confirm the static export
   succeeds, then open a pull request.

Keep it static-export friendly: no server actions, no request-time data, no API
routes.

---

## 8. Restoring a historical version

Everything is in git, so any past state is recoverable.

- **See a file's history:** open the file on GitHub → **History** → pick a
  commit to view it as it was. Use *Raw* to copy old content back, or *Revert*.
- **Undo a bad change:** open the offending commit (Actions/commits list) and
  click **Revert** to open a PR that restores the previous state; merge it and
  the site redeploys.
  Command line: `git revert <commit-sha>` then push.
- **Restore a deleted file:** find the commit that deleted it
  (`git log -- path/to/file`), then
  `git checkout <commit-before-deletion>^ -- path/to/file` and commit.
- **Roll back the whole site to an earlier point:** create a revert PR for the
  commits since then (preferred — keeps history), or for emergencies
  `git revert` the range. Each merge to `main` triggers a fresh deploy, so the
  live site follows `main`.
- **Re-publish without any content change** (e.g. to refresh the meetings
  split): Actions tab → *Deploy to GitHub Pages* → **Run workflow**.

---

## 9. Local preview (optional)

```bash
npm install
npm run dev      # http://localhost:3000 — live preview while editing
npm run build    # produces ./out — the exact files that get published
```

See `README.md` for more detail on the project layout.
