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

Published changes in Median appear after the next build, so trigger a rebuild
(for example a Vercel deploy hook) when you publish.

## Scripts

| Command                    | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `bun dev`                  | Start the development server                       |
| `bun run build`            | Prerender every published page                     |
| `bun run generate-schemas` | Write Zod schemas for the website's components to `generated/` |
