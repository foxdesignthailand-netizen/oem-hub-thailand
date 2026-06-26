# Business Rules: OEM Hub Thailand

This file records the current business rules agreed for the MVP.

## Payment Model

The platform does not hold the large production/service payment in the MVP.

Buyer pays Supplier directly.

Platform earns revenue from Supplier via Order Activation Fee / Platform Success Fee.

## Buyer Payment Rules

- Buyer uses the platform for free in the MVP.
- Buyer does not pay Platform Service Fee.
- Buyer pays the Supplier directly according to the accepted Quote.
- Buyer can see deal price, payment term, timeline, attachments, order status, delivery, acceptance, and review.
- Buyer must not see Platform Fee, fee rate, internal commission, or Supplier's fee obligation to the platform.

## Supplier Fee Rules

After Buyer accepts Quote and pays Supplier directly, Supplier must confirm payment received.

Then the platform calculates Order Activation Fee.

Supplier must pay Order Activation Fee before the Order can progress to active work.

Preferred UI terms:

- Order Activation Fee
- Platform Success Fee

Avoid using "Commission 20%" as the main UI language.

## Fee Calculation

Order Activation Fee is calculated from the full order amount.

This applies even if the Buyer only paid a deposit first.

Example:

- Full deal amount: THB 30,000
- Payment term: Deposit 50% / Final 50%
- Buyer pays Supplier deposit: THB 15,000
- Fee rate: 10%
- Supplier pays platform fee: THB 3,000

The fee base is THB 30,000, not THB 15,000.

The rate and fee rules must be configurable later by Admin. Do not hardcode a permanent 20% commission.

## Supported Payment Terms In MVP

`FULL_100`

Buyer pays Supplier 100%.

`DEPOSIT_FINAL`

Buyer pays deposit first, then pays final amount later.

## Order Statuses

The system should support:

- `QUOTE_ACCEPTED`
- `WAITING_BUYER_PAYMENT`
- `BUYER_PAYMENT_REPORTED`
- `WAITING_SUPPLIER_PAYMENT_CONFIRMATION`
- `WAITING_PLATFORM_FEE`
- `PLATFORM_FEE_PAID`
- `IN_PROGRESS`
- `READY_FOR_REVIEW`
- `DELIVERED`
- `COMPLETED`
- `CANCELLED`
- `DISPUTED`

## Platform Fee Statuses

The system should support:

- `NOT_REQUIRED`
- `PENDING`
- `WAITING_PAYMENT`
- `PAID`
- `OVERDUE`
- `WAIVED`
- `FAILED`

## If Supplier Does Not Pay Platform Fee

If Supplier has received Buyer payment but does not pay Order Activation Fee in time:

- Order remains `WAITING_PLATFORM_FEE`.
- Order does not become `IN_PROGRESS`.
- Supplier does not receive Completed Order Credit.
- Buyer cannot leave Completed Order Review.
- Supplier does not gain rating/ranking benefit from the deal.
- Supplier Reliability Score may decrease.
- Supplier Ranking may decrease.
- Admin may warn or suspend Supplier after repeated behavior.

Buyer-facing wording should be neutral, for example:

"Supplier อยู่ระหว่างยืนยันการเริ่มงานผ่านระบบ"

Do not tell Buyer directly that Supplier has not paid Platform Fee.

## Review Rules

- Reviews must come from completed orders only.
- Completed Order Credit is granted only when the order passed platform fee rules and completed through the system.

## Reliability Scores

Buyer Reliability Score should consider:

- completed orders
- payment reliability
- cancellation rate after accepted quote
- response time
- dispute rate
- review history
- total purchase amount

Supplier Reliability Score should consider:

- completed orders
- platform fee payment rate
- on-time delivery rate
- review average
- dispute rate
- cancellation rate
- response time
- attempts to move Buyer outside the platform

## Supplier Verification Levels

Supplier verification should be gradual, not heavy at signup.

Supported levels:

- `REGISTERED`
- `BASIC_VERIFIED`
- `BUSINESS_VERIFIED`
- `PREMIUM_VERIFIED`
- `SUSPENDED`

Verification level should affect badges, ranking, and Buyer trust.

## Supplier Plans And Listing Limits

MVP should support data fields for:

- SupplierPlan
- ServiceListingLimit
- ExtraServiceSlot
- FeaturedListing
- PromotionPlan

Subscription payment can be added later. The data model should not block it.

## Not Core MVP

These should be future features, not MVP blockers:

- RFQ Credit
- Lead Credit
- full escrow
- full payment gateway
- advanced subscription billing
