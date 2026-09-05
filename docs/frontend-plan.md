# Front-End Plan — AI Tool Discovery for Lawyers

Working title: **In Chambers** (placeholder — swappable).

A website that compiles AI tools, features and solutions for lawyers to discover and
adopt into their daily workflow. Organized **problem-first**, not tool-first: users browse
by the task that eats their afternoon, then find the tools that fit.

---

## 1. Positioning (the two rules that drive every decision)

1. **Problem-first, not tool-first.** Cards, navigation and copy are organized around the
   *problems/tasks* lawyers face — "keeping track of billings", "summarising a matter" —
   not around product names. The product name appears only after the user has identified
   their problem.
2. **Lower the barrier to entry.** Plain language, no jargon, no hype. The audience is
   practicing lawyers and firm staff who are busy and skeptical of AI marketing. Every
   screen must make it obvious *what it does* and *how little it costs to try*.

> The word "AI" is itself a hype word for this audience. Lead with *what the tool does*
> ("tools that draft, sort and find things for you") and let "AI" sit in the fine print.

---

## 2. Goals / success criteria

- A first-time visitor can identify their own problem and reach a relevant tool in **under
  30 seconds**.
- Every problem page answers three questions without leaving the page: *what is it, how
  does it help, how do I start.*
- The chat assistant routes a vaguely-described problem to the correct problem page (it
  links out, it doesn't just reply with text).
- Zero unexplained jargon: any term the audience might not know ("ROC", "AEIC") gets an
  inline plain-English gloss.

---

## 3. Information architecture

```
/                          → Dashboard (all problems, searchable + filterable)
/problems/[slug]           → Problem detail (one page per problem, template-driven)
  /#overview               →   text: how AI helps
  /#how-to-use             →   video: AI in action
  /#download               →   video: how to download + CTA
  /#tools                  →   list of tools with pointers + links
/about
/suggest-a-tool
```

**Key structural decision:** each problem is a distinct URL (`/problems/billings-invoices/`).
The detail page is a *single template* fed by a data object (title, category, description,
copy, videos, tools). Do **not** hand-write 17 near-identical pages — build the template
once and render it from data. The mockup uses one `detail.html` for demonstration; the real
build is one route + one data record per problem.

---

## 4. Page 1 — Dashboard (`/`)

Modeled on https://reports.open.gov.sg/products (the "report cards" look).

| Element | Spec |
|---|---|
| Header | Wordmark + name + minimal nav ("All problems", "How it works", "About", "Suggest a tool") |
| H1 | A **verb, not a product** — e.g. "Find an AI tool for the job." |
| Search | Free-text search over problem titles + descriptions |
| Filters | Lowercase toggle pills: `all`, `clients and cases`, `administrative`, `procedural law`, `substantive law` |
| Card grid | Responsive; each card = one problem |
| Chat | Floating "Describe a problem" button (bottom-right) → chat panel |
| Footer | Simple |

**Card anatomy** (whole card is a link):

```
[icon]  Problem title
        [category tag]
        One-line description (a concrete outcome)
        → 3 tools
```

Refinements over the naive version:
- The meta line should carry a **verb sequence**, not just a count — e.g. `capture · invoice ·
  reconcile` — so the value is visible before the click.
- Descriptions should name a **concrete deliverable**, not an abstract goal. "Reducing time
  spent on research" → "Get to the relevant cases and provisions faster." "Determining the
  best legal course of action" → "A shortlist of your options with the cases that support each."

---

## 5. Page 2 — Problem detail (`/problems/[slug]`)

Modeled on https://reports.open.gov.sg/activesg/overview.

| Element | Spec |
|---|---|
| Breadcrumb | `All problems / [Problem name]` |
| Hero | Icon + title + category tag + one-line description + primary CTA ("Get the tool") |
| Subnav | `Overview · How to use · Download · Tools for this job` (scroll-spy) |
| Main column | Three content blocks + tools list (below) |
| Sidebar | "Quick facts": tools reviewed, time to first use, skill needed, data handling, cost, last updated |

**Three required content blocks** (per client):

1. **Text — how this AI helps.** Plain, useful copy; explain the *gap* the tool closes and
   the *human review* that stays in charge ("a person approves every line before a client
   is billed").
2. **Video — how the AI helps.** In-page playable (16:9 embed). Add a **transcript/caption
   toggle** (legal users often can't play audio at a desk).
3. **Video — how to download.** In-page playable, kept physically adjacent to the Download CTA.

**Download CTA.** Problem-first wording ("Get the tool" / "Get started"), tool name in
supporting text, reassurance line ("free trial, no card required"), and a "what to do next"
3-step follow-up so the user isn't dropped into an unfamiliar app.

**Tools list.** 2–4 tools for this problem, each with 2–3 brief pointers + a link. Frame
them by *how they differ* (e.g. "one captures the time, one turns it into invoices, one
keeps the ledger honest") rather than as interchangeable options.

---

## 6. Content model — categories → problems

| Category | Problems |
|---|---|
| **Clients and Cases** | Explaining legal terms to non-legally trained clients · Combing through emails to find earlier correspondence · Auto-language translation for cross-border correspondence · Responding to clients empathetically · Reviewing past correspondence to recall earlier advice |
| **Administrative** | Keeping track of client billings and invoices · Tidying up documents (exhibits, AEICs) · Tracking time spent on individual files · Contacting the court for filing status · Finding clients' documents on E-Litigation |
| **Procedural Law** | Extracting templates from court practice directions · Determining the best legal course of action · Ensuring submissions comply with ROC and Practice Directions |
| **Substantive Law** | Looking through unfamiliar legislation · Reducing time spent on research · Researching regulations under statutory bodies (MOM, ACRA, LTA, URA, HDB) · Finding the most suitable contract template |

**MVP problems** (launch with these four; the rest follow): billings/invoices, email
summarisation, time tracking, unfamiliar legislation.

---

## 7. Chat assistant

Floating button → panel. Purpose: a user who *can't* classify their own problem describes it
in plain words and is routed to the right problem page.

- **Label honestly.** Not "Assistant" — "Ask a question" with the sub-line "suggests a tool,
  nothing is billed automatically."
- **Task-shaped suggestion chips** (e.g. "I lose track of billable hours").
- **On submit, link out to a problem card/detail page** — that's the point of the product.
- **State what it won't do** ("won't draft legal advice") — critical for trust.
- On mobile, don't auto-focus the input on open (it pops the keyboard over the suggestions).

---

## 8. Wireframes

**Dashboard**

```
┌──────────────────────────────────────────────────────────┐
│ ██  In Chambers · AI for lawyers      All problems  How  │
├──────────────────────────────────────────────────────────┤
│  Find an AI tool for the job.                            │
│  Every guide starts from a problem you recognise.        │
│                                                          │
│  [ 🔍  Search a problem…                    ]            │
│  (all) (clients and cases) (administrative) …            │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │ [icon]       │ │ [icon]       │ │ [icon]       │      │
│  │ Billings &   │ │ Email        │ │ Unfamiliar   │      │
│  │ invoices     │ │ summarising  │ │ legislation  │      │
│  │ admin        │ │ clients      │ │ substantive  │      │
│  │ Spot unbilled│ │ Search years │ │ Find the     │      │
│  │ work…        │ │ of email…    │ │ section…     │      │
│  │ → 3 tools    │ │ → 4 tools    │ │ → 4 tools    │      │
│  └──────────────┘ └──────────────┘ └──────────────┘      │
│                                        (🧭 describe a    │
│                                         problem)         │
└──────────────────────────────────────────────────────────┘
```

**Problem detail**

```
┌──────────────────────────────────────────────────────────┐
│  All problems / Billings and invoices                    │
│  [icon] [administrative]                                 │
│  Keeping track of client billings and invoices   [Get]   │
│  Stop losing billable time in the gaps…                  │
│  Overview · How to use · Download · Tools for this job   │
├─────────────────────────────────────────┬────────────────┤
│  Overview — How AI helps with billing   │  Quick facts   │
│    (plain copy, "your review stays      │  Tools reviewed: 3
│     in charge")                         │  Time to first use:
│  How to use — See it in action          │    ~10 min      │
│    ┌─────────────────────────────┐      │  Skill: none    │
│    │  ▶  (2 min) how it works    │      │  Cost: free trial
│    └─────────────────────────────┘      │  Last updated   │
│  Download — Get the tool                │                │
│    ┌─────────────────────────────┐      │                │
│    │  ▶  (1 min) how to download │      │                │
│    └─────────────────────────────┘      │                │
│    [ Get started ]  free trial, no card │                │
│  Tools for this job                     │                │
│    PointOne — captures, drafts, answers │                │
│    Biller   — invoices, owes, reminders │                │
│    Ledgerline — reconcile, flag gaps    │                │
└─────────────────────────────────────────┴────────────────┘
```

---

## 9. Design system direction

- **Color:** white + cool light gray (`#f6f7f9`, deliberately *not* cream) + one deep blue
  accent (`#1f4e8c`). Calm, trustworthy, non-decorative.
- **Type:** serif display (headlines/section headings) for editorial, case-law authority;
  system sans for cards/UI/body. Two weights, not a family of weights.
- **One motif, held back:** a thin double rule at the top (like the top of a pleading),
  echoed once above the footer. That's the whole decoration — no floating shapes, gradients,
  or noise.
- **Explicitly avoid** (AI-default tells): warm cream `#F4F1EA`; acid/vermilion accent on
  near-black; ALL-CAPS eyebrows; single-word accent-coloring in a headline; mid-dot meta
  strings; monospace for tiny data labels; unneeded `01/02/03` numbering.

Suggested webfont upgrade (self-host, no CDN): **Source Serif 4** or **Newsreader** for
headlines, paired with the existing system sans — the one change that most elevates the
"considered typography" impression without disturbing the calm tone.

---

## 10. Critique & recommendations

### 10.1 Strengths of the current proposal
- Problem-first cards + category filters + chat is the right core loop, and it maps cleanly
  onto the open.gov.sg "report cards" pattern the client asked for.
- The subpage's three-block structure (text / how-it-helps video / download video) directly
  answers the three questions every adopter asks.

### 10.2 Weaknesses and fixes (UX — from the design pass)

1. **Category labels are lawyer-accurate but low-signal for staff.** A paralegal won't know
   whether "finding a contract template" is procedural or substantive. Keep the four
   categories, but add a one-line plain-English gloss under each pill — or rename to
   **"Research"** (substantive) and **"Court & filing"** (procedural).
2. **No confidence signal on cards.** Skeptical lawyers need to know how much to trust a
   suggestion *before* clicking. Add a small honest indicator per card ("review the output
   before using" vs "safe to draft with").
3. **Single-destination detail page.** In the mockup all cards point to one `detail.html`;
   the real build must be template + data (see §3).
4. **"AI" appears in the hero eyebrow and tagline.** For this audience "AI" is the hype word.
   Lead with *what it does*; keep "AI" in the fine print.

### 10.3 Lowering the barrier to entry (the core job)
- The biggest lever is already present: the H1 is a verb, not a product.
- Surface a **condensed** version of the sidebar "Quick facts" (time to first use, skill
  needed) **directly on the cards** — the single most effective barrier-lowering element.
- Add an **"I'm not sure"** / "Everything else" pill so users who can't classify their own
  problem don't bounce.
- A plain-English glossary or inline glosses for "ROC", "AEIC", etc.

### 10.4 Video
- Two stacked in-page videos is correct; add **transcript/caption toggles** (legal users
  often can't play audio).
- Keep the download video adjacent to the Download CTA (already done).

### 10.5 Accessibility (from the design pass)
Good already: semantic landmarks, skip-link, focus-visible, `aria-pressed` on pills,
`aria-expanded`/`role="dialog"` + Escape on chat, `prefers-reduced-motion`, `aria-live`
result count, `scroll-margin` anchors.

Fix before shipping:
- Debounce the result-count live region (announce on change, not per keystroke).
- Video placeholders need a visible text label inside the box (background-only is invisible
  to low-vision users).
- Add a **focus trap** inside the chat dialog (Escape works, Tab currently doesn't stay
  contained).
- Confirm `prefers-reduced-motion` also scopes the subnav anchor smooth-scroll.
- Align subnav labels to a single tense (all-verb or all-noun).

### 10.6 Copy note
The mockup's copy is grounded and usable as-is. One inconsistency to resolve in the real
build: the download button reads "Download PointOne" (tool-first) while the rest of the page
is problem-first — make it "Get started" with the tool name in supporting text.

---

## 11. Technical recommendations

- **Stack:** static-first. Next.js (or Astro) with the detail page as one dynamic route
  (`/problems/[slug]`) reading from a Markdown/JSON/TS data file per problem. No backend
  needed for v1; content lives in the repo.
- **Search/filter:** client-side over the problem index (small dataset, ~17 items).
- **Chat assistant:** serverless route to an LLM with a constrained system prompt (suggest a
  problem + tools, link out, never draft legal advice). Start with a static fallback that
  matches keywords → problem.
- **Video:** self-hosted MP4 (H.264) or a player (Mux/Cloudflare Stream); lazy-load
  off-screen, provide poster + captions. The "gen AI video" described in the brief
  (simulated user-system interaction) is produced content — store it like any other asset.
- **Data model per problem:** `slug, title, category, description, overviewCopy, howItWorksVideo,
  downloadVideo, downloadCta, tools[{name, pointers[], url}], quickFacts[]`.

---

## 12. Mockup

Clickable, self-contained HTML (opens offline, no build step):

- `mockup/index.html` — dashboard (17 problem cards, search, filters, chat, footer)
- `mockup/detail.html` — problem detail ("billings and invoices")
- `mockup/styles.css` — shared styles

Open `mockup/index.html` in a browser; cards link to the detail page, filters and chat work.

---

## 13. Open questions / next steps

- Confirm final category naming (keep the four legal terms + glosses, or rename to
  Research / Court & filing).
- Confirm the working name ("In Chambers") or supply a final name.
- Decide the confidence/risk indicator to add to cards.
- Produce the actual "how it helps" and "download" videos (the gen-AI videos from the brief);
  placeholders are in place.
- Agree the stack (Next.js vs Astro) before scaffolding the real build.
