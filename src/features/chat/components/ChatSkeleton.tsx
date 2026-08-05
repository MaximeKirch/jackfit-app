import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Skeleton } from '@/shared/components/Skeleton'
import { Colors, Spacing } from '@/shared/constants/tokens'

const BUBBLES: readonly { side: 'ai' | 'user'; width: `${number}%`; height: number }[] = [
  { side: 'ai',   width: '65%', height: 44 },
  { side: 'user', width: '52%', height: 40 },
  { side: 'ai',   width: '82%', height: 60 },
  { side: 'ai',   width: '38%', height: 40 },
  { side: 'user', width: '58%', height: 44 },
]

export const ChatSkeleton = () => (
  <SafeAreaView style={styles.container} edges={['top']}>
    <Animated.View
      style={styles.flex}
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(220)}
    >
      <View style={styles.list}>
        {BUBBLES.map((b, i) => (
          <View key={i} style={[styles.row, b.side === 'user' ? styles.rowUser : styles.rowAI]}>
            <Skeleton width={b.width} height={b.height} borderRadius={18} />
          </View>
        ))}
      </View>
      <View style={styles.inputBar}>
        <Skeleton width="100%" height={44} borderRadius={22} />
      </View>
    </Animated.View>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.linen,
  },
  flex: { flex: 1 },
  list: {
    flex:       1,
    paddingTop: Spacing.md,
    gap:        Spacing.xs,
  },
  row: {
    paddingHorizontal: Spacing.md,
    marginVertical:    4,
  },
  rowAI:   { alignItems: 'flex-start' },
  rowUser: { alignItems: 'flex-end' },
  inputBar: {
    paddingHorizontal: Spacing.md,
    paddingBottom:     Spacing.md,
  },
})
