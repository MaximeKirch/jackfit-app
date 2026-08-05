import * as Notifications from 'expo-notifications'
import { NOTIFICATION_TITLE, getReminderMessage } from '@/features/notifications/utils/notificationMessages'

export const cancelAllReminders = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

// Schedules the next occurrence of `hour:minute` — today if still upcoming, otherwise tomorrow.
export const scheduleNextDailyReminder = async (hour: number, minute = 0): Promise<Date> => {
  const now    = new Date()
  const target = new Date(now)
  target.setHours(hour, minute, 0, 0)
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1)
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: NOTIFICATION_TITLE,
      body:  getReminderMessage(),
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: target,
    },
  })

  return target
}
