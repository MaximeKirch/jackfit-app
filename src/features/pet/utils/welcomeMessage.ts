import i18n from '@/shared/i18n'

type TimeSinceLastVisit =
  | 'first_time'
  | 'same_day'
  | 'yesterday'
  | 'few_days'
  | 'week_plus'

const getTimeSinceLastVisit = (lastVisitISO: string | null): TimeSinceLastVisit => {
  if (!lastVisitISO) return 'first_time'

  const hoursSince = (Date.now() - new Date(lastVisitISO).getTime()) / (1000 * 60 * 60)

  if (hoursSince < 12) return 'same_day'
  if (hoursSince < 36) return 'yesterday'
  if (hoursSince < 96) return 'few_days'
  return 'week_plus'
}

const pickRandom = (arr: string[]): string =>
  arr[Math.floor(Math.random() * arr.length)] ?? arr[0]!

export const getWelcomeMessage = (lastVisitISO: string | null, hasEnoughData = true): string => {
  if (!hasEnoughData) {
    const messages = i18n.t('home.welcome_new', { returnObjects: true }) as string[]
    return pickRandom(messages)
  }
  const period = getTimeSinceLastVisit(lastVisitISO)
  const bucket = i18n.t(`home.welcome_return.${period}`, { returnObjects: true }) as string[]
  return pickRandom(bucket.length > 0 ? bucket : [i18n.t('home.welcome_fallback')])
}
