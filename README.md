# AskLaw

A collaboration between the **Singapore Academy of Law** and the **Ministry of Law**.

AskLaw is a government directory that compiles AI tools, features, and solutions for **lawyers**
to discover and adopt into their daily workflow — organized **problem-first**: users browse by
the task that eats their afternoon, not by product name. Neutral by design: it recommends
multiple tools for each problem and does not endorse a single one.

## What's here

| Path | What it is |
|---|---|
| `docs/frontend-plan.md` | Front-end plan: positioning, IA, page specs, content model, wireframes, design system, critique & recommendations |
| `docs/recommendations.md` | Conditions under which GenAI simulation genuinely beats static content |
| `docs/video-pipeline-plan.md` | GenAI video pipeline plan (Remotion + Synthesia/HeyGen) — planning stage, not yet greenlit |
| `mockup/index.html` | Dashboard — 18 problem cards, search, category + practice-area filters, chat |
| `mockup/detail.html` | Problem detail — "how it helps" text + explainer video + tools list |
| `mockup/styles.css` | Shared styles (self-contained, no external dependencies) |
| `web/` | Data-driven Next.js rebuild of the mockup (one `/problems/[slug]` route fed by `web/src/data/problems.json`) |
| `product-video-pipeline/` | GenAI video pipeline pilot (Remotion + HeyGen) for one problem page, plus an admin test bench |

## Run the frontend (`web/`)

Data-driven Next.js rebuild of the mockup (see `web/README.md`):

```
cd web
npm install
npm run dev
```

Open http://localhost:3000.

## Run the video pipeline (`product-video-pipeline/`)

Full setup and details in `product-video-pipeline/README.md`. Quick start:

```
cd product-video-pipeline
npm install
cp .env.example .env          # optional: add HEYGEN_API_KEY / HEYGEN_AVATAR_ID for real narration
npm run make-placeholders     # generates local stand-in video files with ffmpeg
npm run generate-narration    # calls HeyGen (or the mock) and computes scene timing
npm run preview                # opens Remotion Studio to preview ProblemVideo
npm run render                  # renders out/billings-invoices.mp4
```

Requires `ffmpeg`/`ffprobe` on PATH. Without HeyGen credentials, narration falls
back to a local placeholder clip so the pipeline still runs end-to-end.

To use the admin test bench (upload script/demo video, edit the merged scene
script, render and preview in one page):

```
npm run admin   # http://localhost:4174/admin
```

## Next steps

- Produce the "how it helps" explainer video for each problem (see `product-video-pipeline/`
  for the pilot pipeline).
- Decide whether to extend the video pipeline beyond the single pilot problem.
