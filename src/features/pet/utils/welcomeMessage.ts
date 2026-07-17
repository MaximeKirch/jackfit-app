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

const NEW_USER_MESSAGES = [
  "On ne se connaît pas encore — bouge un peu et je vais commencer à comprendre comment tu vas.",
  "Donne-moi quelques jours de données et je te dirai comment je me sens.",
]

const WELCOME_MESSAGES: Record<TimeSinceLastVisit, string[]> = {
  first_time: [
    "Salut. Moi c'est Uma.",
  ],
  same_day: [
    "Nous revoilà.",
    "Toi aussi tu reviens voir ?",
    "Rebonjour.",
  ],
  yesterday: [
    "Alors, cette nuit ?",
    "Moi ça va, plutôt frais et toi ?",
    "Nouvelle journée, on peut faire plein de choses.",
  ],
  few_days: [
    "Tiens, te revoilà.",
    "Ça faisait un bail. Raconte.",
    "On s'est ennuyés un peus.",
  ],
  week_plus: [
    "Ah. Ça faisait un bail, ça.",
    "Je me demandais où t'étais passé, franchement.",
    "J'ai gardé la maison. Toi, du nouveau ?",
  ],
}

export const getWelcomeMessage = (lastVisitISO: string | null, hasEnoughData = true): string => {
  if (!hasEnoughData) {
    return NEW_USER_MESSAGES[Math.floor(Math.random() * NEW_USER_MESSAGES.length)] ?? NEW_USER_MESSAGES[0]!
  }
  const period = getTimeSinceLastVisit(lastVisitISO)
  const messages = WELCOME_MESSAGES[period]
  return messages[Math.floor(Math.random() * messages.length)] ?? "Coucou !"
}
