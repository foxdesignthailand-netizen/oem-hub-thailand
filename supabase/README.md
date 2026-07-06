# Supabase Setup: OEM Hub Thailand

This folder contains the Phase 1 Supabase foundation.

## What This Adds

- Core database tables for RFQ, Quote, Order, Payment, Platform Fee, Review, Dispute, CMS, and Audit Log.
- Role and status enums aligned with the marketplace workflow.
- Row Level Security starting rules.
- Storage buckets for public assets, supplier media, RFQ files, quote files, order files, and admin files.
- A schema marker used by `/admin/supabase-status`.

## Local Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Open Supabase SQL Editor.
5. Run `supabase/migrations/20260706000000_phase_1_foundation.sql`.
6. Start the app with `npm run dev`.
7. Open `/admin/supabase-status`.

## Important Rules

- Do not commit `.env.local`.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client components.
- Buyer UI must not show Platform Fee.
- Platform fee rules must remain configurable.
- Reviews must be created only after an Order is `COMPLETED`.
