-- OEM Hub Thailand MVP operational RPC layer
-- Run after 20260706000000_phase_1_foundation.sql and 20260706001000_phase_2_6_workflow_functions.sql.
-- These functions are intentionally MVP-oriented: they let the app create real RFQ, Quote, Order,
-- manual payment, platform fee verification, supplier profile, file metadata, and review records
-- through Supabase while the production auth and admin policy layer continues to mature.

create or replace function public.oem_mvp_short_id(p_prefix text)
returns text
language sql
as $$
  select upper(p_prefix || '-' || to_char(now(), 'YYYYMMDD') || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
$$;

create or replace function public.oem_mvp_slugify(p_value text)
returns text
language sql
as $$
  select lower(
    regexp_replace(
      regexp_replace(coalesce(nullif(trim(p_value), ''), 'supplier'), '[^a-zA-Z0-9]+', '-', 'g'),
      '(^-|-$)',
      '',
      'g'
    )
  );
$$;

create or replace function public.oem_mvp_upsert_user(
  p_email text,
  p_role public.user_role default 'BUYER',
  p_display_name text default null,
  p_company_name text default null,
  p_phone text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_user_id uuid;
  v_auth_user_id uuid;
begin
  v_email := lower(trim(coalesce(nullif(p_email, ''), coalesce(auth.jwt() ->> 'email', 'buyer-demo@oemhub.local'))));
  v_auth_user_id := auth.uid();

  insert into public.users (auth_user_id, email, role, status, metadata)
  values (v_auth_user_id, v_email, p_role, 'APPROVED', jsonb_build_object('source', 'mvp_operational_rpc'))
  on conflict (email) do update
  set role = excluded.role,
      auth_user_id = coalesce(public.users.auth_user_id, excluded.auth_user_id),
      status = 'APPROVED',
      updated_at = now()
  returning id into v_user_id;

  insert into public.user_profiles (user_id, display_name, phone, company_name)
  values (
    v_user_id,
    coalesce(nullif(p_display_name, ''), split_part(v_email, '@', 1)),
    nullif(p_phone, ''),
    nullif(p_company_name, '')
  )
  on conflict (user_id) do update
  set display_name = coalesce(excluded.display_name, public.user_profiles.display_name),
      phone = coalesce(excluded.phone, public.user_profiles.phone),
      company_name = coalesce(excluded.company_name, public.user_profiles.company_name),
      updated_at = now();

  insert into public.audit_logs (actor_user_id, actor_role, action, entity_type, entity_id, new_value)
  values (
    v_user_id,
    p_role,
    'MVP_USER_UPSERTED',
    'users',
    v_user_id,
    jsonb_build_object('email', v_email, 'role', p_role)
  );

  return jsonb_build_object('user_id', v_user_id, 'email', v_email, 'role', p_role);
end;
$$;

create or replace function public.oem_mvp_ensure_category(
  p_slug text default 'oem-odm',
  p_name text default 'OEM / ODM'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category_id uuid;
begin
  insert into public.categories (slug, name_th, name_en, status, is_active, sort_order)
  values (coalesce(nullif(p_slug, ''), 'oem-odm'), coalesce(nullif(p_name, ''), 'OEM / ODM'), p_name, 'PUBLISHED', true, 10)
  on conflict (slug) do update
  set name_th = excluded.name_th,
      status = 'PUBLISHED',
      is_active = true,
      updated_at = now()
  returning id into v_category_id;

  return v_category_id;
end;
$$;

create or replace function public.oem_mvp_upsert_supplier_company(
  p_actor_email text,
  p_company_name text,
  p_province text default null,
  p_description text default null,
  p_logo_url text default null,
  p_cover_image_url text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user jsonb;
  v_user_id uuid;
  v_company_id uuid;
  v_slug text;
begin
  v_user := public.oem_mvp_upsert_user(
    p_actor_email,
    'SUPPLIER',
    coalesce(nullif(p_company_name, ''), 'Supplier MVP'),
    coalesce(nullif(p_company_name, ''), 'Supplier MVP')
  );
  v_user_id := (v_user ->> 'user_id')::uuid;
  v_slug := public.oem_mvp_slugify(coalesce(nullif(p_company_name, ''), 'supplier-mvp'));

  insert into public.supplier_companies (
    slug,
    owner_user_id,
    company_name,
    description,
    logo_url,
    cover_image_url,
    province,
    status,
    verification_level,
    is_active,
    approved_at,
    metadata
  )
  values (
    v_slug,
    v_user_id,
    coalesce(nullif(p_company_name, ''), 'Supplier MVP'),
    nullif(p_description, ''),
    nullif(p_logo_url, ''),
    nullif(p_cover_image_url, ''),
    nullif(p_province, ''),
    'APPROVED',
    'BASIC_VERIFIED',
    true,
    now(),
    jsonb_build_object('source', 'mvp_operational_rpc')
  )
  on conflict (slug) do update
  set company_name = excluded.company_name,
      description = coalesce(excluded.description, public.supplier_companies.description),
      logo_url = coalesce(excluded.logo_url, public.supplier_companies.logo_url),
      cover_image_url = coalesce(excluded.cover_image_url, public.supplier_companies.cover_image_url),
      province = coalesce(excluded.province, public.supplier_companies.province),
      status = 'APPROVED',
      verification_level = 'BASIC_VERIFIED',
      updated_at = now()
  returning id into v_company_id;

  insert into public.supplier_members (supplier_company_id, user_id, member_role, status)
  values (v_company_id, v_user_id, 'OWNER', 'APPROVED')
  on conflict (supplier_company_id, user_id) do update
  set status = 'APPROVED',
      updated_at = now();

  insert into public.audit_logs (actor_user_id, actor_role, action, entity_type, entity_id, new_value)
  values (
    v_user_id,
    'SUPPLIER',
    'MVP_SUPPLIER_UPSERTED',
    'supplier_companies',
    v_company_id,
    jsonb_build_object('company_name', p_company_name, 'slug', v_slug)
  );

  return jsonb_build_object('supplier_company_id', v_company_id, 'slug', v_slug, 'company_name', p_company_name);
end;
$$;

create or replace function public.oem_mvp_create_rfq(
  p_actor_email text,
  p_title text,
  p_category_slug text default 'oem-odm',
  p_category_name text default 'OEM / ODM',
  p_product_name text default 'OEM product',
  p_quantity integer default 1000,
  p_budget numeric default 100000,
  p_description text default null,
  p_contact_name text default null,
  p_contact_email text default null,
  p_contact_phone text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user jsonb;
  v_user_id uuid;
  v_category_id uuid;
  v_rfq_id uuid;
  v_rfq_no text;
begin
  v_user := public.oem_mvp_upsert_user(p_actor_email, 'BUYER', p_contact_name, null, p_contact_phone);
  v_user_id := (v_user ->> 'user_id')::uuid;
  v_category_id := public.oem_mvp_ensure_category(p_category_slug, p_category_name);
  v_rfq_no := public.oem_mvp_short_id('RFQ');

  insert into public.rfqs (
    rfq_no,
    buyer_user_id,
    category_id,
    title,
    description,
    status,
    budget_min,
    budget_max,
    contact_name,
    contact_email,
    contact_phone,
    supplier_visibility,
    submitted_at,
    metadata
  )
  values (
    v_rfq_no,
    v_user_id,
    v_category_id,
    coalesce(nullif(p_title, ''), 'OEM product RFQ'),
    nullif(p_description, ''),
    'SUBMITTED',
    null,
    p_budget,
    coalesce(nullif(p_contact_name, ''), split_part((v_user ->> 'email'), '@', 1)),
    coalesce(nullif(p_contact_email, ''), v_user ->> 'email'),
    nullif(p_contact_phone, ''),
    'MATCHED',
    now(),
    jsonb_build_object('source', 'mvp_operational_rpc')
  )
  returning id into v_rfq_id;

  insert into public.rfq_items (rfq_id, product_name, product_type, quantity, unit, specs)
  values (
    v_rfq_id,
    coalesce(nullif(p_product_name, ''), p_title, 'OEM product'),
    p_category_name,
    p_quantity,
    'pcs',
    jsonb_build_object('budget', p_budget, 'description', p_description)
  );

  insert into public.audit_logs (actor_user_id, actor_role, action, entity_type, entity_id, new_value)
  values (
    v_user_id,
    'BUYER',
    'MVP_RFQ_CREATED',
    'rfqs',
    v_rfq_id,
    jsonb_build_object('rfq_no', v_rfq_no, 'title', p_title)
  );

  return jsonb_build_object('rfq_id', v_rfq_id, 'rfq_no', v_rfq_no, 'status', 'SUBMITTED');
end;
$$;

create or replace function public.oem_mvp_send_quote(
  p_actor_email text,
  p_rfq_no text,
  p_supplier_name text default 'MVP Supplier Co., Ltd.',
  p_total_amount numeric default 100000,
  p_moq integer default 500,
  p_lead_time_days integer default 20,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rfq public.rfqs%rowtype;
  v_supplier jsonb;
  v_supplier_company_id uuid;
  v_quote_id uuid;
  v_quote_no text;
begin
  select * into v_rfq from public.rfqs where rfq_no = p_rfq_no;
  if not found then
    raise exception 'RFQ not found: %', p_rfq_no;
  end if;

  v_supplier := public.oem_mvp_upsert_supplier_company(p_actor_email, p_supplier_name);
  v_supplier_company_id := (v_supplier ->> 'supplier_company_id')::uuid;
  v_quote_no := public.oem_mvp_short_id('Q');

  insert into public.quotes (
    quote_no,
    rfq_id,
    supplier_company_id,
    status,
    total_amount,
    currency,
    payment_term,
    deposit_percent,
    lead_time_days,
    valid_until,
    note,
    sent_at,
    metadata
  )
  values (
    v_quote_no,
    v_rfq.id,
    v_supplier_company_id,
    'SENT',
    p_total_amount,
    'THB',
    'DEPOSIT_FINAL',
    50,
    p_lead_time_days,
    current_date + 14,
    coalesce(nullif(p_note, ''), 'MVP quote submitted by Supplier'),
    now(),
    jsonb_build_object('moq', p_moq, 'source', 'mvp_operational_rpc')
  )
  returning id into v_quote_id;

  insert into public.quote_items (quote_id, title, description, quantity, unit_price, amount)
  values (v_quote_id, 'Main production quote', p_note, p_moq, case when p_moq > 0 then p_total_amount / p_moq else p_total_amount end, p_total_amount);

  update public.rfqs
  set status = 'QUOTING',
      updated_at = now()
  where id = v_rfq.id;

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('SUPPLIER', 'MVP_QUOTE_SENT', 'quotes', v_quote_id, jsonb_build_object('quote_no', v_quote_no, 'rfq_no', p_rfq_no));

  return jsonb_build_object('quote_id', v_quote_id, 'quote_no', v_quote_no, 'rfq_no', p_rfq_no, 'status', 'SENT');
end;
$$;

create or replace function public.oem_mvp_accept_quote(
  p_actor_email text,
  p_quote_no text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quote public.quotes%rowtype;
  v_rfq public.rfqs%rowtype;
  v_order_id uuid;
  v_order_no text;
begin
  select * into v_quote from public.quotes where quote_no = p_quote_no;
  if not found then
    raise exception 'Quote not found: %', p_quote_no;
  end if;

  select * into v_rfq from public.rfqs where id = v_quote.rfq_id;
  v_order_no := public.oem_mvp_short_id('ORD');

  update public.quotes
  set status = case when id = v_quote.id then 'ACCEPTED'::public.quote_status else 'DECLINED'::public.quote_status end,
      accepted_at = case when id = v_quote.id then now() else accepted_at end,
      updated_at = now()
  where rfq_id = v_quote.rfq_id;

  insert into public.orders (
    order_no,
    rfq_id,
    quote_id,
    buyer_user_id,
    supplier_company_id,
    status,
    total_amount,
    currency,
    payment_term,
    deposit_amount,
    final_amount,
    accepted_at,
    metadata
  )
  values (
    v_order_no,
    v_rfq.id,
    v_quote.id,
    v_rfq.buyer_user_id,
    v_quote.supplier_company_id,
    'WAITING_BUYER_PAYMENT',
    v_quote.total_amount,
    v_quote.currency,
    v_quote.payment_term,
    case when v_quote.payment_term = 'DEPOSIT_FINAL' then round(v_quote.total_amount * 0.5, 2) else v_quote.total_amount end,
    case when v_quote.payment_term = 'DEPOSIT_FINAL' then round(v_quote.total_amount * 0.5, 2) else 0 end,
    now(),
    jsonb_build_object('source', 'mvp_operational_rpc')
  )
  returning id into v_order_id;

  update public.rfqs set status = 'ORDER_CREATED', updated_at = now() where id = v_rfq.id;

  insert into public.order_timeline_events (order_id, title, description, status)
  values (v_order_id, 'Order created', 'Buyer accepted supplier quote and order is waiting for direct buyer payment.', 'PUBLISHED');

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('BUYER', 'MVP_QUOTE_ACCEPTED', 'orders', v_order_id, jsonb_build_object('order_no', v_order_no, 'quote_no', p_quote_no));

  return jsonb_build_object('order_id', v_order_id, 'order_no', v_order_no, 'status', 'WAITING_BUYER_PAYMENT');
end;
$$;

create or replace function public.oem_mvp_report_buyer_payment(
  p_actor_email text,
  p_order_no text,
  p_amount numeric default null,
  p_proof_file_path text default null,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_payment_id uuid;
begin
  select * into v_order from public.orders where order_no = p_order_no;
  if not found then
    raise exception 'Order not found: %', p_order_no;
  end if;

  insert into public.payments (
    order_id,
    payer_user_id,
    supplier_company_id,
    direction,
    amount,
    currency,
    status,
    proof_file_path,
    reported_at,
    metadata
  )
  values (
    v_order.id,
    v_order.buyer_user_id,
    v_order.supplier_company_id,
    'BUYER_TO_SUPPLIER',
    coalesce(p_amount, nullif(v_order.deposit_amount, 0), v_order.total_amount),
    v_order.currency,
    'REPORTED',
    nullif(p_proof_file_path, ''),
    now(),
    jsonb_build_object('note', p_note, 'source', 'mvp_operational_rpc')
  )
  returning id into v_payment_id;

  update public.orders
  set status = 'BUYER_PAYMENT_REPORTED',
      updated_at = now(),
      metadata = metadata || jsonb_build_object('buyer_payment_reported_at', now())
  where id = v_order.id;

  insert into public.order_timeline_events (order_id, title, description, status)
  values (v_order.id, 'Buyer payment reported', 'Buyer reported direct payment to Supplier.', 'PUBLISHED');

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('BUYER', 'MVP_BUYER_PAYMENT_REPORTED', 'payments', v_payment_id, jsonb_build_object('order_no', p_order_no));

  return jsonb_build_object('payment_id', v_payment_id, 'order_no', p_order_no, 'status', 'REPORTED');
end;
$$;

create or replace function public.oem_mvp_confirm_buyer_payment(
  p_actor_email text,
  p_order_no text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_fee_id uuid;
  v_rate numeric(6, 5);
  v_fee_total numeric(14, 2);
begin
  select * into v_order from public.orders where order_no = p_order_no;
  if not found then
    raise exception 'Order not found: %', p_order_no;
  end if;

  v_rate := 0.10000;
  select coalesce((value ->> 'fee_rate')::numeric, v_rate)
    into v_rate
  from public.system_settings
  where key = 'mvp_platform_fee_rule';

  v_fee_total := round(v_order.total_amount * v_rate, 2);

  update public.payments
  set status = 'CONFIRMED_BY_SUPPLIER',
      confirmed_at = now()
  where order_id = v_order.id and direction = 'BUYER_TO_SUPPLIER';

  insert into public.platform_fees (
    order_id,
    supplier_company_id,
    fee_base_amount,
    fee_rate,
    fixed_amount,
    fee_total,
    currency,
    status,
    due_at,
    metadata
  )
  values (
    v_order.id,
    v_order.supplier_company_id,
    v_order.total_amount,
    v_rate,
    0,
    v_fee_total,
    v_order.currency,
    'WAITING_PAYMENT',
    now() + interval '7 days',
    jsonb_build_object('source', 'mvp_operational_rpc')
  )
  on conflict (order_id) do update
  set status = 'WAITING_PAYMENT',
      fee_base_amount = excluded.fee_base_amount,
      fee_rate = excluded.fee_rate,
      fee_total = excluded.fee_total,
      updated_at = now()
  returning id into v_fee_id;

  update public.orders
  set status = 'WAITING_PLATFORM_FEE',
      updated_at = now()
  where id = v_order.id;

  insert into public.order_timeline_events (order_id, title, description, status)
  values (v_order.id, 'Supplier confirmed buyer payment', 'System created Order Activation Fee for Supplier.', 'PUBLISHED');

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('SUPPLIER', 'MVP_BUYER_PAYMENT_CONFIRMED', 'platform_fees', v_fee_id, jsonb_build_object('order_no', p_order_no, 'fee_total', v_fee_total));

  return jsonb_build_object('platform_fee_id', v_fee_id, 'order_no', p_order_no, 'status', 'WAITING_PAYMENT', 'fee_total', v_fee_total);
end;
$$;

create or replace function public.oem_mvp_report_platform_fee(
  p_actor_email text,
  p_order_no text,
  p_proof_file_path text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_fee public.platform_fees%rowtype;
  v_payment_id uuid;
begin
  select * into v_order from public.orders where order_no = p_order_no;
  if not found then
    raise exception 'Order not found: %', p_order_no;
  end if;

  select * into v_fee from public.platform_fees where order_id = v_order.id;
  if not found then
    raise exception 'Platform fee not found for order: %', p_order_no;
  end if;

  insert into public.payments (
    order_id,
    supplier_company_id,
    direction,
    amount,
    currency,
    status,
    proof_file_path,
    reported_at,
    metadata
  )
  values (
    v_order.id,
    v_order.supplier_company_id,
    'SUPPLIER_TO_PLATFORM',
    v_fee.fee_total,
    v_fee.currency,
    'REPORTED',
    nullif(p_proof_file_path, ''),
    now(),
    jsonb_build_object('source', 'mvp_operational_rpc')
  )
  returning id into v_payment_id;

  update public.platform_fees
  set status = 'PAID',
      paid_at = now(),
      payment_id = v_payment_id,
      updated_at = now()
  where id = v_fee.id;

  update public.orders
  set status = 'PLATFORM_FEE_PAID',
      updated_at = now()
  where id = v_order.id;

  insert into public.order_timeline_events (order_id, title, description, status)
  values (v_order.id, 'Activation Fee reported', 'Supplier reported Order Activation Fee payment for admin verification.', 'PUBLISHED');

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('SUPPLIER', 'MVP_PLATFORM_FEE_REPORTED', 'payments', v_payment_id, jsonb_build_object('order_no', p_order_no));

  return jsonb_build_object('payment_id', v_payment_id, 'order_no', p_order_no, 'status', 'PAID');
end;
$$;

create or replace function public.oem_mvp_verify_platform_fee(
  p_actor_email text,
  p_order_no text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where order_no = p_order_no;
  if not found then
    raise exception 'Order not found: %', p_order_no;
  end if;

  update public.platform_fees
  set status = 'PAID',
      verified_at = now(),
      updated_at = now()
  where order_id = v_order.id;

  update public.payments
  set status = 'VERIFIED_BY_ADMIN',
      verified_at = now()
  where order_id = v_order.id and direction = 'SUPPLIER_TO_PLATFORM';

  update public.orders
  set status = 'IN_PROGRESS',
      updated_at = now()
  where id = v_order.id;

  insert into public.order_timeline_events (order_id, title, description, status)
  values (v_order.id, 'Order started', 'Admin verified Order Activation Fee and order is now in progress.', 'PUBLISHED');

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('ADMIN', 'MVP_PLATFORM_FEE_VERIFIED', 'orders', v_order.id, jsonb_build_object('order_no', p_order_no, 'status', 'IN_PROGRESS'));

  return jsonb_build_object('order_no', p_order_no, 'status', 'IN_PROGRESS');
end;
$$;

create or replace function public.oem_mvp_mark_ready_for_review(
  p_actor_email text,
  p_order_no text,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where order_no = p_order_no;
  if not found then
    raise exception 'Order not found: %', p_order_no;
  end if;

  update public.orders
  set status = 'READY_FOR_REVIEW',
      updated_at = now(),
      metadata = metadata || jsonb_build_object('supplier_delivery_note', p_note)
  where id = v_order.id;

  insert into public.order_timeline_events (order_id, title, description, status)
  values (v_order.id, 'Ready for buyer review', coalesce(p_note, 'Supplier delivered work and is waiting for buyer acceptance.'), 'PUBLISHED');

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('SUPPLIER', 'MVP_READY_FOR_REVIEW', 'orders', v_order.id, jsonb_build_object('order_no', p_order_no));

  return jsonb_build_object('order_no', p_order_no, 'status', 'READY_FOR_REVIEW');
end;
$$;

create or replace function public.oem_mvp_complete_order(
  p_actor_email text,
  p_order_no text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where order_no = p_order_no;
  if not found then
    raise exception 'Order not found: %', p_order_no;
  end if;

  update public.orders
  set status = 'COMPLETED',
      completed_at = now(),
      updated_at = now()
  where id = v_order.id;

  insert into public.order_timeline_events (order_id, title, description, status)
  values (v_order.id, 'Order completed', 'Buyer accepted delivery and completed the order.', 'PUBLISHED');

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('BUYER', 'MVP_ORDER_COMPLETED', 'orders', v_order.id, jsonb_build_object('order_no', p_order_no));

  return jsonb_build_object('order_no', p_order_no, 'status', 'COMPLETED');
end;
$$;

create or replace function public.oem_mvp_create_review(
  p_actor_email text,
  p_order_no text,
  p_rating integer default 5,
  p_comment text default 'Completed through OEM Hub Thailand MVP workflow.'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_review_id uuid;
begin
  select * into v_order from public.orders where order_no = p_order_no;
  if not found then
    raise exception 'Order not found: %', p_order_no;
  end if;

  if v_order.status <> 'COMPLETED' then
    raise exception 'Review can be created only after order is COMPLETED. Current status: %', v_order.status;
  end if;

  insert into public.reviews (
    order_id,
    reviewer_user_id,
    supplier_company_id,
    rating,
    comment,
    status,
    published_at,
    metadata
  )
  values (
    v_order.id,
    v_order.buyer_user_id,
    v_order.supplier_company_id,
    greatest(1, least(5, coalesce(p_rating, 5))),
    p_comment,
    'PUBLISHED',
    now(),
    jsonb_build_object('source', 'mvp_operational_rpc')
  )
  on conflict (order_id) do update
  set rating = excluded.rating,
      comment = excluded.comment,
      status = 'PUBLISHED',
      published_at = now(),
      updated_at = now()
  returning id into v_review_id;

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('BUYER', 'MVP_REVIEW_CREATED', 'reviews', v_review_id, jsonb_build_object('order_no', p_order_no, 'rating', p_rating));

  return jsonb_build_object('review_id', v_review_id, 'order_no', p_order_no, 'rating', greatest(1, least(5, coalesce(p_rating, 5))));
end;
$$;

create or replace function public.oem_mvp_register_file(
  p_actor_email text,
  p_owner_type text,
  p_owner_no text,
  p_bucket text,
  p_file_name text,
  p_file_path text,
  p_file_type text default null,
  p_file_size integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rfq public.rfqs%rowtype;
  v_file_id uuid;
begin
  if lower(p_owner_type) = 'rfq' then
    select * into v_rfq from public.rfqs where rfq_no = p_owner_no;
    if not found then
      raise exception 'RFQ not found: %', p_owner_no;
    end if;

    insert into public.rfq_attachments (
      rfq_id,
      uploaded_by_user_id,
      file_name,
      file_path,
      file_type,
      file_size,
      metadata
    )
    values (
      v_rfq.id,
      v_rfq.buyer_user_id,
      p_file_name,
      p_file_path,
      p_file_type,
      p_file_size,
      jsonb_build_object('bucket', p_bucket, 'source', 'mvp_operational_rpc')
    )
    returning id into v_file_id;

    return jsonb_build_object('file_id', v_file_id, 'owner_type', 'rfq', 'owner_no', p_owner_no);
  end if;

  raise exception 'Unsupported owner_type for MVP file registration: %', p_owner_type;
end;
$$;

create or replace function public.oem_mvp_get_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rfqs jsonb;
  v_quotes jsonb;
  v_orders jsonb;
  v_payments jsonb;
  v_reviews jsonb;
  v_suppliers jsonb;
  v_files jsonb;
begin
  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    into v_rfqs
  from (
    select rfq_no, title, status, budget_max, created_at
    from public.rfqs
    order by created_at desc
    limit 10
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    into v_quotes
  from (
    select q.quote_no, r.rfq_no, q.status, q.total_amount, q.lead_time_days, q.created_at
    from public.quotes q
    join public.rfqs r on r.id = q.rfq_id
    order by q.created_at desc
    limit 10
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    into v_orders
  from (
    select order_no, status, total_amount, payment_term, created_at
    from public.orders
    order by created_at desc
    limit 10
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    into v_payments
  from (
    select p.id, o.order_no, p.direction, p.amount, p.status, p.created_at
    from public.payments p
    join public.orders o on o.id = p.order_id
    order by p.created_at desc
    limit 10
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    into v_reviews
  from (
    select rv.id, o.order_no, rv.rating, rv.status, rv.created_at
    from public.reviews rv
    join public.orders o on o.id = rv.order_id
    order by rv.created_at desc
    limit 10
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    into v_suppliers
  from (
    select slug, company_name, status, verification_level, province, updated_at
    from public.supplier_companies
    order by updated_at desc
    limit 10
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    into v_files
  from (
    select a.file_name, a.file_path, r.rfq_no, a.created_at
    from public.rfq_attachments a
    join public.rfqs r on r.id = a.rfq_id
    order by a.created_at desc
    limit 10
  ) t;

  return jsonb_build_object(
    'rfqs', v_rfqs,
    'quotes', v_quotes,
    'orders', v_orders,
    'payments', v_payments,
    'reviews', v_reviews,
    'suppliers', v_suppliers,
    'files', v_files
  );
end;
$$;

insert into public.system_settings (key, value, description, is_public)
values
  ('mvp_operational_rpc_version', '"20260710000000"', 'OEM Hub Thailand MVP operational RPC marker', true),
  ('mvp_platform_fee_rule', '{"fee_rate":0.10,"label":"Order Activation Fee"}', 'Configurable MVP platform fee rule used by operational RPC', false)
on conflict (key) do update
set value = excluded.value,
    description = excluded.description,
    updated_at = now();
