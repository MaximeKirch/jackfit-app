-- Add AI consent tracking to profiles.
-- Required by Apple App Store Review Guideline 5.1.2(i) (effective 2025-11-13):
-- explicit consent must be recorded before sharing user data with third-party
-- AI providers (in this app: Anthropic/Claude via the /chat endpoint).
-- Null = consent not granted (or not yet asked). Timestamp = moment of grant.

alter table public.profiles
  add column if not exists ai_consent_given_at timestamptz;

comment on column public.profiles.ai_consent_given_at is
  'Timestamp when the user granted consent to share health summary and chat history with Anthropic/Claude. Null if not granted.';
