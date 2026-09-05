# AskLaw

A collaboration between the **Singapore Academy of Law** and the **Ministry of Law**.

AskLaw is a government directory that compiles AI tools, features, and solutions for **lawyers**
to discover and adopt into their daily workflow — organized **problem-first**: users browse by
the task that eats their afternoon, not by product name. Neutral by design: it recommends
multiple tools for each problem and does not endorse a single one.

## Status

Planning and design mockup. No production build yet.

## What's here

| Path | What it is |
|---|---|
| `docs/frontend-plan.md` | Front-end plan: positioning, IA, page specs, content model, wireframes, design system, critique & recommendations |
| `mockup/index.html` | Dashboard — 18 problem cards, search, category + practice-area filters, chat |
| `mockup/detail.html` | Problem detail — "how it helps" text + explainer video + tools list |
| `mockup/styles.css` | Shared styles (self-contained, no external dependencies) |

## View the mockup

Open `mockup/index.html` in any browser. No build step or dependencies — it works offline.

## Next steps

- Agree the stack (suggested: Astro or Next.js, static-first).
- Implement the data-driven detail page — one `/problems/[slug]` route fed by a single data
  file (recommendation 5 in `docs/frontend-plan.md`).
- Produce the "how it helps" explainer video.
