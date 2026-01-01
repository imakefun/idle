# Quick Deploy Instructions

## Deploy to GitHub Pages (From Your Local Machine)

### Step 1: Pull the Latest Code

```bash
# Pull the latest changes from GitHub
git pull origin claude/idle-game-project-plan-qRsUB

# Or if you're starting fresh, clone the repo
git clone https://github.com/yourusername/idle.git
cd idle
git checkout claude/idle-game-project-plan-qRsUB
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Deploy

```bash
# This builds and deploys in one command
npm run deploy
```

The script will:
1. Build the production bundle
2. Create/update the `gh-pages` branch
3. Push the built files to GitHub

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
4. Click **Save**

### Step 5: Wait & Visit

- Wait 1-2 minutes for GitHub to build
- Your game will be live at: `https://yourusername.github.io/idle/`

## Alternative: Auto-Deploy with GitHub Actions

If you prefer automatic deployment on every push:

### Step 1: Merge to Main

```bash
git checkout main
git merge claude/idle-game-project-plan-qRsUB
git push origin main
```

### Step 2: Enable GitHub Pages (GitHub Actions)

1. Go to **Settings** → **Pages**
2. Under **Source**, select: **GitHub Actions**
3. Click **Save**

### Step 3: Automatic Deployment

Every push to `main` will now automatically deploy!

Check the **Actions** tab to see deployment progress.

---

## Troubleshooting

### "Permission denied" or "403 error"

- Make sure you're authenticated with GitHub (run `git config --global user.name` and `git config --global user.email`)
- Try: `git remote -v` to verify your remote URL

### Blank page after deploy

- Check that `vite.config.js` has `base: '/idle/'` (or your repo name)
- Rebuild: `npm run build`
- Redeploy: `npm run deploy`

### Changes not showing up

- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Wait 2-3 minutes for GitHub to propagate changes

---

**Current Status:** Build is ready! Just run `npm run deploy` from your local machine.
