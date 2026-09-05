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
screen-record, which is out of scope for fixture data. Leave that field blank
to keep the generated placeholder, or supply any short MP4 you have on hand
to test that the upload path itself works.

## Quick test

1. `npm run admin`
2. Upload `sample-script.txt` as the script, both `.md` files as documents,
   and paste `directions.txt`'s contents into the directions box.
3. Click **Generate scene plan**.
   - With `GEMINI_API_KEY` set in `.env`: Gemini splits the script into
     scenes, inserts a screen-recording slot, and writes a visualIntent for
     each narration beat — review that output like any AI-drafted content.
   - Without a key: you'll see a naive paragraph split instead, clearly
     flagged in the warnings box and in each scene's `visualIntent` — treat
     it as a rough draft, not a finished plan.
4. Confirm the human-review checkpoint (from `sample-script.txt`'s third
   paragraph) survived as its own scene — it's a firm policy requirement per
   `supporting-doc-firm-review-policy.md`, not something that should get
   trimmed for pacing.
5. Click **Confirm & render** and confirm the output plays.
