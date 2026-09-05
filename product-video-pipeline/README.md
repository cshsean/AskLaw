# Video pipeline pilot — "Keeping track of client billings and invoices"

Single-problem test of the pipeline in `docs/video-pipeline-plan.md`. Not wired
up to the real site yet, and not using a real HeyGen key or a real screen
recording yet — see "What's mocked" below.

## Setup

```
npm install
npm run make-placeholders   # generates local stand-in video files with ffmpeg
npm run generate-narration  # calls HeyGen (or the mock) and computes scene timing
npm run preview              # opens Remotion Studio to preview ProblemVideo
npm run render                # renders out/billings-invoices.mp4
```

## Admin UI (browser test bench)

```
npm run admin   # serves http://localhost:4174/admin
```

Upload a script JSON / demo video / supporting documents / free-text directions,
review (and edit) the merged scene script inline — this is the mandatory human
review gate from `docs/video-pipeline-plan.md` §5, not a rubber stamp — then
render and watch the output on the same page.

`mockup/index.html` and `mockup/detail.html` link to this page from an "Admin"
button in the top-right nav. It only works while `npm run admin` is running
locally; it's a dev/test tool, not part of the public site.

Requires `ffmpeg`/`ffprobe` on PATH (used for placeholder generation and to
measure clip durations for scene timing).

## What's real vs. mocked in this pilot

| Piece | Status |
|---|---|
| Scene script (`data/billings-invoices.json`) | Written for this pilot, needs your team's actual review/sign-off before treating it as final (per the mandatory review gate in the plan, §5) |
| Ordering logic (HeyGen `video_inputs` array, Remotion `<Series>`) | Real — this is the thing being tested |
| HeyGen narration | **Mocked** unless `HEYGEN_API_KEY` + `HEYGEN_AVATAR_ID` are set in `.env` (copy `.env.example`). Falls back to a local placeholder clip so the pipeline runs end-to-end without live credentials |
| Screen-recording segment (§3a of the plan) | **Placeholder only** — `PLACEHOLDER_billings-tool-demo.mp4`, a generated color card, not real footage of any tool. Swap in a real capture at `assets/` and update `assetRef` in the data file to test with real footage |
| Diagram overlays (`visualIntent`) | Rendered as plain text labels for this pilot, not generated motion graphics — that's a follow-up once the ordering/composition mechanism is validated |

## How ordering is guaranteed (what this pilot exists to prove)

1. `data/billings-invoices.json` → `videoScript` is the single source of truth
   for order (`scene` field).
2. `src/heygenClient.ts` sorts narration scenes by `scene` before building the
   HeyGen `video_inputs` array — array index is what HeyGen uses to
   concatenate, so this is where narration order is locked in.
3. `src/generateNarrationVideo.ts` splits the single returned HeyGen video back
   into per-scene timing (proportional to word count — see the caveat in
   `docs/video-pipeline-plan.md` §3) and writes `data/billings-invoices.generated.json`.
4. `remotion/ProblemVideo.tsx` merges the narration timing entries and the
   screen-recording entry into one list, sorted again by `scene`, and lays
   them out with Remotion's `<Series>` — so the final render order is decided
   in exactly one place, from the same `scene` numbers as step 1.

## Next steps once this pilot is reviewed

- Swap in a real screen recording for the billings tool and confirm the
  composition still lines up.
- Provide real HeyGen credentials and confirm a live-rendered narration track
  composites correctly.
- Only after both of those check out: decide whether to extend to the
  remaining problems (see open decision in `docs/video-pipeline-plan.md` §7 on
  per-problem vs. per-category).
