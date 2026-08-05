import { useEffect, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import { posthog } from '@/config/posthog'
import { useNotifStore } from '@/shared/stores/notifStore'
import { configureNotificationHandler } from '../lib/notificationHandler'
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
} from '../lib/permissions'
import { cancelAllReminders, scheduleNextDailyReminder } from '../lib/scheduler'

const REMINDER_HOUR = 18
const MS_PER_DAY    = 86_400_000

export const useDailyReminder = () => {
  const firstOpenAt                       = useNotifStore((s) => s.firstOpenAt)
  const hasCompletedFirstWorkoutObserved  = useNotifStore((s) => s.hasCompletedFirstWorkoutObserved)
  const setFirstOpenAt                    = useNotifStore((s) => s.setFirstOpenAt)
  const appState                          = useRef(AppState.currentState)

  useEffect(() => {
    configureNotificationHandler()
  }, [])

  useEffect(() => {
    if (!firstOpenAt) setFirstOpenAt(new Date().toISOString())
  }, [firstOpenAt, setFirstOpenAt])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const daysSinceFirstOpen = firstOpenAt
          ? Math.floor((Date.now() - new Date(firstOpenAt).getTime()) / MS_PER_DAY)
          : 0
        const gateOpen = daysSinceFirstOpen >= 1 || hasCompletedFirstWorkoutObserved

        let status = await getNotificationPermissionStatus()

        if (status === 'undetermined' && gateOpen) {
          posthog.capture('notification_permission_prompted', {
            trigger: hasCompletedFirstWorkoutObserved ? 'first_workout' : 'day_2',
          })
          status = await requestNotificationPermission()
          if (cancelled) return
          posthog.capture('notification_permission_result', { status })
        }

        if (status !== 'granted') return

        await cancelAllReminders()
        if (cancelled) return
        const target = await scheduleNextDailyReminder(REMINDER_HOUR)
        posthog.capture('notification_reminder_scheduled', {
          target_iso: target.toISOString(),
          hour:       REMINDER_HOUR,
        })
      } catch (err) {
        posthog.captureException(err, { operation: 'daily_reminder_scheduling' })
      }
    }

    void run()

    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current !== 'active' && nextState === 'active') {
        void run()
      }
      appState.current = nextState
    })

    return () => {
      cancelled = true
      sub.remove()
    }
  }, [firstOpenAt, hasCompletedFirstWorkoutObserved])
}
