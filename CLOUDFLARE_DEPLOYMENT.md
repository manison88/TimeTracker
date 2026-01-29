# Cloudflare Pages Deployment Configuration

This document outlines the correct configuration for deploying TimeTracker to Cloudflare Pages.

## Important: This is a Pages Project, NOT a Workers Project

TimeTracker is configured as a **Cloudflare Pages** project, not a Workers project. Make sure to use Pages-specific commands and configurations.

## Cloudflare Dashboard Configuration

When setting up the project in Cloudflare Pages Dashboard, use these settings:

### Build Configuration

1. **Framework preset**: Next.js
2. **Build command**: `npm run pages:build`
3. **Build output directory**: `.vercel/output/static`

### Deploy Command (Important!)

In the Cloudflare Pages Dashboard build settings, the **deploy command should NOT be set**. Cloudflare Pages will automatically deploy the contents of the build output directory.

**DO NOT use**: `npx wrangler deploy` (this is for Workers, not Pages)
**DO NOT use**: `wrangler deploy` (this is for Workers, not Pages)

The correct behavior is to let Cloudflare Pages handle the deployment automatically after the build completes.

### Environment Variables

Add these in Settings → Environment Variables:

```env
AUTH_SECRET=<your-secret-from-openssl-rand-base64-32>
NODE_VERSION=18
```

### D1 Database Binding

In Settings → Functions → D1 database bindings:
- **Variable name**: `DB`
- **D1 database**: `timetracker-db`

## Project Configuration Files

### wrangler.toml

The `wrangler.toml` file contains:
- `name = "timetracker5"` - Must match your Cloudflare Pages project name
- `pages_build_output_dir = ".vercel/output/static"` - Confirms this is a Pages project
- D1 database configuration

### package.json Scripts

- `npm run pages:build` - Builds the Next.js app for Cloudflare Pages
- `npm run pages:deploy` - Deploys using `wrangler pages deploy` (for manual deployments)
- `npm run pages:dev` - Local development with Wrangler Pages

## Manual Deployment

If you want to deploy manually from your local machine:

```bash
npm run pages:deploy
```

This uses `wrangler pages deploy` which is the correct command for Pages projects.

## Common Issues

### Error: "It looks like you've run a Workers-specific command in a Pages project"

This error occurs when `wrangler deploy` (Workers command) is used instead of `wrangler pages deploy`.

**Solution**: Make sure the Cloudflare Pages Dashboard is configured correctly with only the build command, not a deploy command. The deployment happens automatically after the build.

### Error: "Update wrangler.toml in your repo"

This occurs when the `name` field in `wrangler.toml` doesn't match the project name in Cloudflare Pages.

**Solution**: Ensure `wrangler.toml` has `name = "timetracker5"` (or whatever your project name is in Cloudflare).
