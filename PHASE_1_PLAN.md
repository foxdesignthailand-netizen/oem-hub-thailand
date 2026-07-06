# Phase 1 Plan: Backend Foundation

Phase 1 prepares OEM Hub Thailand to move from a mock UI prototype into a real MVP foundation.

The goal is not to build every admin screen immediately. The goal is to make the database, roles, permissions, storage, and workflow foundations admin-ready from the beginning.

## Recommended Default Stack

Use Supabase unless the project owner chooses a different backend.

Recommended reasons:

- PostgreSQL database
- built-in authentication
- role-aware access through RLS
- file storage for logos, banners, documents, and references
- dashboard for early admin inspection
- good fit for MVP speed

## Phase 1 Objectives

1. Add authentication foundation.
2. Add role model for Buyer, Supplier, Admin, and Super Admin.
3. Add database schema for core marketplace entities.
4. Add storage buckets for public and private files.
5. Add admin-ready fields, status fields, and audit log tables.
6. Add environment configuration.
7. Keep existing mock UI working during migration.

## Roles

Required roles:

- `VISITOR`
- `BUYER`
- `SUPPLIER`
- `ADMIN`
- `SUPER_ADMIN`

Users can have one primary role at first. Multi-role support can be added later if needed.

## Core Tables For Phase 1

Minimum recommended tables:

- `users`
- `user_profiles`
- `supplier_companies`
- `supplier_members`
- `categories`
- `service_listings`
- `rfqs`
- `rfq_items`
- `rfq_attachments`
- `quotes`
- `quote_items`
- `orders`
- `order_timeline_events`
- `payments`
- `platform_fees`
- `commission_rules`
- `reviews`
- `disputes`
- `cms_banners`
- `audit_logs`
- `system_settings`

Some tables may be created as empty foundations before their UI is fully implemented.

## Admin-Ready Fields

Most business tables should include:

- `id`
- `created_at`
- `updated_at`
- `created_by_user_id`
- `updated_by_user_id`
- `status`
- `is_active`
- `published_at`
- `approved_at`
- `approved_by_user_id`
- `rejected_at`
- `rejected_by_user_id`
- `rejection_reason`
- `metadata`

Use only fields that make sense for each table.

## Storage Buckets

Recommended storage buckets:

- `public-assets`: public banners, category images, public supplier logos
- `supplier-media`: supplier profile images, gallery, service images
- `rfq-attachments`: buyer RFQ reference files
- `quote-attachments`: supplier quotation files
- `order-documents`: order files, delivery files, payment slips
- `admin-documents`: verification documents and internal admin files

Storage access must separate public media from private deal files.

## Permission Direction

Initial permission rules:

- Visitor can read public published content only.
- Buyer can create and manage their own RFQs.
- Supplier can manage its own company profile, services, quotes, and order updates.
- Supplier cannot read private Buyer RFQs unless matched or invited.
- Buyer cannot see platform fee details.
- Admin can inspect and moderate platform records.
- Super Admin can manage admin users, settings, fee rules, and high-risk changes.

## Phase 1 Deliverables

1. Choose and confirm backend provider. `Done: Supabase`
2. Add `.env.example` with required environment variables. `Done`
3. Add database schema or migration files. `Done: supabase/migrations/20260706000000_phase_1_foundation.sql`
4. Add auth helper and role helper. `Started: Supabase client helper and SQL role functions`
5. Add typed domain models aligned with database tables. `Started: lib/supabase/types.ts`
6. Add storage bucket plan or migration notes. `Done: migration creates starter buckets`
7. Add audit log helper. `Data-ready: audit_logs table exists, app helper pending`
8. Add a small connection smoke test page or script. `Done: /admin/supabase-status`
9. Keep current public UI functional. `Required for verification`

## Current Phase 1 Status

Phase 1 backend foundation has started. The app now has Supabase configuration, schema, storage bucket setup, role/status foundations, and a safe status page.

The current UI still uses mock data. This is intentional so the public marketplace and dashboards remain usable while backend persistence is added gradually.

Recommended next step: connect the existing `/dashboard/workflow` local MVP flow to authenticated Supabase users and real database writes.

## Phase 2-6 Progress

The app now has a working local workflow console at `/dashboard/workflow` for the complete MVP loop:

1. RFQ creation.
2. Supplier Quote.
3. Buyer accepts Quote and creates Order.
4. Manual Buyer payment and Supplier confirmation.
5. Supplier Order Activation Fee and Admin verification.
6. Completed Order and Review.

The Supabase migration `20260706001000_phase_2_6_workflow_functions.sql` adds matching SQL functions for a database-backed demo path.

The workflow console currently stores demo state in browser storage so it remains testable before Supabase Auth is configured. Production persistence should replace this with authenticated server actions/RPC calls.

## What Phase 1 Should Not Do Yet

- Do not rebuild every screen.
- Do not add full escrow.
- Do not add full payment gateway.
- Do not build full CMS editor yet.
- Do not build full admin dashboard yet.
- Do not remove the current mock data until real data paths are ready.

## Phase 1 Completion Criteria

Phase 1 is complete when:

- authentication provider is configured
- database schema exists
- roles and permissions are documented and partially enforced
- file storage plan exists
- RFQ can be prepared for real persistence in Phase 2
- admin-ready fields exist for future moderation
- local development still runs
- `npm run typecheck` passes
- `npm run build` passes

## Next Phase

Phase 2 should focus on making `/rfq/new` save real RFQ data into the database while preserving the current user-friendly RFQ wizard.
