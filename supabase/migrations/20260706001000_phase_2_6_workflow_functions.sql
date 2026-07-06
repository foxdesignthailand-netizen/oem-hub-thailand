-- OEM Hub Thailand Phase 2-6 workflow functions
-- These functions create a safe demo path for RFQ -> Quote -> Order -> Payment -> Completed -> Review.

create or replace function public.ensure_demo_user(p_email text, p_role public.user_role, p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  insert into public.users (email, role, status, metadata)
  values (p_email, p_role, 'APPROVED', jsonb_build_object('seed', 'phase_2_6_workflow'))
  on conflict (email) do update
  set role = excluded.role,
      status = 'APPROVED',
      updated_at = now()
  returning id into v_user_id;

  insert into public.user_profiles (user_id, display_name, company_name)
  values (v_user_id, p_name, p_name)
  on conflict (user_id) do update
  set display_name = excluded.display_name,
      company_name = excluded.company_name,
      updated_at = now();

  return v_user_id;
end;
$$;

create or replace function public.ensure_demo_category()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category_id uuid;
begin
  insert into public.categories (slug, name_th, name_en, description, status, is_active, is_featured, sort_order)
  values (
    'demo-skincare-packaging',
    'สกินแคร์และบรรจุภัณฑ์',
    'Skincare and Packaging',
    'Demo category for RFQ to Order workflow',
    'PUBLISHED',
    true,
    true,
    1
  )
  on conflict (slug) do update
  set name_th = excluded.name_th,
      status = 'PUBLISHED',
      is_active = true,
      updated_at = now()
  returning id into v_category_id;

  return v_category_id;
end;
$$;

create or replace function public.ensure_demo_supplier()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_supplier_user_id uuid;
  v_supplier_company_id uuid;
begin
  v_supplier_user_id := public.ensure_demo_user('supplier-demo@oemhub.local', 'SUPPLIER', 'Premium Factory Co., Ltd.');

  insert into public.supplier_companies (
    slug,
    owner_user_id,
    company_name,
    legal_name,
    description,
    province,
    status,
    verification_level,
    is_active,
    is_featured,
    approved_at
  )
  values (
    'premium-factory-demo',
    v_supplier_user_id,
    'Premium Factory Co., Ltd.',
    'Premium Factory Co., Ltd.',
    'Demo supplier for RFQ to Order workflow',
    'สมุทรปราการ',
    'APPROVED',
    'BUSINESS_VERIFIED',
    true,
    true,
    now()
  )
  on conflict (slug) do update
  set company_name = excluded.company_name,
      status = 'APPROVED',
      verification_level = 'BUSINESS_VERIFIED',
      is_active = true,
      updated_at = now()
  returning id into v_supplier_company_id;

  insert into public.supplier_members (supplier_company_id, user_id, member_role, status)
  values (v_supplier_company_id, v_supplier_user_id, 'OWNER', 'APPROVED')
  on conflict (supplier_company_id, user_id) do update
  set status = 'APPROVED',
      updated_at = now();

  return v_supplier_company_id;
end;
$$;

create or replace function public.oem_create_demo_rfq()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_buyer_id uuid;
  v_category_id uuid;
  v_rfq_id uuid;
begin
  v_buyer_id := public.ensure_demo_user('buyer-demo@oemhub.local', 'BUYER', 'Buyer Demo Co., Ltd.');
  v_category_id := public.ensure_demo_category();

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
    submitted_at
  )
  values (
    'RFQ-DEMO-SQL-0001',
    v_buyer_id,
    v_category_id,
    'ผลิตสกินแคร์ 3,000 ชิ้น พร้อมฉลากและกล่อง',
    'Demo RFQ สำหรับทดสอบ workflow จาก RFQ ไปจนถึง Review',
    'SUBMITTED',
    120000,
    180000,
    'Buyer Demo',
    'buyer-demo@oemhub.local',
    now()
  )
  on conflict (rfq_no) do update
  set status = 'SUBMITTED',
      updated_at = now()
  returning id into v_rfq_id;

  insert into public.rfq_items (rfq_id, product_name, product_type, quantity, unit, specs)
  values (v_rfq_id, 'Skincare set', 'Skincare', 3000, 'pcs', '{"standard":"GMP","packaging":"label and box"}'::jsonb)
  on conflict do nothing;

  insert into public.audit_logs (actor_user_id, actor_role, action, entity_type, entity_id, new_value)
  values (v_buyer_id, 'BUYER', 'RFQ_SUBMITTED', 'rfqs', v_rfq_id, jsonb_build_object('rfq_no', 'RFQ-DEMO-SQL-0001'));

  return jsonb_build_object('rfq_no', 'RFQ-DEMO-SQL-0001', 'rfq_id', v_rfq_id, 'status', 'SUBMITTED');
end;
$$;

create or replace function public.oem_send_demo_quote(p_rfq_no text default 'RFQ-DEMO-SQL-0001')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rfq public.rfqs%rowtype;
  v_supplier_company_id uuid;
  v_quote_id uuid;
begin
  select * into v_rfq from public.rfqs where rfq_no = p_rfq_no;
  if not found then
    raise exception 'RFQ not found: %', p_rfq_no;
  end if;

  v_supplier_company_id := public.ensure_demo_supplier();

  insert into public.quotes (
    quote_no,
    rfq_id,
    supplier_company_id,
    status,
    total_amount,
    payment_term,
    deposit_percent,
    lead_time_days,
    valid_until,
    note,
    sent_at
  )
  values (
    'Q-DEMO-SQL-0001',
    v_rfq.id,
    v_supplier_company_id,
    'SENT',
    158000,
    'DEPOSIT_FINAL',
    50,
    20,
    current_date + 14,
    'รวมผลิตสินค้า ฉลาก กล่อง และตรวจคุณภาพก่อนส่งมอบ',
    now()
  )
  on conflict (quote_no) do update
  set status = 'SENT',
      total_amount = excluded.total_amount,
      updated_at = now()
  returning id into v_quote_id;

  update public.rfqs
  set status = 'QUOTING',
      updated_at = now()
  where id = v_rfq.id;

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('SUPPLIER', 'QUOTE_SENT', 'quotes', v_quote_id, jsonb_build_object('quote_no', 'Q-DEMO-SQL-0001', 'rfq_no', p_rfq_no));

  return jsonb_build_object('quote_no', 'Q-DEMO-SQL-0001', 'quote_id', v_quote_id, 'status', 'SENT');
end;
$$;

create or replace function public.oem_accept_demo_quote(p_quote_no text default 'Q-DEMO-SQL-0001')
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
  v_order_no := 'ORD-DEMO-SQL-0001';

  update public.quotes
  set status = case when id = v_quote.id then 'ACCEPTED'::public.quote_status else 'DECLINED'::public.quote_status end,
      accepted_at = case when id = v_quote.id then now() else accepted_at end,
      updated_at = now()
  where rfq_id = v_quote.rfq_id;

  update public.rfqs
  set status = 'ORDER_CREATED',
      updated_at = now()
  where id = v_quote.rfq_id;

  insert into public.orders (
    order_no,
    rfq_id,
    quote_id,
    buyer_user_id,
    supplier_company_id,
    status,
    total_amount,
    payment_term,
    deposit_amount,
    final_amount,
    accepted_at
  )
  values (
    v_order_no,
    v_quote.rfq_id,
    v_quote.id,
    v_rfq.buyer_user_id,
    v_quote.supplier_company_id,
    'WAITING_BUYER_PAYMENT',
    v_quote.total_amount,
    v_quote.payment_term,
    case when v_quote.payment_term = 'DEPOSIT_FINAL' then round(v_quote.total_amount / 2, 2) else v_quote.total_amount end,
    case when v_quote.payment_term = 'DEPOSIT_FINAL' then round(v_quote.total_amount / 2, 2) else 0 end,
    now()
  )
  on conflict (quote_id) do update
  set status = 'WAITING_BUYER_PAYMENT',
      updated_at = now()
  returning id into v_order_id;

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('BUYER', 'QUOTE_ACCEPTED_ORDER_CREATED', 'orders', v_order_id, jsonb_build_object('order_no', v_order_no, 'quote_no', p_quote_no));

  return jsonb_build_object('order_no', v_order_no, 'order_id', v_order_id, 'status', 'WAITING_BUYER_PAYMENT');
end;
$$;

create or replace function public.oem_report_demo_buyer_payment(p_order_no text default 'ORD-DEMO-SQL-0001')
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

  insert into public.payments (order_id, payer_user_id, supplier_company_id, direction, amount, status, reported_at, metadata)
  values (
    v_order.id,
    v_order.buyer_user_id,
    v_order.supplier_company_id,
    'BUYER_TO_SUPPLIER',
    case when v_order.payment_term = 'DEPOSIT_FINAL' then v_order.deposit_amount else v_order.total_amount end,
    'REPORTED',
    now(),
    '{"note":"Buyer paid Supplier directly"}'::jsonb
  )
  returning id into v_payment_id;

  update public.orders
  set status = 'BUYER_PAYMENT_REPORTED',
      updated_at = now()
  where id = v_order.id;

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('BUYER', 'BUYER_PAYMENT_REPORTED', 'payments', v_payment_id, jsonb_build_object('order_no', p_order_no));

  return jsonb_build_object('payment_id', v_payment_id, 'order_no', p_order_no, 'status', 'BUYER_PAYMENT_REPORTED');
end;
$$;

create or replace function public.oem_confirm_demo_buyer_payment(p_order_no text default 'ORD-DEMO-SQL-0001')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_rule public.commission_rules%rowtype;
  v_fee_id uuid;
  v_fee_total numeric(14, 2);
begin
  select * into v_order from public.orders where order_no = p_order_no;
  if not found then
    raise exception 'Order not found: %', p_order_no;
  end if;

  select * into v_rule
  from public.commission_rules
  where status = 'APPROVED'
  order by created_at desc
  limit 1;

  if not found then
    raise exception 'No approved commission rule found.';
  end if;

  v_fee_total := round((v_order.total_amount * v_rule.fee_rate) + v_rule.fixed_amount, 2);

  update public.payments
  set status = 'CONFIRMED_BY_SUPPLIER',
      confirmed_at = now(),
      updated_at = now()
  where order_id = v_order.id
    and direction = 'BUYER_TO_SUPPLIER';

  insert into public.platform_fees (
    order_id,
    supplier_company_id,
    commission_rule_id,
    fee_base_amount,
    fee_rate,
    fixed_amount,
    fee_total,
    status,
    due_at
  )
  values (
    v_order.id,
    v_order.supplier_company_id,
    v_rule.id,
    v_order.total_amount,
    v_rule.fee_rate,
    v_rule.fixed_amount,
    v_fee_total,
    'WAITING_PAYMENT',
    now() + interval '3 days'
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

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('SUPPLIER', 'BUYER_PAYMENT_CONFIRMED_PLATFORM_FEE_CREATED', 'platform_fees', v_fee_id, jsonb_build_object('order_no', p_order_no, 'fee_total', v_fee_total));

  return jsonb_build_object('platform_fee_id', v_fee_id, 'order_no', p_order_no, 'status', 'WAITING_PLATFORM_FEE');
end;
$$;

create or replace function public.oem_report_demo_platform_fee(p_order_no text default 'ORD-DEMO-SQL-0001')
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

  insert into public.payments (order_id, supplier_company_id, direction, amount, status, reported_at, metadata)
  values (v_order.id, v_order.supplier_company_id, 'SUPPLIER_TO_PLATFORM', v_fee.fee_total, 'REPORTED', now(), '{"note":"Supplier paid Order Activation Fee"}'::jsonb)
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

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('SUPPLIER', 'PLATFORM_FEE_REPORTED', 'payments', v_payment_id, jsonb_build_object('order_no', p_order_no));

  return jsonb_build_object('payment_id', v_payment_id, 'order_no', p_order_no, 'status', 'PLATFORM_FEE_PAID');
end;
$$;

create or replace function public.oem_verify_demo_platform_fee(p_order_no text default 'ORD-DEMO-SQL-0001')
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
      verified_at = now(),
      updated_at = now()
  where order_id = v_order.id
    and direction = 'SUPPLIER_TO_PLATFORM';

  update public.orders
  set status = 'IN_PROGRESS',
      updated_at = now()
  where id = v_order.id;

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('ADMIN', 'PLATFORM_FEE_VERIFIED_ORDER_STARTED', 'orders', v_order.id, jsonb_build_object('order_no', p_order_no, 'status', 'IN_PROGRESS'));

  return jsonb_build_object('order_no', p_order_no, 'status', 'IN_PROGRESS');
end;
$$;

create or replace function public.oem_complete_demo_order(p_order_no text default 'ORD-DEMO-SQL-0001')
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

  insert into public.order_timeline_events (order_id, title, description, status, event_at)
  values (v_order.id, 'Order completed', 'Buyer accepted delivered work through OEM Hub Thailand', 'PUBLISHED', now());

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('BUYER', 'ORDER_COMPLETED', 'orders', v_order.id, jsonb_build_object('order_no', p_order_no, 'status', 'COMPLETED'));

  return jsonb_build_object('order_no', p_order_no, 'status', 'COMPLETED');
end;
$$;

create or replace function public.oem_create_demo_review(p_order_no text default 'ORD-DEMO-SQL-0001')
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
    raise exception 'Review can only be created from COMPLETED order.';
  end if;

  insert into public.reviews (order_id, reviewer_user_id, supplier_company_id, rating, comment, status, published_at)
  values (
    v_order.id,
    v_order.buyer_user_id,
    v_order.supplier_company_id,
    5,
    'งานเรียบร้อย ติดตามสถานะในระบบได้ดี และส่งมอบตามที่ตกลง',
    'PUBLISHED',
    now()
  )
  on conflict (order_id) do update
  set rating = excluded.rating,
      comment = excluded.comment,
      status = 'PUBLISHED',
      updated_at = now()
  returning id into v_review_id;

  insert into public.audit_logs (actor_role, action, entity_type, entity_id, new_value)
  values ('BUYER', 'REVIEW_CREATED', 'reviews', v_review_id, jsonb_build_object('order_no', p_order_no, 'rating', 5));

  return jsonb_build_object('review_id', v_review_id, 'order_no', p_order_no, 'status', 'PUBLISHED');
end;
$$;

insert into public.system_settings (key, value, description, is_public)
values (
  'phase_2_6_workflow_version',
  '"20260706001000"',
  'OEM Hub Thailand Phase 2-6 workflow RPC marker',
  true
)
on conflict (key) do update
set value = excluded.value,
    description = excluded.description,
    is_public = excluded.is_public,
    updated_at = now();
