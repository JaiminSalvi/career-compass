# Career Compass

A free, mobile-friendly career opportunity dashboard for:

**B.Com Graduate • M.Com Pursuing • Tally Certified • CS Executive Aspirant • Ahmedabad**

## What works immediately

- Responsive dashboard
- Search and category filters
- Government and private sections
- Match scoring and eligibility badges
- Deadline calculations
- Saved opportunities using browser localStorage
- Light/dark mode
- Manual refresh of `data/jobs.json`
- GitHub Actions daily workflow
- GitHub Pages deployment

## Important data note

The included dataset contains official government source entry links and clearly labelled demo private-job records. The project does **not** claim demo records are live vacancies.

The updater is deliberately conservative. It must only publish a new opening when a source-specific adapter has verified the title, relevant dates, and source/application link. It must not bypass CAPTCHAs, logins, or anti-bot controls.

## Phone-only setup

1. Create a **public** GitHub repository named `career-compass`.
2. Upload all files from this project while preserving folders.
3. Open repository **Settings → Pages**.
4. Under Build and deployment, select **GitHub Actions**.
5. Open the **Actions** tab and allow workflows if GitHub asks.
6. Run **Update opportunities and deploy → Run workflow**.
7. Wait for the workflow to finish and open the Pages URL shown in the deployment environment.

The daily schedule is set to approximately 06:00 IST. You can change the cron expression in `.github/workflows/daily-update-and-deploy.yml`.

## Manual refresh

The website Refresh button reloads the newest `data/jobs.json` using a cache-busting query parameter. It does not itself trigger a new internet crawl.

To force the updater from your phone:

**GitHub repository → Actions → Update opportunities and deploy → Run workflow**

Then refresh the website.

## Adding a verified adapter

Add a source-specific parser under `scripts/sources/`. It should return only verified records and preserve official source URLs.

Run locally with:

```bash
npm run update
```

No dependencies are required for the included MVP.
