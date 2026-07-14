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

const WELCOME_MESSAGES: Record<TimeSinceLastVisit, string[]> = {
  first_time: [
    "Salut, je suis Uma ! On va bien s'entendre tous les deux. 🐾",
  ],
  same_day: [
    "Re-coucou ! Je suis toujours là. 🐾",
    "On continue la journée ensemble ?",
    "Content de te revoir si vite !",
  ],
  yesterday: [
    "Bien dormi ? Moi je me sens frais aujourd'hui.",
    "Nouvelle journée, nouvelle énergie !",
    "J'espère que t'as bien récupéré cette nuit.",
  ],
  few_days: [
    "Tu m'as manqué un peu... on reprend ?",
    "Ça fait quelques jours ! Raconte-moi comment tu vas.",
    "J'attendais que tu reviennes. 🥺",
  ],
  week_plus: [
    "Ça fait longtemps... je me demandais où tu étais passé.",
    "Content de te revoir. Ça fait un moment.",
    "J'ai gardé la maison pendant ton absence. Tout va bien ?",
  ],
}

export const getWelcomeMessage = (lastVisitISO: string | null): string => {
  const period = getTimeSinceLastVisit(lastVisitISO)
  const messages = WELCOME_MESSAGES[period]
  return messages[Math.floor(Math.random() * messages.length)] ?? "Je suis là. 🐾"
}
