# GitHub Pages Deployment Guide

## Quick Start

1. **Create GitHub Repository**
   - Go to GitHub.com and create a new repository
   - Name it something like `puzzle-hub` or `my-puzzle-games`
   - Make it public (required for free GitHub Pages)

2. **Upload Files**
   - Upload all files from this `puzzle-hub` folder to your repository
   - You can drag and drop files directly on GitHub.com or use Git commands

3. **Enable GitHub Pages**
   - Go to your repository Settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access Your App**
   - Your app will be available at: `https://yourusername.github.io/repository-name`
   - It may take a few minutes to deploy initially

## Using Git Commands

If you prefer using Git:

```bash
# Create and navigate to your project folder
mkdir my-puzzle-hub
cd my-puzzle-hub

# Initialize Git repository
git init

# Copy all puzzle-hub files to this directory
# (copy index.html, css/, js/, games/ folders)

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/your-repo-name.git

# Add, commit, and push files
git add .
git commit -m "Initial commit: Puzzle Hub web app"
git branch -M main
git push -u origin main
```

## Verification

After deployment, test your app by:

1. Opening the GitHub Pages URL
2. Trying each game
3. Testing theme toggle
4. Checking mobile responsiveness
5. Verifying score persistence (play a game, refresh page, check scores)
6. **PWA Testing:**
   - Check for install prompt on mobile/desktop
   - Test offline functionality (disconnect internet, reload)
   - Verify app works when installed
   - Check app icon appears correctly

## Troubleshooting

**App not loading?**
- Check that `index.html` is in the root directory
- Verify all file paths are correct (case-sensitive)
- Check browser console for JavaScript errors

**Games not working?**
- Ensure all `.js` files are uploaded
- Check that script tags in `index.html` match file names
- Verify file permissions (should be public)

**Styling issues?**
- Confirm `css/styles.css` is uploaded
- Check CSS file path in `index.html`
- Clear browser cache and refresh

## PWA Requirements

**Before deploying, ensure you have:**

1. **App Icons:**
   - Create `icon-192x192.png` and `icon-512x512.png`
   - Place in `icons/` folder
   - Use the included `create-icons.html` tool or design custom icons

2. **HTTPS Required:**
   - GitHub Pages automatically provides HTTPS
   - PWAs require secure connection to work

3. **Service Worker:**
   - Already included and configured
   - Caches all app files for offline use

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to your repository root
2. Put your domain name in the file (e.g., `puzzles.yourdomain.com`)
3. Configure DNS settings with your domain provider
4. Update GitHub Pages settings to use custom domain

## Updates

To update your app:

1. Modify files locally
2. Test changes by opening `index.html` in browser
3. Commit and push changes to GitHub
4. GitHub Pages will automatically redeploy (may take a few minutes)

Your Puzzle Hub is now ready to share with the world! 🎮