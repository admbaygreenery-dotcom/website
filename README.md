# Bay Greenery — website

The source code for [baygreenery.com](https://baygreenery.com). Plain HTML, CSS, and JavaScript — no build step, no framework, no `npm install`. Anyone who can edit a text file can edit this site.

> **This file is for collaborators only and is NOT served on the public website.** GitHub Pages excludes `README.md` by default, and we've explicitly confirmed it in `_config.yml`.

## What's in this repo

| File / folder | Purpose |
|---|---|
| `index.html` | Homepage |
| `portfolio/index.html` | Project gallery page (served at `/portfolio/`) |
| `styles.css` | All visual styles, colors, and layout |
| `script.js` | Page interactivity (carousel, gallery lightbox, etc.) |
| `config.js` | **Easy-edit values**: phone, email, booking form URL, Google Analytics ID, mailing address. Change these without touching code. |
| `images/` | All photos used on the site (tiles, gallery, project before/afters) |
| `fonts/` | Self-hosted brand fonts |
| `sitemap.xml` | URL list for search engines |
| `robots.txt` | Crawler permissions |
| `llms.txt` | Site summary formatted for AI assistants |
| `CNAME` | The custom domain (`baygreenery.com`) for GitHub Pages |

## Editing the easy stuff (no code knowledge required)

Most things you'd want to update — phone number, email, booking form link, mailing address — live in `config.js`. Open it in any text editor, change the value in quotes, save. That's it.

Example: change the phone number from `(408) 454-8078` to something else:
```js
phone: '(408) 454-8078',          // ← edit just the part inside the quotes
```

After you save and commit, the change goes live on baygreenery.com within ~2 minutes.

## Previewing the site on your computer (before pushing)

If you want to see changes before they go live, you can run the site locally:

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate into this repo's folder
3. Run:
   ```
   python3 -m http.server 8765
   ```
4. Open `http://localhost:8765` in your browser
5. When done, press `Ctrl+C` in Terminal to stop

Mac has Python preinstalled. Windows: install from [python.org](https://www.python.org/downloads/) (any version 3.x works).

## Recommended free tools

You don't *need* any of these — you can edit files directly on GitHub.com in a browser. But if you're going to do more than occasional edits, these make life nicer:

- **[Visual Studio Code](https://code.visualstudio.com/)** — Microsoft's free code editor. Works on Mac and Windows. Most common pick.
- **[Cursor](https://cursor.com/)** — VS Code with built-in AI assistance. Free tier is generous; great if you want AI to help you edit.

Both let you open this whole repo as a folder, edit any file, and have a built-in terminal for the preview command above.

## Setting up Git and GitHub on a new computer

GitHub publishes a step-by-step setup guide that covers installing Git, signing in to GitHub, and cloning this repo:

→ [GitHub's "Quickstart" guide](https://docs.github.com/en/get-started/quickstart/set-up-git)

The short version:
1. Install Git: [git-scm.com/downloads](https://git-scm.com/downloads)
2. Install GitHub Desktop (easier than command-line Git): [desktop.github.com](https://desktop.github.com/)
3. Sign in to GitHub Desktop with your GitHub account
4. Clone this repo: **File → Clone Repository → admbaygreenery-dotcom/website**

## Making a change and getting it reviewed

This repo is set up so changes go through pull requests (PRs) before merging into `main`. The workflow:

1. Create a new branch (any name describing your change, e.g. `update-phone-number`)
2. Make your edit, commit, push the branch
3. Open a Pull Request on GitHub
4. Wait for approval, then merge
5. baygreenery.com updates automatically within ~2 minutes

GitHub Desktop handles steps 1, 2, and 3 with point-and-click buttons if you'd rather not use Terminal.

## Adding new project photos to the gallery

When you want to add new before/after photos for a project:

1. Drop the photos in `images/projects/<project-name>/` (create the folder if needed; use lowercase, dashes-not-spaces)
2. Resize them to ~1600px wide for fast loading. Mac: open in Preview → Tools → Adjust Size → 1600 wide → save. Or use the Terminal command `sips --resampleWidth 1600 -s formatOptions 80 <file>` on each.
3. Add a new section in `portfolio/index.html` following the pattern of existing sections
4. Open a PR

## Questions?

Email **ops@baygreenery.com** or reach Joseph directly.
