# Atharva · Prep Tracker

A dark-themed web app for tracking and logging interview prep across **DSA**, **LLD** and **HLD**,
with spaced-repetition revision scheduling. It is plain HTML/CSS/JS with no build step and no
dependencies, so it runs on GitHub Pages exactly as it is.

It already contains everything from the "Prep for switch" Excel sheet (Atharva's tabs):
191 DSA problems, 12 LLD and 12 HLD, with approaches, mistakes, solve times, links and revision dates.

## What's inside

| Page | What it does |
| --- | --- |
| **Dashboard** | KPI cards, progress per track, today's revision goal, activity heatmap, monthly chart, difficulty/confidence mix, "where you stand" insights, revise-next list and DSA topic strengths |
| **DSA / LLD / HLD** | Searchable, filterable, sortable tables. Click a row for approach, mistakes and the revision timeline. ✓ logs a revision for today |
| **Revise** | Everything due, grouped Overdue / Today / This week / Upcoming. Rate each revision (Shaky / Okay / Nailed it) to update confidence and push the next due date out |
| **Settings** | Revision intervals, goals, quick links, GitHub sync, JSON backup/import and CSV export (opens in Excel) |

**Revision schedule** (same as the spreadsheet): next due = last revision (or the solved date) + base days × (revisions done + 1).
Base days: Low 3, Medium 7, High 14 (editable).

Shortcuts: <kbd>N</kbd> logs a new problem, <kbd>/</kbd> searches, <kbd>Esc</kbd> closes the form.
Dates are shown as dd/mm/yyyy everywhere.

## Deploy on GitHub Pages (about 3 minutes)

1. Create a new repository on GitHub, e.g. `prep-tracker`.
   (A free account needs it to be **public** for Pages. Anyone with the link can then read `data/progress.js`.)
2. Upload everything in this folder: **Add file → Upload files**, drag in `index.html`, `README.md`, `.nojekyll`
   and the `assets` and `data` folders, then commit.
3. Go to **Settings → Pages**. Under "Build and deployment" pick **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
4. After a minute the site is live at `https://<your-username>.github.io/prep-tracker/`.

You can also just double-click `index.html` to use it locally.

## Password & encryption

The tracker is password-protected. The first time you open it, it asks you to **set a password**, then encrypts all
your data in the browser (AES-256-GCM, key derived with PBKDF2-SHA256, 250k iterations). From then on:

- `data/progress.js` contains only ciphertext (`window.PROGRESS_ENC = {...}`). The public repo and site reveal nothing without the password.
- Visitors only ever see the lock screen. Nobody can change your published data without your GitHub token.
- "Remember me on this device" keeps you unlocked on your own laptop/phone. **Lock** (sidebar) forgets the key.
- Change the password in **Settings → Password & lock**. There is no recovery if you forget it, so keep a backup.

**After setting the password the first time**, click **Download locked progress.js** in the yellow banner, replace
`data/progress.js` in the repo with it, then commit and push. Your earlier unencrypted commit is still in the git history, so
rewrite the history once (see below).

## Where your data is saved

- Every change is saved instantly in your browser (localStorage).
- **To get the same data on every device**, turn on GitHub sync (optional but recommended):
  1. GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new token.
  2. Repository access: **Only select repositories** → your tracker repo.
  3. Repository permissions → **Contents: Read and write**. Generate and copy the token.
  4. In the tracker go to **Settings → GitHub sync**, paste the token (owner and repo fill in automatically on github.io) and press **Save & test**.

  From then on every change is committed to `data/progress.js` (a couple of seconds after you stop clicking).
  When the site opens it pulls the latest copy straight from GitHub. The token is stored only in that browser.
- No token? Use **Settings → Download data/progress.js** and upload it to the repo to update the published copy,
  or **Backup (.json)** to keep a copy and **Import backup** to restore it.

## Files

```
index.html          page shell
assets/styles.css   dark theme
assets/app.js       all the logic (rendering, revision maths, sync)
data/progress.js    your data (window.PROGRESS_DATA = {...})
```
