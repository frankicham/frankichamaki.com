# V5.1 deployment — GitHub → Vercel

The production repository is `frankicham/frankichamaki.com` and Vercel is connected to `main`.

## Vercel environment variables
Keep the existing Resend variables and add:

```text
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace the placeholder with the real GA4 Measurement ID when created. A redeploy is recommended after changing the variable.

## Production checks
After Vercel finishes deploying, confirm:

- `https://www.frankichamaki.com/`
- `https://www.frankichamaki.com/robots.txt`
- `https://www.frankichamaki.com/sitemap.xml`
- `https://www.frankichamaki.com/llms.txt`
- contact form sends and only displays the success state after Resend confirms delivery acceptance
- GA4 Realtime shows a page view after a real `GA_MEASUREMENT_ID` is configured

## Search Console
Use a Domain property + DNS TXT verification, or add Google's exact HTML verification file to the repository root. See `SEARCH-CONSOLE.md`.
