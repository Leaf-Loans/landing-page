# Lead capture → Google Sheets

The contact modal in `assets/leafloans.js` posts JSON to a Google Apps Script
web app, which appends one row per submission to a Google Sheet (and optionally
pings Slack).

## One-time setup

1. **Create a Google Sheet** named e.g. `Leaf Loans — Leads`. Open it.
2. **Open the script editor**: `Extensions → Apps Script`.
3. **Replace the default `Code.gs`** with the contents of
   [`google-apps-script.gs`](./google-apps-script.gs). Save (⌘S).
4. **(Optional) wire Slack**: in the script editor, go to
   `Project Settings → Script properties → Add script property`,
   key `SLACK_WEBHOOK`, value = your Slack incoming webhook URL. Skip this if
   you don't want Slack notifications.
5. **Deploy as web app**: `Deploy → New deployment` →
   - Type: **Web app**
   - Description: `leafloans-leads v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, authorize the scopes when prompted, copy the
     **Web app URL** (`https://script.google.com/macros/s/.../exec`).
6. **Wire it into the site**: open `assets/config.js` and set
   `window.LL_SHEET_WEBHOOK` to the URL from step 5. Commit + push.

## Test it

```bash
curl -X POST -H "Content-Type: text/plain" \
  -d '{"name":"Test","email":"t@x.com","company":"Acme","role":"Head","usecase":"marketplace","timestamp":"2026-04-23T00:00:00Z","source":"manual","page":"/test"}' \
  "https://script.google.com/macros/s/.../exec"
```

A new row should appear in the `Leads` tab within 1–2 seconds.

## Updating the script

Apps Script versions are immutable — to ship changes:

1. Edit `Code.gs` in the script editor (or paste the latest from `google-apps-script.gs`).
2. `Deploy → Manage deployments → ✏️ pencil → Version: New version → Deploy`.
3. The same web-app URL keeps working (don't create a new deployment unless
   you actually want a new URL).

## Why we POST as `text/plain`

Apps Script web apps reject CORS preflight requests. Sending the body as
`text/plain` avoids preflight; the JSON is parsed in `doPost(e)` from
`e.postData.contents`. The browser sees an opaque response (no readable status)
but the row lands reliably.
