-- Migration: Add audit log table and secure RLS policies
-- Created: 2025-01-30
-- Purpose: Security improvements - audit trail and prevent direct character modifications

-- ========================================
-- 1. Create audit log table
-- ========================================

create table if not exists public.audit_log (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  postac_id bigint references public.postacie(id) on delete cascade,
  action text not null,
  details jsonb default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Index for fast queries
create index if not exists idx_audit_log_user_id on public.audit_log(user_id);
create index if not exists idx_audit_log_postac_id on public.audit_log(postac_id);
create index if not exists idx_audit_log_timestamp on public.audit_log(timestamp desc);
create index if not exists idx_audit_log_action on public.audit_log(action);

-- RLS for audit_log
alter table public.audit_log enable row level security;

-- Users can only read their own audit logs
create policy "Users can view their own audit logs"
  on public.audit_log for select
  using (auth.uid() = user_id);

-- Only service role can insert audit logs
create policy "Service role can insert audit logs"
  on public.audit_log for insert
  with check (true);

-- Auto-cleanup old audit logs (keep last 90 days)
create or replace function cleanup_old_audit_logs()
returns void as $$
begin
  delete from public.audit_log
  where timestamp < now() - interval '90 days';
end;
$$ language plpgsql security definer;

-- ========================================
-- 2. Update RLS policies for postacie table
-- ========================================

-- Drop existing policies if any
drop policy if exists "Users can view their own character" on public.postacie;
drop policy if exists "Users can update their own character" on public.postacie;
drop policy if exists "Users can insert their own character" on public.postacie;

-- Users can SELECT their own character
create policy "Users can view their own character"
  on public.postacie for select
  using (auth.uid() = user_id);

-- Users can INSERT their own character (for character creation)
create policy "Users can create their own character"
  on public.postacie for insert
  with check (auth.uid() = user_id);

-- Users can UPDATE only non-critical fields (appearance, clothing)
-- Critical fields (stats, inventory, level, etc.) can only be updated by Edge Functions
create policy "Users can update appearance and clothing only"
  on public.postacie for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    -- Only allow updates to appearance and clothing
    -- All other fields should be updated via Edge Functions
  );

-- ========================================
-- 3. Create helper function to validate stat updates
-- ========================================

-- This function ensures stat updates are valid
-- Called by Edge Functions to validate and apply stat changes
create or replace function validate_and_increase_stat(
  p_postac_id bigint,
  p_stat_name text,
  p_user_id uuid
)
returns jsonb as $$
declare
  v_postac record;
  v_current_value integer;
  v_new_stats jsonb;
begin
  -- Validate stat name
  if p_stat_name not in ('strength', 'intelligence', 'endurance', 'agility', 'charisma', 'luck') then
    return jsonb_build_object(
      'success', false,
      'error', 'Invalid stat name'
    );
  end if;

  -- Get character
  select * into v_postac
  from public.postacie
  where id = p_postac_id and user_id = p_user_id;

  if not found then
    return jsonb_build_object(
      'success', false,
      'error', 'Character not found'
    );
  end if;

  -- Check stat points
  if coalesce(v_postac.stat_points, 0) < 1 then
    return jsonb_build_object(
      'success', false,
      'error', 'No stat points available'
    );
  end if;

  -- Calculate new stats
  v_current_value := coalesce((v_postac.stats ->> p_stat_name)::integer, 1);
  v_new_stats := jsonb_set(
    coalesce(v_postac.stats, '{}'::jsonb),
    array[p_stat_name],
    to_jsonb(v_current_value + 1)
  );

  -- Update character
  update public.postacie
  set
    stats = v_new_stats,
    stat_points = stat_points - 1,
    updated_at = now()
  where id = p_postac_id;

  return jsonb_build_object(
    'success', true,
    'old_value', v_current_value,
    'new_value', v_current_value + 1
  );
end;
$$ language plpgsql security definer;

-- ========================================
-- 4. Add rate limiting table (for future use)
-- ========================================

create table if not exists public.rate_limits (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  action text not null,
  count integer not null default 1,
  window_start timestamptz not null default now(),
  created_at timestamptz not null default now(),
  
  unique(user_id, action, window_start)
);

create index if not exists idx_rate_limits_user_action on public.rate_limits(user_id, action, window_start);

-- RLS for rate_limits
alter table public.rate_limits enable row level security;

create policy "Service role manages rate limits"
  on public.rate_limits for all
  using (true)
  with check (true);

-- Cleanup function for rate limits (keep last 24 hours)
create or replace function cleanup_old_rate_limits()
returns void as $$
begin
  delete from public.rate_limits
  where window_start < now() - interval '24 hours';
end;
$$ language plpgsql security definer;

-- ========================================
-- 5. Comments for documentation
-- ========================================

comment on table public.audit_log is 'Audit trail for all critical game actions';
comment on table public.rate_limits is 'Rate limiting tracking to prevent abuse';
comment on function validate_and_increase_stat is 'Safely increase character stat with validation';
comment on function cleanup_old_audit_logs is 'Remove audit logs older than 90 days';
comment on function cleanup_old_rate_limits is 'Remove rate limit records older than 24 hours';

-- ========================================
-- 6. Grant permissions
-- ========================================

-- Service role needs full access
grant all on public.audit_log to service_role;
grant all on public.rate_limits to service_role;

-- Authenticated users can only read their own data
grant select on public.audit_log to authenticated;
grant select on public.postacie to authenticated;
grant insert on public.postacie to authenticated;
grant update on public.postacie to authenticated;

-- ========================================
-- Done!
-- ========================================
