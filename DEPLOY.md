# Launch frankichamaki.com

## Recommended route: GitHub → Vercel

This gives you version control plus automatic Vercel deployments on future pushes.

### 1. Unzip and enter the project

If the ZIP is in Downloads:

```bash
cd ~/Downloads
unzip -o franki-personal-site-prototype-v4.zip
cd franki-personal-site-prototype-v4
```

### 2. Create the GitHub repo and push

The commands below use GitHub CLI (`gh`). If `gh` is not installed on your Mac, install it with `brew install gh`.

```bash
# Check GitHub CLI
command -v gh >/dev/null 2>&1 || brew install gh

# Sign in if needed
gh auth status || gh auth login

# Start repository
git init
git branch -M main
git add .
git commit -m "Launch frankichamaki.com"

# Create the public repo in the frankicham account and push
gh repo create frankichamaki.com --public --source=. --remote=origin --push
```

If the repository already exists, use this instead of `gh repo create`:

```bash
git remote add origin https://github.com/frankicham/frankichamaki.com.git
git push -u origin main
```

### 3. Import into Vercel

In Vercel:
1. Open your `frankichamaki` account/dashboard.
2. Choose **Add New → Project**.
3. Import `frankicham/frankichamaki.com`.
4. Framework Preset: **Other** (no build command required).
5. Root Directory: repository root.
6. Deploy.

### 4. Add the Resend variables

In **Project Settings → Environment Variables**, add:

```text
RESEND_API_KEY=<your real Resend API key>
RESEND_FROM_EMAIL=Franki Chamaki Website <hello@frankichamaki.com>
CONTACT_TO_EMAIL=frankichamaki@gmail.com
```

Add them to Production. Adding them to Preview as well is useful for testing preview deployments. Redeploy after adding/changing variables.

### 5. Add your domain

In **Project Settings → Domains** add:

```text
frankichamaki.com
www.frankichamaki.com
```

Choose which should be primary and redirect the other to it. Vercel will show the DNS records to enter at your domain registrar.

### 6. Test before calling it done

Check:
- desktop and mobile layout
- hero portrait is not stretched
- social icons are visible without hover
- LinkedIn / YouTube / Instagram / X links
- GTM Sprint and Alex & The Yellow Door links
- all FAQ accordions
- contact form sends and arrives in your inbox
- reply-to on the received email replies to the visitor
- `https://frankichamaki.com/robots.txt`
- `https://frankichamaki.com/sitemap.xml`

## Optional: deploy from Terminal instead of importing GitHub

Vercel CLI can create/link the project and deploy it:

```bash
command -v vercel >/dev/null 2>&1 || npm install -g vercel
vercel login
vercel link
vercel deploy
# Test the preview URL, then:
vercel deploy --prod
```

Environment variables can be added from the dashboard, or with `vercel env add`.
