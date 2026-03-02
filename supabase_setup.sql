-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: rooms
create table if not exists public.rooms (
  id uuid default uuid_generate_v4() primary key,
  room_code text unique not null,
  visual_id text not null,
  participant_1_token text not null,
  participant_2_token text,
  status text not null default 'waiting',
  last_active timestamp with time zone default now(),
  delete_request_1 boolean default false,
  delete_request_2 boolean default false
);

-- Table: messages
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.rooms(id) on delete cascade not null,
  sender_token text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Table: security_logs
create table if not exists public.security_logs (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.rooms(id) on delete cascade not null,
  attempt_time timestamp with time zone default now()
);

-- Enable RLS
alter table public.rooms enable row level security;
alter table public.messages enable row level security;
alter table public.security_logs enable row level security;

-- Rooms Policies
-- Anyone can create a room (insert)
create policy "Allow insert on rooms" on public.rooms for insert with check (true);

-- Read only if participant 1, participant 2, or checking available rooms (participant 2 is null)
create policy "Allow select on rooms" on public.rooms for select using (
  participant_1_token = current_setting('request.headers', true)::json->>'x-primelink-token'
  or
  participant_2_token = current_setting('request.headers', true)::json->>'x-primelink-token'
  or
  participant_2_token is null 
);

-- Update only if participating or joining
create policy "Allow update on rooms" on public.rooms for update using (
  participant_1_token = current_setting('request.headers', true)::json->>'x-primelink-token'
  or
  participant_2_token = current_setting('request.headers', true)::json->>'x-primelink-token'
  or
  participant_2_token is null
);

-- Delete only if participating
create policy "Allow delete on rooms" on public.rooms for delete using (
  participant_1_token = current_setting('request.headers', true)::json->>'x-primelink-token'
  or
  participant_2_token = current_setting('request.headers', true)::json->>'x-primelink-token'
);

-- Messages Policies
create policy "Allow insert on messages" on public.messages for insert with check (
  sender_token = current_setting('request.headers', true)::json->>'x-primelink-token'
);

create policy "Allow select on messages" on public.messages for select using (
  exists (
    select 1 from public.rooms
    where id = room_id
    and (
      participant_1_token = current_setting('request.headers', true)::json->>'x-primelink-token'
      or
      participant_2_token = current_setting('request.headers', true)::json->>'x-primelink-token'
    )
  )
);

create policy "Allow delete on messages" on public.messages for delete using (
  sender_token = current_setting('request.headers', true)::json->>'x-primelink-token'
);

-- Security Logs Policies
create policy "Allow insert on security_logs" on public.security_logs for insert with check (true);

create policy "Allow select on security_logs" on public.security_logs for select using (
  exists (
    select 1 from public.rooms
    where id = room_id
    and (
      participant_1_token = current_setting('request.headers', true)::json->>'x-primelink-token'
      or
      participant_2_token = current_setting('request.headers', true)::json->>'x-primelink-token'
    )
  )
);

-- Enable Realtime for all tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.security_logs;
