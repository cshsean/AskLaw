# Ashton & Friends

A website that compiles AI tools, features, and solutions for **lawyers** to discover and
adopt into their daily workflow — organized **problem-first**: users browse by the task that
eats their afternoon, not by product name.

## Status

Planning and design mockup. No production build yet.

## What's here

| Path | What it is |
|---|---|
| `docs/frontend-plan.md` | Front-end plan: positioning, IA, page specs, content model, wireframes, design system, critique & recommendations |
| `mockup/index.html` | Dashboard — 17 problem cards, search, category filters, chat |
| `mockup/detail.html` | Problem detail — "how it helps" text + "how to use" and "how to download" videos, tools list |
| `mockup/styles.css` | Shared styles (self-contained, no external dependencies) |

## View the mockup

Open `mockup/index.html` in any browser. No build step or dependencies — it works offline.

## Next steps

- Agree the stack (suggested: Astro, static-first).
- Implement the data-driven detail page — one `/problems/[slug]` route fed by a single data
  file (recommendation 5 in `docs/frontend-plan.md`).
- Produce the "how it helps" and "how to download" videos.
