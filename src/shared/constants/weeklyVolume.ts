export const WEEKLY_VOLUME_BUCKETS = ['under_3h', '3_6h', '6_10h', '10h_plus'] as const

export type WeeklyVolumeBucket = (typeof WEEKLY_VOLUME_BUCKETS)[number]

// Onboarding bucket → target hours to use as weekly_activity_goal_hours.
// Slightly aspirational within each bucket. Tune here if the calibration
// drifts — the value is stored on the profile at onboarding time and can
// be overridden by the user from the Profile screen.
export const VOLUME_TO_TARGET_HOURS: Record<WeeklyVolumeBucket, number> = {
  under_3h: 4,
  '3_6h':   6,
  '6_10h':  9,
  '10h_plus': 12,
}

export const volumeToTargetHours = (
  bucket: WeeklyVolumeBucket | null,
): number | null => (bucket ? VOLUME_TO_TARGET_HOURS[bucket] : null)
