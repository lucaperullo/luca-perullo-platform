# Setup admin fatturazione

Procedura una-tantum per attivare /admin in produzione.

## 1. Migrazione DB

Esegui `supabase/migrations/2026_05_13_admin_fatturazione.sql` sul progetto Supabase di produzione (Studio → SQL editor → Run).

## 2. Bucket Storage

Su Supabase Studio: Storage → New bucket → Name: `fiscal-documents`, Public: **off**, File size limit: 10MB, Allowed MIME types: `application/pdf,application/xml,text/xml`.

Poi su SQL editor:

```sql
create policy "admin reads fiscal-documents" on storage.objects
  for select to authenticated
  using (bucket_id = 'fiscal-documents'
         and auth.jwt()->>'email' = 'luca.perullo@icloud.com');

create policy "admin writes fiscal-documents" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fiscal-documents'
              and auth.jwt()->>'email' = 'luca.perullo@icloud.com');
```

## 3. Sanity check RPC

```sql
select next_document_number('invoice', 2026);
-- Expected: 1
select next_document_number('invoice', 2026);
-- Expected: 2
delete from document_sequences;  -- reset
```

## 4. Env vars (Vercel + .env.local)

Aggiungi:
- `ADMIN_EMAIL=luca.perullo@icloud.com`
- `FIC_CLIENT_ID`, `FIC_CLIENT_SECRET`, `FIC_REDIRECT_URI`, `FIC_WEBHOOK_SECRET` (popolati nel Task 13)

## 5. Compila anagrafica

Login come admin, vai a `/admin/impostazioni`, compila anagrafica e IBAN, click "Connetti Fatture in Cloud" (dopo Task 13).

## 6. Webhook FiC

Su FiC dashboard → Sviluppatori → Webhook: URL `https://lucaperullo.it/api/admin/webhooks/fatture-in-cloud`, evento "Documento — cambio stato SDI". Copia il secret in `FIC_WEBHOOK_SECRET`.
