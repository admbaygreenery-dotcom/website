# Bay Greenery Website

Landscape construction and maintenance company website for Bay Greenery (San Jose, CA). Built as a static single-page site for deployment on GitHub Pages.

## Deploy to GitHub Pages

### Option A: Deploy from main branch (root)

1. **Push this repo to GitHub**
   - Create a new repository on GitHub (e.g. `baygrennery` or `baygreenery`)
   - In terminal:
   ```bash
   git add .
   git commit -m "Initial Bay Greenery website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Click **Settings** → **Pages** (in the left sidebar)
   - Under **Source**, select **Deploy from a branch**
   - Under **Branch**, choose `main` and `/ (root)`
   - Click **Save**

3. **Wait for deployment** (usually 1–2 minutes). Your site will be at:
   - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Option B: Custom domain (baygreenery.com)

1. Follow Option A steps 1–2 first.
2. In **Settings → Pages**, enter `baygreenery.com` in **Custom domain**.
3. In your domain registrar (e.g. Namecheap, GoDaddy):
   - Add a **CNAME** record: `www` → `YOUR_USERNAME.github.io`
   - Add **A** records for root: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. In GitHub Pages settings, check **Enforce HTTPS** once DNS propagates.

### Option C: Deploy from `gh-pages` branch

If you prefer to keep `main` for source and deploy from a branch:

1. Create a `gh-pages` branch:
   ```bash
   git checkout -b gh-pages
   git push -u origin gh-pages
   ```

2. In **Settings → Pages**, set source to **Deploy from a branch**, branch `gh-pages`, folder `/ (root)`.

3. Merge changes from `main` into `gh-pages` when you update the site.

---

## Local preview

Open `index.html` in a browser, or use a local server:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve
```

Then go to `http://localhost:8000`.

---

## Structure

- `index.html` – Single-page site
- `styles.css` – Styling
- `script.js` – Interactivity (reviews scroll, etc.)
- `images/` – Logos and photos from baygreenery.com

See `EXECUTION_PLAN.md` for design specs and section details.
