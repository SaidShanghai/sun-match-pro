
-- Add missing diagnostic columns to quote_requests
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS objectif text,
  ADD COLUMN IF NOT EXISTS type_abonnement text,
  ADD COLUMN IF NOT EXISTS puissance_souscrite text,
  ADD COLUMN IF NOT EXISTS selected_usages text[],
  ADD COLUMN IF NOT EXISTS description_projet text,
  ADD COLUMN IF NOT EXISTS adresse_projet text,
  ADD COLUMN IF NOT EXISTS ville_projet text,
  ADD COLUMN IF NOT EXISTS date_debut text,
  ADD COLUMN IF NOT EXISTS date_fin text,
  ADD COLUMN IF NOT EXISTS pv_existante text,
  ADD COLUMN IF NOT EXISTS extension_install text,
  ADD COLUMN IF NOT EXISTS subvention_recue text,
  ADD COLUMN IF NOT EXISTS elig_decl jsonb;
