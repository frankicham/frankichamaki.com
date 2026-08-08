# frankichamaki.com — V5.1

Production-ready one-page personal site for Franki Chamaki, deployed through GitHub → Vercel.

## V5.1 changes
- Carries forward V5 favicon/photo, form success-state, social-icon visibility and pink shimmer UI.
- Fixes Resend direct API calls by adding the required `User-Agent` header.
- Adds GA4 global loading through `/api/ga-config` using the Vercel `GA_MEASUREMENT_ID` environment variable.
- Adds root-level `robots.txt`, `sitemap.xml` and `llms.txt`.
- Standardises canonical URLs on `https://www.frankichamaki.com/`.
- Adds Search Console verification guidance.

## Required Vercel environment variables

```text
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=Franki Chamaki Website <onboarding@resend.dev>
CONTACT_TO_EMAIL=frankichamaki@gmail.com
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

`GA_MEASUREMENT_ID` can be left unset until the real GA4 Measurement ID is available. The site will not load GA4 for the placeholder `G-XXXXXXXXXX`.

## Resend testing
When using `onboarding@resend.dev`, delivery is limited to the email address associated with the Resend account. For production sending to other recipients, verify `frankichamaki.com` in Resend and use a sender on that verified domain.

## Search Console
The exact Search Console verification file/token is unique to your Google account and is not included because no token was supplied. See `SEARCH-CONSOLE.md`.

## SEO/AEO files
- `https://www.frankichamaki.com/robots.txt`
- `https://www.frankichamaki.com/sitemap.xml`
- `https://www.frankichamaki.com/llms.txt`

The sitemap is intentionally static for V5.1 because the site currently has one canonical public page. Move to build-generated sitemap creation when additional on-site pages are introduced.


## V5.2 polish
- Renamed Growth Infrastructure & Analytics to AI Growth Automation Analytics.
- Updated capability copy to cover AI workflow automation, attribution, enablement and experimentation.
- Social icons are hot pink by default with a subtle shimmer effect.
- Back to top now uses an explicit smooth-scroll handler with `#top` as a fallback.
