import * as Notifications from 'expo-notifications'

let configured = false

export const configureNotificationHandler = (): void => {
  if (configured) return
  configured = true
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList:   false,
      shouldPlaySound:  false,
      shouldSetBadge:   false,
    }),
  })
}
