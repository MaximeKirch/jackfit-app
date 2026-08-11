alter table profiles
  add column current_weekly_volume text check (
    current_weekly_volume in ('under_3h', '3_6h', '6_10h', '10h_plus')
  ),
  add column weekly_activity_goal_hours numeric;
