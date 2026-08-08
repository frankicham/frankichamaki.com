# Franki Chamaki personal site — V4

Production-ready static site for `frankichamaki.com`, with a server-side Resend contact form designed for Vercel.

## Final visual fixes in V4
- Restored the hero portrait to its natural aspect ratio so it is never stretched or squashed.
- Kept the portrait in front of the pink halftone/glow treatment.
- Increased the default contrast of all footer social icons so they are clearly visible before hover. Hover still changes them to hot pink.
- Preserved the V3 contact form, audience proof, project callouts, SEO/AEO metadata and structured data.

## Resend setup
The API key stays server-side in Vercel. Never paste the real key into `index.html`, `styles.css` or `script.js`.

Add these Environment Variables in Vercel:

```text
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=Franki Chamaki Website <hello@frankichamaki.com>
CONTACT_TO_EMAIL=frankichamaki@gmail.com
```

`RESEND_FROM_EMAIL` must use a sender/domain permitted by your Resend account. Verify `frankichamaki.com` in Resend before using `hello@frankichamaki.com` as the sender.

## Local preview
Visual/static preview only:

```bash
python3 -m http.server 8080
```

Full form test through Vercel:

```bash
npx vercel dev
```

For local form testing, create `.env.local` containing the three Resend variables. `.env.local` is ignored by Git.

## GitHub repository
Recommended repository name:

```text
frankicham/frankichamaki.com
```

The connected GitHub account is `frankicham`. If that repository does not exist yet, the terminal commands in `DEPLOY.md` create it with GitHub CLI and push this folder.

## Vercel deployment
You can deploy this folder directly with Vercel CLI, or import the GitHub repository into your Vercel account. Git integration is recommended because every future push to `main` can deploy automatically.

After deploying, add `frankichamaki.com` and optionally `www.frankichamaki.com` in Vercel Project Settings → Domains. Vercel will show the exact DNS records required by your registrar.

## Main files
- `index.html` — page structure, SEO metadata and Person/FAQ structured data
- `styles.css` — responsive visual system
- `script.js` — navigation and contact-form UX
- `api/contact.js` — server-side Resend form endpoint
- `.env.example` — variable names only; no secret values
- `assets/franki-cutout.png` — hero portrait
- `assets/gtm-sprint.png` — GTM Sprint project visual
- `assets/alex-yellow-door.png` — Alex & The Yellow Door project visual
- `robots.txt`
- `sitemap.xml`
- `DEPLOY.md` — copy/paste launch instructions
