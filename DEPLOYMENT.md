# Deployment Guide - Norrath Idle

This guide walks you through deploying Norrath Idle to GitHub Pages.

## Quick Start

The game is configured for automatic deployment to GitHub Pages. Once set up, every push to the `main` branch will automatically build and deploy.

**Your game will be live at:** `https://yourusername.github.io/idle/`

---

## Prerequisites

- GitHub repository with this code
- Node.js 18+ installed locally (for manual deployment)
- Google Sheets API key (optional, for Phase 1.5)

---

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
4. Click **Save**

### 2. Configure GitHub Actions (Optional - for Auto-Deploy)

The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`.

**To enable auto-deploy from the `main` branch:**

1. Merge your current branch to `main`:
   ```bash
   git checkout main
   git merge claude/idle-game-project-plan-qRsUB
   git push origin main
   ```

2. GitHub Actions will automatically trigger and deploy
3. Check the **Actions** tab in your repo to see deployment progress
4. Once complete, your game will be live!

### 3. Add GitHub Secrets (For Phase 1.5 - Google Sheets)

When you're ready for Phase 1.5 (Google Sheets integration):

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:
   - **Name:** `VITE_GOOGLE_SHEETS_API_KEY`
   - **Value:** Your Google Sheets API key
4. Add another secret:
   - **Name:** `VITE_SPREADSHEET_ID`
   - **Value:** Your spreadsheet ID

**Note:** For now, the build will work without these secrets. They're only needed once you implement Google Sheets data sync.

---

## Manual Deployment (Alternative)

If you prefer manual deployment or want to test before auto-deploy:

### Option A: Using npm deploy script

```bash
# Build and deploy in one command
npm run deploy
```

This will:
1. Build the production bundle (`npm run build`)
2. Push the `dist` folder to the `gh-pages` branch
3. GitHub Pages will automatically serve it

### Option B: Step-by-step manual deploy

```bash
# 1. Build the production bundle
npm run build

# 2. Install gh-pages if not already installed
npm install -D gh-pages

# 3. Deploy to gh-pages branch
npx gh-pages -d dist
```

---

## Testing Locally Before Deploy

Always test the production build locally before deploying:

```bash
# Build production bundle
npm run build

# Preview the production build
npm run preview
```

Then open the URL shown in terminal (usually `http://localhost:4173`).

---

## Deployment Workflow

### Automatic (Recommended)

1. Make changes to your code
2. Commit and push to `main` branch
3. GitHub Actions automatically builds and deploys
4. Check deployment status in **Actions** tab
5. Game updates at `https://yourusername.github.io/idle/`

### Manual

1. Make changes to your code
2. Run `npm run deploy`
3. Wait for deployment to complete
4. Visit `https://yourusername.github.io/idle/`

---

## Troubleshooting

### Build Fails with "Cannot find module"

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Blank Page After Deploy

1. Check that `vite.config.js` has the correct `base` path:
   ```javascript
   base: '/idle/' // Must match your repo name
   ```

2. If your repo name is different (e.g., `norrath-idle`), update to:
   ```javascript
   base: '/norrath-idle/'
   ```

3. Rebuild and redeploy:
   ```bash
   npm run build
   npm run deploy
   ```

### GitHub Actions Deployment Fails

1. Check **Settings** → **Actions** → **General**
2. Ensure **Workflow permissions** is set to:
   - ✅ Read and write permissions
3. Re-run the failed workflow in the **Actions** tab

### 404 Error on Page Load

1. Ensure GitHub Pages is enabled in repo settings
2. Wait 2-5 minutes after first deployment (DNS propagation)
3. Check the **Pages** settings for the correct URL
4. Try accessing `https://yourusername.github.io/idle/` (with trailing slash)

---

## Environment Variables

### Local Development

Create a `.env` file (DO NOT commit this):

```bash
cp .env.example .env
```

Edit `.env` and add your values:
```
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_SPREADSHEET_ID=your_spreadsheet_id_here
```

### Production (GitHub Pages)

Add secrets in GitHub repo settings:
- **Settings** → **Secrets and variables** → **Actions**
- Add `VITE_GOOGLE_SHEETS_API_KEY`
- Add `VITE_SPREADSHEET_ID`

---

## Deployment Checklist

Before deploying to production:

- [ ] Test locally: `npm run dev`
- [ ] Test production build: `npm run build && npm run preview`
- [ ] Check console for errors
- [ ] Verify save/load works
- [ ] Test on mobile device (or browser dev tools)
- [ ] Update version number in `package.json` and footer
- [ ] Commit all changes
- [ ] Deploy!

---

## Custom Domain (Optional)

To use a custom domain (e.g., `norrath-idle.com`):

1. Buy domain from domain registrar
2. Add a `CNAME` file to the `public` folder:
   ```
   yourdomain.com
   ```
3. Configure DNS with your registrar:
   - Add CNAME record pointing to `yourusername.github.io`
4. In GitHub repo: **Settings** → **Pages** → **Custom domain**
5. Enter your domain and click **Save**
6. Wait for DNS propagation (up to 24 hours)

---

## Monitoring Deployments

### GitHub Actions Status

- **Actions** tab shows all deployment runs
- Green checkmark = successful deployment
- Red X = failed deployment (click to see logs)

### GitHub Pages Status

- **Settings** → **Pages** shows current deployment status
- Click **Visit site** to open your deployed game

---

## Rolling Back

If a deployment breaks the game:

```bash
# Revert to previous commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

Or manually:

1. Go to **Actions** tab
2. Find the last successful deployment
3. Click **Re-run all jobs**

---

## Next Steps

Once deployed:

1. **Test on real mobile devices** - visit the GitHub Pages URL on your phone
2. **Share the link** with friends for playtesting
3. **Monitor browser console** for errors
4. **Iterate quickly** - every push to `main` deploys automatically

---

## Support

- **Build issues:** Check build logs in terminal or Actions tab
- **Deployment issues:** Check GitHub Pages settings
- **Runtime errors:** Open browser console (F12) on deployed site

---

**Deployment Status:** Ready to deploy! 🚀

**Current URL (after deployment):** `https://yourusername.github.io/idle/`
