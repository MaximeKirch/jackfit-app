-- RGPD art. 17: propager la suppression d'un utilisateur (auth.users)
-- vers toutes les tables applicatives contenant ses données.
--
-- NOTE: appliqué manuellement via le SQL editor du dashboard Supabase
-- le 2026-08-05 avant l'intégration au pipeline CLI. Ce fichier sert
-- de trace historique et sera vu comme "déjà appliqué" lors du prochain
-- pull.

begin;

alter table public.profiles
  drop constraint if exists profiles_id_fkey,
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

alter table public.messages
  drop constraint if exists messages_user_id_fkey,
  add constraint messages_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.chat_usage
  drop constraint if exists chat_usage_user_id_fkey,
  add constraint chat_usage_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.health_data_raw
  drop constraint if exists health_data_raw_user_id_fkey,
  add constraint health_data_raw_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.weekly_scores
  drop constraint if exists weekly_scores_user_id_fkey,
  add constraint weekly_scores_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.pet_progression
  drop constraint if exists pet_progression_user_id_fkey,
  add constraint pet_progression_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.xp_transactions
  drop constraint if exists xp_transactions_user_id_fkey,
  add constraint xp_transactions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

commit;
