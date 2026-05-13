-- ────────────────────────────────────────────────────────────────
-- Admin fatturazione elettronica — schema iniziale
-- Spec: docs/superpowers/specs/2026-05-13-admin-fatturazione-design.md
-- ────────────────────────────────────────────────────────────────

-- 1. admin_settings (singleton)
create table admin_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default '',
  legal_name text,
  vat_number text not null default '',
  tax_code text not null default '',
  address text not null default '',
  city text not null default '',
  zip text not null default '',
  province text not null default '',
  country text not null default 'IT',
  iban text not null default '',
  swift text,
  bank_name text,
  pec_email text,
  sdi_code text,
  regime_fiscale text not null default 'RF19',
  bollo_threshold_cents int not null default 7747,
  bollo_amount_cents int not null default 200,
  min_installment_cents int not null default 50000,
  fic_company_id text,
  fic_access_token text,
  fic_refresh_token text,
  fic_token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index admin_settings_singleton on admin_settings ((true));

-- 2. clients
create table clients (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('individual','business','pa')),
  display_name text not null,
  legal_name text,
  vat_number text,
  tax_code text,
  address text not null,
  city text not null,
  zip text not null,
  province text not null,
  country text not null default 'IT',
  pec_email text,
  sdi_code text default '0000000',
  contact_email text,
  contact_phone text,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index clients_kind_archived_idx on clients (kind) where archived_at is null;
create index clients_search_idx on clients
  using gin (to_tsvector('italian',
    coalesce(display_name,'') || ' ' || coalesce(legal_name,'') || ' ' ||
    coalesce(vat_number,'') || ' ' || coalesce(tax_code,'')));

-- 3. documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('quote','invoice')),
  number text,
  fiscal_year int,
  sequence int,
  issue_date date not null default current_date,
  due_date date,
  client_id uuid not null references clients(id) on delete restrict,
  client_snapshot jsonb not null,
  status text not null default 'draft' check (status in (
    'draft','issued','sent_sdi','delivered_sdi','rejected_sdi','partially_paid','paid','cancelled'
  )),
  sdi_id_fic text,
  sdi_message text,
  subtotal_cents int not null default 0,
  bollo_cents int not null default 0,
  total_cents int not null default 0,
  currency text not null default 'EUR',
  payment_method text,
  payment_terms text,
  notes_to_client text,
  internal_notes text,
  pdf_storage_path text,
  xml_storage_path text,
  converted_from_id uuid references documents(id),
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (kind, fiscal_year, sequence)
);
create index documents_kind_status_idx on documents (kind, status);
create index documents_fiscal_year_idx on documents (fiscal_year, kind, sequence);
create index documents_client_idx on documents (client_id);

-- 4. document_items
create table document_items (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  position int not null,
  description text not null,
  quantity numeric(10,3) not null default 1,
  unit_price_cents int not null,
  line_total_cents int not null,
  vat_code text not null default 'N2.2',
  unique (document_id, position)
);

-- 5. document_installments (rate)
create table document_installments (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  position int not null,
  due_date date not null,
  amount_cents int not null,
  paid_at timestamptz,
  payment_reference text,
  unique (document_id, position)
);
create index document_installments_unpaid_idx on document_installments (due_date)
  where paid_at is null;

-- 6. document_sequences
create table document_sequences (
  kind text not null,
  fiscal_year int not null,
  last_seq int not null default 0,
  primary key (kind, fiscal_year)
);

-- 7. RPC: numerazione atomica
create or replace function next_document_number(p_kind text, p_year int)
returns int
language plpgsql
security definer
as $$
declare
  v_seq int;
begin
  insert into document_sequences (kind, fiscal_year, last_seq)
    values (p_kind, p_year, 1)
  on conflict (kind, fiscal_year)
    do update set last_seq = document_sequences.last_seq + 1
  returning last_seq into v_seq;
  return v_seq;
end;
$$;

-- 8. RLS — solo l'admin (email = ADMIN_EMAIL hardcoded qui).
alter table admin_settings enable row level security;
alter table clients enable row level security;
alter table documents enable row level security;
alter table document_items enable row level security;
alter table document_installments enable row level security;
alter table document_sequences enable row level security;

create policy admin_full on admin_settings for all to authenticated
  using (auth.jwt()->>'email' = 'luca.perullo@icloud.com')
  with check (auth.jwt()->>'email' = 'luca.perullo@icloud.com');
create policy admin_full on clients for all to authenticated
  using (auth.jwt()->>'email' = 'luca.perullo@icloud.com')
  with check (auth.jwt()->>'email' = 'luca.perullo@icloud.com');
create policy admin_full on documents for all to authenticated
  using (auth.jwt()->>'email' = 'luca.perullo@icloud.com')
  with check (auth.jwt()->>'email' = 'luca.perullo@icloud.com');
create policy admin_full on document_items for all to authenticated
  using (auth.jwt()->>'email' = 'luca.perullo@icloud.com')
  with check (auth.jwt()->>'email' = 'luca.perullo@icloud.com');
create policy admin_full on document_installments for all to authenticated
  using (auth.jwt()->>'email' = 'luca.perullo@icloud.com')
  with check (auth.jwt()->>'email' = 'luca.perullo@icloud.com');
create policy admin_full on document_sequences for all to authenticated
  using (auth.jwt()->>'email' = 'luca.perullo@icloud.com')
  with check (auth.jwt()->>'email' = 'luca.perullo@icloud.com');

-- 9. Seed singleton admin_settings
insert into admin_settings (business_name) values ('') on conflict do nothing;

-- 10. trigger updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger trg_admin_settings_updated before update on admin_settings
  for each row execute function set_updated_at();
create trigger trg_clients_updated before update on clients
  for each row execute function set_updated_at();
create trigger trg_documents_updated before update on documents
  for each row execute function set_updated_at();
