import { lazy, Suspense } from 'react'
import { View, StyleSheet } from 'react-native'
import { Skeleton } from '@/shared/components/Skeleton'
import { Colors, Spacing } from '@/shared/constants/tokens'

const ChatList = lazy(() => import('@/features/chat/components/ChatList'))

export default function ChatScreen() {
  return (
    <Suspense
      fallback={
        <View style={styles.fallback}>
          <Skeleton width="90%" height={56} borderRadius={18} />
          <View style={styles.gap8} />
          <Skeleton width="70%" height={56} borderRadius={18} />
          <View style={styles.gap8} />
          <Skeleton width="85%" height={56} borderRadius={18} />
        </View>
      }
    >
      <ChatList />
    </Suspense>
  )
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: Colors.linen,
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },
  gap8: { height: 8 },
})
