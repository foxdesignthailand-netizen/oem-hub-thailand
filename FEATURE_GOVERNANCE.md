# Feature Governance: OEM Hub Thailand

This document defines how every new feature must be designed before implementation.

OEM Hub Thailand is a B2B quote-based manufacturing marketplace. A feature is not complete if it only works for the visible user screen but cannot be controlled, reviewed, audited, or extended by the platform later.

## Core Principle

Every feature must be reviewed from five angles:

1. Visitor / Buyer experience
2. Supplier / Supplier Admin experience
3. Platform Admin experience
4. Super Admin / system governance
5. Data, status, permission, audit, and configuration needs

If a feature does not need one of these angles immediately, the data model should still leave a safe path to add it later.

## Admin Parity Rule

When adding a feature, decide its admin maturity level:

- `M0_DATA_READY`: Data model has status, ownership, audit, and config fields, but no admin UI yet.
- `M1_MINIMAL_ADMIN`: Platform Admin can list, inspect, approve, reject, suspend, hide, or restore records.
- `M2_FULL_ADMIN`: Platform Admin can fully edit, schedule, feature, configure, moderate, export, and review audit history.

Most MVP features can start at `M0_DATA_READY` or `M1_MINIMAL_ADMIN`, but should not skip admin-ready data fields.

## Feature Completeness Checklist

Before implementing any feature, answer these questions:

1. Who creates this record?
2. Who owns it?
3. Who can view it?
4. Who can edit it?
5. Who can approve or reject it?
6. Who can hide, suspend, archive, or delete it?
7. What statuses does it need?
8. Does it need draft, submitted, approved, rejected, suspended, archived, or published states?
9. Does Platform Admin need to override it?
10. Does Supplier Admin or Buyer need self-service controls?
11. Does it affect money, fee calculation, reviews, ranking, reliability score, or disputes?
12. Does it need audit logs?
13. Does it need configurable settings instead of hardcoded values?
14. Does it need file upload, media library, or storage rules?
15. Does it expose sensitive Buyer, Supplier, pricing, or payment data?
16. Does it need notifications?
17. Does it need moderation?
18. Does it need search, filter, sorting, or reporting later?
19. What is the minimal admin support required for MVP?
20. What should be intentionally deferred?

## Standard Status Fields

Use explicit statuses instead of booleans when workflow matters.

Common lifecycle statuses:

- `DRAFT`
- `SUBMITTED`
- `PENDING_REVIEW`
- `APPROVED`
- `REJECTED`
- `PUBLISHED`
- `HIDDEN`
- `SUSPENDED`
- `ARCHIVED`
- `DELETED`

Use domain-specific statuses for RFQ, Quote, Order, Payment, Dispute, and Review, as defined in `BUSINESS_RULES.md`.

## Standard Ownership Fields

Records should include the owner and creator context needed for permission checks.

Common fields:

- `id`
- `slug`
- `createdAt`
- `updatedAt`
- `createdByUserId`
- `updatedByUserId`
- `ownerUserId`
- `buyerUserId`
- `supplierUserId`
- `supplierCompanyId`
- `status`
- `isActive`
- `isFeatured`
- `sortOrder`
- `publishedAt`
- `approvedAt`
- `approvedByUserId`
- `rejectedAt`
- `rejectedByUserId`
- `rejectionReason`
- `suspendedAt`
- `suspendedByUserId`
- `metadata`

Only use the fields that match the domain. Do not add irrelevant fields blindly.

## Audit Log Rule

Any action that affects money, status, visibility, approval, ranking, reviews, disputes, or user access should produce an audit event.

Audit events should capture:

- actor user
- actor role
- action
- entity type
- entity id
- previous value when useful
- new value when useful
- reason or note when required
- timestamp

## Configuration Rule

Do not hardcode business rules that should be controlled by Admin later.

Configurable examples:

- platform fee rate
- supplier plan limits
- listing slot limits
- featured listing rules
- banner display windows
- review moderation rules
- RFQ matching rules
- notification templates
- supplier verification requirements

## Buyer Visibility Rule

Buyer must not see internal platform fee, supplier fee obligation, internal commission, or hidden admin review notes.

Buyer-facing status wording must be neutral when the issue is related to Supplier platform fee payment.

## Supplier Visibility Rule

Supplier can manage its own company profile, service listings, RFQ responses, quotes, order timeline updates, and buyer-facing content.

Supplier must not manage platform-wide categories, fee rules, review moderation, ranking rules, or other suppliers.

## Platform Admin Rule

Platform Admin should eventually be able to manage:

- users
- supplier companies
- supplier verification
- categories
- service listings
- RFQs
- quotes
- orders
- platform fee verification
- reviews
- disputes
- CMS banners and content
- supplier plans and listing limits
- audit logs

Not every admin screen must exist in MVP, but the underlying data should support these controls.

## Super Admin Rule

Super Admin controls high-risk operations:

- admin user management
- role and permission changes
- fee rule changes
- system-wide settings
- destructive actions
- audit log review
- manual correction of high-risk records

## Examples

### Supplier Company

Supplier creates or updates its own company profile.

Platform Admin approves, rejects, verifies, suspends, or features the company.

Suggested statuses:

- `DRAFT`
- `PENDING_REVIEW`
- `APPROVED`
- `REJECTED`
- `SUSPENDED`

### Service Listing

Supplier Admin creates and updates listings.

Platform Admin can approve, hide, reject, feature, or move categories.

Suggested statuses:

- `DRAFT`
- `PENDING_REVIEW`
- `PUBLISHED`
- `REJECTED`
- `HIDDEN`
- `ARCHIVED`

### RFQ

Buyer creates RFQ.

Platform Admin can inspect, moderate, close, or assist if needed.

Supplier only sees RFQs that are public to suppliers or matched to them.

Suggested statuses:

- `DRAFT`
- `SUBMITTED`
- `MATCHING`
- `QUOTING`
- `QUOTE_ACCEPTED`
- `ORDER_CREATED`
- `CANCELLED`
- `EXPIRED`

### Quote

Supplier creates Quote.

Buyer compares and accepts one Quote.

Platform Admin can inspect Quote history and resolve disputes.

Suggested statuses:

- `DRAFT`
- `SENT`
- `REVISED`
- `ACCEPTED`
- `DECLINED`
- `EXPIRED`
- `CANCELLED`

### CMS Banner

Platform Admin creates and schedules banners.

Public users only see active banners.

Suggested fields:

- `title`
- `subtitle`
- `imageUrl`
- `ctaLabel`
- `ctaHref`
- `placement`
- `isActive`
- `sortOrder`
- `startAt`
- `endAt`

## Definition Of Done For New Features

A feature is not ready to merge unless it has:

- clear user role ownership
- status model
- permission boundaries
- admin maturity level
- audit needs identified
- config needs identified
- Buyer/Supplier visibility checked
- business rule impact checked
- future admin path documented when admin UI is deferred

