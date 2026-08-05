type ReminderContext = 'daily'

const REMINDER_MESSAGES: Record<ReminderContext, string[]> = {
  daily: [
    "Uma remue la queue en t'attendant.",
    "Petit tour aujourd'hui ?",
    "Uma garde la maison, tranquille.",
    "Un peu d'air ?",
    "Passe dire bonjour.",
    "Envie de sortir ?",
    "Uma se prélasse au soleil.",
    "Une pause qui bouge ?",
    "Uma est là, quand tu veux.",
    "Uma flâne, tout va bien.",
  ],
}

export const NOTIFICATION_TITLE = 'Uma'

export const getReminderMessage = (context: ReminderContext = 'daily'): string => {
  const pool = REMINDER_MESSAGES[context]
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0]!
}
