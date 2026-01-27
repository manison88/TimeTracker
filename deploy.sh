#!/bin/bash

# TimeTracker Cloudflare Pages Deployment Script

set -e

echo "🚀 Building for Cloudflare Pages..."
npm run pages:build

echo ""
echo "📦 Deploying to Cloudflare Pages..."
npx wrangler pages deploy .vercel/output/static --project-name=timetracker --branch=main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to https://dash.cloudflare.com → Workers & Pages → timetracker"
echo "2. Add environment variables (Settings → Environment Variables):"
echo "   - AUTH_SECRET=Ky7dNxZTR9vMjP3hG2wQfA1sC8kL4uB6mE5nH0iJ7oY="
echo "   - NEXTAUTH_URL=https://timetracker.pages.dev"
echo "   - NODE_VERSION=18"
echo "3. Bind D1 database (Settings → Functions → D1 database bindings):"
echo "   - Variable name: DB"
echo "   - D1 database: timetracker-db"
echo "4. Redeploy after configuration: npm run pages:deploy"
echo ""
echo "🌐 Your app will be live at: https://timetracker.pages.dev"
