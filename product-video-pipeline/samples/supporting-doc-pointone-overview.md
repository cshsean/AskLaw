# PointOne — feature overview (sample supporting document)

Sample reference document for admin-UI testing. Represents the kind of
background material a lawyer/reviewer might attach when preparing a problem's
video — a vendor feature sheet, not something the pipeline parses yet.

## What it does
- Reads calendar events, email metadata, and call logs to detect billable
  activity that hasn't been logged as time yet.
- Drafts invoice line items grouped by matter, with a plain-language
  description of the work (e.g. "Reviewed and responded to opposing counsel's
  email re: discovery schedule — 0.3h").
- Flags anything it's unsure about for manual entry rather than guessing.

## What it doesn't do
- Never sends an invoice without a human clicking "approve."
- Doesn't read the content of privileged emails — only metadata (sender,
  recipient, subject line, timestamp, duration).

## Typical first-use flow
1. Connect calendar and email (read-only, revocable at any time).
2. Review the first week of drafted entries against your own memory of the
   week — most firms find PointOne catches 10-15% more billable time than
   manual logging alone.
3. Approve, edit, or discard each line; approved lines flow into the firm's
   existing billing system.

## Pricing (sample)
14-day free trial, no card required. $39/user/month after, discounted for
firms over 10 seats.

## Data handling
Time and correspondence metadata is processed in-region; no client
correspondence content is stored longer than needed to draft the line item.
