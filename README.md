# OEM Hub Thailand

OEM Hub Thailand is a Next.js B2B marketplace for Thai brand builders and industrial buyers to discover suppliers, create RFQs, compare quotes, open orders, track work, and review completed deals.

The platform is not a simple supplier directory. Its core value is the transaction workflow inside the system: RFQ -> Quote -> Accepted Quote -> Order -> Direct Buyer Payment -> Supplier Order Activation Fee -> Work Timeline -> Completion -> Review.

## Current Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Mock/seed data for the first implementation phase

## Run Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Type-check:

```bash
npm run typecheck
```

## Main Routes

Public marketplace:

- `/`
- `/categories`
- `/categories/[slug]`
- `/suppliers`
- `/suppliers/[slug]`
- `/services/[slug]`
- `/rfq/new`
- `/how-it-works`
- `/pricing`
- `/contact`

Dashboards:

- `/dashboard/buyer`
- `/dashboard/buyer/rfq/[id]`
- `/dashboard/supplier`
- `/dashboard/supplier/rfqs`
- `/admin`

## Project Structure

- `app/` - Next.js pages and routes
- `components/` - reusable UI and business widgets
- `components/ui/` - local primitive UI components
- `lib/data.ts` - marketplace mock data
- `lib/commerce.ts` - current commerce/payment/order domain model
- `public/images/` - static assets

## Important Context

Before making product or code decisions, read:

- `PROJECT_BRIEF.md`
- `BUSINESS_RULES.md`
- `AGENTS.md`

These files describe the business model, workflow, user roles, payment rules, and AI-agent working rules for this project.
