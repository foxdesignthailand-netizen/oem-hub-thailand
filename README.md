# OEM Hub Thailand

OEM Hub Thailand is a Next.js B2B marketplace for Thai brand builders and industrial buyers to discover suppliers, create RFQs, compare quotes, open orders, track work, and review completed deals.

The platform is not a simple supplier directory. Its core value is the transaction workflow inside the system: RFQ -> Quote -> Accepted Quote -> Order -> Direct Buyer Payment -> Supplier Order Activation Fee -> Work Timeline -> Completion -> Review.

## Preview

### Public Marketplace

![OEM Hub Thailand marketplace preview](public/images/oem-hero-marketplace.png)

### Supplier Discovery

![OEM Hub Thailand supplier discovery preview](public/images/oem-hero-suppliers.png)

### RFQ Flow

![OEM Hub Thailand RFQ flow preview](public/images/oem-hero-rfq.png)

## Current Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Supabase foundation for Phase 1 backend
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
- `/auth`
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
- `/dashboard/supplier/profile`
- `/dashboard/supplier/rfqs`
- `/dashboard/mvp`
- `/dashboard/deal-room`
- `/dashboard/files`
- `/dashboard/workflow`
- `/admin`
- `/admin/operations`
- `/admin/supabase-status`

## Project Structure

- `app/` - Next.js pages and routes
- `components/` - reusable UI and business widgets
- `components/ui/` - local primitive UI components
- `lib/data.ts` - marketplace mock data
- `lib/commerce.ts` - current commerce/payment/order domain model
- `lib/workflow.ts` - end-to-end RFQ to Review workflow engine for MVP flow testing
- `lib/supabase/` - Supabase client helpers and TypeScript foundation types
- `supabase/migrations/` - SQL schema foundation for Supabase
- `public/images/` - static assets

## Supabase Phase 1

Phase 1 has started with Supabase as the backend provider.

Setup steps:

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Run all SQL files in `supabase/migrations/` in filename order.
5. Open `/admin/supabase-status` to verify the connection.
6. Open `/dashboard/mvp` to test real Supabase MVP actions.
7. Open `/dashboard/workflow` to test the browser-storage fallback flow.

Do not commit `.env.local` or any real secret keys.

## Current MVP Workflow

The app now includes a local workflow console for testing the core marketplace loop before full authentication and persistence are connected:

- Buyer creates RFQ.
- Supplier sends Quote.
- Buyer accepts Quote and creates Order.
- Buyer reports direct payment to Supplier.
- Supplier confirms Buyer payment.
- Supplier reports Order Activation Fee.
- Admin verifies Platform Fee.
- Supplier delivers work.
- Buyer completes Order.
- Buyer reviews Supplier only after `COMPLETED`.

This console is at `/dashboard/workflow`. It uses browser storage for the demo state and is designed to match the Supabase workflow functions added in the Phase 2-6 migration.

## MVP Control Center

The app also includes `/dashboard/mvp`, a single control center that maps the first 10 product systems:

1. Authentication and role switching
2. RFQ creation
3. Supplier quote submission
4. Quote acceptance and order creation
5. Manual payment verification
6. Deal room and order timeline
7. Completed-order-only review
8. Admin operations
9. Supplier self-service
10. File upload and storage buckets

It combines browser-storage workflow testing with Supabase RPC smoke actions for the Phase 2-6 SQL functions. Use `/dashboard/deal-room`, `/dashboard/files`, `/dashboard/supplier/profile`, and `/admin/operations` to inspect focused slices of the same MVP foundation.

## Supabase MVP Operations

The migration `supabase/migrations/20260710000000_mvp_operational_rpc.sql` adds an operational RPC layer for the first real database-backed MVP flow:

- register or update demo users by role
- create RFQ records from `/rfq/new` and `/dashboard/mvp`
- let Supplier create Quote records
- let Buyer accept Quote and create Order records
- record manual Buyer-to-Supplier payment status
- record and verify Supplier Order Activation Fee
- move Orders through ready-for-review and completed states
- create Review records only after an Order is `COMPLETED`
- register file metadata for RFQ, Quote, Order, Supplier, and Admin files
- inspect a compact MVP snapshot from `/dashboard/mvp`

This is still an MVP operations layer, not a full production admin system. It is designed so the RFQ -> Quote -> Order loop can start using Supabase while the public marketplace UI remains stable.

## Important Context

Before making product or code decisions, read:

- `PROJECT_BRIEF.md`
- `BUSINESS_RULES.md`
- `FEATURE_GOVERNANCE.md`
- `PHASE_1_PLAN.md`
- `AGENTS.md`

These files describe the business model, workflow, user roles, payment rules, and AI-agent working rules for this project.
