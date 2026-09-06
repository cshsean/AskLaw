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
| `docs/chatbot-plan.md` | Chatbot plan: architecture, search & grounding, category answering, layered prompt-injection / safety defenses |
| `docs/recommendations.md` | Conditions under which GenAI simulation genuinely beats static content |
| `docs/video-pipeline-plan.md` | GenAI video pipeline plan (Remotion + Synthesia/HeyGen) — planning stage, not yet greenlit |
| `mockup/index.html` | Dashboard — 18 problem cards, search, category + practice-area filters, chat |
| `mockup/detail.html` | Problem detail — "how it helps" text + explainer video + tools list |
| `mockup/styles.css` | Shared styles (self-contained, no external dependencies) |
| `web/` | Data-driven Next.js rebuild (one `/problems/[slug]` route fed by `web/src/data/problems.json`), plus the chatbot assistant (`/api/chat`) |
| `product-video-pipeline/` | GenAI video pipeline pilot (Remotion + HeyGen) for one problem page, plus an admin test bench |

## Run the frontend (`web/`)

Data-driven Next.js rebuild of the mockup (see `web/README.md`):

```
cd web
npm install
npm run dev
```

Open http://localhost:3000.

## Chatbot

A floating chat assistant (bottom-right) answers plain-English questions — from "which category
is billings in?" to "what tools help me find old emails?" — and routes users to the matching
problem page.

- **Grounded, not hallucinated** — recommendations map to real problems in `web/src/data/problems.json`.
- **Category-aware** — lists the four categories and maps a query to one.
- **Safe by default** — structured JSON output, a slug allow-list, a hardened system prompt with
  delimited data blocks, no model-side tools, and per-IP rate limiting (see `docs/chatbot-plan.md`).
- **Provider-agnostic** — OpenAI or Anthropic behind one interface. Without a key it falls back to
  deterministic keyword matching.

To enable the LLM (otherwise it runs on the built-in keyword matcher):

```
cd web
# .env.local (do not commit)
LLM_PROVIDER=openai      # openai | anthropic
OPENAI_API_KEY=...       # or ANTHROPIC_API_KEY=...
LLM_MODEL=gpt-4o-mini    # optional; defaults gpt-4o-mini / claude-3-5-haiku-latest
```

Endpoint: `POST /api/chat` with `{ "message": "..." }` returns
`{ answer, category?, matches: [{ slug, title, reason }], disclaimer }`.

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
