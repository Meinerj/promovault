# Vercel Deploy (MindSpark.ai)

## 1) Import repo
- Go to Vercel → Add New Project
- Import: `Meinerj/mindspark.ai`

## 2) Project settings
- Framework Preset: **Next.js**
- Root Directory: **apps/web**
- Build Command: `pnpm --filter @mindspark/web build`
- Install Command: `pnpm install --frozen-lockfile`

## 3) Required environment variables
Add these in Vercel Project Settings → Environment Variables:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (set to your Vercel URL, e.g. `https://mindspark-ai.vercel.app`)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_BASIC_PRICE_ID`
- `STRIPE_FEATURED_PRICE_ID`
- `STRIPE_PREMIUM_PRICE_ID`
- `STRIPE_ELITE_PRICE_ID`

## 4) Deploy
- Click **Deploy**
- Your live URL will be: `https://<project-name>.vercel.app`

## 5) Post-deploy
- In Stripe dashboard, point webhook endpoint to:
  - `https://<project-name>.vercel.app/api/webhooks/stripe`
- In Google OAuth settings, add callback URL:
  - `https://<project-name>.vercel.app/api/auth/callback/google`
