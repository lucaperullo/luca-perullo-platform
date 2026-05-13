# Admin fatturazione elettronica — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere `/admin` accessibile solo a `luca.perullo@icloud.com` per gestire preventivi e fatture (regime forfettario RF19) con trasmissione SDI via Fatture in Cloud, dati canonical in Supabase, PDF/XML generati in casa.

**Architecture:** Server-rendered Next.js 16 admin dietro Supabase magic-link + email gate. CRUD su tabelle `admin_settings`/`clients`/`documents`/`document_items` in Supabase con RLS. Numerazione atomica via RPC PostgreSQL. Issue → genera PDF (@react-pdf/renderer) + XML FatturaPA → POST a Fatture in Cloud → trasmissione SDI → webhook FiC aggiorna stato. Storage privato Supabase per PDF/XML.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase (Postgres + Storage + Auth), Tailwind v4, `@react-pdf/renderer`, `vitest` per i test, Fatture in Cloud REST API v2.

**Reference spec:** `docs/superpowers/specs/2026-05-13-admin-fatturazione-design.md` — leggere prima di iniziare.

---

## Riferimenti veloci

- Esempio API route esistente: `src/app/api/profile/update/route.ts` (pattern: `runtime = "nodejs"`, `createServerClient()`, JSON validation, `NextResponse.json`).
- Esempio page con auth gate: `src/app/profilo/page.tsx`.
- Supabase server client: `src/lib/supabase/server.ts` (`createServerClient`, `createServiceRoleClient`).
- Design tokens (Tailwind v4 + CSS vars): `src/app/globals.css` (`bg-bg`, `text-fg`, `text-fg-muted`, `border-border`, `font-mono`, `--container-prose: 672px`, `--container-frame: 800px`).
- Italiano in tutta la UI utente.

---

Ho spezzato il piano in 18 task. Ogni task produce un commit (o più). Le sezioni successive di questo file conterranno i dettagli delle task.

## Task 0: Setup test infrastructure (vitest)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/admin/__tests__/_setup-smoke.test.ts`

- [ ] **Step 1: Add vitest deps**

```bash
npm install -D vitest @vitest/ui happy-dom
```

- [ ] **Step 2: Add `test` script to package.json**

In `package.json`, add to `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

- [ ] **Step 4: Write smoke test**

`src/lib/admin/__tests__/_setup-smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("vitest setup", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run and verify pass**

```bash
npm test
```
Expected: 1 file, 1 test passed.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/admin/__tests__/_setup-smoke.test.ts
git commit -m "chore(test): setup vitest with smoke test"
```

---

## Task 1: Env vars + `requireAdmin()` + admin layout 404 gate

**Files:**
- Modify: `.env.example`, `.env.local`
- Create: `src/lib/admin/auth.ts`
- Create: `src/lib/admin/__tests__/auth.test.ts`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Add `ADMIN_EMAIL` to `.env.example`**

Append to `.env.example`:

```bash

# ── Admin gate ────────────────────────────────────────────────────
# Email dell'unico utente che può accedere a /admin (fatturazione).
# Lower/uppercase non conta — confronto case-insensitive.
ADMIN_EMAIL=luca.perullo@icloud.com
```

- [ ] **Step 2: Add same to `.env.local`** (real value)

Append to `.env.local`:

```bash
ADMIN_EMAIL=luca.perullo@icloud.com
```

- [ ] **Step 3: Test for `isAdminEmail()` helper**

`src/lib/admin/__tests__/auth.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isAdminEmail } from "../auth";

describe("isAdminEmail", () => {
  const originalEnv = process.env.ADMIN_EMAIL;
  beforeEach(() => { process.env.ADMIN_EMAIL = "Luca.Perullo@icloud.com"; });
  afterEach(() => { process.env.ADMIN_EMAIL = originalEnv; });

  it("matches case-insensitively", () => {
    expect(isAdminEmail("luca.perullo@icloud.com")).toBe(true);
    expect(isAdminEmail("LUCA.PERULLO@ICLOUD.COM")).toBe(true);
  });
  it("rejects other emails", () => {
    expect(isAdminEmail("foo@bar.com")).toBe(false);
  });
  it("rejects null/undefined/empty", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });
  it("throws if ADMIN_EMAIL env missing", () => {
    delete process.env.ADMIN_EMAIL;
    expect(() => isAdminEmail("foo")).toThrow(/ADMIN_EMAIL/);
  });
});
```

- [ ] **Step 4: Run test, expect FAIL**

```bash
npm test -- src/lib/admin/__tests__/auth.test.ts
```
Expected: cannot find module `../auth`.

- [ ] **Step 5: Create `src/lib/admin/auth.ts`**

```ts
import "server-only";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error("[admin/auth] ADMIN_EMAIL env var non configurata");
  }
  if (!email) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Garantisce che chi chiama sia l'admin. Se no, 404 (non redirect:
 * non vogliamo rivelare l'esistenza di /admin a chi non c'entra).
 */
export async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    notFound();
  }
  return { user: user!, supabase };
}
```

- [ ] **Step 6: Run test, expect PASS**

```bash
npm test -- src/lib/admin/__tests__/auth.test.ts
```
Expected: 4 tests passed.

- [ ] **Step 7: Create admin layout**

`src/app/admin/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin · Luca Perullo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="mx-auto w-full max-w-[var(--container-frame)] px-4 sm:px-6">
      {children}
    </div>
  );
}
```

- [ ] **Step 8: Create dashboard placeholder page**

`src/app/admin/page.tsx`:

```tsx
export default function AdminDashboardPage() {
  return (
    <div className="py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
        Admin
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">
        Dashboard
      </h1>
      <p className="mt-4 text-[14px] text-fg-muted">
        Placeholder. KPI e ultimi documenti arrivano nel Task 16.
      </p>
    </div>
  );
}
```

- [ ] **Step 9: Manual smoke (dev server)**

```bash
npm run dev
```
- Visita `http://localhost:3000/admin` da finestra in incognito (non loggato): aspettati 404.
- Login come `luca.perullo@icloud.com` via `/accedi`, poi `/admin`: aspettati la dashboard placeholder.
- Login come altra email (se hai un secondo account di test): aspettati 404.

- [ ] **Step 10: Commit**

```bash
git add .env.example src/lib/admin/auth.ts src/lib/admin/__tests__/auth.test.ts src/app/admin/layout.tsx src/app/admin/page.tsx
git commit -m "feat(admin): email gate + layout 404 + dashboard placeholder"
```

---

## Task 2: Database migration (tables, RPC, RLS, storage)

**Files:**
- Create: `supabase/migrations/2026_05_13_admin_fatturazione.sql`
- Create: `docs/admin/setup.md` (note operative)

- [ ] **Step 1: Crea cartella migrazioni se manca**

```bash
mkdir -p supabase/migrations
ls supabase/migrations
```

- [ ] **Step 2: Scrivi la migrazione**

`supabase/migrations/2026_05_13_admin_fatturazione.sql`:

```sql
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
-- L'email è embeddata nella policy per semplicità: se cambi admin
-- cambi questa policy via nuova migrazione.
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
```

- [ ] **Step 3: Bucket Storage `fiscal-documents`**

Su Supabase Studio (UI web): Storage → New bucket → Name: `fiscal-documents`, Public: **off**, File size limit: 10MB, Allowed MIME types: `application/pdf,application/xml,text/xml`.

Poi su SQL editor incolla:

```sql
-- Bucket policies (storage.objects)
create policy "admin reads fiscal-documents" on storage.objects
  for select to authenticated
  using (bucket_id = 'fiscal-documents'
         and auth.jwt()->>'email' = 'luca.perullo@icloud.com');

create policy "admin writes fiscal-documents" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fiscal-documents'
              and auth.jwt()->>'email' = 'luca.perullo@icloud.com');
```

- [ ] **Step 4: Applica la migrazione su Supabase**

Apri Supabase Studio → SQL editor → incolla il contenuto di `supabase/migrations/2026_05_13_admin_fatturazione.sql` → Run.
Verifica in Table editor che esistano: `admin_settings` (1 riga), `clients`, `documents`, `document_items`, `document_sequences`.

- [ ] **Step 5: Sanity check RPC**

Sempre in SQL editor:

```sql
select next_document_number('invoice', 2026);
-- Expected: 1
select next_document_number('invoice', 2026);
-- Expected: 2
delete from document_sequences;  -- reset
```

- [ ] **Step 6: Crea note operative**

`docs/admin/setup.md`:

```markdown
# Setup admin fatturazione

Procedura una-tantum per attivare /admin in produzione.

## 1. Migrazione DB

Esegui `supabase/migrations/2026_05_13_admin_fatturazione.sql` sul progetto Supabase di produzione (Studio → SQL editor → Run).

## 2. Bucket Storage

Crea bucket privato `fiscal-documents` (vedi Step 3 della migration). Applica le policies.

## 3. Env vars (Vercel)

Aggiungi:
- `ADMIN_EMAIL=luca.perullo@icloud.com`
- `FIC_CLIENT_ID`, `FIC_CLIENT_SECRET`, `FIC_REDIRECT_URI`, `FIC_WEBHOOK_SECRET` (popolati nel Task 12)

## 4. Compila anagrafica

Login come admin, vai a `/admin/impostazioni`, compila anagrafica e IBAN, click "Connetti Fatture in Cloud".

## 5. Webhook FiC

Su FiC dashboard → Sviluppatori → Webhook: URL `https://lucaperullo.it/api/admin/webhooks/fatture-in-cloud`, evento "Documento — cambio stato SDI". Copia il secret in `FIC_WEBHOOK_SECRET`.
```

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/2026_05_13_admin_fatturazione.sql docs/admin/setup.md
git commit -m "feat(admin): db migration + storage policies + setup notes"
```

---

## Task 3: Validators (P.IVA, CF, codice destinatario, CAP, IBAN)

**Files:**
- Create: `src/lib/admin/validators.ts`
- Create: `src/lib/admin/__tests__/validators.test.ts`

- [ ] **Step 1: Test sui validatori**

`src/lib/admin/__tests__/validators.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  isValidPartitaIva,
  isValidCodiceFiscale,
  isValidCodiceDestinatario,
  isValidCap,
  isValidIban,
} from "../validators";

describe("isValidPartitaIva", () => {
  it("accepts valid", () => {
    expect(isValidPartitaIva("00743110157")).toBe(true);  // FIAT
    expect(isValidPartitaIva("IT00743110157")).toBe(true);
  });
  it("rejects invalid", () => {
    expect(isValidPartitaIva("12345678901")).toBe(false);
    expect(isValidPartitaIva("0074311015")).toBe(false);   // 10 cifre
    expect(isValidPartitaIva("abcdefghijk")).toBe(false);
    expect(isValidPartitaIva("")).toBe(false);
  });
});

describe("isValidCodiceFiscale", () => {
  it("accepts valid 16-char personal CF", () => {
    expect(isValidCodiceFiscale("RSSMRA80A01H501U")).toBe(true);
  });
  it("accepts 11-digit CF (giuridico)", () => {
    expect(isValidCodiceFiscale("00743110157")).toBe(true);
  });
  it("rejects invalid", () => {
    expect(isValidCodiceFiscale("RSSMRA80A01H501Z")).toBe(false);
    expect(isValidCodiceFiscale("ABC")).toBe(false);
    expect(isValidCodiceFiscale("")).toBe(false);
  });
});

describe("isValidCodiceDestinatario", () => {
  it("accepts 7 alphanumeric", () => {
    expect(isValidCodiceDestinatario("ABCDEF1")).toBe(true);
    expect(isValidCodiceDestinatario("0000000")).toBe(true);
  });
  it("rejects wrong length / chars", () => {
    expect(isValidCodiceDestinatario("ABC")).toBe(false);
    expect(isValidCodiceDestinatario("ABCDEFGH")).toBe(false);
    expect(isValidCodiceDestinatario("ABC-DEF")).toBe(false);
  });
});

describe("isValidCap", () => {
  it("5 digits", () => {
    expect(isValidCap("00100")).toBe(true);
    expect(isValidCap("80138")).toBe(true);
  });
  it("rejects others", () => {
    expect(isValidCap("1234")).toBe(false);
    expect(isValidCap("123456")).toBe(false);
    expect(isValidCap("ABCDE")).toBe(false);
  });
});

describe("isValidIban", () => {
  it("accepts valid IT", () => {
    expect(isValidIban("IT60X0542811101000000123456")).toBe(true);
  });
  it("rejects invalid checksum", () => {
    expect(isValidIban("IT60X0542811101000000123457")).toBe(false);
  });
  it("ignores whitespace", () => {
    expect(isValidIban("IT60 X054 2811 1010 0000 0123 456")).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect FAIL**

```bash
npm test -- src/lib/admin/__tests__/validators.test.ts
```

- [ ] **Step 3: Implement**

`src/lib/admin/validators.ts`:

```ts
/** P.IVA: 11 cifre, controllo modulo 10 (Luhn-like italiano). */
export function isValidPartitaIva(input: string): boolean {
  const s = input.replace(/^IT/i, "").trim();
  if (!/^\d{11}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    let n = parseInt(s[i]!, 10);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

const CF_ODD: Record<string, number> = {
  "0":1,"1":0,"2":5,"3":7,"4":9,"5":13,"6":15,"7":17,"8":19,"9":21,
  A:1,B:0,C:5,D:7,E:9,F:13,G:15,H:17,I:19,J:21,K:2,L:4,M:18,N:20,
  O:11,P:3,Q:6,R:8,S:12,T:14,U:16,V:10,W:22,X:25,Y:24,Z:23,
};
const CF_EVEN: Record<string, number> = {
  "0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,
  A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,
  O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,
};
const CF_CTRL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** CF: 16 char personali (con controllo) o 11 cifre (giuridico = P.IVA). */
export function isValidCodiceFiscale(input: string): boolean {
  const s = input.toUpperCase().trim();
  if (/^\d{11}$/.test(s)) return isValidPartitaIva(s);
  if (!/^[A-Z0-9]{16}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const ch = s[i]!;
    sum += (i % 2 === 0 ? CF_ODD[ch] : CF_EVEN[ch]) ?? 0;
  }
  return CF_CTRL[sum % 26] === s[15];
}

export function isValidCodiceDestinatario(input: string): boolean {
  return /^[A-Z0-9]{7}$/.test(input.toUpperCase());
}

export function isValidCap(input: string): boolean {
  return /^\d{5}$/.test(input);
}

/** IBAN: validazione checksum mod-97. */
export function isValidIban(input: string): boolean {
  const s = input.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(s) || s.length < 15 || s.length > 34) {
    return false;
  }
  const rearranged = s.slice(4) + s.slice(0, 4);
  const expanded = rearranged
    .split("")
    .map(ch => /[A-Z]/.test(ch) ? (ch.charCodeAt(0) - 55).toString() : ch)
    .join("");
  // mod 97 a chunk per evitare BigInt overflow
  let remainder = 0;
  for (let i = 0; i < expanded.length; i += 7) {
    remainder = parseInt(String(remainder) + expanded.substr(i, 7), 10) % 97;
  }
  return remainder === 1;
}
```

- [ ] **Step 4: Run, expect PASS**

```bash
npm test -- src/lib/admin/__tests__/validators.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/validators.ts src/lib/admin/__tests__/validators.test.ts
git commit -m "feat(admin): fiscal validators (P.IVA, CF, codice dest, CAP, IBAN)"
```

---

## Task 4: Totals computation (forfettario-aware)

**Files:**
- Create: `src/lib/admin/totals.ts`
- Create: `src/lib/admin/__tests__/totals.test.ts`

- [ ] **Step 1: Test**

```ts
import { describe, it, expect } from "vitest";
import { computeTotals, computeLineTotal } from "../totals";

const settings = { bollo_threshold_cents: 7747, bollo_amount_cents: 200 };

describe("computeLineTotal", () => {
  it("multiplies quantity * unit_price (centesimi)", () => {
    expect(computeLineTotal({ quantity: 2, unit_price_cents: 5000 })).toBe(10000);
  });
  it("rounds to nearest centesimo", () => {
    expect(computeLineTotal({ quantity: 1.5, unit_price_cents: 333 })).toBe(500);
    expect(computeLineTotal({ quantity: 0.1, unit_price_cents: 333 })).toBe(33);
  });
});

describe("computeTotals (forfettario)", () => {
  it("subtotale + bollo se > soglia", () => {
    const items = [{ line_total_cents: 100000 }];
    expect(computeTotals(items, settings)).toEqual({
      subtotal_cents: 100000, bollo_cents: 200, total_cents: 100200,
    });
  });
  it("nessun bollo sotto soglia", () => {
    const items = [{ line_total_cents: 5000 }];
    expect(computeTotals(items, settings)).toEqual({
      subtotal_cents: 5000, bollo_cents: 0, total_cents: 5000,
    });
  });
  it("sopra soglia esatta (€77.47 = 7747 centesimi)", () => {
    const items = [{ line_total_cents: 7747 }];
    expect(computeTotals(items, settings).bollo_cents).toBe(0);  // strict > soglia
    const items2 = [{ line_total_cents: 7748 }];
    expect(computeTotals(items2, settings).bollo_cents).toBe(200);
  });
  it("bollo override (force off)", () => {
    const items = [{ line_total_cents: 100000 }];
    expect(computeTotals(items, settings, { forceBollo: false })).toEqual({
      subtotal_cents: 100000, bollo_cents: 0, total_cents: 100000,
    });
  });
  it("bollo override (force on under threshold)", () => {
    const items = [{ line_total_cents: 5000 }];
    expect(computeTotals(items, settings, { forceBollo: true })).toEqual({
      subtotal_cents: 5000, bollo_cents: 200, total_cents: 5200,
    });
  });
});
```

- [ ] **Step 2: Run, expect FAIL** → `npm test -- src/lib/admin/__tests__/totals.test.ts`

- [ ] **Step 3: Implement**

`src/lib/admin/totals.ts`:

```ts
type LineInput = { quantity: number; unit_price_cents: number };
type Line = { line_total_cents: number };
type BolloSettings = { bollo_threshold_cents: number; bollo_amount_cents: number };
type Override = { forceBollo?: boolean };

export function computeLineTotal(line: LineInput): number {
  return Math.round(line.quantity * line.unit_price_cents);
}

export function computeTotals(
  items: readonly Line[],
  settings: BolloSettings,
  override: Override = {},
): { subtotal_cents: number; bollo_cents: number; total_cents: number } {
  const subtotal = items.reduce((s, i) => s + i.line_total_cents, 0);
  const auto = subtotal > settings.bollo_threshold_cents;
  const apply = override.forceBollo ?? auto;
  const bollo = apply ? settings.bollo_amount_cents : 0;
  return {
    subtotal_cents: subtotal,
    bollo_cents: bollo,
    total_cents: subtotal + bollo,
  };
}
```

- [ ] **Step 4: Run, expect PASS**.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/totals.ts src/lib/admin/__tests__/totals.test.ts
git commit -m "feat(admin): line + document totals with forfettario bollo logic"
```

---

## Task 5: Numbering wrapper

**Files:**
- Create: `src/lib/admin/numbering.ts`
- Create: `src/lib/admin/__tests__/numbering.test.ts`

- [ ] **Step 1: Test (formattazione, no DB)**

```ts
import { describe, it, expect } from "vitest";
import { formatDocumentNumber } from "../numbering";

describe("formatDocumentNumber", () => {
  it("invoice: YYYY/NNNN", () => {
    expect(formatDocumentNumber({ kind: "invoice", year: 2026, seq: 1 })).toBe("2026/0001");
    expect(formatDocumentNumber({ kind: "invoice", year: 2026, seq: 42 })).toBe("2026/0042");
    expect(formatDocumentNumber({ kind: "invoice", year: 2026, seq: 9999 })).toBe("2026/9999");
  });
  it("quote: P-YYYY-NNNN", () => {
    expect(formatDocumentNumber({ kind: "quote", year: 2026, seq: 1 })).toBe("P-2026-0001");
  });
  it("seq > 9999 still works (no truncation)", () => {
    expect(formatDocumentNumber({ kind: "invoice", year: 2026, seq: 12345 })).toBe("2026/12345");
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement**

`src/lib/admin/numbering.ts`:

```ts
import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export type DocumentKind = "quote" | "invoice";

export function formatDocumentNumber(p: {
  kind: DocumentKind;
  year: number;
  seq: number;
}): string {
  const padded = String(p.seq).padStart(4, "0");
  return p.kind === "invoice" ? `${p.year}/${padded}` : `P-${p.year}-${padded}`;
}

/**
 * Prenota atomicamente il prossimo numero per (kind, year). Da chiamare
 * SOLO al passaggio draft → issued.
 */
export async function reserveNextNumber(
  kind: DocumentKind,
  fiscalYear: number,
): Promise<{ sequence: number; number: string }> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.rpc("next_document_number", {
    p_kind: kind,
    p_year: fiscalYear,
  });
  if (error) throw new Error(`[numbering] rpc failed: ${String(error)}`);
  const seq = data as unknown as number;
  return { sequence: seq, number: formatDocumentNumber({ kind, year: fiscalYear, seq }) };
}

export function fiscalYearOf(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getUTCFullYear();
}
```

- [ ] **Step 4: Run, expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/numbering.ts src/lib/admin/__tests__/numbering.test.ts
git commit -m "feat(admin): document number formatter + RPC wrapper"
```

---

## Task 6: Admin chrome (sidebar layout)

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/admin-nav.tsx`

- [ ] **Step 1: Crea `AdminNav` (server component)**

`src/components/admin/admin-nav.tsx`:

```tsx
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Receipt, Settings } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clienti", label: "Clienti", icon: Users },
  { href: "/admin/preventivi", label: "Preventivi", icon: FileText },
  { href: "/admin/fatture", label: "Fatture", icon: Receipt },
  { href: "/admin/impostazioni", label: "Impostazioni", icon: Settings },
];

export function AdminNav() {
  return (
    <nav aria-label="Admin">
      <ul className="flex flex-row gap-1 overflow-x-auto sm:flex-col sm:gap-0.5">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="press flex items-center gap-2.5 rounded-md px-3 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-fg-muted hover:bg-bg-alt hover:text-fg"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Crea `AdminShell`**

`src/components/admin/admin-shell.tsx`:

```tsx
import { AdminNav } from "./admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 sm:grid-cols-[200px_1fr]">
      <aside className="border-b border-border bg-bg-alt px-3 py-3 sm:border-b-0 sm:border-r sm:py-6">
        <p className="hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft sm:block">
          Admin
        </p>
        <div className="sm:mt-4">
          <AdminNav />
        </div>
      </aside>
      <main className="px-4 py-6 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Aggiorna `src/app/admin/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin · Luca Perullo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
```

- [ ] **Step 4: Manual smoke**

```bash
npm run dev
```
Visita `/admin` → vedi sidebar con 5 voci, dashboard placeholder a destra. Su mobile: sidebar in alto orizzontale.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/admin-shell.tsx src/components/admin/admin-nav.tsx src/app/admin/layout.tsx
git commit -m "feat(admin): sidebar shell with 5-section nav"
```

---

## Task 7: Settings page (anagrafica + IBAN, no FiC connect ancora)

**Files:**
- Create: `src/app/admin/impostazioni/page.tsx`
- Create: `src/components/admin/settings-form.tsx`
- Create: `src/app/api/admin/settings/route.ts`
- Create: `src/lib/admin/settings.ts`

- [ ] **Step 1: Helper read/upsert settings**

`src/lib/admin/settings.ts`:

```ts
import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export type AdminSettings = {
  id: string;
  business_name: string;
  legal_name: string | null;
  vat_number: string;
  tax_code: string;
  address: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  iban: string;
  swift: string | null;
  bank_name: string | null;
  pec_email: string | null;
  sdi_code: string | null;
  regime_fiscale: string;
  bollo_threshold_cents: number;
  bollo_amount_cents: number;
  min_installment_cents: number;
  fic_company_id: string | null;
  fic_access_token: string | null;
  fic_refresh_token: string | null;
  fic_token_expires_at: string | null;
};

export async function loadSettings(): Promise<AdminSettings> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .maybeSingle();
  if (error || !data) {
    throw new Error(`[admin/settings] load failed: ${String(error)}`);
  }
  return data as unknown as AdminSettings;
}
```

- [ ] **Step 2: API route per update**

`src/app/api/admin/settings/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  isValidPartitaIva,
  isValidCodiceFiscale,
  isValidCap,
  isValidIban,
  isValidCodiceDestinatario,
} from "@/lib/admin/validators";

export const runtime = "nodejs";

const STR_FIELDS = [
  "business_name","legal_name","vat_number","tax_code","address","city","zip",
  "province","country","iban","swift","bank_name","pec_email","sdi_code",
] as const;
const NUM_FIELDS = [
  "bollo_threshold_cents","bollo_amount_cents","min_installment_cents",
] as const;

export async function PATCH(req: Request) {
  const { supabase } = await requireAdmin();
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid-json" }, { status: 400 }); }

  const patch: Record<string, unknown> = {};
  for (const k of STR_FIELDS) {
    if (typeof body[k] === "string") patch[k] = (body[k] as string).trim() || null;
  }
  for (const k of NUM_FIELDS) {
    if (typeof body[k] === "number" && Number.isInteger(body[k]) && (body[k] as number) >= 0) {
      patch[k] = body[k];
    }
  }

  // Validazioni autoritative
  if (patch.vat_number && !isValidPartitaIva(String(patch.vat_number))) {
    return NextResponse.json({ error: "invalid-vat" }, { status: 400 });
  }
  if (patch.tax_code && !isValidCodiceFiscale(String(patch.tax_code))) {
    return NextResponse.json({ error: "invalid-tax-code" }, { status: 400 });
  }
  if (patch.zip && !isValidCap(String(patch.zip))) {
    return NextResponse.json({ error: "invalid-cap" }, { status: 400 });
  }
  if (patch.iban && !isValidIban(String(patch.iban))) {
    return NextResponse.json({ error: "invalid-iban" }, { status: 400 });
  }
  if (patch.sdi_code && !isValidCodiceDestinatario(String(patch.sdi_code))) {
    return NextResponse.json({ error: "invalid-sdi-code" }, { status: 400 });
  }

  const { data: row } = await supabase.from("admin_settings").select("id").maybeSingle();
  if (!row) {
    return NextResponse.json({ error: "no-singleton" }, { status: 500 });
  }
  const { error } = await supabase
    .from("admin_settings")
    .update(patch)
    .eq("id", (row as { id: string }).id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Form client component**

`src/components/admin/settings-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { AdminSettings } from "@/lib/admin/settings";

type Props = { initial: AdminSettings };

export function SettingsForm({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) {
    setForm(f => ({ ...f, [k]: v }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null); setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        bollo_threshold_cents: form.bollo_threshold_cents,
        bollo_amount_cents: form.bollo_amount_cents,
        min_installment_cents: form.min_installment_cents,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "save-failed");
      return;
    }
    setSaved(true);
  }

  const f = (k: keyof AdminSettings) => String(form[k] ?? "");

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Section title="Anagrafica">
        <Field label="Ragione sociale / Nome" value={f("business_name")} onChange={v => set("business_name", v)} required />
        <Field label="Denominazione legale (se diversa)" value={f("legal_name")} onChange={v => set("legal_name", v)} />
        <Field label="P.IVA" value={f("vat_number")} onChange={v => set("vat_number", v)} required mono />
        <Field label="Codice fiscale" value={f("tax_code")} onChange={v => set("tax_code", v)} required mono />
      </Section>

      <Section title="Sede legale">
        <Field label="Indirizzo" value={f("address")} onChange={v => set("address", v)} required />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="CAP" value={f("zip")} onChange={v => set("zip", v)} required mono />
          <Field label="Città" value={f("city")} onChange={v => set("city", v)} required />
          <Field label="Prov. (sigla)" value={f("province")} onChange={v => set("province", v.toUpperCase().slice(0,2))} required mono />
        </div>
      </Section>

      <Section title="Pagamento (IBAN per bonifico)">
        <Field label="IBAN" value={f("iban")} onChange={v => set("iban", v)} required mono />
        <Field label="Banca" value={f("bank_name")} onChange={v => set("bank_name", v)} />
        <Field label="SWIFT/BIC (opzionale)" value={f("swift")} onChange={v => set("swift", v)} mono />
      </Section>

      <Section title="Contatti SDI (di solito vuoti per privati)">
        <Field label="PEC" value={f("pec_email")} onChange={v => set("pec_email", v)} />
        <Field label="Codice destinatario tuo (7 char)" value={f("sdi_code")} onChange={v => set("sdi_code", v)} mono />
      </Section>

      <Section title="Parametri fiscali (forfettario)">
        <FieldNum label="Soglia bollo (centesimi)" value={form.bollo_threshold_cents} onChange={v => set("bollo_threshold_cents", v)} />
        <FieldNum label="Importo bollo (centesimi)" value={form.bollo_amount_cents} onChange={v => set("bollo_amount_cents", v)} />
        <FieldNum label="Rata minima mensile (centesimi)" value={form.min_installment_cents} onChange={v => set("min_installment_cents", v)} />
        <p className="font-mono text-[11px] text-fg-soft">
          Default: bollo €2,00 sopra €77,47; rata minima €500,00. Cambia solo se la legge cambia o se decidi un minimo diverso.
        </p>
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="press inline-flex items-center rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg disabled:opacity-50"
        >
          {saving ? "Salvataggio…" : "Salva"}
        </button>
        {saved ? <span className="font-mono text-[11.5px] text-fg-muted">Salvato.</span> : null}
        {error ? <span className="font-mono text-[11.5px] text-red-600">{error}</span> : null}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, value, onChange, required, mono }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] text-fg-muted">{label}{required ? " *" : ""}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className={`mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[14px] text-fg outline-none focus:border-fg ${mono ? "font-mono text-[13px]" : ""}`}
      />
    </label>
  );
}

function FieldNum({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] text-fg-muted">{label}</span>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10) || 0)}
        className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-[13px] text-fg outline-none focus:border-fg"
      />
    </label>
  );
}
```

- [ ] **Step 4: Page**

`src/app/admin/impostazioni/page.tsx`:

```tsx
import { loadSettings } from "@/lib/admin/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function ImpostazioniPage() {
  const settings = await loadSettings();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Impostazioni</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Anagrafica e parametri</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-fg-muted">
        Dati che vanno in cima a ogni preventivo e fattura emessa, e nei campi obbligatori dell'XML FatturaPA.
      </p>
      <div className="mt-8">
        <SettingsForm initial={settings} />
      </div>
      <div className="mt-12 rounded-md border border-border bg-bg-alt p-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Fatture in Cloud</p>
        <p className="mt-2 text-[13.5px] text-fg-muted">
          Connessione SDI: arriverà nel Task 12 del piano. Per ora: niente trasmissione.
        </p>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Manual smoke**

`npm run dev` → `/admin/impostazioni` → compila i campi → Salva → ricarica pagina, dati persistiti.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/settings.ts src/app/api/admin/settings/route.ts src/components/admin/settings-form.tsx src/app/admin/impostazioni/page.tsx
git commit -m "feat(admin): impostazioni page (anagrafica + IBAN + parametri)"
```

---

## Task 8: Installments logic (schedule generator + validator)

**Files:**
- Create: `src/lib/admin/installments.ts`
- Create: `src/lib/admin/__tests__/installments.test.ts`

- [ ] **Step 1: Test**

```ts
import { describe, it, expect } from "vitest";
import {
  generateMonthlySchedule,
  validateInstallments,
  deriveStatusFromInstallments,
} from "../installments";

describe("generateMonthlySchedule", () => {
  it("3 rate da €1000 totale €3000", () => {
    const out = generateMonthlySchedule({
      total_cents: 300000,
      n: 3,
      first_due_date: "2026-06-01",
    });
    expect(out).toEqual([
      { position: 1, due_date: "2026-06-01", amount_cents: 100000 },
      { position: 2, due_date: "2026-07-01", amount_cents: 100000 },
      { position: 3, due_date: "2026-08-01", amount_cents: 100000 },
    ]);
  });
  it("ultima rata aggiusta il resto (totale 100, n=3 → 33+33+34)", () => {
    const out = generateMonthlySchedule({
      total_cents: 100, n: 3, first_due_date: "2026-06-01",
    });
    expect(out.map(r => r.amount_cents)).toEqual([33, 33, 34]);
    expect(out.reduce((s, r) => s + r.amount_cents, 0)).toBe(100);
  });
  it("date mensili: gestisce fine mese (31 gen → 28 feb)", () => {
    const out = generateMonthlySchedule({
      total_cents: 200, n: 2, first_due_date: "2026-01-31",
    });
    expect(out[1]!.due_date).toBe("2026-02-28");
  });
  it("rifiuta n < 1", () => {
    expect(() => generateMonthlySchedule({ total_cents: 100, n: 0, first_due_date: "2026-06-01" })).toThrow();
  });
});

describe("validateInstallments", () => {
  const settings = { min_installment_cents: 50000 };
  it("ok: somma = totale, ogni rata ≥ minimo, date crescenti", () => {
    const result = validateInstallments(
      [
        { position: 1, due_date: "2026-06-01", amount_cents: 100000 },
        { position: 2, due_date: "2026-07-01", amount_cents: 100000 },
      ],
      300000,  // totale doc
      settings,
    );
    // somma 200000 ≠ 300000 → invalid
    expect(result.ok).toBe(false);
  });
  it("rifiuta rata sotto minimo", () => {
    const result = validateInstallments(
      [{ position: 1, due_date: "2026-06-01", amount_cents: 40000 }],
      40000,
      settings,
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("min_amount");
  });
  it("rifiuta date non crescenti", () => {
    const result = validateInstallments(
      [
        { position: 1, due_date: "2026-07-01", amount_cents: 100000 },
        { position: 2, due_date: "2026-06-01", amount_cents: 100000 },
      ],
      200000, settings,
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("date_order");
  });
  it("0 rate = soluzione unica = ok (a prescindere da totale)", () => {
    const result = validateInstallments([], 999999, settings);
    expect(result.ok).toBe(true);
  });
});

describe("deriveStatusFromInstallments", () => {
  it("nessuna pagata → null (status invariato)", () => {
    expect(deriveStatusFromInstallments([
      { paid_at: null }, { paid_at: null },
    ])).toBeNull();
  });
  it("alcune pagate → partially_paid", () => {
    expect(deriveStatusFromInstallments([
      { paid_at: "2026-06-01" }, { paid_at: null },
    ])).toBe("partially_paid");
  });
  it("tutte pagate → paid", () => {
    expect(deriveStatusFromInstallments([
      { paid_at: "2026-06-01" }, { paid_at: "2026-07-01" },
    ])).toBe("paid");
  });
  it("array vuoto → null (no rate, status non auto-deducibile)", () => {
    expect(deriveStatusFromInstallments([])).toBeNull();
  });
});
```

- [ ] **Step 2: Run, expect FAIL** → `npm test -- src/lib/admin/__tests__/installments.test.ts`

- [ ] **Step 3: Implement**

`src/lib/admin/installments.ts`:

```ts
export type InstallmentRow = {
  position: number;
  due_date: string;       // ISO YYYY-MM-DD
  amount_cents: number;
};

export type InstallmentPaid = { paid_at: string | null };

/**
 * Genera N rate mensili. Importo = total/N centesimi, l'ultima
 * rata assorbe il resto della divisione intera.
 */
export function generateMonthlySchedule(p: {
  total_cents: number;
  n: number;
  first_due_date: string;  // YYYY-MM-DD
}): InstallmentRow[] {
  if (!Number.isInteger(p.n) || p.n < 1) {
    throw new Error("[installments] n deve essere intero >= 1");
  }
  if (!Number.isInteger(p.total_cents) || p.total_cents < 0) {
    throw new Error("[installments] total_cents deve essere intero >= 0");
  }
  const base = Math.floor(p.total_cents / p.n);
  const remainder = p.total_cents - base * p.n;
  const rows: InstallmentRow[] = [];
  const start = parseISODate(p.first_due_date);
  for (let i = 0; i < p.n; i++) {
    const d = addMonths(start, i);
    rows.push({
      position: i + 1,
      due_date: formatISODate(d),
      amount_cents: i === p.n - 1 ? base + remainder : base,
    });
  }
  return rows;
}

export type ValidateResult = { ok: boolean; errors: string[] };

export function validateInstallments(
  rows: readonly InstallmentRow[],
  totalCents: number,
  settings: { min_installment_cents: number },
): ValidateResult {
  if (rows.length === 0) return { ok: true, errors: [] };
  const errors: string[] = [];
  // somma
  const sum = rows.reduce((s, r) => s + r.amount_cents, 0);
  if (sum !== totalCents) errors.push("sum_mismatch");
  // minimo
  if (rows.some(r => r.amount_cents < settings.min_installment_cents)) {
    errors.push("min_amount");
  }
  // date crescenti
  for (let i = 1; i < rows.length; i++) {
    if (rows[i]!.due_date <= rows[i - 1]!.due_date) {
      errors.push("date_order");
      break;
    }
  }
  // position crescenti
  for (let i = 0; i < rows.length; i++) {
    if (rows[i]!.position !== i + 1) errors.push("position_order");
  }
  return { ok: errors.length === 0, errors };
}

export function deriveStatusFromInstallments(
  rows: readonly InstallmentPaid[],
): "paid" | "partially_paid" | null {
  if (rows.length === 0) return null;
  const paid = rows.filter(r => r.paid_at !== null).length;
  if (paid === 0) return null;
  if (paid === rows.length) return "paid";
  return "partially_paid";
}

// ── date helpers (UTC, no timezone surprises) ───────────────────
function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
}
function formatISODate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addMonths(d: Date, months: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  const day = d.getUTCDate();
  // Last day of target month (gestisce 31 gen → 28/29 feb)
  const lastDayTargetMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const finalDay = Math.min(day, lastDayTargetMonth);
  return new Date(Date.UTC(y, m, finalDay));
}
```

- [ ] **Step 4: Run, expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/installments.ts src/lib/admin/__tests__/installments.test.ts
git commit -m "feat(admin): installment schedule generator + validator + status derivation"
```

---

## Task 9: Clients CRUD (route + UI)

**Files:**
- Create: `src/app/api/admin/clients/route.ts`
- Create: `src/app/api/admin/clients/[id]/route.ts`
- Create: `src/app/admin/clienti/page.tsx`
- Create: `src/app/admin/clienti/nuovo/page.tsx`
- Create: `src/app/admin/clienti/[id]/page.tsx`
- Create: `src/components/admin/client-form.tsx`
- Create: `src/components/admin/clients-table.tsx`
- Create: `src/lib/admin/clients.ts`

- [ ] **Step 1: Type + helper**

`src/lib/admin/clients.ts`:

```ts
import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export type ClientKind = "individual" | "business" | "pa";

export type Client = {
  id: string;
  kind: ClientKind;
  display_name: string;
  legal_name: string | null;
  vat_number: string | null;
  tax_code: string | null;
  address: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  pec_email: string | null;
  sdi_code: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  archived_at: string | null;
};

export async function listClients(opts: { includeArchived?: boolean } = {}): Promise<Client[]> {
  const supabase = await createServerClient();
  let q = supabase.from("clients").select("*").order("display_name", { ascending: true });
  if (!opts.includeArchived) {
    q = q.eq("archived_at", null as unknown as string);
  }
  const { data } = await q;
  return (data as unknown as Client[] | null) ?? [];
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
  return (data as unknown as Client) ?? null;
}
```

- [ ] **Step 2: API routes**

`src/app/api/admin/clients/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  isValidPartitaIva, isValidCodiceFiscale, isValidCap, isValidCodiceDestinatario,
} from "@/lib/admin/validators";

export const runtime = "nodejs";

const KINDS = ["individual", "business", "pa"] as const;

export async function POST(req: Request) {
  const { supabase } = await requireAdmin();
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const validation = validateClientPayload(body);
  if (!validation.ok) return NextResponse.json({ error: validation.errors }, { status: 400 });
  const { data, error } = await supabase.from("clients").insert(validation.payload).select("id").single();
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ id: (data as { id: string }).id });
}

export function validateClientPayload(body: Record<string, unknown>) {
  const errors: string[] = [];
  const kind = String(body.kind ?? "");
  if (!(KINDS as readonly string[]).includes(kind)) errors.push("invalid-kind");
  const str = (k: string) => typeof body[k] === "string" ? (body[k] as string).trim() : "";
  const display_name = str("display_name");
  if (!display_name) errors.push("missing-display_name");
  const address = str("address");
  const city = str("city");
  const zip = str("zip");
  const province = str("province").toUpperCase().slice(0, 2);
  if (!address || !city || !zip || !province) errors.push("missing-address");
  if (zip && !isValidCap(zip)) errors.push("invalid-cap");
  const vat_number = str("vat_number") || null;
  const tax_code = str("tax_code") || null;
  if (kind === "individual" && !tax_code) errors.push("missing-tax_code");
  if (kind === "business" && !vat_number) errors.push("missing-vat_number");
  if (vat_number && !isValidPartitaIva(vat_number)) errors.push("invalid-vat");
  if (tax_code && !isValidCodiceFiscale(tax_code)) errors.push("invalid-tax_code");
  const sdi_code = str("sdi_code") || "0000000";
  if (!isValidCodiceDestinatario(sdi_code)) errors.push("invalid-sdi_code");
  if (errors.length) return { ok: false as const, errors };
  return {
    ok: true as const,
    payload: {
      kind, display_name,
      legal_name: str("legal_name") || null,
      vat_number, tax_code,
      address, city, zip, province,
      country: str("country") || "IT",
      pec_email: str("pec_email") || null,
      sdi_code,
      contact_email: str("contact_email") || null,
      contact_phone: str("contact_phone") || null,
      notes: str("notes") || null,
    },
  };
}
```

`src/app/api/admin/clients/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { validateClientPayload } from "../route";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const v = validateClientPayload(body);
  if (!v.ok) return NextResponse.json({ error: v.errors }, { status: 400 });
  const { error } = await supabase.from("clients").update(v.payload).eq("id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  // Soft delete = archive
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const { error } = await supabase.from("clients").update({ archived_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: ClientForm**

`src/components/admin/client-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Client, ClientKind } from "@/lib/admin/clients";

type Props = { initial?: Client };

const EMPTY: Client = {
  id: "", kind: "business", display_name: "", legal_name: null,
  vat_number: null, tax_code: null, address: "", city: "", zip: "",
  province: "", country: "IT", pec_email: null, sdi_code: "0000000",
  contact_email: null, contact_phone: null, notes: null, archived_at: null,
};

export function ClientForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Client>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Client>(k: K, v: Client[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }
  const f = (k: keyof Client) => String(form[k] ?? "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    const url = initial ? `/api/admin/clients/${initial.id}` : "/api/admin/clients";
    const method = initial ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(Array.isArray(j.error) ? j.error.join(", ") : (j.error ?? "save-failed"));
      return;
    }
    router.push("/admin/clienti");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Tipo</legend>
        {(["individual","business","pa"] as ClientKind[]).map(k => (
          <label key={k} className="mr-4 inline-flex items-center gap-2 font-mono text-[12px]">
            <input type="radio" name="kind" value={k} checked={form.kind === k} onChange={() => set("kind", k)} />
            {k === "individual" ? "Privato" : k === "business" ? "Azienda" : "Pubblica Amministrazione"}
          </label>
        ))}
      </fieldset>

      <Field label="Nome interno (come lo cerchi)" value={f("display_name")} onChange={v => set("display_name", v)} required />
      <Field label="Denominazione legale" value={f("legal_name")} onChange={v => set("legal_name", v as never)} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {form.kind !== "individual" ? (
          <Field label="P.IVA" value={f("vat_number")} onChange={v => set("vat_number", v as never)} required mono />
        ) : null}
        <Field label="Codice fiscale" value={f("tax_code")} onChange={v => set("tax_code", v.toUpperCase() as never)} required={form.kind === "individual"} mono />
      </div>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Sede</legend>
        <Field label="Indirizzo" value={f("address")} onChange={v => set("address", v)} required />
        <div className="grid grid-cols-3 gap-3">
          <Field label="CAP" value={f("zip")} onChange={v => set("zip", v)} required mono />
          <Field label="Città" value={f("city")} onChange={v => set("city", v)} required />
          <Field label="Prov." value={f("province")} onChange={v => set("province", v.toUpperCase().slice(0,2))} required mono />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">SDI</legend>
        <Field label="PEC" value={f("pec_email")} onChange={v => set("pec_email", v as never)} />
        <Field label="Codice destinatario (7 char, '0000000' se nessuno)" value={f("sdi_code")} onChange={v => set("sdi_code", v.toUpperCase().slice(0,7) as never)} mono />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Contatti</legend>
        <Field label="Email" value={f("contact_email")} onChange={v => set("contact_email", v as never)} />
        <Field label="Telefono" value={f("contact_phone")} onChange={v => set("contact_phone", v as never)} />
      </fieldset>

      <label className="block">
        <span className="font-mono text-[11px] text-fg-muted">Note interne</span>
        <textarea
          value={f("notes")}
          onChange={e => set("notes", e.target.value as never)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[14px] text-fg outline-none focus:border-fg"
        />
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="press inline-flex items-center rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg disabled:opacity-50">
          {saving ? "Salvataggio…" : initial ? "Salva modifiche" : "Crea cliente"}
        </button>
        {error ? <span className="font-mono text-[11.5px] text-red-600">{error}</span> : null}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, required, mono }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] text-fg-muted">{label}{required ? " *" : ""}</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} required={required}
        className={`mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[14px] text-fg outline-none focus:border-fg ${mono ? "font-mono text-[13px]" : ""}`} />
    </label>
  );
}
```

- [ ] **Step 4: Pages**

`src/app/admin/clienti/page.tsx`:

```tsx
import Link from "next/link";
import { listClients } from "@/lib/admin/clients";

export const dynamic = "force-dynamic";

export default async function ClientiPage() {
  const clients = await listClients();
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Clienti</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Clienti</h1>
        </div>
        <Link href="/admin/clienti/nuovo"
          className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">
          + Nuovo
        </Link>
      </div>
      {clients.length === 0 ? (
        <p className="mt-12 text-[14px] text-fg-muted">Nessun cliente. Aggiungine uno.</p>
      ) : (
        <table className="mt-8 w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
              <th className="py-2">Nome</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">P.IVA / CF</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-b border-border">
                <td className="py-3"><Link href={`/admin/clienti/${c.id}`} className="text-fg hover:underline">{c.display_name}</Link></td>
                <td className="py-3 font-mono text-[12px] text-fg-muted">{c.kind}</td>
                <td className="py-3 font-mono text-[12px] text-fg-muted">{c.vat_number ?? c.tax_code ?? "—"}</td>
                <td className="py-3 text-right"><Link href={`/admin/clienti/${c.id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Modifica →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
```

`src/app/admin/clienti/nuovo/page.tsx`:

```tsx
import { ClientForm } from "@/components/admin/client-form";
export const dynamic = "force-dynamic";
export default function NuovoClientePage() {
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Clienti / Nuovo</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Nuovo cliente</h1>
      <div className="mt-8"><ClientForm /></div>
    </>
  );
}
```

`src/app/admin/clienti/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getClient } from "@/lib/admin/clients";
import { ClientForm } from "@/components/admin/client-form";

export const dynamic = "force-dynamic";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Clienti / {client.display_name}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">{client.display_name}</h1>
      <div className="mt-8"><ClientForm initial={client} /></div>
    </>
  );
}
```

- [ ] **Step 5: Manual smoke**

`/admin/clienti/nuovo` → crea un cliente test (P.IVA `00743110157`, CAP valido), submit, redirect a lista, vedi cliente. Click su nome → form pre-compilato.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/clients.ts src/app/api/admin/clients src/app/admin/clienti src/components/admin/client-form.tsx
git commit -m "feat(admin): clienti CRUD (lista + form + API + soft archive)"
```

---

## Task 10: Document editor + draft CRUD (no FiC, no PDF, no XML)

**Files:**
- Create: `src/lib/admin/documents.ts`
- Create: `src/app/api/admin/documents/route.ts`
- Create: `src/app/api/admin/documents/[id]/route.ts`
- Create: `src/app/admin/preventivi/page.tsx`, `nuovo/page.tsx`, `[id]/page.tsx`
- Create: `src/app/admin/fatture/page.tsx`, `nuovo/page.tsx`, `[id]/page.tsx`
- Create: `src/components/admin/document-editor.tsx`
- Create: `src/components/admin/installments-section.tsx`
- Create: `src/components/admin/documents-table.tsx`

- [ ] **Step 1: Type + helpers**

`src/lib/admin/documents.ts`:

```ts
import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { DocumentKind } from "./numbering";

export type DocumentStatus =
  | "draft" | "issued" | "sent_sdi" | "delivered_sdi" | "rejected_sdi"
  | "partially_paid" | "paid" | "cancelled";

export type Document = {
  id: string; kind: DocumentKind; number: string | null;
  fiscal_year: number | null; sequence: number | null;
  issue_date: string; due_date: string | null;
  client_id: string; client_snapshot: unknown;
  status: DocumentStatus;
  sdi_id_fic: string | null; sdi_message: string | null;
  subtotal_cents: number; bollo_cents: number; total_cents: number;
  currency: string;
  payment_method: string | null; payment_terms: string | null;
  notes_to_client: string | null; internal_notes: string | null;
  pdf_storage_path: string | null; xml_storage_path: string | null;
  converted_from_id: string | null;
  issued_at: string | null;
};
export type DocumentItem = {
  id: string; document_id: string; position: number;
  description: string; quantity: number; unit_price_cents: number;
  line_total_cents: number; vat_code: string;
};
export type Installment = {
  id: string; document_id: string; position: number;
  due_date: string; amount_cents: number;
  paid_at: string | null; payment_reference: string | null;
};

export async function listDocuments(kind: DocumentKind): Promise<Document[]> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("documents").select("*").eq("kind", kind).order("created_at", { ascending: false });
  return (data as unknown as Document[] | null) ?? [];
}
export async function getDocumentBundle(id: string) {
  const supabase = await createServerClient();
  const { data: doc } = await supabase.from("documents").select("*").eq("id", id).maybeSingle();
  if (!doc) return null;
  const { data: items } = await supabase.from("document_items").select("*").eq("document_id", id).order("position");
  const { data: rates } = await supabase.from("document_installments").select("*").eq("document_id", id).order("position");
  return {
    document: doc as unknown as Document,
    items: (items as unknown as DocumentItem[] | null) ?? [],
    installments: (rates as unknown as Installment[] | null) ?? [],
  };
}
```

- [ ] **Step 2: API: create draft**

`src/app/api/admin/documents/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { supabase } = await requireAdmin();
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const kind = body.kind === "invoice" ? "invoice" : "quote";
  const client_id = typeof body.client_id === "string" ? body.client_id : null;
  if (!client_id) return NextResponse.json({ error: "missing-client_id" }, { status: 400 });
  const { data: client } = await supabase.from("clients").select("*").eq("id", client_id).maybeSingle();
  if (!client) return NextResponse.json({ error: "client-not-found" }, { status: 404 });

  const { data, error } = await supabase.from("documents").insert({
    kind,
    client_id,
    client_snapshot: client,    // congelato già in draft (riaggiornato in issue)
    issue_date: new Date().toISOString().slice(0, 10),
    status: "draft",
  }).select("id").single();
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ id: (data as { id: string }).id });
}
```

- [ ] **Step 3: API: update draft + items + installments**

`src/app/api/admin/documents/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { computeLineTotal, computeTotals } from "@/lib/admin/totals";
import { validateInstallments } from "@/lib/admin/installments";
import { loadSettings } from "@/lib/admin/settings";

export const runtime = "nodejs";

type ItemIn = { description: string; quantity: number; unit_price_cents: number };
type InstIn = { due_date: string; amount_cents: number };

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;

  // Documento deve essere draft per essere editabile
  const { data: existing } = await supabase.from("documents").select("status").eq("id", id).maybeSingle();
  if (!existing) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if ((existing as { status: string }).status !== "draft") {
    return NextResponse.json({ error: "not-editable-after-issue" }, { status: 409 });
  }

  const settings = await loadSettings();

  // Items
  const itemsRaw = Array.isArray(body.items) ? body.items as ItemIn[] : [];
  const items = itemsRaw
    .filter(i => typeof i.description === "string" && Number.isFinite(i.quantity) && Number.isInteger(i.unit_price_cents))
    .map((i, idx) => ({
      position: idx + 1,
      description: i.description.slice(0, 500),
      quantity: i.quantity,
      unit_price_cents: i.unit_price_cents,
      line_total_cents: computeLineTotal({ quantity: i.quantity, unit_price_cents: i.unit_price_cents }),
      vat_code: "N2.2",
    }));

  // Totali (con bollo override opzionale)
  const forceBollo = typeof body.force_bollo === "boolean" ? body.force_bollo : undefined;
  const totals = computeTotals(items, settings, { forceBollo });

  // Installments
  const instRaw = Array.isArray(body.installments) ? body.installments as InstIn[] : [];
  const installments = instRaw
    .filter(r => typeof r.due_date === "string" && Number.isInteger(r.amount_cents))
    .map((r, idx) => ({ position: idx + 1, due_date: r.due_date, amount_cents: r.amount_cents }));
  const v = validateInstallments(installments, totals.total_cents, settings);
  if (!v.ok) return NextResponse.json({ error: "invalid-installments", details: v.errors }, { status: 400 });

  // Update doc + replace items + replace installments (transaction logica via 3 step)
  const docPatch: Record<string, unknown> = {
    issue_date: typeof body.issue_date === "string" ? body.issue_date : undefined,
    due_date: typeof body.due_date === "string" ? body.due_date : null,
    payment_method: typeof body.payment_method === "string" ? body.payment_method : null,
    payment_terms: typeof body.payment_terms === "string" ? body.payment_terms : null,
    notes_to_client: typeof body.notes_to_client === "string" ? body.notes_to_client : null,
    internal_notes: typeof body.internal_notes === "string" ? body.internal_notes : null,
    subtotal_cents: totals.subtotal_cents,
    bollo_cents: totals.bollo_cents,
    total_cents: totals.total_cents,
  };
  Object.keys(docPatch).forEach(k => docPatch[k] === undefined && delete docPatch[k]);

  const { error: e1 } = await supabase.from("documents").update(docPatch).eq("id", id);
  if (e1) return NextResponse.json({ error: String(e1) }, { status: 500 });

  await supabase.from("document_items").delete().eq("document_id", id);
  if (items.length > 0) {
    const { error: e2 } = await supabase.from("document_items").insert(items.map(i => ({ ...i, document_id: id })));
    if (e2) return NextResponse.json({ error: String(e2) }, { status: 500 });
  }

  await supabase.from("document_installments").delete().eq("document_id", id);
  if (installments.length > 0) {
    const { error: e3 } = await supabase.from("document_installments").insert(installments.map(r => ({ ...r, document_id: id })));
    if (e3) return NextResponse.json({ error: String(e3) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, totals });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const { data: doc } = await supabase.from("documents").select("status").eq("id", id).maybeSingle();
  if (!doc) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if ((doc as { status: string }).status !== "draft") {
    return NextResponse.json({ error: "cannot-delete-issued" }, { status: 409 });
  }
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Installments section component**

`src/components/admin/installments-section.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { generateMonthlySchedule, validateInstallments, type InstallmentRow } from "@/lib/admin/installments";

type Props = {
  totalCents: number;
  minInstallmentCents: number;
  initial: InstallmentRow[];
  onChange: (rows: InstallmentRow[]) => void;
};

export function InstallmentsSection({ totalCents, minInstallmentCents, initial, onChange }: Props) {
  const [enabled, setEnabled] = useState(initial.length > 0);
  const [rows, setRows] = useState<InstallmentRow[]>(initial);
  const [n, setN] = useState(initial.length || 3);
  const [firstDate, setFirstDate] = useState(initial[0]?.due_date ?? new Date().toISOString().slice(0, 10));

  const validation = useMemo(
    () => validateInstallments(rows, totalCents, { min_installment_cents: minInstallmentCents }),
    [rows, totalCents, minInstallmentCents]
  );

  function regenerate() {
    const out = generateMonthlySchedule({ total_cents: totalCents, n, first_due_date: firstDate });
    setRows(out);
    onChange(out);
  }

  function setEnabledWith(v: boolean) {
    setEnabled(v);
    if (!v) { setRows([]); onChange([]); }
  }

  function updateRow(i: number, patch: Partial<InstallmentRow>) {
    const next = rows.map((r, idx) => idx === i ? { ...r, ...patch } : r);
    setRows(next); onChange(next);
  }

  return (
    <fieldset className="rounded-md border border-border p-4">
      <legend className="px-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
        Pagamento
      </legend>

      <label className="inline-flex items-center gap-2 font-mono text-[12px]">
        <input type="checkbox" checked={enabled} onChange={e => setEnabledWith(e.target.checked)} />
        Rateizza il pagamento
      </label>

      {!enabled ? (
        <p className="mt-2 font-mono text-[11px] text-fg-soft">
          Soluzione unica: il cliente paga {(totalCents/100).toFixed(2)}€ entro la data di scadenza.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="font-mono text-[10.5px] text-fg-soft">N° rate</span>
              <input type="number" min={1} value={n} onChange={e => setN(parseInt(e.target.value, 10) || 1)}
                className="mt-1 block w-20 rounded-md border border-border bg-bg px-2 py-1 font-mono text-[12px]" />
            </label>
            <label className="block">
              <span className="font-mono text-[10.5px] text-fg-soft">Prima rata</span>
              <input type="date" value={firstDate} onChange={e => setFirstDate(e.target.value)}
                className="mt-1 block rounded-md border border-border bg-bg px-2 py-1 font-mono text-[12px]" />
            </label>
            <button type="button" onClick={regenerate}
              className="press rounded-md border border-border-strong bg-bg-alt px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em]">
              Genera schedule
            </button>
          </div>

          {rows.length > 0 ? (
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                  <th className="py-1.5 w-8">#</th>
                  <th className="py-1.5">Scadenza</th>
                  <th className="py-1.5 text-right">Importo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-1.5 font-mono text-[11px] text-fg-muted">{r.position}</td>
                    <td className="py-1.5">
                      <input type="date" value={r.due_date}
                        onChange={e => updateRow(i, { due_date: e.target.value })}
                        className="rounded-md border border-border bg-bg px-2 py-1 font-mono text-[12px]" />
                    </td>
                    <td className="py-1.5 text-right">
                      <input type="number" min={0} step={1}
                        value={r.amount_cents}
                        onChange={e => updateRow(i, { amount_cents: parseInt(e.target.value, 10) || 0 })}
                        className="w-32 rounded-md border border-border bg-bg px-2 py-1 text-right font-mono text-[12px]" />
                      <span className="ml-1 font-mono text-[10.5px] text-fg-soft">cent</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {!validation.ok && rows.length > 0 ? (
            <p className="font-mono text-[11px] text-red-600">
              {validation.errors.includes("sum_mismatch") && "Somma rate ≠ totale fattura. "}
              {validation.errors.includes("min_amount") && `Almeno una rata sotto il minimo (${(minInstallmentCents/100).toFixed(0)}€). `}
              {validation.errors.includes("date_order") && "Date non in ordine cronologico. "}
            </p>
          ) : null}
        </div>
      )}
    </fieldset>
  );
}
```

- [ ] **Step 5: Document editor**

`src/components/admin/document-editor.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@/lib/admin/clients";
import type { Document, DocumentItem, Installment } from "@/lib/admin/documents";
import { computeLineTotal, computeTotals } from "@/lib/admin/totals";
import { InstallmentsSection } from "./installments-section";
import type { InstallmentRow } from "@/lib/admin/installments";

type Props = {
  document: Document;
  items: DocumentItem[];
  installments: Installment[];
  client: Client;
  settings: { bollo_threshold_cents: number; bollo_amount_cents: number; min_installment_cents: number };
};

type EditorItem = { description: string; quantity: number; unit_price_cents: number };

export function DocumentEditor({ document, items: initialItems, installments: initialInstallments, client, settings }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<EditorItem[]>(
    initialItems.length > 0
      ? initialItems.map(i => ({ description: i.description, quantity: i.quantity, unit_price_cents: i.unit_price_cents }))
      : [{ description: "", quantity: 1, unit_price_cents: 0 }]
  );
  const [issueDate, setIssueDate] = useState(document.issue_date);
  const [dueDate, setDueDate] = useState(document.due_date ?? "");
  const [paymentTerms, setPaymentTerms] = useState(document.payment_terms ?? "Bonifico bancario");
  const [notesToClient, setNotesToClient] = useState(document.notes_to_client ?? "");
  const [forceBollo, setForceBollo] = useState<boolean | null>(null);
  const [installments, setInstallments] = useState<InstallmentRow[]>(
    initialInstallments.map(r => ({ position: r.position, due_date: r.due_date, amount_cents: r.amount_cents }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lineRows = useMemo(() => items.map(i => ({
    line_total_cents: computeLineTotal({ quantity: i.quantity, unit_price_cents: i.unit_price_cents }),
  })), [items]);

  const totals = useMemo(
    () => computeTotals(lineRows, settings, forceBollo === null ? {} : { forceBollo }),
    [lineRows, settings, forceBollo]
  );

  function updateItem(i: number, patch: Partial<EditorItem>) {
    setItems(items.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  }
  function addItem() { setItems([...items, { description: "", quantity: 1, unit_price_cents: 0 }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j]!, next[i]!];
    setItems(next);
  }

  async function save() {
    setSaving(true); setError(null);
    const res = await fetch(`/api/admin/documents/${document.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        issue_date: issueDate,
        due_date: dueDate || null,
        payment_terms: paymentTerms,
        notes_to_client: notesToClient,
        force_bollo: forceBollo,
        items,
        installments,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "save-failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-border p-4">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Cliente</h2>
        <p className="mt-2 text-[14px] text-fg">{client.display_name}</p>
        <p className="font-mono text-[11px] text-fg-muted">{client.address}, {client.zip} {client.city} ({client.province})</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label><span className="font-mono text-[10.5px] text-fg-soft">Data emissione</span>
            <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-[12px]" />
          </label>
          <label><span className="font-mono text-[10.5px] text-fg-soft">Scadenza (se senza rate)</span>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-[12px]" />
          </label>
        </div>
      </section>

      <section className="rounded-md border border-border p-4">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Righe</h2>
        <ul className="mt-3 space-y-3">
          {items.map((it, i) => (
            <li key={i} className="grid grid-cols-12 items-end gap-2 border-b border-border pb-3">
              <div className="col-span-12 sm:col-span-6">
                <span className="font-mono text-[10px] text-fg-soft">Descrizione</span>
                <input value={it.description} onChange={e => updateItem(i, { description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 text-[13px]" />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <span className="font-mono text-[10px] text-fg-soft">Q.tà</span>
                <input type="number" step="0.01" value={it.quantity}
                  onChange={e => updateItem(i, { quantity: parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 text-right font-mono text-[12px]" />
              </div>
              <div className="col-span-5 sm:col-span-3">
                <span className="font-mono text-[10px] text-fg-soft">Prezzo (cent)</span>
                <input type="number" step="1" value={it.unit_price_cents}
                  onChange={e => updateItem(i, { unit_price_cents: parseInt(e.target.value, 10) || 0 })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 text-right font-mono text-[12px]" />
              </div>
              <div className="col-span-3 sm:col-span-1 flex items-end justify-end gap-1">
                <button type="button" onClick={() => move(i, -1)} aria-label="Sposta su" className="press rounded border border-border px-1.5 py-1 font-mono text-[10px]">↑</button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Sposta giù" className="press rounded border border-border px-1.5 py-1 font-mono text-[10px]">↓</button>
                <button type="button" onClick={() => removeItem(i)} aria-label="Rimuovi" className="press rounded border border-border px-1.5 py-1 font-mono text-[10px]">×</button>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" onClick={addItem}
          className="press mt-3 rounded-md border border-border-strong bg-bg-alt px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em]">
          + Aggiungi riga
        </button>
      </section>

      <section className="rounded-md border border-border p-4">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Totali</h2>
        <dl className="mt-3 space-y-1 text-[14px]">
          <div className="flex justify-between"><dt>Subtotale</dt><dd className="font-mono">{(totals.subtotal_cents/100).toFixed(2)}€</dd></div>
          <div className="flex justify-between"><dt>Bollo</dt><dd className="font-mono">{(totals.bollo_cents/100).toFixed(2)}€</dd></div>
          <div className="flex justify-between border-t border-border pt-1 text-[16px] font-semibold"><dt>Totale</dt><dd className="font-mono">{(totals.total_cents/100).toFixed(2)}€</dd></div>
        </dl>
        <label className="mt-3 inline-flex items-center gap-2 font-mono text-[11px]">
          <input type="checkbox"
            checked={forceBollo ?? totals.bollo_cents > 0}
            onChange={e => setForceBollo(e.target.checked)} />
          Forza bollo (auto: {totals.subtotal_cents > settings.bollo_threshold_cents ? "sì" : "no"})
        </label>
      </section>

      <InstallmentsSection
        totalCents={totals.total_cents}
        minInstallmentCents={settings.min_installment_cents}
        initial={installments}
        onChange={setInstallments}
      />

      <section className="rounded-md border border-border p-4">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Note al cliente</h2>
        <textarea value={notesToClient} onChange={e => setNotesToClient(e.target.value)} rows={3}
          className="mt-2 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[13px]" />
        <label className="mt-3 block"><span className="font-mono text-[10.5px] text-fg-soft">Termini di pagamento</span>
          <input value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}
            className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[13px]" /></label>
      </section>

      <div className="sticky bottom-0 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        {error ? <span className="font-mono text-[11px] text-red-600">{error}</span> : <span />}
        <div className="flex items-center gap-2">
          <button type="button" onClick={save} disabled={saving}
            className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg disabled:opacity-50">
            {saving ? "Salvataggio…" : "Salva bozza"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Pages preventivi e fatture (lista + nuovo + dettaglio)**

Crea queste 6 pagine. Sono praticamente identiche a coppie (preventivi/fatture); l'unica differenza è il `kind` (`quote`/`invoice`) e i label.

`src/app/admin/preventivi/page.tsx`:

```tsx
import { listDocuments } from "@/lib/admin/documents";
import { DocumentsTable } from "@/components/admin/documents-table";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function PreventiviPage() {
  const docs = await listDocuments("quote");
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Preventivi</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Preventivi</h1>
        </div>
        <Link href="/admin/preventivi/nuovo" className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">+ Nuovo</Link>
      </div>
      <div className="mt-8"><DocumentsTable docs={docs} basePath="/admin/preventivi" /></div>
    </>
  );
}
```

Stesso schema per `src/app/admin/fatture/page.tsx` (cambia `"quote"`→`"invoice"`, label "Fatture", basePath `/admin/fatture`).

`src/components/admin/documents-table.tsx`:

```tsx
import Link from "next/link";
import type { Document } from "@/lib/admin/documents";

const STATUS_LABELS: Record<string, string> = {
  draft: "Bozza", issued: "Emesso", sent_sdi: "Inviato SDI",
  delivered_sdi: "Consegnato SDI", rejected_sdi: "Scartato SDI",
  partially_paid: "Pagato parz.", paid: "Pagato", cancelled: "Annullato",
};

export function DocumentsTable({ docs, basePath }: { docs: Document[]; basePath: string }) {
  if (docs.length === 0) return <p className="text-[14px] text-fg-muted">Nessun documento.</p>;
  return (
    <table className="w-full border-collapse text-[14px]">
      <thead><tr className="border-b border-border text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
        <th className="py-2">Numero</th><th>Data</th><th>Stato</th><th className="text-right">Totale</th><th></th>
      </tr></thead>
      <tbody>
        {docs.map(d => (
          <tr key={d.id} className="border-b border-border">
            <td className="py-3 font-mono text-[12px]">{d.number ?? `(bozza ${d.id.slice(0,6)})`}</td>
            <td className="py-3 font-mono text-[12px] text-fg-muted">{d.issue_date}</td>
            <td className="py-3 font-mono text-[12px]">{STATUS_LABELS[d.status] ?? d.status}</td>
            <td className="py-3 text-right font-mono text-[12px]">{(d.total_cents/100).toFixed(2)}€</td>
            <td className="py-3 text-right"><Link href={`${basePath}/${d.id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

`src/app/admin/preventivi/nuovo/page.tsx` (analogo per fatture):

```tsx
import { listClients } from "@/lib/admin/clients";
import { NewDocumentForm } from "@/components/admin/new-document-form";

export const dynamic = "force-dynamic";
export default async function NuovoPreventivoPage() {
  const clients = await listClients();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Preventivi / Nuovo</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Nuovo preventivo</h1>
      <div className="mt-8"><NewDocumentForm kind="quote" clients={clients} /></div>
    </>
  );
}
```

Crea anche `src/components/admin/new-document-form.tsx` semplice: select cliente + bottone "Crea bozza" → POST `/api/admin/documents` → redirect a `/admin/{preventivi|fatture}/[id]`.

`src/app/admin/preventivi/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getDocumentBundle } from "@/lib/admin/documents";
import { getClient } from "@/lib/admin/clients";
import { loadSettings } from "@/lib/admin/settings";
import { DocumentEditor } from "@/components/admin/document-editor";

export const dynamic = "force-dynamic";

export default async function PreventivoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bundle = await getDocumentBundle(id);
  if (!bundle || bundle.document.kind !== "quote") notFound();
  const client = await getClient(bundle.document.client_id);
  if (!client) notFound();
  const settings = await loadSettings();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Preventivi / {bundle.document.number ?? "Bozza"}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">{bundle.document.number ?? "Bozza preventivo"}</h1>
      <div className="mt-8">
        <DocumentEditor document={bundle.document} items={bundle.items} installments={bundle.installments} client={client} settings={settings} />
      </div>
    </>
  );
}
```

Identico per fatture (cambia `"quote"`→`"invoice"`).

- [ ] **Step 7: Manual smoke**

`/admin/preventivi/nuovo` → seleziona cliente → crea → editor si apre → aggiungi riga `Consulenza | 1 | 100000` → totale 1000€, no bollo (sotto soglia? wait, 1000€ > €77.47 → bollo 2€) → totale 1002€ → abilita rate (n=2, prima 2026-06-01) → vedi 2 rate da 50100 cent ciascuna → salva → ricarica pagina, dati persistiti.

- [ ] **Step 8: Commit**

```bash
git add src/lib/admin/documents.ts src/app/api/admin/documents src/app/admin/preventivi src/app/admin/fatture src/components/admin/document-editor.tsx src/components/admin/installments-section.tsx src/components/admin/documents-table.tsx src/components/admin/new-document-form.tsx
git commit -m "feat(admin): document editor (draft) + items + rate + lista"
```

---

## Task 11: PDF rendering with @react-pdf/renderer

**Files:**
- Modify: `package.json` (+`@react-pdf/renderer`)
- Create: `src/lib/admin/pdf/invoice-template.tsx`
- Create: `src/lib/admin/pdf/quote-template.tsx`
- Create: `src/lib/admin/pdf/render.ts`
- Create: `src/app/api/admin/documents/[id]/pdf/route.ts`

- [ ] **Step 1: Install dep**

```bash
npm install @react-pdf/renderer
```

- [ ] **Step 2: Template comune (helpers + componenti riusati)**

`src/lib/admin/pdf/invoice-template.tsx`:

```tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AdminSettings } from "@/lib/admin/settings";
import type { Document as Doc, DocumentItem, Installment } from "@/lib/admin/documents";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#09090b" },
  h1: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  meta: { fontSize: 9, color: "#71717a" },
  section: { marginTop: 16 },
  cols: { flexDirection: "row", justifyContent: "space-between" },
  col: { width: "48%" },
  itemsHead: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#e4e4e7", paddingBottom: 4, marginBottom: 4 },
  itemsRow: { flexDirection: "row", paddingVertical: 3, borderBottomWidth: 0.5, borderColor: "#e4e4e7" },
  cDesc: { width: "55%" },
  cQty: { width: "15%", textAlign: "right" },
  cPrice: { width: "15%", textAlign: "right" },
  cTotal: { width: "15%", textAlign: "right" },
  totalsBox: { marginTop: 12, alignSelf: "flex-end", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totalsRowFinal: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#09090b", paddingTop: 4, marginTop: 4, fontWeight: "bold" },
  installmentsHead: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#e4e4e7", paddingBottom: 3, marginBottom: 3 },
  installmentsRow: { flexDirection: "row", paddingVertical: 2 },
  iCol1: { width: "50%" }, iCol2: { width: "30%", textAlign: "right" }, iCol3: { width: "20%", textAlign: "right" },
  footer: { position: "absolute", bottom: 36, left: 36, right: 36, fontSize: 8, color: "#71717a", borderTopWidth: 0.5, borderColor: "#e4e4e7", paddingTop: 6 },
});

function fmt(c: number) { return (c/100).toFixed(2).replace(".", ",") + " €"; }

export function InvoicePdf({ doc, items, installments, settings, clientSnapshot }: {
  doc: Doc; items: DocumentItem[]; installments: Installment[];
  settings: AdminSettings; clientSnapshot: Record<string, string | null>;
}) {
  const isQuote = doc.kind === "quote";
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.cols}>
          <View style={s.col}>
            <Text style={s.h1}>{settings.business_name}</Text>
            <Text style={s.meta}>{settings.address}</Text>
            <Text style={s.meta}>{settings.zip} {settings.city} ({settings.province})</Text>
            <Text style={s.meta}>P.IVA {settings.vat_number} · CF {settings.tax_code}</Text>
            {settings.pec_email ? <Text style={s.meta}>PEC: {settings.pec_email}</Text> : null}
          </View>
          <View style={s.col}>
            <Text style={[s.h1, { textAlign: "right" }]}>
              {isQuote ? "Preventivo" : "Fattura"} {doc.number ?? "(bozza)"}
            </Text>
            <Text style={[s.meta, { textAlign: "right" }]}>Data emissione: {doc.issue_date}</Text>
            {doc.due_date ? <Text style={[s.meta, { textAlign: "right" }]}>Scadenza: {doc.due_date}</Text> : null}
          </View>
        </View>

        <View style={s.section}>
          <Text style={[s.meta, { fontWeight: "bold" }]}>Cliente</Text>
          <Text>{String(clientSnapshot.legal_name ?? clientSnapshot.display_name ?? "")}</Text>
          <Text style={s.meta}>{String(clientSnapshot.address)}, {String(clientSnapshot.zip)} {String(clientSnapshot.city)} ({String(clientSnapshot.province)})</Text>
          {clientSnapshot.vat_number ? <Text style={s.meta}>P.IVA {clientSnapshot.vat_number}</Text> : null}
          {clientSnapshot.tax_code ? <Text style={s.meta}>CF {clientSnapshot.tax_code}</Text> : null}
        </View>

        <View style={s.section}>
          <View style={s.itemsHead}>
            <Text style={s.cDesc}>Descrizione</Text>
            <Text style={s.cQty}>Q.tà</Text>
            <Text style={s.cPrice}>Prezzo</Text>
            <Text style={s.cTotal}>Totale</Text>
          </View>
          {items.map(it => (
            <View key={it.id} style={s.itemsRow}>
              <Text style={s.cDesc}>{it.description}</Text>
              <Text style={s.cQty}>{it.quantity}</Text>
              <Text style={s.cPrice}>{fmt(it.unit_price_cents)}</Text>
              <Text style={s.cTotal}>{fmt(it.line_total_cents)}</Text>
            </View>
          ))}
        </View>

        <View style={s.totalsBox}>
          <View style={s.totalsRow}><Text>Subtotale</Text><Text>{fmt(doc.subtotal_cents)}</Text></View>
          {doc.bollo_cents > 0 ? <View style={s.totalsRow}><Text>Bollo</Text><Text>{fmt(doc.bollo_cents)}</Text></View> : null}
          <View style={s.totalsRowFinal}><Text>Totale</Text><Text>{fmt(doc.total_cents)}</Text></View>
        </View>

        {installments.length > 0 ? (
          <View style={s.section}>
            <Text style={[s.meta, { fontWeight: "bold" }]}>Piano rate ({installments.length})</Text>
            <View style={s.installmentsHead}>
              <Text style={s.iCol1}>Scadenza</Text>
              <Text style={s.iCol2}>Importo</Text>
              <Text style={s.iCol3}>Stato</Text>
            </View>
            {installments.map(r => (
              <View key={r.id} style={s.installmentsRow}>
                <Text style={s.iCol1}>{r.due_date}</Text>
                <Text style={s.iCol2}>{fmt(r.amount_cents)}</Text>
                <Text style={s.iCol3}>{r.paid_at ? "Pagata" : "—"}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={s.section}>
          <Text style={[s.meta, { fontWeight: "bold" }]}>Modalità di pagamento</Text>
          <Text style={s.meta}>Bonifico bancario su IBAN: {settings.iban}</Text>
          {settings.bank_name ? <Text style={s.meta}>Banca: {settings.bank_name}</Text> : null}
          {doc.payment_terms ? <Text style={s.meta}>{doc.payment_terms}</Text> : null}
        </View>

        {doc.notes_to_client ? (
          <View style={s.section}>
            <Text style={[s.meta, { fontWeight: "bold" }]}>Note</Text>
            <Text style={s.meta}>{doc.notes_to_client}</Text>
          </View>
        ) : null}

        <Text style={s.footer}>
          {!isQuote ? "Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, della Legge 190/2014 e successive modifiche/integrazioni (regime forfettario)." : ""}
        </Text>
      </Page>
    </Document>
  );
}
```

`src/lib/admin/pdf/quote-template.tsx`: alias che riusa `InvoicePdf` con `doc.kind === "quote"` (cambia solo l'header, già gestito con la condizione `isQuote`).

```tsx
export { InvoicePdf as QuotePdf } from "./invoice-template";
```

- [ ] **Step 3: Render helper**

`src/lib/admin/pdf/render.ts`:

```ts
import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import type { ReactElement } from "react";

export async function pdfBuffer(element: ReactElement): Promise<Buffer> {
  return await renderToBuffer(element);
}
```

- [ ] **Step 4: GET PDF route**

`src/app/api/admin/documents/[id]/pdf/route.ts`:

```ts
import { NextResponse } from "next/server";
import React from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { getDocumentBundle } from "@/lib/admin/documents";
import { loadSettings } from "@/lib/admin/settings";
import { InvoicePdf } from "@/lib/admin/pdf/invoice-template";
import { pdfBuffer } from "@/lib/admin/pdf/render";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await ctx.params;
  const bundle = await getDocumentBundle(id);
  if (!bundle) return new NextResponse("not-found", { status: 404 });
  const settings = await loadSettings();
  const buf = await pdfBuffer(
    React.createElement(InvoicePdf, {
      doc: bundle.document,
      items: bundle.items,
      installments: bundle.installments,
      settings,
      clientSnapshot: bundle.document.client_snapshot as Record<string, string | null>,
    })
  );
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${bundle.document.number ?? "bozza"}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
```

- [ ] **Step 5: Aggiungi bottone "Anteprima PDF" all'editor**

Nel `DocumentEditor` (Task 10 step 5), nella sticky bar aggiungi prima del "Salva":

```tsx
<a href={`/api/admin/documents/${document.id}/pdf`} target="_blank" rel="noreferrer"
  className="press rounded-md border border-border-strong bg-bg-alt px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em]">
  Anteprima PDF
</a>
```

- [ ] **Step 6: Manual smoke**

Apri editor di una bozza con righe → click "Anteprima PDF" → si apre nuova tab con il PDF renderizzato. Verifica: header tuo, cliente, righe, totali, sezione rate (se hai compilato).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/lib/admin/pdf src/app/api/admin/documents/[id]/pdf/route.ts src/components/admin/document-editor.tsx
git commit -m "feat(admin): PDF rendering via @react-pdf/renderer + preview link"
```

---

## Task 12: XML FatturaPA builder (con multiple DettaglioPagamento)

**Files:**
- Create: `src/lib/admin/fattura-pa-xml.ts`
- Create: `src/lib/admin/__tests__/fattura-pa-xml.test.ts`
- Create: `src/lib/admin/__tests__/__fixtures__/sample-invoice.xml`

- [ ] **Step 1: Test snapshot**

`src/lib/admin/__tests__/fattura-pa-xml.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildFatturaPAXml } from "../fattura-pa-xml";

const sample = {
  doc: {
    number: "2026/0001", issue_date: "2026-05-13", total_cents: 100200,
    bollo_cents: 200, currency: "EUR", payment_terms: null,
  },
  cedente: {
    business_name: "Luca Perullo", vat_number: "12345678903", tax_code: "PRLLCU90A01F839U",
    address: "Via Roma 1", zip: "80100", city: "Napoli", province: "NA", country: "IT",
    regime_fiscale: "RF19",
  },
  cessionario: {
    legal_name: "ACME SRL", vat_number: "00743110157", tax_code: null,
    address: "Via Verdi 5", zip: "20100", city: "Milano", province: "MI", country: "IT",
    sdi_code: "ABCDEF1", pec_email: null,
  },
  items: [
    { position: 1, description: "Consulenza", quantity: 1, unit_price_cents: 100000, line_total_cents: 100000, vat_code: "N2.2" },
  ],
  installments: [
    { position: 1, due_date: "2026-06-13", amount_cents: 50100 },
    { position: 2, due_date: "2026-07-13", amount_cents: 50100 },
  ],
  iban: "IT60X0542811101000000123456",
};

describe("buildFatturaPAXml", () => {
  it("outputs valid header structure", () => {
    const xml = buildFatturaPAXml(sample);
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("<FatturaElettronica");
    expect(xml).toContain("versione=\"FPR12\"");
    expect(xml).toContain("<Numero>2026/0001</Numero>");
    expect(xml).toContain("<Natura>N2.2</Natura>");
    expect(xml).toContain("<RegimeFiscale>RF19</RegimeFiscale>");
  });
  it("emits TP02 + multiple DettaglioPagamento for installments", () => {
    const xml = buildFatturaPAXml(sample);
    expect(xml).toContain("<CondizioniPagamento>TP02</CondizioniPagamento>");
    const matches = xml.match(/<DettaglioPagamento>/g);
    expect(matches?.length).toBe(2);
    expect(xml).toContain("<DataScadenzaPagamento>2026-06-13</DataScadenzaPagamento>");
    expect(xml).toContain("<ImportoPagamento>501.00</ImportoPagamento>");
  });
  it("emits TP01 + single DettaglioPagamento when no installments", () => {
    const xml = buildFatturaPAXml({ ...sample, installments: [], doc: { ...sample.doc } });
    expect(xml).toContain("<CondizioniPagamento>TP01</CondizioniPagamento>");
    expect((xml.match(/<DettaglioPagamento>/g) ?? []).length).toBe(1);
    expect(xml).toContain("<ImportoPagamento>1002.00</ImportoPagamento>");
  });
  it("emits DatiBollo when bollo > 0", () => {
    const xml = buildFatturaPAXml(sample);
    expect(xml).toContain("<DatiBollo>");
    expect(xml).toContain("<ImportoBollo>2.00</ImportoBollo>");
  });
  it("escapes XML special chars in description", () => {
    const xml = buildFatturaPAXml({
      ...sample,
      items: [{ position: 1, description: "A & B <test>", quantity: 1, unit_price_cents: 100000, line_total_cents: 100000, vat_code: "N2.2" }],
    });
    expect(xml).toContain("A &amp; B &lt;test&gt;");
    expect(xml).not.toContain("A & B <test>");
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement builder**

`src/lib/admin/fattura-pa-xml.ts`:

```ts
type Cedente = {
  business_name: string; vat_number: string; tax_code: string;
  address: string; zip: string; city: string; province: string; country: string;
  regime_fiscale: string;
};
type Cessionario = {
  legal_name: string | null; vat_number: string | null; tax_code: string | null;
  address: string; zip: string; city: string; province: string; country: string;
  sdi_code: string | null; pec_email: string | null;
};
type Item = {
  position: number; description: string; quantity: number;
  unit_price_cents: number; line_total_cents: number; vat_code: string;
};
type Installment = { position: number; due_date: string; amount_cents: number };

export function buildFatturaPAXml(input: {
  doc: { number: string | null; issue_date: string; total_cents: number; bollo_cents: number; currency: string; payment_terms: string | null };
  cedente: Cedente;
  cessionario: Cessionario;
  items: Item[];
  installments: Installment[];
  iban: string;
}): string {
  const { doc, cedente, cessionario, items, installments, iban } = input;
  const sdi = (cessionario.sdi_code && cessionario.sdi_code.length === 7) ? cessionario.sdi_code : "0000000";
  const formatoTrasmissione = "FPR12";
  const idTrasmittente = `IT${cedente.vat_number}`;
  const progressivo = (doc.number ?? "00001").replace(/[^0-9]/g, "").slice(-5).padStart(5, "0");
  const eur = (cents: number) => (cents / 100).toFixed(2);

  const condizioni = installments.length > 1 ? "TP02" : "TP01";
  const pagamenti = installments.length > 0
    ? installments.map(r => `      <DettaglioPagamento>
        <ModalitaPagamento>MP05</ModalitaPagamento>
        <DataScadenzaPagamento>${r.due_date}</DataScadenzaPagamento>
        <ImportoPagamento>${eur(r.amount_cents)}</ImportoPagamento>
        <IBAN>${iban}</IBAN>
      </DettaglioPagamento>`).join("\n")
    : `      <DettaglioPagamento>
        <ModalitaPagamento>MP05</ModalitaPagamento>
        <ImportoPagamento>${eur(doc.total_cents)}</ImportoPagamento>
        <IBAN>${iban}</IBAN>
      </DettaglioPagamento>`;

  const datiBollo = doc.bollo_cents > 0
    ? `      <DatiBollo>
        <BolloVirtuale>SI</BolloVirtuale>
        <ImportoBollo>${eur(doc.bollo_cents)}</ImportoBollo>
      </DatiBollo>`
    : "";

  const cessionarioId = cessionario.vat_number
    ? `<IdFiscaleIVA><IdPaese>${cessionario.country}</IdPaese><IdCodice>${cessionario.vat_number}</IdCodice></IdFiscaleIVA>`
    : "";
  const cessionarioCF = cessionario.tax_code ? `<CodiceFiscale>${cessionario.tax_code}</CodiceFiscale>` : "";

  const righe = items.map(i => `      <DettaglioLinee>
        <NumeroLinea>${i.position}</NumeroLinea>
        <Descrizione>${esc(i.description)}</Descrizione>
        <Quantita>${i.quantity.toFixed(2)}</Quantita>
        <PrezzoUnitario>${eur(i.unit_price_cents)}</PrezzoUnitario>
        <PrezzoTotale>${eur(i.line_total_cents)}</PrezzoTotale>
        <AliquotaIVA>0.00</AliquotaIVA>
        <Natura>${i.vat_code}</Natura>
      </DettaglioLinee>`).join("\n");

  const subtotal = items.reduce((s, i) => s + i.line_total_cents, 0);

  return `<?xml version="1.0" encoding="UTF-8"?>
<FatturaElettronica versione="${formatoTrasmissione}" xmlns="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente><IdPaese>IT</IdPaese><IdCodice>${cedente.vat_number}</IdCodice></IdTrasmittente>
      <ProgressivoInvio>${progressivo}</ProgressivoInvio>
      <FormatoTrasmissione>${formatoTrasmissione}</FormatoTrasmissione>
      <CodiceDestinatario>${sdi}</CodiceDestinatario>
      ${cessionario.pec_email ? `<PECDestinatario>${esc(cessionario.pec_email)}</PECDestinatario>` : ""}
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA><IdPaese>IT</IdPaese><IdCodice>${cedente.vat_number}</IdCodice></IdFiscaleIVA>
        <CodiceFiscale>${cedente.tax_code}</CodiceFiscale>
        <Anagrafica><Denominazione>${esc(cedente.business_name)}</Denominazione></Anagrafica>
        <RegimeFiscale>${cedente.regime_fiscale}</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${esc(cedente.address)}</Indirizzo>
        <CAP>${cedente.zip}</CAP><Comune>${esc(cedente.city)}</Comune>
        <Provincia>${cedente.province}</Provincia><Nazione>${cedente.country}</Nazione>
      </Sede>
    </CedentePrestatore>
    <CessionarioCommittente>
      <DatiAnagrafici>
        ${cessionarioId}
        ${cessionarioCF}
        <Anagrafica><Denominazione>${esc(cessionario.legal_name ?? "Cliente privato")}</Denominazione></Anagrafica>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${esc(cessionario.address)}</Indirizzo>
        <CAP>${cessionario.zip}</CAP><Comune>${esc(cessionario.city)}</Comune>
        <Provincia>${cessionario.province}</Provincia><Nazione>${cessionario.country}</Nazione>
      </Sede>
    </CessionarioCommittente>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>TD01</TipoDocumento>
        <Divisa>${doc.currency}</Divisa>
        <Data>${doc.issue_date}</Data>
        <Numero>${doc.number ?? "BOZZA"}</Numero>
${datiBollo}
        <ImportoTotaleDocumento>${eur(doc.total_cents)}</ImportoTotaleDocumento>
        <Causale>Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, della Legge 190/2014 e successive modifiche/integrazioni</Causale>
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>
${righe}
      <DatiRiepilogo>
        <AliquotaIVA>0.00</AliquotaIVA>
        <Natura>N2.2</Natura>
        <ImponibileImporto>${eur(subtotal)}</ImponibileImporto>
        <Imposta>0.00</Imposta>
        <RiferimentoNormativo>Operazione non soggetta — regime forfettario L.190/2014</RiferimentoNormativo>
      </DatiRiepilogo>
    </DatiBeniServizi>
    <DatiPagamento>
      <CondizioniPagamento>${condizioni}</CondizioniPagamento>
${pagamenti}
    </DatiPagamento>
  </FatturaElettronicaBody>
</FatturaElettronica>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
```

- [ ] **Step 4: Run, expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/fattura-pa-xml.ts src/lib/admin/__tests__/fattura-pa-xml.test.ts
git commit -m "feat(admin): FatturaPA 1.2.2 XML builder with multi-installment support"
```

---

## Task 13: FiC OAuth (start + callback) + admin_settings update

**Files:**
- Modify: `.env.example` + `.env.local`
- Create: `src/lib/admin/fic/oauth.ts`
- Create: `src/app/api/admin/fic/oauth/start/route.ts`
- Create: `src/app/api/admin/fic/oauth/callback/route.ts`
- Modify: `src/app/admin/impostazioni/page.tsx`

- [ ] **Step 1: Aggiungi env vars FiC**

Append a `.env.example`:

```bash

# ── Fatture in Cloud ─────────────────────────────────────────────
# App OAuth creata su https://developers.fattureincloud.it/
FIC_CLIENT_ID=
FIC_CLIENT_SECRET=
FIC_REDIRECT_URI=http://localhost:3000/api/admin/fic/oauth/callback
FIC_WEBHOOK_SECRET=
```

In `.env.local`: stessi nomi con valori reali (creabili dopo aver registrato l'app su FiC dev portal — vedi `docs/admin/setup.md`).

- [ ] **Step 2: OAuth helpers**

`src/lib/admin/fic/oauth.ts`:

```ts
import "server-only";

const AUTH_URL = "https://api-v2.fattureincloud.it/oauth/authorize";
const TOKEN_URL = "https://api-v2.fattureincloud.it/oauth/token";
const SCOPES = "entity.clients:r entity.suppliers:r issued_documents.invoices:a issued_documents.quotes:a settings:r";

export function buildAuthUrl(state: string): string {
  const cid = process.env.FIC_CLIENT_ID;
  const ru = process.env.FIC_REDIRECT_URI;
  if (!cid || !ru) throw new Error("[fic] FIC_CLIENT_ID o FIC_REDIRECT_URI mancanti");
  const u = new URL(AUTH_URL);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", cid);
  u.searchParams.set("redirect_uri", ru);
  u.searchParams.set("scope", SCOPES);
  u.searchParams.set("state", state);
  return u.toString();
}

export async function exchangeCode(code: string): Promise<{
  access_token: string; refresh_token: string; expires_in: number;
}> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.FIC_CLIENT_ID,
      client_secret: process.env.FIC_CLIENT_SECRET,
      redirect_uri: process.env.FIC_REDIRECT_URI,
      code,
    }),
  });
  if (!res.ok) throw new Error(`[fic] token exchange failed: ${res.status} ${await res.text()}`);
  return await res.json() as { access_token: string; refresh_token: string; expires_in: number };
}

export async function refreshToken(refresh: string): Promise<{
  access_token: string; refresh_token: string; expires_in: number;
}> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: process.env.FIC_CLIENT_ID,
      client_secret: process.env.FIC_CLIENT_SECRET,
      refresh_token: refresh,
    }),
  });
  if (!res.ok) throw new Error(`[fic] refresh failed: ${res.status} ${await res.text()}`);
  return await res.json() as { access_token: string; refresh_token: string; expires_in: number };
}
```

- [ ] **Step 3: Routes start + callback**

`src/app/api/admin/fic/oauth/start/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { buildAuthUrl } from "@/lib/admin/fic/oauth";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  await requireAdmin();
  const state = randomBytes(16).toString("hex");
  const c = await cookies();
  c.set("fic_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });
  return NextResponse.redirect(buildAuthUrl(state));
}
```

`src/app/api/admin/fic/oauth/callback/route.ts`:

```ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { exchangeCode } from "@/lib/admin/fic/oauth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { supabase } = await requireAdmin();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const c = await cookies();
  const expectedState = c.get("fic_oauth_state")?.value;
  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/admin/impostazioni?fic=state-mismatch", url));
  }
  try {
    const tok = await exchangeCode(code);
    const expires = new Date(Date.now() + tok.expires_in * 1000).toISOString();
    const { data: row } = await supabase.from("admin_settings").select("id").maybeSingle();
    await supabase.from("admin_settings").update({
      fic_access_token: tok.access_token,
      fic_refresh_token: tok.refresh_token,
      fic_token_expires_at: expires,
    }).eq("id", (row as { id: string }).id);
    return NextResponse.redirect(new URL("/admin/impostazioni?fic=connected", url));
  } catch (e) {
    return NextResponse.redirect(new URL(`/admin/impostazioni?fic=error&msg=${encodeURIComponent(String(e))}`, url));
  }
}
```

- [ ] **Step 4: Aggiorna `/admin/impostazioni`** per mostrare bottone "Connetti" + stato connessione

In `src/app/admin/impostazioni/page.tsx`, sostituisci la sezione FiC placeholder:

```tsx
<div className="mt-12 rounded-md border border-border bg-bg-alt p-4">
  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Fatture in Cloud</p>
  {settings.fic_access_token ? (
    <p className="mt-2 text-[13.5px] text-fg-muted">
      Connesso. Token scade il {settings.fic_token_expires_at ?? "—"}.
    </p>
  ) : (
    <a href="/api/admin/fic/oauth/start"
      className="press mt-3 inline-block rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">
      Connetti Fatture in Cloud
    </a>
  )}
</div>
```

- [ ] **Step 5: Manual smoke (richiede env reali, può aspettare il setup di prod)**

Per ora basta verificare che `/api/admin/fic/oauth/start` redirige (con env vuote → 500 con messaggio chiaro).

- [ ] **Step 6: Commit**

```bash
git add .env.example src/lib/admin/fic src/app/api/admin/fic src/app/admin/impostazioni/page.tsx
git commit -m "feat(admin): FiC OAuth start + callback + token storage"
```

---

## Task 14: FiC API client (auto-refresh + create issued doc + transmit)

**Files:**
- Create: `src/lib/admin/fic/client.ts`
- Create: `src/lib/admin/fic/types.ts`
- Create: `src/lib/admin/__tests__/fic-payload.test.ts`

- [ ] **Step 1: Types**

`src/lib/admin/fic/types.ts`:

```ts
export type FicCreateInvoicePayload = {
  data: {
    type: "invoice" | "quote";
    numeration: string;       // "/2026" → FiC genera, oppure forziamo
    subject: string;
    visible_subject: string;
    rc_center: string;
    notes: string;
    rivalsa: number; rivalsa_taxable: number; cassa: number;
    cassa_taxable: number; cassa2: number; cassa2_taxable: number;
    global_cassa_taxable: number; withholding_tax: number;
    withholding_tax_taxable: number; other_withholding_tax: number;
    stamp_duty: number;       // bollo in EUR
    payment_method: { id?: number; name: string };
    use_split_payment: false;
    use_gross_prices: false;
    e_invoice: true;
    ei_data: { payment_method: "MP05" };
    entity: {
      // cessionario
      name: string; vat_number?: string; tax_code?: string;
      address_street: string; address_postal_code: string;
      address_city: string; address_province: string;
      country: string; ei_code: string; certified_email?: string;
    };
    items_list: Array<{
      product_id?: number; code?: string; name: string; description?: string;
      qty: number; net_price: number;
      vat: { id?: number; value: 0; description: string; ei_type: "N2.2"; ei_description: string };
      stock?: false;
    }>;
    payments_list: Array<{
      due_date: string;       // YYYY-MM-DD
      amount: number;         // EUR
      payment_terms: { days: 0; type: "standard" };
      status: "not_paid";
    }>;
  };
};

export type FicDocumentResponse = {
  data: { id: number; number: string };
};

export type FicEInvoiceStatus =
  | "not_sent" | "sent" | "delivered" | "rejected" | "no_recipient";
```

- [ ] **Step 2: Test mapping**

`src/lib/admin/__tests__/fic-payload.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildFicInvoicePayload } from "../fic/client";

describe("buildFicInvoicePayload", () => {
  it("maps installments to payments_list with EUR amounts", () => {
    const out = buildFicInvoicePayload({
      kind: "invoice",
      doc: { number: "2026/0001", issue_date: "2026-05-13", subtotal_cents: 100000, bollo_cents: 200, total_cents: 100200, payment_terms: null, notes_to_client: null },
      cessionario: { legal_name: "ACME", vat_number: "00743110157", tax_code: null, address: "Via X 1", zip: "20100", city: "Milano", province: "MI", country: "IT", sdi_code: "ABCDEF1", pec_email: null },
      items: [{ description: "Consulenza", quantity: 1, unit_price_cents: 100000 }],
      installments: [
        { due_date: "2026-06-13", amount_cents: 50100 },
        { due_date: "2026-07-13", amount_cents: 50100 },
      ],
    });
    expect(out.data.payments_list).toHaveLength(2);
    expect(out.data.payments_list[0]!.amount).toBe(501);
    expect(out.data.payments_list[0]!.due_date).toBe("2026-06-13");
    expect(out.data.stamp_duty).toBe(2);
    expect(out.data.entity.ei_code).toBe("ABCDEF1");
    expect(out.data.items_list[0]!.vat.ei_type).toBe("N2.2");
  });

  it("falls back to ei_code 0000000 when missing", () => {
    const out = buildFicInvoicePayload({
      kind: "invoice",
      doc: { number: "2026/0002", issue_date: "2026-05-13", subtotal_cents: 5000, bollo_cents: 0, total_cents: 5000, payment_terms: null, notes_to_client: null },
      cessionario: { legal_name: "Mario Rossi", vat_number: null, tax_code: "RSSMRA80A01H501U", address: "Via Y 2", zip: "00100", city: "Roma", province: "RM", country: "IT", sdi_code: null, pec_email: null },
      items: [{ description: "Servizio", quantity: 1, unit_price_cents: 5000 }],
      installments: [],
    });
    expect(out.data.entity.ei_code).toBe("0000000");
    expect(out.data.payments_list).toHaveLength(1);
    expect(out.data.payments_list[0]!.amount).toBe(50);
  });
});
```

- [ ] **Step 3: Run, expect FAIL.**

- [ ] **Step 4: Implement**

`src/lib/admin/fic/client.ts`:

```ts
import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import { refreshToken } from "./oauth";
import type { FicCreateInvoicePayload, FicDocumentResponse } from "./types";

const BASE = "https://api-v2.fattureincloud.it";

let refreshInFlight: Promise<string> | null = null;

export async function getValidAccessToken(): Promise<string> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("admin_settings")
    .select("id, fic_access_token, fic_refresh_token, fic_token_expires_at")
    .maybeSingle();
  const row = data as unknown as {
    id: string; fic_access_token: string | null; fic_refresh_token: string | null; fic_token_expires_at: string | null;
  } | null;
  if (!row?.fic_access_token || !row.fic_refresh_token) {
    throw new Error("[fic] non connesso. Vai su /admin/impostazioni → Connetti Fatture in Cloud");
  }
  const expires = row.fic_token_expires_at ? new Date(row.fic_token_expires_at).getTime() : 0;
  if (expires - Date.now() > 60_000) return row.fic_access_token;

  // Mutex per evitare double-refresh nello stesso processo
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const tok = await refreshToken(row.fic_refresh_token!);
      const newExpires = new Date(Date.now() + tok.expires_in * 1000).toISOString();
      await supabase.from("admin_settings").update({
        fic_access_token: tok.access_token,
        fic_refresh_token: tok.refresh_token,
        fic_token_expires_at: newExpires,
      }).eq("id", row.id);
      return tok.access_token;
    })().finally(() => { refreshInFlight = null; });
  }
  return await refreshInFlight;
}

async function ficFetch<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const token = await getValidAccessToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  if (!res.ok) throw new Error(`[fic] ${path} failed: ${res.status} ${await res.text()}`);
  return await res.json() as T;
}

export async function getCompanyId(): Promise<string> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("admin_settings").select("fic_company_id").maybeSingle();
  const cid = (data as { fic_company_id: string | null } | null)?.fic_company_id;
  if (!cid) throw new Error("[fic] fic_company_id non impostato. Selezionalo in /admin/impostazioni dopo la connessione.");
  return cid;
}

export async function createIssuedDocument(payload: FicCreateInvoicePayload): Promise<FicDocumentResponse> {
  const cid = await getCompanyId();
  return await ficFetch<FicDocumentResponse>(`/c/${cid}/issued_documents`, {
    method: "POST", json: payload,
  });
}

export async function transmitToSdi(docId: number): Promise<void> {
  const cid = await getCompanyId();
  await ficFetch<{ data: { id: number } }>(`/c/${cid}/issued_documents/${docId}/e_invoice/send`, {
    method: "POST", json: { data: {} },
  });
}

// ── Builder payload (puro, testabile) ───────────────────────────
export function buildFicInvoicePayload(input: {
  kind: "invoice" | "quote";
  doc: { number: string; issue_date: string; subtotal_cents: number; bollo_cents: number; total_cents: number; payment_terms: string | null; notes_to_client: string | null };
  cessionario: {
    legal_name: string | null; vat_number: string | null; tax_code: string | null;
    address: string; zip: string; city: string; province: string; country: string;
    sdi_code: string | null; pec_email: string | null;
  };
  items: Array<{ description: string; quantity: number; unit_price_cents: number }>;
  installments: Array<{ due_date: string; amount_cents: number }>;
}): FicCreateInvoicePayload {
  const c = input.cessionario;
  const ei = (c.sdi_code && c.sdi_code.length === 7) ? c.sdi_code : "0000000";
  const total = input.doc.total_cents;
  const payments = input.installments.length > 0
    ? input.installments.map(r => ({
        due_date: r.due_date, amount: +(r.amount_cents / 100).toFixed(2),
        payment_terms: { days: 0 as const, type: "standard" as const },
        status: "not_paid" as const,
      }))
    : [{
        due_date: input.doc.issue_date, amount: +(total / 100).toFixed(2),
        payment_terms: { days: 0 as const, type: "standard" as const },
        status: "not_paid" as const,
      }];
  return {
    data: {
      type: input.kind,
      numeration: "",
      subject: input.doc.notes_to_client ?? "",
      visible_subject: input.doc.notes_to_client ?? "",
      rc_center: "",
      notes: input.doc.notes_to_client ?? "",
      rivalsa: 0, rivalsa_taxable: 0, cassa: 0, cassa_taxable: 0,
      cassa2: 0, cassa2_taxable: 0, global_cassa_taxable: 0,
      withholding_tax: 0, withholding_tax_taxable: 0, other_withholding_tax: 0,
      stamp_duty: +(input.doc.bollo_cents / 100).toFixed(2),
      payment_method: { name: "Bonifico bancario" },
      use_split_payment: false, use_gross_prices: false,
      e_invoice: true,
      ei_data: { payment_method: "MP05" },
      entity: {
        name: c.legal_name ?? "Cliente privato",
        vat_number: c.vat_number ?? undefined,
        tax_code: c.tax_code ?? undefined,
        address_street: c.address, address_postal_code: c.zip,
        address_city: c.city, address_province: c.province, country: c.country,
        ei_code: ei,
        certified_email: c.pec_email ?? undefined,
      },
      items_list: input.items.map(i => ({
        name: i.description.slice(0, 100),
        description: i.description,
        qty: i.quantity,
        net_price: +(i.unit_price_cents / 100).toFixed(2),
        vat: { value: 0, description: "Esente N2.2", ei_type: "N2.2", ei_description: "Operazione non soggetta — regime forfettario" },
      })),
      payments_list: payments,
    },
  };
}
```

- [ ] **Step 5: Run, expect PASS.**

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/fic src/lib/admin/__tests__/fic-payload.test.ts
git commit -m "feat(admin): FiC API client + payload builder + auto-refresh"
```

---

## Task 15: Issue + transmit routes

**Files:**
- Create: `src/app/api/admin/documents/[id]/issue/route.ts`
- Create: `src/app/api/admin/documents/[id]/transmit/route.ts`
- Modify: `src/components/admin/document-editor.tsx`

- [ ] **Step 1: Issue route**

`src/app/api/admin/documents/[id]/issue/route.ts`:

```ts
import { NextResponse } from "next/server";
import React from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { getDocumentBundle } from "@/lib/admin/documents";
import { getClient } from "@/lib/admin/clients";
import { loadSettings } from "@/lib/admin/settings";
import { reserveNextNumber, fiscalYearOf } from "@/lib/admin/numbering";
import { InvoicePdf } from "@/lib/admin/pdf/invoice-template";
import { pdfBuffer } from "@/lib/admin/pdf/render";
import { buildFatturaPAXml } from "@/lib/admin/fattura-pa-xml";

export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const bundle = await getDocumentBundle(id);
  if (!bundle) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (bundle.document.status !== "draft") {
    return NextResponse.json({ error: "already-issued" }, { status: 409 });
  }
  const client = await getClient(bundle.document.client_id);
  if (!client) return NextResponse.json({ error: "client-missing" }, { status: 500 });
  const settings = await loadSettings();

  const fy = fiscalYearOf(bundle.document.issue_date);
  const { sequence, number } = await reserveNextNumber(bundle.document.kind, fy);

  // Snapshot cliente al momento dell'emissione
  const snapshot = { ...client };

  // Genera PDF
  const pdfBuf = await pdfBuffer(
    React.createElement(InvoicePdf, {
      doc: { ...bundle.document, number, fiscal_year: fy, sequence },
      items: bundle.items, installments: bundle.installments,
      settings, clientSnapshot: snapshot as unknown as Record<string, string | null>,
    })
  );
  const slug = number.replace(/\//g, "-");
  const pdfPath = `${fy}/${bundle.document.kind}/${slug}.pdf`;
  await supabase.storage.from("fiscal-documents").createSignedUrl(pdfPath, 60).catch(() => null); // ensure path is computed
  const { error: upPdf } = await (supabase as unknown as {
    storage: { from(b: string): { upload(p: string, body: Blob | Buffer | Uint8Array, opts?: { contentType?: string; upsert?: boolean }): Promise<{ error: unknown }> } };
  }).storage.from("fiscal-documents").upload(pdfPath, new Uint8Array(pdfBuf), { contentType: "application/pdf", upsert: true });
  if (upPdf) return NextResponse.json({ error: `pdf-upload: ${String(upPdf)}` }, { status: 500 });

  // Genera XML solo per fatture
  let xmlPath: string | null = null;
  if (bundle.document.kind === "invoice") {
    const xml = buildFatturaPAXml({
      doc: { number, issue_date: bundle.document.issue_date, total_cents: bundle.document.total_cents, bollo_cents: bundle.document.bollo_cents, currency: bundle.document.currency, payment_terms: bundle.document.payment_terms },
      cedente: { business_name: settings.business_name, vat_number: settings.vat_number, tax_code: settings.tax_code, address: settings.address, zip: settings.zip, city: settings.city, province: settings.province, country: settings.country, regime_fiscale: settings.regime_fiscale },
      cessionario: { legal_name: client.legal_name ?? client.display_name, vat_number: client.vat_number, tax_code: client.tax_code, address: client.address, zip: client.zip, city: client.city, province: client.province, country: client.country, sdi_code: client.sdi_code, pec_email: client.pec_email },
      items: bundle.items.map(i => ({ position: i.position, description: i.description, quantity: i.quantity, unit_price_cents: i.unit_price_cents, line_total_cents: i.line_total_cents, vat_code: i.vat_code })),
      installments: bundle.installments.map(r => ({ position: r.position, due_date: r.due_date, amount_cents: r.amount_cents })),
      iban: settings.iban,
    });
    xmlPath = `${fy}/${bundle.document.kind}/${slug}.xml`;
    const { error: upXml } = await (supabase as unknown as {
      storage: { from(b: string): { upload(p: string, body: Blob | Buffer | Uint8Array, opts?: { contentType?: string; upsert?: boolean }): Promise<{ error: unknown }> } };
    }).storage.from("fiscal-documents").upload(xmlPath, new TextEncoder().encode(xml), { contentType: "application/xml", upsert: true });
    if (upXml) return NextResponse.json({ error: `xml-upload: ${String(upXml)}` }, { status: 500 });
  }

  // Update documento
  const { error } = await supabase.from("documents").update({
    status: "issued",
    number, fiscal_year: fy, sequence,
    issued_at: new Date().toISOString(),
    client_snapshot: snapshot,
    pdf_storage_path: pdfPath,
    xml_storage_path: xmlPath,
  }).eq("id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });

  return NextResponse.json({ ok: true, number });
}
```

- [ ] **Step 2: Transmit route (solo per fatture)**

`src/app/api/admin/documents/[id]/transmit/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getDocumentBundle } from "@/lib/admin/documents";
import { getClient } from "@/lib/admin/clients";
import { loadSettings } from "@/lib/admin/settings";
import { buildFicInvoicePayload, createIssuedDocument, transmitToSdi } from "@/lib/admin/fic/client";

export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const bundle = await getDocumentBundle(id);
  if (!bundle) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (bundle.document.kind !== "invoice") {
    return NextResponse.json({ error: "only-invoices-go-to-sdi" }, { status: 400 });
  }
  if (bundle.document.status !== "issued" && bundle.document.status !== "rejected_sdi") {
    return NextResponse.json({ error: "wrong-status" }, { status: 409 });
  }
  const client = await getClient(bundle.document.client_id);
  if (!client) return NextResponse.json({ error: "client-missing" }, { status: 500 });
  const settings = await loadSettings();

  const payload = buildFicInvoicePayload({
    kind: "invoice",
    doc: {
      number: bundle.document.number ?? "",
      issue_date: bundle.document.issue_date,
      subtotal_cents: bundle.document.subtotal_cents,
      bollo_cents: bundle.document.bollo_cents,
      total_cents: bundle.document.total_cents,
      payment_terms: bundle.document.payment_terms,
      notes_to_client: bundle.document.notes_to_client,
    },
    cessionario: {
      legal_name: client.legal_name ?? client.display_name,
      vat_number: client.vat_number, tax_code: client.tax_code,
      address: client.address, zip: client.zip, city: client.city,
      province: client.province, country: client.country,
      sdi_code: client.sdi_code, pec_email: client.pec_email,
    },
    items: bundle.items.map(i => ({ description: i.description, quantity: i.quantity, unit_price_cents: i.unit_price_cents })),
    installments: bundle.installments.map(r => ({ due_date: r.due_date, amount_cents: r.amount_cents })),
  });

  try {
    const created = await createIssuedDocument(payload);
    await transmitToSdi(created.data.id);
    await supabase.from("documents").update({
      status: "sent_sdi",
      sdi_id_fic: String(created.data.id),
      sdi_message: null,
    }).eq("id", id);
    return NextResponse.json({ ok: true, fic_id: created.data.id });
  } catch (e) {
    await supabase.from("documents").update({
      sdi_message: String(e),
    }).eq("id", id);
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
```

- [ ] **Step 3: Bottoni nell'editor**

Nel `DocumentEditor` aggiungi al sticky bar (sezione bottoni):

```tsx
{document.status === "draft" ? (
  <button type="button" onClick={async () => {
    if (!confirm("Confermi l'emissione? Il numero verrà assegnato e il documento non sarà più editabile.")) return;
    const r = await fetch(`/api/admin/documents/${document.id}/issue`, { method: "POST" });
    if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error ?? "issue-failed"); return; }
    router.refresh();
  }}
    className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">
    Emetti
  </button>
) : null}
{document.kind === "invoice" && (document.status === "issued" || document.status === "rejected_sdi") ? (
  <button type="button" onClick={async () => {
    const r = await fetch(`/api/admin/documents/${document.id}/transmit`, { method: "POST" });
    if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error ?? "transmit-failed"); return; }
    router.refresh();
  }}
    className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">
    Trasmetti a SDI
  </button>
) : null}
```

- [ ] **Step 4: Manual smoke (dopo aver connesso FiC)**

In ambiente sandbox: bozza → "Emetti" → numero assegnato, stato `issued`, PDF in storage. Poi "Trasmetti a SDI" → FiC riceve, stato `sent_sdi`, vedi `sdi_id_fic` popolato.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/documents/[id]/issue src/app/api/admin/documents/[id]/transmit src/components/admin/document-editor.tsx
git commit -m "feat(admin): issue (assign number + PDF + XML) + transmit to SDI via FiC"
```

---

## Task 16: Webhook FiC + status sync

**Files:**
- Create: `src/app/api/admin/webhooks/fatture-in-cloud/route.ts`

- [ ] **Step 1: Webhook handler**

```ts
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Map dello stato SDI di FiC al nostro status
const STATUS_MAP: Record<string, string> = {
  not_sent: "issued",
  sent: "sent_sdi",
  delivered: "delivered_sdi",
  rejected: "rejected_sdi",
  no_recipient: "delivered_sdi",  // SDI ha messo a disposizione senza recapito
};

export async function POST(req: Request) {
  const secret = process.env.FIC_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("server misconfig", { status: 500 });
  const signature = req.headers.get("x-signature") ?? "";
  const raw = await req.text();
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  let payload: { data?: { id?: number; ei_status?: string; ei_message?: string | null } };
  try { payload = JSON.parse(raw); }
  catch { return new NextResponse("invalid json", { status: 400 }); }

  const ficId = payload.data?.id;
  const eiStatus = payload.data?.ei_status;
  if (!ficId || !eiStatus) return NextResponse.json({ ok: true, skipped: true });

  const newStatus = STATUS_MAP[eiStatus];
  if (!newStatus) return NextResponse.json({ ok: true, ignored: eiStatus });

  // Service role: bypassa RLS perché FiC non è autenticato come utente
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("documents")
    .update({ status: newStatus, sdi_message: payload.data?.ei_message ?? null })
    .eq("sdi_id_fic", String(ficId));
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Manual smoke**

Con `curl` finto (segna come 401 senza signature corretta):

```bash
curl -i -X POST http://localhost:3000/api/admin/webhooks/fatture-in-cloud -d '{}'
# Expected: 401 invalid signature
```

Poi calcola la signature giusta e verifica 200 + update.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/webhooks/fatture-in-cloud/route.ts
git commit -m "feat(admin): FiC webhook with HMAC validation + SDI status sync"
```

---

## Task 17: Mark installment paid + auto status update

**Files:**
- Create: `src/app/api/admin/documents/[id]/installments/[iid]/route.ts`
- Modify: `src/components/admin/installments-section.tsx` (aggiungi colonna stato + checkbox solo dopo issued)
- Create: `src/components/admin/installments-paid-list.tsx` (componente per documento issued)

- [ ] **Step 1: API route per segnare pagata**

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { deriveStatusFromInstallments } from "@/lib/admin/installments";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string; iid: string }> }) {
  const { supabase } = await requireAdmin();
  const { id, iid } = await ctx.params;
  const body = await req.json().catch(() => ({})) as { paid?: boolean; reference?: string };
  const paid_at = body.paid ? new Date().toISOString() : null;
  const payment_reference = typeof body.reference === "string" ? body.reference : null;
  const { error } = await supabase
    .from("document_installments")
    .update({ paid_at, payment_reference })
    .eq("id", iid).eq("document_id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });

  // Ricalcola lo status del documento
  const { data: rates } = await supabase
    .from("document_installments").select("paid_at").eq("document_id", id);
  const derived = deriveStatusFromInstallments((rates as unknown as { paid_at: string | null }[]) ?? []);
  if (derived) {
    await supabase.from("documents").update({ status: derived }).eq("id", id);
  }
  return NextResponse.json({ ok: true, status: derived });
}
```

- [ ] **Step 2: Componente "Lista rate con checkbox" da mostrare in editor SOLO se documento issued**

`src/components/admin/installments-paid-list.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Installment } from "@/lib/admin/documents";

export function InstallmentsPaidList({ docId, installments }: { docId: string; installments: Installment[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(iid: string, paid: boolean, reference: string) {
    setBusy(iid);
    await fetch(`/api/admin/documents/${docId}/installments/${iid}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paid, reference }),
    });
    setBusy(null);
    router.refresh();
  }

  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="border-b border-border text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
          <th className="py-2">#</th><th>Scadenza</th><th className="text-right">Importo</th><th>CRO</th><th className="text-right">Pagata</th>
        </tr>
      </thead>
      <tbody>
        {installments.map(r => (
          <tr key={r.id} className="border-b border-border">
            <td className="py-2 font-mono text-[11px] text-fg-muted">{r.position}</td>
            <td className="py-2 font-mono text-[12px]">{r.due_date}</td>
            <td className="py-2 text-right font-mono text-[12px]">{(r.amount_cents/100).toFixed(2)}€</td>
            <td className="py-2">
              <input
                defaultValue={r.payment_reference ?? ""}
                placeholder="rif. bonifico"
                onBlur={e => toggle(r.id, !!r.paid_at, e.target.value)}
                disabled={busy === r.id}
                className="w-full rounded border border-border bg-bg px-2 py-1 font-mono text-[11px]"
              />
            </td>
            <td className="py-2 text-right">
              <input type="checkbox" checked={!!r.paid_at}
                onChange={e => toggle(r.id, e.target.checked, r.payment_reference ?? "")}
                disabled={busy === r.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 3: Aggiungi questa lista in `DocumentEditor`** (mostra `InstallmentsSection` solo per draft, `InstallmentsPaidList` per issued+).

Nel `DocumentEditor` (Task 10), wrap la `<InstallmentsSection>`:

```tsx
{document.status === "draft" ? (
  <InstallmentsSection ... />
) : installments.length > 0 ? (
  <section className="rounded-md border border-border p-4">
    <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Piano rate</h2>
    <div className="mt-3"><InstallmentsPaidList docId={document.id} installments={initialInstallments} /></div>
  </section>
) : null}
```

(Quando il documento non è draft, l'editor è di sola lettura per items/totali — lo riflettiamo in Task 18.)

- [ ] **Step 4: Manual smoke**

Documento issued con 2 rate → segna 1 come pagata → status diventa `partially_paid`. Segna anche la seconda → diventa `paid`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/documents/[id]/installments src/components/admin/installments-paid-list.tsx src/components/admin/document-editor.tsx
git commit -m "feat(admin): mark installment paid + auto status (partially_paid/paid)"
```

---

## Task 18: Dashboard reale (KPI + da fare + rate in scadenza)

**Files:**
- Modify: `src/app/admin/page.tsx`
- Create: `src/lib/admin/dashboard.ts`

- [ ] **Step 1: Aggregazioni**

`src/lib/admin/dashboard.ts`:

```ts
import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export async function loadDashboard() {
  const supabase = await createServerClient();
  const year = new Date().getUTCFullYear();
  const todayISO = new Date().toISOString().slice(0, 10);

  const { data: invoices } = await supabase.from("documents")
    .select("total_cents, status, kind, fiscal_year")
    .eq("kind", "invoice").eq("fiscal_year", year);
  const list = (invoices as unknown as { total_cents: number; status: string }[] | null) ?? [];
  const fatturatoYTD = list.reduce((s, d) => s + d.total_cents, 0);
  const incassatoYTD = list.filter(d => d.status === "paid").reduce((s, d) => s + d.total_cents, 0);

  const { data: dueRates } = await supabase.from("document_installments")
    .select("id, due_date, amount_cents, document_id")
    .is("paid_at", null).order("due_date", { ascending: true });
  const allDue = (dueRates as unknown as { id: string; due_date: string; amount_cents: number; document_id: string }[] | null) ?? [];
  const overdue = allDue.filter(r => r.due_date < todayISO);
  const upcoming = allDue.filter(r => r.due_date >= todayISO).slice(0, 10);

  const { data: drafts } = await supabase.from("documents")
    .select("id, kind, total_cents, created_at").eq("status", "draft").order("created_at", { ascending: false }).limit(5);
  const { data: toTransmit } = await supabase.from("documents")
    .select("id, number, total_cents").eq("kind", "invoice").eq("status", "issued").order("issued_at", { ascending: false });

  return {
    year, fatturatoYTD, incassatoYTD,
    invoiceCount: list.length,
    overdue, upcoming,
    drafts: (drafts as unknown[] ?? []) as { id: string; kind: string; total_cents: number; created_at: string }[],
    toTransmit: (toTransmit as unknown[] ?? []) as { id: string; number: string | null; total_cents: number }[],
  };
}
```

- [ ] **Step 2: Page**

```tsx
import Link from "next/link";
import { loadDashboard } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

const fmt = (c: number) => (c/100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });

export default async function AdminDashboardPage() {
  const d = await loadDashboard();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Dashboard</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Anno {d.year}</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card label="Fatturato emesso" value={fmt(d.fatturatoYTD)} />
        <Card label="Incassato" value={fmt(d.incassatoYTD)} />
        <Card label="N° fatture" value={String(d.invoiceCount)} />
      </div>

      {d.overdue.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-red-600">Rate scadute non pagate ({d.overdue.length})</h2>
          <ul className="mt-3 divide-y divide-border rounded-md border border-border">
            {d.overdue.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px]">
                <span className="font-mono text-[12px]">{r.due_date}</span>
                <span className="font-mono text-[12px]">{fmt(r.amount_cents)}</span>
                <Link href={`/admin/fatture/${r.document_id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Prossime rate in scadenza</h2>
        {d.upcoming.length === 0 ? (
          <p className="mt-2 font-mono text-[11px] text-fg-soft">Nessuna in scadenza.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-md border border-border">
            {d.upcoming.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px]">
                <span className="font-mono text-[12px]">{r.due_date}</span>
                <span className="font-mono text-[12px]">{fmt(r.amount_cents)}</span>
                <Link href={`/admin/fatture/${r.document_id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {d.toTransmit.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Da trasmettere a SDI</h2>
          <ul className="mt-3 divide-y divide-border rounded-md border border-border">
            {d.toTransmit.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px]">
                <span className="font-mono text-[12px]">{r.number}</span>
                <span className="font-mono text-[12px]">{fmt(r.total_cents)}</span>
                <Link href={`/admin/fatture/${r.id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {d.drafts.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Bozze</h2>
          <ul className="mt-3 divide-y divide-border rounded-md border border-border">
            {d.drafts.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px]">
                <span className="font-mono text-[12px]">{r.kind === "invoice" ? "Fattura" : "Preventivo"} bozza · {r.created_at.slice(0, 10)}</span>
                <span className="font-mono text-[12px]">{fmt(r.total_cents)}</span>
                <Link href={`/admin/${r.kind === "invoice" ? "fatture" : "preventivi"}/${r.id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-4">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
```

- [ ] **Step 3: Manual smoke + Commit**

```bash
git add src/lib/admin/dashboard.ts src/app/admin/page.tsx
git commit -m "feat(admin): dashboard with YTD KPIs + rate scadute/in-scadenza + da trasmettere"
```

---

## Self-Review

Checklist eseguita dopo aver scritto il piano:

**1. Spec coverage** — ogni sezione della spec ha un task:
- §3 Auth → Task 1 ✓
- §4 Schema (incluso `min_installment_cents`, `document_installments`, status `partially_paid`) → Task 2 ✓
- §5 Routing → Tasks 1, 6, 7, 9, 10, 13, 15, 16, 17 ✓
- §6 UI (chrome, dashboard, lista clienti, form, editor con piano rate, lista doc) → Tasks 6, 7, 9, 10, 18 ✓
- §7 FiC OAuth + client + transmit + webhook → Tasks 13, 14, 15, 16 ✓
- §8 PDF + XML → Tasks 11, 12 ✓
- §9 Numerazione → Task 5 + Task 15 ✓
- §10 Totals → Task 4 ✓
- §11 Validators → Task 3 ✓
- §12 State machine + rate auto → Task 17 ✓
- §13 Risk register → mitigazioni in Tasks 14 (mutex), 15 (numerazione), 16 (HMAC) ✓
- §14 Scope guardrail → tutto v1, niente Stripe (mai), niente email auto (rinviato) ✓
- §15 Migrazioni → Task 2 ✓
- §16 Env → Tasks 1, 13 ✓
- §17 Testing → Tasks 0, 3, 4, 5, 8, 12, 14 ✓
- §18 Deliverables → 19 task coprono i 12 deliverable ✓
- §19 Note operative → `docs/admin/setup.md` (Task 2) ✓

**2. Placeholder scan** — Nessun "TBD"/"TODO"/"add validation"/"fill in" nei task.

**3. Type consistency**:
- `Document.kind` = `"quote" | "invoice"` (`numbering.ts`, `documents.ts`, `fattura-pa-xml.ts`, `fic/client.ts`) ✓
- `Installment.due_date` = string ISO YYYY-MM-DD ovunque ✓
- `*_cents` = int Postgres ovunque ✓
- `requireAdmin()` ritorna `{ user, supabase }` (Task 1, usato in Tasks 7, 9, 10, 13, 15, 16, 17) ✓
- `loadSettings()` ritorna `AdminSettings` (Task 7, usato in Tasks 10, 11, 15, 18) ✓
- `validateInstallments(rows, total, settings)` firma identica in Tasks 8, 10 ✓
- `STATUS_MAP.no_recipient → "delivered_sdi"` documentato (Task 16): rispetta lo stato derivato da §12 della spec.

Tutto consistente. Piano pronto per l'esecuzione.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-13-admin-fatturazione.md`. Two execution options:

**1. Subagent-Driven (recommended)** — Dispatcho un subagent fresco per ogni task, review tra un task e l'altro, iterazione veloce. Buono qui perché il piano è grosso (19 task, ~1600 righe) e ogni task ha boundary chiari.

**2. Inline Execution** — Eseguo i task in questa sessione con checkpoint per review. Più lento, ma vedi tutto live.

Quale preferisci? (O preferisci solo committare il piano e eseguire dopo?)



