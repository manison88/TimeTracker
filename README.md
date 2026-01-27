# TimeTracker

A production-quality MVP web app for freelancers and side-project builders to track projects, features, and time.

## Features

- 🎯 **Project Management** - Create and organize multiple projects with custom icons
- ⚡ **Feature Tracking** - Break projects into features with individual time tracking
- ⏱️ **Smart Timer** - One-click start/stop with automatic timer management
- 📊 **Time Insights** - Detailed analytics and reporting per project/feature
- 🔒 **Authentication** - Secure user accounts with NextAuth
- 🌐 **Cloudflare Deployment** - Serverless architecture with D1 database

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Prisma
- **Auth**: Auth.js v5 (NextAuth)
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages

## Local Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd timetracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your AUTH_SECRET
```

4. Set up the database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with demo data (optional)
npm run db:seed
```

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Demo Account

After seeding:
- Email: `demo@example.com`
- Password: `password123`

## Deployment to Cloudflare Pages

### 1. Create D1 Database

```bash
npx wrangler login
npx wrangler d1 create timetracker-db
```

Update `wrangler.toml` with the database_id from output.

### 2. Run Migrations

```bash
npx wrangler d1 migrations apply timetracker-db --remote
```

### 3. Deploy via GitHub

1. Push code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
3. Create new Pages project → Connect to Git
4. Select your repository
5. Build settings:
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`

### 4. Configure Environment Variables

In Cloudflare Pages → Settings → Environment Variables:

```env
AUTH_SECRET=<your-secret-from-openssl-rand-base64-32>
NODE_VERSION=18
```

### 5. Bind D1 Database

Settings → Functions → D1 database bindings:
- **Variable name**: `DB`
- **D1 database**: `timetracker-db`

### 6. Deploy

Save settings and redeploy. Your app will be live at `https://your-project.pages.dev`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run pages:build` - Build for Cloudflare Pages
- `npm run pages:deploy` - Deploy to Cloudflare Pages
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with demo data
- `npm test` - Run tests

## Project Structure

```
timetracker/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts           # Seed data
├── src/
│   ├── actions/          # Server actions
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/              # Utilities and configs
│   └── types/            # TypeScript types
├── wrangler.toml         # Cloudflare configuration
└── package.json
```

## License

MIT
