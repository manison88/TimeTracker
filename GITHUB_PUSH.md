# Push to GitHub Instructions

After creating your GitHub repository, run these commands:

```bash
cd /Users/armanpiric/timetracker

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/timetracker.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/timetracker.git
git push -u origin main
```

## Verify:

After pushing, refresh your GitHub repository page. You should see all your files.

---

## Next: Connect to Cloudflare Pages

Once pushed to GitHub, follow these steps:

### 1. Go to Cloudflare Dashboard
https://dash.cloudflare.com → Workers & Pages → Create application → Pages → Connect to Git

### 2. Authorize GitHub
- Click "Connect GitHub"
- Select your `timetracker` repository

### 3. Configure Build Settings
- **Project name**: `timetracker`
- **Production branch**: `main`
- **Build command**: `npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: (leave empty)

### 4. Environment Variables
Add these in the configuration:

```
AUTH_SECRET=Ky7dNxZTR9vMjP3hG2wQfA1sC8kL4uB6mE5nH0iJ7oY=
NODE_VERSION=18
```

### 5. Save and Deploy

Click "Save and Deploy" - initial deployment will take 2-3 minutes.

### 6. Configure D1 Database

After first deployment:

1. Go to your project → Settings → Functions → D1 database bindings
2. Add binding:
   - **Variable name**: `DB`
   - **D1 database**: Select `timetracker-db` (or create it first)

3. If database doesn't exist yet:
```bash
npx wrangler login
npx wrangler d1 create timetracker-db
# Update wrangler.toml with the database_id from output
npx wrangler d1 migrations apply timetracker-db --remote
```

4. Go back to Cloudflare Pages → Settings → Functions → D1 database bindings
5. Add the binding with the database you just created
6. Create a new deployment (Settings → Deployments → Retry deployment)

### 7. Your App is Live! 🎉

Visit: `https://timetracker.pages.dev` (or your custom domain)

---

## Future Deployments

Every push to the `main` branch will automatically trigger a new deployment on Cloudflare Pages.

```bash
git add .
git commit -m "Your commit message"
git push
```
