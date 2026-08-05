import * as Notifications from 'expo-notifications'

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined'

const toStatus = (perms: Notifications.NotificationPermissionsStatus): NotificationPermissionStatus => {
  if (perms.granted) return 'granted'
  if (perms.status === 'denied') return 'denied'
  return 'undetermined'
}

export const getNotificationPermissionStatus = async (): Promise<NotificationPermissionStatus> => {
  const perms = await Notifications.getPermissionsAsync()
  return toStatus(perms)
}

export const requestNotificationPermission = async (): Promise<NotificationPermissionStatus> => {
  const perms = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  })
  return toStatus(perms)
}
