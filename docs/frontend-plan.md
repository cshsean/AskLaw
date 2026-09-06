# Front-End Plan — AI Tool Discovery for Lawyers

**AskLaw** — a collaboration between the Singapore Academy of Law and the Ministry of Law.

A government directory that compiles AI tools, features and solutions for lawyers to discover
and adopt into their daily workflow. Organized **problem-first**, not tool-first: users browse
by the task that eats their afternoon, then find the tools that fit. Neutral by design — the
site recommends *multiple* tools for each problem and does not endorse a single one.

---

## 1. Positioning (the rules that drive every decision)

1. **Problem-first, not tool-first.** Cards, navigation and copy are organized around the
   *problems/tasks* lawyers face, not product names. The product name appears only after the
   user has identified their problem.
2. **Lower the barrier to entry.** Plain language, no jargon, no hype. The audience is busy,
   skeptical lawyers and firm staff.
3. **Neutral, government voice.** The word "AI" is a hype word for this audience — lead with
   *what the tool does* ("tools that draft, sort and find things for you") and let "AI" sit in
   the fine print. The H1 is a verb, not a product: **"Find a tool for the job."**

---

## 2. Goals / success criteria

- A first-time visitor identifies their own problem and reaches a relevant tool in **under 30
  seconds**.
- Every problem page answers two questions without leaving the page: *how does it help, and
  which tools do this.*
- The chat assistant routes a vaguely-described problem to the correct problem page.
- The directory is visibly **neutral** — no single tool is endorsed; every problem lists
  multiple options.

---

## 3. Information architecture

```
/                          → Dashboard (all problems, searchable + filterable)
/problems/[slug]           → Problem detail (one page per problem, template-driven)
  /#overview               →   text: how the tools help
  /#how-to-use             →   video: how it helps (the gen-AI explainer)
  /#tools                  →   list of tools with pointers + links
/about
/suggest-a-tool
```

**Key structural decision:** each problem is a distinct URL (`/problems/billings-invoices/`),
rendered by a **single template fed by a data object** — do not hand-write 18 near-identical
pages. The mockup uses one `detail.html`; the real build is one route + one data record per
problem.

---

## 4. Page 1 — Dashboard (`/`)

Modeled on https://reports.open.gov.sg/products.

| Element | Spec |
|---|---|
| Top banner | Government collaboration line: "A collaboration between the Singapore Academy of Law and the Ministry of Law." |
| Header | Wordmark "AskLaw" + minimal nav |
| H1 | "Find a tool for the job." |
| Search | Free-text over problem titles + descriptions |
| Filters | Two levels (see below) |
| Card grid | Responsive; each card = one problem |
| Chat | Floating "Describe a problem" button → chat panel |
| Footer | Simple, with collaboration subtitle |

### Two-level tag model

Each problem has:
- **One primary category** (single-select filter pill): `clients`, `administrative`,
  `procedural law`, `substantive law`.
- **Zero or more practice-area tags** (multi-select toggle pills): `family law`,
  `criminal law`, and more later (corporate, conveyancing, litigation, …).

Filtering combines category (AND) with practice area (multi-select, OR-within-facet), plus
search. Cards show **all** tags: a category chip + any practice-area chip(s). This is
data-driven (`data-category` + `data-tags`), so adding a practice area is a one-line change.

**Card anatomy** (whole card is a link):

```
[icon]  Problem title
        [category chip] [practice-area chip(s)]
        One-line description (a concrete outcome)
        → N tools
```

---

## 5. Page 2 — Problem detail (`/problems/[slug]`)

Modeled on https://reports.open.gov.sg/activesg/overview.

| Element | Spec |
|---|---|
| Breadcrumb | `All problems / [Problem name]` |
| Hero | Icon + title + category tag (+ any practice-area tags) + one-line description + CTA |
| Subnav | `Overview · How to use · Tools for this job` |
| Main column | Text + one video + tools list |
| Sidebar | "Quick facts": tools reviewed, time to first use, skill needed, data handling, cost, last updated |

**Three content blocks:**

1. **Overview — how the tools help.** Plain, useful copy; explain the *gap* the tools close
   and the *human review* that stays in charge.
2. **How to use — see it in action.** ONE in-page-playable gen-AI explainer video, with a
   transcript/caption toggle.
3. **Tools for this job.** 2–4 tools, each with 2–3 brief pointers + a link, framed by *how
   they differ*.

**CTA.** The hero button is **"See the tools"** and scrolls to `#tools`. There is **no download
button and no "how to download" video** — different tools have different install flows, so a
single-tool download video would endorse one product and break neutrality.

**Neutrality note** near the tools list: "AskLaw does not endorse any specific tool."

---

## 6. Content model — categories → problems

Primary categories with practice-area tags shown in brackets:

| Category | Problems |
|---|---|
| **Clients** | Explaining legal terms and judgements to non-legally trained clients · Comb through emails to find earlier correspondence · Translate languages · Review past correspondence to recall earlier advice |
| **Administrative** | Keeping track of client billings and invoices · Tidying up documents (exhibits, AEICs) · Tracking time spent on individual files · Contacting the court for filing status · Finding documents on E-Litigation · Tracking divorce timelines `[family law]` |
| **Procedural Law** | Extracting templates from court practice directions · Determining the best legal course of action · Ensuring submissions comply with ROC and Practice Directions · Submitting bail applications `[criminal law]` |
| **Substantive Law** | Looking through and summarising unfamiliar legislation · Finding regulations and guidelines under statutory bodies (MOM, ACRA, LTA, URA, HDB) · Finding suitable contract templates · Calculate family maintenance (spousal and child) `[family law]` |

**MVP problems** (launch scope): billings/invoices, email summarisation, time tracking,
unfamiliar legislation.

---

## 7. Chat assistant

Floating button → panel. Routes a vaguely-described problem to the right problem page.

- Label honestly ("Ask a question" + "suggests a tool, nothing is billed automatically").
- Task-shaped suggestion chips (e.g. "I lose track of billable hours").
- On submit, **link out to a problem card/detail page**.
- State what it won't do ("won't draft legal advice").

---

## 8. Wireframes

**Dashboard**

```
┌──────────────────────────────────────────────────────────┐
│  A collaboration between the Singapore Academy of Law    │
│  and the Ministry of Law                                 │
│  ██  AskLaw · tools for lawyers         All problems     │
├──────────────────────────────────────────────────────────┤
│  Find a tool for the job.                                │
│  [ 🔍  Search a problem…                    ]            │
│  (all) (clients) (administrative) (procedural) …         │
│  Practice area: (family law) (criminal law)              │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │ [icon]       │ │ [icon]       │ │ [icon]       │      │
│  │ Billings &   │ │ Email        │ │ Divorce      │      │
│  │ invoices     │ │ summarising  │ │ timelines    │      │
│  │ admin        │ │ clients      │ │ admin ·family│      │
│  │ → 3 tools    │ │ → 4 tools    │ │ → N tools    │      │
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
│  Keeping track of client billings and invoices  [See]    │
│  Stop losing billable time in the gaps…        [tools]   │
│  Overview · How to use · Tools for this job              │
├─────────────────────────────────────────┬────────────────┤
│  Overview — How the tools help          │  Quick facts   │
│    (plain copy, "your review stays      │  Tools reviewed: 3
│     in charge")                         │  Time to first use:
│  How to use — See it in action          │    ~10 min      │
│    ┌─────────────────────────────┐      │  Skill: none    │
│    │  ▶  (2 min) how it helps    │      │  Cost: free trial
│    └─────────────────────────────┘      │  Last updated   │
│  Tools for this job                     │                │
│    AskLaw does not endorse any          │                │
│    specific tool.                       │                │
│    PointOne — captures, drafts, answers │                │
│    Biller   — invoices, owes, reminders │                │
│    Ledgerline — reconcile, flag gaps    │                │
└─────────────────────────────────────────┴────────────────┘
```

---

## 9. Design system direction

- **Color:** white + cool light gray (`#f6f7f9`, not cream) + a deep navy brand accent
  (`#1a4a8a`) for AskLaw identity + a muted **teal** for practice-area tags (distinct from
  category). Calm, official, non-decorative.
- **Type:** serif display for headlines (case-law authority), system sans for cards/UI/body.
- **One motif, held back:** a thin double rule at the top, echoed above the footer.
- **Avoid** (AI-default tells): warm cream `#F4F1EA`, acid/vermilion accent, ALL-CAPS eyebrows,
  single-word accent-coloring, mid-dot meta strings, monospace data labels, unneeded `01/02/03`.
- Suggested self-hosted webfont upgrade: **Source Serif 4** or **Newsreader** for headlines.

---

## 10. Critique & recommendations

### 10.1 What's now right
- Removing the download video/button is correct: a single-tool install video would endorse one
  product and break the government-neutrality stance.
- "See the tools" anchoring to `#tools` is the right neutral CTA pattern.
- Two-level tagging (category + practice area) correctly models the "family law / criminal law"
  cross-cutting tags without polluting the four primary categories.
- Rebrand to AskLaw + SAL/MinLaw collaboration is a strong trust anchor.

### 10.2 Open issues to resolve
1. **Tag mapping correction (please confirm).** "Calculate family maintenance" maps to
   *Substantive Law + Family Law* — **not** Criminal Law. "Submitting bail applications" is the
   *Criminal Law* item. The brief's phrasing ("family maintenance can fall under both
   substantive law and criminal law") appears to be a slip; the mockup implements maintenance →
   family law, bail → criminal law.
2. **Explainer video vs neutrality (most important).** The "How to use AI to bill" narration
   names a specific tool ("Biller"). But AskLaw is now a neutral, tool-agnostic directory. The
   "how it helps" video must either be **product-agnostic** (show the *pattern*: work → screen
   captured → draft entry → approve) or be explicitly labeled "example using Biller". Resolve
   this before producing the video, or the flagship content will contradict the positioning.
3. **Neutrality disclosure.** "Does not endorse any specific tool" is a start. Consider adding:
   how tools are selected/reviewed, any commercial relationship, and a per-tool "free / paid /
   government-provided" badge. Given legal confidentiality, a short data/privacy stance is
   also worth stating.

### 10.3 Lowering the barrier to entry
- Surface a condensed "Quick facts" (time to first use, skill needed) directly on the cards.
- Add an "I'm not sure" pill for users who can't classify their own problem.
- Plain-English glosses for "ROC", "AEIC", etc.

### 10.4 Removed problems — confirm
- **"Responding to clients empathetically"** was dropped. If the concern is that "empathy"
  isn't an AI job, reframe it as **"Responding to clients promptly"** (response speed + tone
  consistency) rather than deleting a real pain point.
- **"Reducing time spent on research"** was dropped. Reasonable consolidation into
  "summarising legislation" + "finding regulations", but consider a broader **"Legal research"**
  umbrella if research remains a top pain point.

### 10.5 Video & accessibility (carried from earlier pass)
- Keep transcript/caption toggles on the video (legal users often can't play audio).
- Debounce the result-count live region; add a focus trap in the chat dialog; give video
  placeholders a visible text label; scope `prefers-reduced-motion` to subnav smooth-scroll.

---

## 11. Technical recommendations

- **Stack:** static-first. Next.js or Astro; detail page is one dynamic route
  (`/problems/[slug]`) reading from a Markdown/JSON/TS data file per problem. No backend for v1.
- **Search/filter:** client-side over the problem index; the tag model is data-driven
  (`category` + `practiceAreas[]`).
- **Chat assistant:** serverless route to an LLM with a constrained prompt (suggest a problem +
  tools, link out, never draft legal advice); start with a keyword→problem fallback.
- **Video:** self-hosted MP4 (H.264) or a player (Mux/Cloudflare Stream); poster + captions.
- **Data model per problem:** `slug, title, category, practiceAreas[], description,
  overviewCopy, howItHelpsVideo, tools[{name, pointers[], url, cost}], quickFacts[]`.

---

## 12. Mockup

Clickable, self-contained HTML (opens offline, no build step):

- `mockup/index.html` — dashboard (18 problem cards, search, two-level filters, chat, footer)
- `mockup/detail.html` — problem detail (billings: text + one video + tools list)
- `mockup/styles.css` — shared styles

Open `mockup/index.html` in a browser; cards link to the detail page; category + practice-area
filters and chat work.

---

## 13. Open questions / next steps

- Confirm the tag mapping correction (maintenance → family law, bail → criminal law).
- Decide whether the explainer video is product-agnostic or explicitly "example using Biller".
- Decide how tools are selected/reviewed and surfaced (neutrality disclosure, cost badges).
- Confirm the two removed problems and whether to reintroduce them reframed.
- Agree the stack (Next.js vs Astro) before scaffolding the real build.
