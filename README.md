# The Living Method

A Next.js site whose pages come from [Median CMS](https://app.mediancms.com) through
[`cms-renderer`](https://www.npmjs.com/package/cms-renderer). Published pages are
prerendered at build time; only the CMS draft preview renders on request.

## Getting started

```bash
bun install
cp .env.example .env.local   # fill in MEDIAN_API_KEY
bun dev
```

## How it renders

- `src/lib/median.ts` creates the `Median` client: the website id and page-service
  endpoint are in the code, the API key comes from `MEDIAN_API_KEY`.
- `src/app/[[...slug]]/page.tsx` prerenders every URL from `median.listPages()`:
  `median.resolveComponent(path)` reads the page and `ParametricPage` renders its
  blocks with the components in `src/lib/registry.tsx`.
- `src/app/cms-preview_/[[...slug]]/page.tsx` renders the page's live draft on every
  request with `ParametricPreview`, which adds the CMS edit overlay. The CMS
  template builder and canvas load it.
- Document references in block content (pillars, blog posts, the Living Being
  record) arrive filled with the referenced document, so blocks only render them.

Published changes appear without a rebuild, whether or not anyone has the site open:
- `src/instrumentation.ts` starts `src/lib/publish-listener.ts` once per server
  process. It holds the page service's `/content-changes` SSE stream, reconnects from
  the last version it saw, and after each publish POSTs to its own `/api/revalidate`
  (token derived from `MEDIAN_API_KEY`), which runs `revalidatePath('/', 'layout')`.
- Open tabs also re-render at once: `ContentChanges` listens to
  `/api/content-changes` (a relay of the same stream) and calls the
  `revalidatePublished` server action.
- No timed revalidation: pages are only re-rendered after a publish, so they cost
  no API reads in between. If the server listener was asleep during a publish, the
  first tab to open a stale page triggers the refresh (its listener sends the
  version it was rendered from).

URLs published since the build render on their first request. Block **Appearance**
settings from the CMS arrive as each component's `layout` prop (see `LivingHero`).

## Scripts

| Command                    | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `bun dev`                  | Start the development server                       |
| `bun run build`            | Prerender every published page                     |
| `bun run generate-schemas` | Write Zod schemas for the website's components to `generated/` |
