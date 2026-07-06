-- OEM Hub Thailand Phase 1 backend foundation
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('VISITOR', 'BUYER', 'SUPPLIER', 'ADMIN', 'SUPER_ADMIN');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lifecycle_status as enum ('DRAFT', 'SUBMITTED', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'HIDDEN', 'SUSPENDED', 'ARCHIVED', 'DELETED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.supplier_verification_level as enum ('REGISTERED', 'BASIC_VERIFIED', 'BUSINESS_VERIFIED', 'PREMIUM_VERIFIED', 'SUSPENDED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.rfq_status as enum ('DRAFT', 'SUBMITTED', 'MATCHING', 'QUOTING', 'QUOTE_ACCEPTED', 'ORDER_CREATED', 'CANCELLED', 'EXPIRED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.quote_status as enum ('DRAFT', 'SENT', 'REVISED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('QUOTE_ACCEPTED', 'WAITING_BUYER_PAYMENT', 'BUYER_PAYMENT_REPORTED', 'WAITING_SUPPLIER_PAYMENT_CONFIRMATION', 'WAITING_PLATFORM_FEE', 'PLATFORM_FEE_PAID', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'DISPUTED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_term as enum ('FULL_100', 'DEPOSIT_FINAL');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('NOT_REPORTED', 'REPORTED', 'CONFIRMED_BY_SUPPLIER', 'REJECTED', 'VERIFIED_BY_ADMIN');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.platform_fee_status as enum ('NOT_REQUIRED', 'PENDING', 'WAITING_PAYMENT', 'PAID', 'OVERDUE', 'WAIVED', 'FAILED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.review_status as enum ('PENDING', 'PUBLISHED', 'HIDDEN', 'REJECTED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.dispute_status as enum ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_direction as enum ('BUYER_TO_SUPPLIER', 'SUPPLIER_TO_PLATFORM');
exception when duplicate_object then null; end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique,
  role public.user_role not null default 'BUYER',
  status public.lifecycle_status not null default 'APPROVED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.user_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  display_name text,
  phone text,
  avatar_url text,
  company_name text,
  position_title text,
  province text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name_th text not null,
  name_en text,
  description text,
  icon_name text,
  image_url text,
  status public.lifecycle_status not null default 'PUBLISHED',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.supplier_companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  owner_user_id uuid not null references public.users(id) on delete restrict,
  company_name text not null,
  legal_name text,
  tax_id text,
  description text,
  logo_url text,
  cover_image_url text,
  province text,
  address text,
  website_url text,
  status public.lifecycle_status not null default 'PENDING_REVIEW',
  verification_level public.supplier_verification_level not null default 'REGISTERED',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  approved_at timestamptz,
  approved_by_user_id uuid references public.users(id) on delete set null,
  rejected_at timestamptz,
  rejected_by_user_id uuid references public.users(id) on delete set null,
  rejection_reason text,
  suspended_at timestamptz,
  suspended_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.supplier_members (
  id uuid primary key default gen_random_uuid(),
  supplier_company_id uuid not null references public.supplier_companies(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  member_role text not null default 'OWNER',
  status public.lifecycle_status not null default 'APPROVED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_company_id, user_id)
);

create table if not exists public.service_listings (
  id uuid primary key default gen_random_uuid(),
  supplier_company_id uuid not null references public.supplier_companies(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  description text,
  min_moq integer,
  lead_time_min_days integer,
  lead_time_max_days integer,
  price_starts_at numeric(14, 2),
  status public.lifecycle_status not null default 'DRAFT',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  published_at timestamptz,
  approved_at timestamptz,
  approved_by_user_id uuid references public.users(id) on delete set null,
  rejected_at timestamptz,
  rejected_by_user_id uuid references public.users(id) on delete set null,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  rfq_no text not null unique,
  buyer_user_id uuid not null references public.users(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text,
  status public.rfq_status not null default 'DRAFT',
  budget_min numeric(14, 2),
  budget_max numeric(14, 2),
  target_delivery_date date,
  contact_name text,
  contact_email text,
  contact_phone text,
  supplier_visibility text not null default 'MATCHED',
  submitted_at timestamptz,
  expires_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  product_name text not null,
  product_type text,
  quantity integer,
  unit text,
  specs jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rfq_attachments (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  uploaded_by_user_id uuid references public.users(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size integer,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_no text not null unique,
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  supplier_company_id uuid not null references public.supplier_companies(id) on delete restrict,
  created_by_user_id uuid references public.users(id) on delete set null,
  status public.quote_status not null default 'DRAFT',
  total_amount numeric(14, 2) not null,
  currency text not null default 'THB',
  payment_term public.payment_term not null default 'FULL_100',
  deposit_percent numeric(5, 2),
  lead_time_days integer,
  valid_until date,
  note text,
  sent_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  title text not null,
  description text,
  quantity integer,
  unit_price numeric(14, 2),
  amount numeric(14, 2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  rfq_id uuid not null references public.rfqs(id) on delete restrict,
  quote_id uuid not null unique references public.quotes(id) on delete restrict,
  buyer_user_id uuid not null references public.users(id) on delete restrict,
  supplier_company_id uuid not null references public.supplier_companies(id) on delete restrict,
  status public.order_status not null default 'QUOTE_ACCEPTED',
  total_amount numeric(14, 2) not null,
  currency text not null default 'THB',
  payment_term public.payment_term not null,
  deposit_amount numeric(14, 2) not null default 0,
  final_amount numeric(14, 2) not null default 0,
  accepted_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.order_timeline_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  created_by_user_id uuid references public.users(id) on delete set null,
  title text not null,
  description text,
  status public.lifecycle_status not null default 'PUBLISHED',
  event_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  payer_user_id uuid references public.users(id) on delete set null,
  supplier_company_id uuid references public.supplier_companies(id) on delete set null,
  direction public.payment_direction not null,
  amount numeric(14, 2) not null,
  currency text not null default 'THB',
  status public.payment_status not null default 'NOT_REPORTED',
  proof_file_path text,
  reported_at timestamptz,
  confirmed_at timestamptz,
  confirmed_by_user_id uuid references public.users(id) on delete set null,
  verified_at timestamptz,
  verified_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.commission_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  fee_rate numeric(6, 5) not null,
  fixed_amount numeric(14, 2) not null default 0,
  currency text not null default 'THB',
  status public.lifecycle_status not null default 'APPROVED',
  starts_at timestamptz,
  ends_at timestamptz,
  created_by_user_id uuid references public.users(id) on delete set null,
  approved_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.platform_fees (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  supplier_company_id uuid not null references public.supplier_companies(id) on delete restrict,
  commission_rule_id uuid references public.commission_rules(id) on delete set null,
  fee_base_amount numeric(14, 2) not null,
  fee_rate numeric(6, 5) not null,
  fixed_amount numeric(14, 2) not null default 0,
  fee_total numeric(14, 2) not null,
  currency text not null default 'THB',
  status public.platform_fee_status not null default 'PENDING',
  due_at timestamptz,
  paid_at timestamptz,
  verified_at timestamptz,
  verified_by_user_id uuid references public.users(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  reviewer_user_id uuid not null references public.users(id) on delete restrict,
  supplier_company_id uuid not null references public.supplier_companies(id) on delete restrict,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status public.review_status not null default 'PUBLISHED',
  published_at timestamptz,
  hidden_at timestamptz,
  hidden_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  opened_by_user_id uuid not null references public.users(id) on delete restrict,
  assigned_admin_user_id uuid references public.users(id) on delete set null,
  reason text not null,
  status public.dispute_status not null default 'OPEN',
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.cms_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  cta_label text,
  cta_href text,
  placement text not null default 'homepage_hero',
  status public.lifecycle_status not null default 'DRAFT',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by_user_id uuid references public.users(id) on delete set null,
  approved_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  actor_role public.user_role,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  previous_value jsonb,
  new_value jsonb,
  reason text,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_auth_user_id on public.users(auth_user_id);
create index if not exists idx_supplier_companies_owner on public.supplier_companies(owner_user_id);
create index if not exists idx_service_listings_supplier on public.service_listings(supplier_company_id);
create index if not exists idx_rfqs_buyer_status on public.rfqs(buyer_user_id, status);
create index if not exists idx_quotes_rfq_status on public.quotes(rfq_id, status);
create index if not exists idx_orders_buyer_status on public.orders(buyer_user_id, status);
create index if not exists idx_orders_supplier_status on public.orders(supplier_company_id, status);
create index if not exists idx_platform_fees_status on public.platform_fees(status);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);

do $$ declare
  table_name text;
begin
  foreach table_name in array array[
    'users', 'user_profiles', 'categories', 'supplier_companies', 'supplier_members',
    'service_listings', 'rfqs', 'rfq_items', 'quotes', 'quote_items', 'orders',
    'payments', 'platform_fees', 'commission_rules', 'reviews', 'disputes',
    'cms_banners', 'system_settings'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end $$;

create or replace function public.current_app_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.current_app_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('ADMIN', 'SUPER_ADMIN'), false);
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'SUPER_ADMIN', false);
$$;

create or replace function public.user_belongs_to_supplier(company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.supplier_members
    where supplier_company_id = company_id
      and user_id = public.current_app_user_id()
      and status = 'APPROVED'
  );
$$;

create or replace function public.prevent_review_before_completed_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.orders
    where id = new.order_id
      and status = 'COMPLETED'
  ) then
    raise exception 'Reviews can only be created from completed orders.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_review_before_completed_order on public.reviews;
create trigger prevent_review_before_completed_order
before insert or update on public.reviews
for each row execute function public.prevent_review_before_completed_order();

alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.supplier_companies enable row level security;
alter table public.supplier_members enable row level security;
alter table public.service_listings enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;
alter table public.rfq_attachments enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_timeline_events enable row level security;
alter table public.payments enable row level security;
alter table public.platform_fees enable row level security;
alter table public.commission_rules enable row level security;
alter table public.reviews enable row level security;
alter table public.disputes enable row level security;
alter table public.cms_banners enable row level security;
alter table public.audit_logs enable row level security;
alter table public.system_settings enable row level security;

drop policy if exists "Users can read own user or admin can read all" on public.users;
create policy "Users can read own user or admin can read all"
on public.users for select
using (auth_user_id = auth.uid() or public.is_platform_admin());

drop policy if exists "Users can read own profile or admin can read all" on public.user_profiles;
create policy "Users can read own profile or admin can read all"
on public.user_profiles for select
using (user_id = public.current_app_user_id() or public.is_platform_admin());

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
on public.user_profiles for update
using (user_id = public.current_app_user_id())
with check (user_id = public.current_app_user_id());

drop policy if exists "Public can read published categories" on public.categories;
create policy "Public can read published categories"
on public.categories for select
using (status = 'PUBLISHED' and is_active = true);

drop policy if exists "Admin can manage categories" on public.categories;
create policy "Admin can manage categories"
on public.categories for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Public can read approved suppliers" on public.supplier_companies;
create policy "Public can read approved suppliers"
on public.supplier_companies for select
using (status = 'APPROVED' and is_active = true);

drop policy if exists "Supplier members can read own supplier" on public.supplier_companies;
create policy "Supplier members can read own supplier"
on public.supplier_companies for select
using (public.user_belongs_to_supplier(id) or public.is_platform_admin());

drop policy if exists "Supplier members can update own supplier draft" on public.supplier_companies;
create policy "Supplier members can update own supplier draft"
on public.supplier_companies for update
using (public.user_belongs_to_supplier(id))
with check (public.user_belongs_to_supplier(id));

drop policy if exists "Public can read published listings" on public.service_listings;
create policy "Public can read published listings"
on public.service_listings for select
using (status = 'PUBLISHED' and is_active = true);

drop policy if exists "Supplier members can manage own listings" on public.service_listings;
create policy "Supplier members can manage own listings"
on public.service_listings for all
using (public.user_belongs_to_supplier(supplier_company_id) or public.is_platform_admin())
with check (public.user_belongs_to_supplier(supplier_company_id) or public.is_platform_admin());

drop policy if exists "Buyer can manage own rfqs" on public.rfqs;
create policy "Buyer can manage own rfqs"
on public.rfqs for all
using (buyer_user_id = public.current_app_user_id() or public.is_platform_admin())
with check (buyer_user_id = public.current_app_user_id() or public.is_platform_admin());

drop policy if exists "Buyer can manage own rfq items" on public.rfq_items;
create policy "Buyer can manage own rfq items"
on public.rfq_items for all
using (
  exists (
    select 1 from public.rfqs
    where rfqs.id = rfq_items.rfq_id
      and (rfqs.buyer_user_id = public.current_app_user_id() or public.is_platform_admin())
  )
)
with check (
  exists (
    select 1 from public.rfqs
    where rfqs.id = rfq_items.rfq_id
      and (rfqs.buyer_user_id = public.current_app_user_id() or public.is_platform_admin())
  )
);

drop policy if exists "Supplier can manage own quotes" on public.quotes;
create policy "Supplier can manage own quotes"
on public.quotes for all
using (public.user_belongs_to_supplier(supplier_company_id) or public.is_platform_admin())
with check (public.user_belongs_to_supplier(supplier_company_id) or public.is_platform_admin());

drop policy if exists "Buyer can read quotes for own rfqs" on public.quotes;
create policy "Buyer can read quotes for own rfqs"
on public.quotes for select
using (
  exists (
    select 1 from public.rfqs
    where rfqs.id = quotes.rfq_id
      and rfqs.buyer_user_id = public.current_app_user_id()
  )
);

drop policy if exists "Order participants can read orders" on public.orders;
create policy "Order participants can read orders"
on public.orders for select
using (
  buyer_user_id = public.current_app_user_id()
  or public.user_belongs_to_supplier(supplier_company_id)
  or public.is_platform_admin()
);

drop policy if exists "Admin can manage orders" on public.orders;
create policy "Admin can manage orders"
on public.orders for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Supplier and admin can read platform fees" on public.platform_fees;
create policy "Supplier and admin can read platform fees"
on public.platform_fees for select
using (public.user_belongs_to_supplier(supplier_company_id) or public.is_platform_admin());

drop policy if exists "Admin can manage platform fees" on public.platform_fees;
create policy "Admin can manage platform fees"
on public.platform_fees for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Public can read published reviews" on public.reviews;
create policy "Public can read published reviews"
on public.reviews for select
using (status = 'PUBLISHED');

drop policy if exists "Buyer can create review for own completed order" on public.reviews;
create policy "Buyer can create review for own completed order"
on public.reviews for insert
with check (
  reviewer_user_id = public.current_app_user_id()
  and exists (
    select 1 from public.orders
    where orders.id = reviews.order_id
      and orders.buyer_user_id = public.current_app_user_id()
      and orders.status = 'COMPLETED'
  )
);

drop policy if exists "Admin can read audit logs" on public.audit_logs;
create policy "Admin can read audit logs"
on public.audit_logs for select
using (public.is_platform_admin());

drop policy if exists "Super admin can manage system settings" on public.system_settings;
create policy "Super admin can manage system settings"
on public.system_settings for all
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists "Public can read public system settings" on public.system_settings;
create policy "Public can read public system settings"
on public.system_settings for select
using (is_public = true or public.is_platform_admin());

insert into public.system_settings (key, value, description, is_public)
values
  ('phase_1_schema_version', '"20260706000000"', 'OEM Hub Thailand Phase 1 Supabase foundation marker', true),
  ('default_platform_fee_rate', '0.10', 'Default configurable Order Activation Fee rate. Do not expose to Buyer UI.', false)
on conflict (key) do update
set value = excluded.value,
    description = excluded.description,
    is_public = excluded.is_public,
    updated_at = now();

insert into public.commission_rules (name, fee_rate, fixed_amount, status, metadata)
values ('Default Order Activation Fee', 0.10, 0, 'APPROVED', '{"note":"Configurable starter rule for MVP; not a hardcoded permanent commission."}'::jsonb)
on conflict (name) do update
set fee_rate = excluded.fee_rate,
    fixed_amount = excluded.fixed_amount,
    status = excluded.status,
    metadata = excluded.metadata,
    updated_at = now();

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('public-assets', 'public-assets', true, 10485760),
  ('supplier-media', 'supplier-media', true, 10485760),
  ('rfq-attachments', 'rfq-attachments', false, 20971520),
  ('quote-attachments', 'quote-attachments', false, 20971520),
  ('order-documents', 'order-documents', false, 20971520),
  ('admin-documents', 'admin-documents', false, 20971520)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Public can read public assets" on storage.objects;
create policy "Public can read public assets"
on storage.objects for select
using (bucket_id in ('public-assets', 'supplier-media'));

drop policy if exists "Authenticated users can upload private deal files" on storage.objects;
create policy "Authenticated users can upload private deal files"
on storage.objects for insert
to authenticated
with check (bucket_id in ('rfq-attachments', 'quote-attachments', 'order-documents'));

drop policy if exists "Admin can manage all storage objects" on storage.objects;
create policy "Admin can manage all storage objects"
on storage.objects for all
to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());
