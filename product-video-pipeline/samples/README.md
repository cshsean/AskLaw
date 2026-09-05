# Sample inputs for the admin UI

Test data for `npm run admin` (http://localhost:4174/admin) — nothing here is
real content, it's fixtures to exercise the upload → generate → review →
render flow end to end. All of it is written for the **billings-invoices**
pilot problem, naming **PointOne** as the tool (matching `mockup/detail.html`).

| File | Upload it as | What it's for |
|---|---|---|
| `sample-script.txt` | Script | Plain narration text — **what should be said**, not the video's shot structure. The admin page (via Gemini, if `GEMINI_API_KEY` is set) turns this into the ordered scene JSON for you to review |
| `supporting-doc-pointone-overview.md` | Documents | Stand-in vendor feature sheet — passed to script generation as background context |
| `supporting-doc-firm-review-policy.md` | Documents | Stand-in internal policy doc — reinforces that the human-review beat in the script is a compliance requirement, not just style |
| `directions.txt` | Directions (paste the contents into the textarea) | Sample reviewer notes passed alongside the script and documents |

There's no sample demo video here — recording one requires an actual tool to
screen-record, which is out of scope for fixture data. This matters more than
it might look: the generated scene plan follows a fixed structure (see
`docs/video-pipeline-plan.md` §1) — **what is it → how to use it (only if a
demo video is attached) → how it helps** — so leaving the demo video field
blank should produce a plan with *no* screen-recording scene at all, not a
placeholder one. Supply any short MP4 to test the "how to use it" scene
actually appearing.

## Quick test

1. `npm run admin`
2. Upload `sample-script.txt` as the script, both `.md` files as documents,
   and paste `directions.txt`'s contents into the directions box. Leave the
   demo video field blank for this first pass.
3. Click **Generate scene plan**.
   - With `GEMINI_API_KEY` set in `.env`: Gemini follows the fixed structure —
     opens by naming PointOne, skips straight to "how it helps" since no demo
     video was attached, and writes a visualIntent for each narration beat —
     review that output like any AI-drafted content.
   - Without a key: you'll see a naive paragraph split instead, clearly
     flagged in the warnings box and in each scene's `visualIntent` — treat
     it as a rough draft, not a finished plan.
4. Confirm:
   - The first scene names and describes PointOne — it should never open with
     the pain point.
   - There's no screen-recording scene, since no demo video was uploaded.
   - The human-review checkpoint (from `sample-script.txt`'s third paragraph)
     survived as its own scene under "how it helps" — it's a firm policy
     requirement per `supporting-doc-firm-review-policy.md`, not something
     that should get trimmed for pacing.
5. Click **Confirm & render** and confirm the output plays.
6. Optional second pass: re-upload with any short MP4 as the demo video, and
   confirm a "how to use it" screen-recording scene now appears between the
   intro and the benefit scenes.
