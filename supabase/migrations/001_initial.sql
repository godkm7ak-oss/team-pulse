-- TeamPulse v2 — Initial Schema
-- Run this in Supabase SQL Editor or via supabase db push

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────

create table if not exists public.companies (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  join_code        text not null unique,
  plan             text not null default 'trial' check (plan in ('trial','starter','pro','business')),
  plan_expires_at  timestamptz,
  owner_id         uuid references auth.users on delete set null,
  office_lat       float8 not null default 13.7563,
  office_lng       float8 not null default 100.5018,
  office_radius_m  int    not null default 200,
  stripe_customer_id text,
  created_at       timestamptz not null default now()
);

create table if not exists public.employees (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references auth.users on delete cascade,
  company_id     uuid not null references public.companies on delete cascade,
  employee_code  text not null,
  full_name      text not null,
  email          text not null,
  role           text not null default 'employee' check (role in ('employee','admin','owner')),
  status         text not null default 'active' check (status in ('active','inactive')),
  created_at     timestamptz not null default now(),
  unique (company_id, employee_code),
  unique (company_id, email)
);

create table if not exists public.leave_requests (
  id            uuid primary key default uuid_generate_v4(),
  employee_id   uuid not null references public.employees on delete cascade,
  company_id    uuid not null references public.companies on delete cascade,
  leave_type    text not null check (leave_type in ('sick','annual','personal','emergency')),
  start_date    date not null,
  end_date      date not null,
  reason        text,
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by   uuid references public.employees on delete set null,
  created_at    timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists public.attendance (
  id            uuid primary key default uuid_generate_v4(),
  employee_id   uuid not null references public.employees on delete cascade,
  company_id    uuid not null references public.companies on delete cascade,
  check_in_at   timestamptz not null default now(),
  check_out_at  timestamptz,
  method        text not null default 'gps' check (method in ('gps','qr')),
  location      jsonb,
  is_late       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index if not exists idx_employees_company    on public.employees(company_id);
create index if not exists idx_employees_user       on public.employees(user_id);
create index if not exists idx_employees_code       on public.employees(company_id, employee_code);
create index if not exists idx_leave_company        on public.leave_requests(company_id);
create index if not exists idx_leave_employee       on public.leave_requests(employee_id);
create index if not exists idx_attendance_company   on public.attendance(company_id);
create index if not exists idx_attendance_employee  on public.attendance(employee_id);
create index if not exists idx_attendance_date      on public.attendance(check_in_at);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table public.companies      enable row level security;
alter table public.employees      enable row level security;
alter table public.leave_requests enable row level security;
alter table public.attendance     enable row level security;

-- Helper: get the authenticated user's company_id
create or replace function public.my_company_id()
returns uuid language sql stable security definer as $$
  select company_id from public.employees where user_id = auth.uid() limit 1;
$$;

-- Helper: get the authenticated user's role
create or replace function public.my_role()
returns text language sql stable security definer as $$
  select role from public.employees where user_id = auth.uid() limit 1;
$$;

-- Helper: get the authenticated user's employee id
create or replace function public.my_employee_id()
returns uuid language sql stable security definer as $$
  select id from public.employees where user_id = auth.uid() limit 1;
$$;

-- COMPANIES
drop policy if exists "Company members can read their company" on public.companies;
create policy "Company members can read their company"
  on public.companies for select
  using (id = public.my_company_id());

drop policy if exists "Owner/admin can update company" on public.companies;
create policy "Owner/admin can update company"
  on public.companies for update
  using (id = public.my_company_id() and public.my_role() in ('owner','admin'));

drop policy if exists "Authenticated users can insert a company" on public.companies;
create policy "Authenticated users can insert a company"
  on public.companies for insert
  with check (auth.uid() is not null);

-- EMPLOYEES
drop policy if exists "Employees can read same company" on public.employees;
create policy "Employees can read same company"
  on public.employees for select
  using (company_id = public.my_company_id());

drop policy if exists "Admin/owner can insert employees" on public.employees;
create policy "Admin/owner can insert employees"
  on public.employees for insert
  with check (
    company_id = public.my_company_id()
    and public.my_role() in ('owner','admin')
  );

drop policy if exists "Admin/owner can update employees" on public.employees;
create policy "Admin/owner can update employees"
  on public.employees for update
  using (
    company_id = public.my_company_id()
    and public.my_role() in ('owner','admin')
  );

drop policy if exists "Own employee row insert on signup" on public.employees;
create policy "Own employee row insert on signup"
  on public.employees for insert
  with check (user_id = auth.uid());

-- LEAVE REQUESTS
drop policy if exists "Employees see own company leave" on public.leave_requests;
create policy "Employees see own company leave"
  on public.leave_requests for select
  using (company_id = public.my_company_id());

drop policy if exists "Employee can insert own leave" on public.leave_requests;
create policy "Employee can insert own leave"
  on public.leave_requests for insert
  with check (
    company_id = public.my_company_id()
    and employee_id = public.my_employee_id()
  );

drop policy if exists "Admin/owner can update leave status" on public.leave_requests;
create policy "Admin/owner can update leave status"
  on public.leave_requests for update
  using (
    company_id = public.my_company_id()
    and public.my_role() in ('owner','admin')
  );

-- ATTENDANCE
drop policy if exists "Company members can read attendance" on public.attendance;
create policy "Company members can read attendance"
  on public.attendance for select
  using (company_id = public.my_company_id());

drop policy if exists "Employee inserts own attendance" on public.attendance;
create policy "Employee inserts own attendance"
  on public.attendance for insert
  with check (
    company_id = public.my_company_id()
    and employee_id = public.my_employee_id()
  );

drop policy if exists "Employee updates own check_out" on public.attendance;
create policy "Employee updates own check_out"
  on public.attendance for update
  using (employee_id = public.my_employee_id());

-- ─────────────────────────────────────────────
-- TRIGGER: create company + employee after signup
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  _company_id uuid;
  _company_name text;
  _join_code text;
begin
  -- Only create company if metadata has company_name
  _company_name := new.raw_user_meta_data->>'company_name';
  if _company_name is null or _company_name = '' then
    return new;
  end if;

  -- Generate unique 6-char join code
  loop
    _join_code := upper(substring(md5(random()::text), 1, 6));
    exit when not exists (select 1 from public.companies where join_code = _join_code);
  end loop;

  -- Insert company
  insert into public.companies (name, join_code, owner_id)
  values (_company_name, _join_code, new.id)
  returning id into _company_id;

  -- Insert owner as employee
  insert into public.employees (user_id, company_id, employee_code, full_name, email, role)
  values (
    new.id,
    _company_id,
    'EMP001',
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'owner'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
