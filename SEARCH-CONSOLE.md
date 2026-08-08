# Google Search Console verification

SEO discovery files are live-ready:
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`

Search Console ownership verification still needs the **exact token supplied by Google**.

Recommended option for `frankichamaki.com`: create a **Domain property** in Google Search Console and add Google's TXT record at your DNS provider. This verifies the whole domain, including `www`.

If you prefer Google's **HTML file upload** method for a URL-prefix property, download the unique file from Search Console and place it unchanged in the repository root. It must then load at the exact root URL Google gives you.

Do not rename or edit Google's verification file.
