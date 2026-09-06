# AskLaw — web app

Data-driven [Next.js](https://nextjs.org) (App Router) rebuild of the AskLaw directory. One
`/problems/[slug]` route fed by `web/src/data/problems.json`, with client-side search/filter and a
grounded chatbot assistant.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## Structure

- `src/data/problems.json`, `src/data/categories.json` — the directory content (single source of truth).
- `src/app/page.tsx` — dashboard (search + category filters + problem cards).
- `src/app/problems/[slug]/page.tsx` — problem detail.
- `src/app/ChatWidget.tsx` — floating chat assistant UI.
- `src/app/api/chat/route.ts` — chatbot endpoint (`POST /api/chat`).
- `src/lib/search/` — lexical retrieval + no-LLM keyword fallback.
- `src/lib/llm/` — OpenAI / Anthropic providers (structured output).
- `src/lib/safety/` — input sanitization, slug allow-list, per-IP rate limiting.

## Chatbot

`POST /api/chat` — body `{ "message": "..." }` →

```json
{
  "answer": "…",
  "category": "administrative",
  "matches": [{ "slug": "billings-and-invoices", "title": "…", "reason": "…" }],
  "disclaimer": "AskLaw doesn't endorse any specific tool, and this isn't legal advice."
}
```

Configure the LLM via `.env.local` (not committed):

```bash
LLM_PROVIDER=openai     # openai | anthropic
OPENAI_API_KEY=...      # or ANTHROPIC_API_KEY=...
LLM_MODEL=gpt-4o-mini   # optional
```

Without keys it runs a deterministic keyword matcher. Full design in `docs/chatbot-plan.md`.
