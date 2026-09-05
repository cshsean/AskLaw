# GenAI Video Pipeline — Plan

Status: **Planning — not yet greenlit for implementation.**

Companion to `frontend-plan.md`. This document scopes the generative audio-video
component of the problem detail page: a short, general, educational clip that sits
below the "how AI helps" text block (§5 of the frontend plan).

---

## 1. Fixed scene structure

Every generated video follows the same three-part order, enforced in the script
generator, not left to per-problem judgment:

1. **What is it** — one or more scenes plainly naming and describing the tool.
   Must come first; never opens with the pain point or a benefit claim before the
   tool itself has been introduced.
2. **How to use it** — *optional*, included only when a real screen recording has
   been supplied for that tool (§4a). Exactly one screen-recording scene, placed
   between "what is it" and "how it helps." Skipped entirely — not replaced with
   narrated UI steps — when no recording exists yet.
3. **How it helps** — one or more scenes tying the tool back to the lawyer's
   actual pain point, grounded in the script. Any human-review/approval step
   described in the script or supporting documents must appear here as its own
   beat; it is a compliance requirement, not something to trim for pacing.

## 2. What this is (and isn't)

- **Is:** a short (30–90s), general, AI-generated explainer of *how a class of AI
  tool accomplishes the task* (e.g. "how AI helps track billing invoices") —
  conceptual, not tied to any single vendor's real interface.
- **Is not, for the conceptual portion:** a step-by-step tutorial. The
  data-flow/mechanism segments stay generic (§3) — never a fabricated recreation of
  a specific product's real interface.
- **Does include one real segment:** a short (~10–15s), genuinely screen-recorded
  clip of the actual tool's interface, to show real navigation/UI. This is
  **manually captured footage, not AI-generated** — HeyGen/Remotion don't invent
  it, they place it. See §4a and §6 for how this is sourced and kept current.
- **Why genAI, specifically (per `docs/recommendations.md`, condition 1 — high UI
  volatility):** the site documents third-party tools it doesn't control. Their UIs
  change on their own schedule. A generated *conceptual* clip (never claiming to be
  a real screen) can be regenerated cheaply when a problem's copy changes, instead of
  manually re-recording footage of someone else's product.
- **Open point, flagged honestly:** nothing here mechanically requires *video* over
  text — the UI-volatility argument applies equally to text. Audio-video is being
  built because it's a product requirement from the team, not because the UX
  strictly demands it. Captions/transcript remain mandatory (frontend-plan §10.4)
  since the audience often can't play audio at a desk.

---

## 3. Scope for v1

- One clip **per problem** (17 total at full content), generated from that
  problem's existing data record — not per tool. Tool-specific footage is exactly
  what we're avoiding (fidelity/staleness risk).
- Content = the mechanism, not the UI: inputs → AI step(s) → human-review
  checkpoint → output. Every clip must show a human-approval step somewhere in the
  sequence (trust requirement carried over from the frontend plan's "a person
  approves every line" principle).
- English only for v1. Localization (condition 4 in `recommendations.md`) is a
  later phase, not v1.

---

## 4. Pipeline

```
problem data record (slug, title, overviewCopy, tools[], quickFacts[])
        │
        ▼
  1. Script generation (LLM)
     → ordered JSON scene list: [{scene, narration, visual_intent}, ...]
     → human review / edit gate (mandatory, see §6)
        │
        ▼
  2. Narration render (Synthesia or HeyGen API)
     → one API call per problem, scenes submitted in order
     → returns narrated avatar/voice segments in the given order
        │
        ▼
  3. Composition (Remotion)
     → React components consume the same ordered scene JSON
     → layers narration audio/avatar output with generated diagram /
       motion-graphic visuals (data flow, not real UI) per scene
     → renders final MP4 + auto-generated caption track (from the narration
       script — no separate transcription step needed, we already have the text)
        │
        ▼
  4. Output stored as a static asset per problem slug
     (same asset-per-slug model as the rest of the data-driven page, §11 of
     frontend-plan.md), referenced from the problem's data record.
```

Key point: there is no manual *editing* step (dragging clips on a timeline).
Ordering and composition are both driven by the same scene JSON produced in step
1 — Remotion renders directly from data, the same way the page template renders
HTML from data. The one manual step in the whole pipeline is capturing the real
screen recording itself (§4a) — that's inherent to it being real footage, not a
gap in the automation.

### 4a. Real screen-recording segment

- **Source:** either (a) someone on the team screen-records the featured tool
  once, following a fixed short script ("open the tool, do X, see Y"), or (b) an
  existing vendor-provided demo clip is used if its license permits embedding.
  Either way this is **one asset per tool**, not per problem — a tool used across
  multiple problem pages reuses the same clip.
- **Placement:** the clip is assigned to a specific `scene` slot in the same scene
  JSON as the HeyGen narration and diagram overlays (e.g. `scene: 3, type: "screen_recording", assetRef: "tool-slug-demo.mp4"`).
  Remotion overlays a narration voiceover (from HeyGen, or a plain TTS line) on
  top of the muted recording, plus the caption track — the recording itself
  doesn't need its own audio.
- **Freshness is tracked, not assumed.** Each recording carries a `capturedAt`
  date and a `verifiedAt` date. It does not get silently regenerated the way the
  conceptual segments do (there's no automated way to detect a UI redesign) — it
  needs a periodic manual spot-check instead. See §8 for cadence decision.

---

## 5. Why Remotion for the composition layer

- Composes video from code + data (React components), matching the site's
  existing "one template, fed by data" philosophy (frontend-plan §3, §11) — the
  video becomes another render target of the same problem data record, not a
  separate content pipeline.
- Programmatic — no GUI timeline editor, no human splicing step, which is the
  actual gap Synthesia/HeyGen alone don't close (they render narration, not
  composited diagrams).
- Open-source, self-hostable render (cost control vs. a pure SaaS compositor).

Alternatives considered: Shotstack / Creatomate (JSON-timeline cloud APIs — viable
fallback if Remotion's render infra becomes a bottleneck), plain FFmpeg scripting
(more control, more engineering cost, no strong reason to prefer it here).

---

## 6. Guardrails (non-negotiable, carried from earlier discussion)

- **Mandatory human review of the generated script before any rendering.** The
  script is the one place inaccuracy or an implied claim ("this tool guarantees…")
  could sneak in; review it as text before it becomes a harder-to-edit video.
- **The conceptual/diagram segments never fake a real product's UI** — those stay
  generic motion graphics. The one segment that *does* show a real UI must be
  actual, current, verified footage (§4a) — never a generated recreation of it.
  Mixing a fabricated "looks real" UI clip in with genuinely real ones is worse
  than either alone, since a viewer has no way to tell which is which.
- **Screen-recording freshness needs an owner.** Someone must be responsible for
  the periodic spot-check in §4a — this doesn't get an automated regeneration
  trigger the way the conceptual segments do.
- **Every clip includes a human-checkpoint beat** in the narration/visual sequence
  (e.g. "you review before it's sent") — consistent with the site's trust
  positioning for a skeptical legal audience.
- **Captions/transcript always shipped**, generated directly from the reviewed
  script (already-approved text), not a separate AI transcription pass.
- **Regeneration trigger:** re-run the pipeline when a problem's `overviewCopy`
  data changes, not on a fixed schedule — ties the video's freshness to the same
  content update that would already require someone to touch the page.

---

## 7. Data model addition

Extend the per-problem record (frontend-plan §11) with:

```
{
  ...existing fields,
  videoScript: [{
    scene: number,
    type: "narration" | "screen_recording",
    narration: string,              // for type "narration": HeyGen input text
    visualIntent: string,           // for type "narration": diagram overlay to generate
    assetRef: string                // for type "screen_recording": tool-slug-demo.mp4
  }],
  videoAsset: { url: string, captionsUrl: string, generatedAt: string, sourceCopyHash: string }
}
```

Screen-recording assets are keyed by **tool**, not problem, and tracked separately
since they don't regenerate automatically:

```
{
  toolSlug: string,
  assetUrl: string,
  capturedAt: string,
  verifiedAt: string,
  verifiedBy: string
}
```

`sourceCopyHash` lets the pipeline detect when `overviewCopy` has drifted from what
the video was generated against, to flag a problem's video as stale without a
manual audit pass.

---

## 8. Open decisions before build

1. Synthesia vs. HeyGen for narration — needs a quick side-by-side on: API scene
   support, voice/avatar quality, per-minute cost at ~17 clips.
2. Confirm one clip per problem (17) vs. per category (4) — affects total
   generation cost and how generic the script can be.
3. Where does the human script-review step live procedurally — a review UI, or
   just a PR-style diff on the generated JSON before render?
4. Self-host Remotion renders vs. Remotion Lambda (their managed render
   infrastructure) — cost/ops tradeoff, decide once volume (17 vs. scaling later)
   is confirmed.
5. Who owns capturing/re-verifying each tool's screen recording, and on what
   cadence (e.g. every N months, or triggered when a tool's listing is edited)?
6. Per-tool or per-problem screen recording — a tool that appears on multiple
   problem pages: one shared clip, or a different short capture per context it's
   used in?

---

## 9. Status

Planning complete pending greenlight. **Do not begin implementation until
explicitly approved** — this doc is the spec to review first.
