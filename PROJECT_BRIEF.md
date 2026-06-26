# Project Brief: OEM Hub Thailand

## What This Product Is

OEM Hub Thailand is a B2B marketplace for Thailand-focused manufacturing and brand-building services.

It connects Buyers with:

- OEM/ODM factories
- manufacturers
- bottle/cap/packaging suppliers
- sticker, label, and box printers
- product and packaging designers
- FDA/GMP/ISO/trademark service providers
- marketing and launch service providers

The product must feel like a modern SaaS plus marketplace platform, not an old supplier directory.

## What Problem It Solves

Buyers often struggle to find reliable suppliers, request quotes from multiple vendors, compare conditions, and track production work in a structured way.

Suppliers often struggle to receive qualified RFQs, understand buyer reliability, showcase trust signals, and get completed-order credit from successful deals.

OEM Hub Thailand solves this by making the deal workflow happen inside the platform.

## Core User Roles

### Visitor

Can browse public pages, categories, suppliers, services, content, and CTA flows. The goal is to convert Visitors into Buyers or Suppliers.

### Buyer

Creates RFQs, receives quotes, compares suppliers, accepts a quote, pays Supplier directly, tracks the order, confirms completion, and reviews the Supplier.

### Supplier

Creates a company profile, publishes service listings, receives RFQs, sends quotes, confirms Buyer payment, pays Order Activation Fee to the platform, updates work timeline, and earns completed-order credit.

### Admin

Manages users, suppliers, verification, categories, RFQs, quotes, orders, platform fee verification, reviews, disputes, plans, listing limits, and CMS content.

### Super Admin

Has full platform control, including admin users, permissions, platform settings, fee rules, audit logs, and high-risk actions.

## Core Workflow

1. Buyer creates RFQ.
2. Supplier sends Quote.
3. Buyer compares Quotes.
4. Buyer accepts one Quote.
5. System creates Order.
6. Buyer pays Supplier directly according to payment term.
7. Supplier confirms payment received.
8. System calculates Order Activation Fee from full order amount.
9. Supplier pays Order Activation Fee to Platform.
10. Admin or system verifies the platform fee.
11. Order becomes `IN_PROGRESS`.
12. Supplier updates timeline and delivers work.
13. Buyer reviews and accepts work.
14. Order becomes `COMPLETED`.
15. Buyer can review Supplier.
16. Supplier receives Completed Order Credit and ranking benefit.

## MVP Focus

The MVP should prioritize the RFQ -> Quote -> Order workflow.

Do not overbuild subscriptions, escrow, payment gateway, RFQ credits, or advanced automation before the core transaction flow is real.

## Current Implementation Status

The current repo contains a Next.js UI implementation with mock data for:

- public marketplace pages
- Buyer dashboard
- Supplier dashboard
- Admin dashboard
- RFQ creation wizard
- quote comparison UI
- direct Buyer payment UI
- Supplier Order Activation Fee UI
- reliability score widgets
- verification and listing-slot previews

The current app does not yet have a real backend, database, authentication, or persistent workflow engine.

## Product Principle

Every major feature should support real B2B deals happening through the system. Avoid building a static brochure or supplier directory experience.
