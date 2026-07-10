import { View, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Path, Rect } from 'react-native-svg'
import { Colors, Spacing } from '../constants/tokens'

type TabBarProps = {
  state: { routes: { key: string; name: string }[]; index: number }
  navigation: { navigate: (name: string) => void }
}

const STROKE = Colors.stone
const STROKE_ACTIVE = Colors.moss
const W = 1.5

const HomeIcon = ({ active }: { active: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={5} stroke={active ? STROKE_ACTIVE : STROKE} strokeWidth={W} />
    <Circle cx={12} cy={12} r={1.5} stroke={active ? STROKE_ACTIVE : STROKE} strokeWidth={W} />
  </Svg>
)

const ChatIcon = ({ active }: { active: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V14C20 15.1 19.1 16 18 16H8L4 20V6Z"
      stroke={active ? STROKE_ACTIVE : STROKE}
      strokeWidth={W}
      strokeLinejoin="round"
    />
  </Svg>
)

const StatsIcon = ({ active }: { active: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect x={4} y={14} width={4} height={6} rx={1} stroke={active ? STROKE_ACTIVE : STROKE} strokeWidth={W} />
    <Rect x={10} y={9} width={4} height={11} rx={1} stroke={active ? STROKE_ACTIVE : STROKE} strokeWidth={W} />
    <Rect x={16} y={4} width={4} height={16} rx={1} stroke={active ? STROKE_ACTIVE : STROKE} strokeWidth={W} />
  </Svg>
)

const ProfileIcon = ({ active }: { active: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={8} r={3.5} stroke={active ? STROKE_ACTIVE : STROKE} strokeWidth={W} />
    <Path
      d="M5 20C5 17 8 14.5 12 14.5C16 14.5 19 17 19 20"
      stroke={active ? STROKE_ACTIVE : STROKE}
      strokeWidth={W}
      strokeLinecap="round"
    />
  </Svg>
)

const ICONS = {
  index:   HomeIcon,
  chat:    ChatIcon,
  stats:   StatsIcon,
  profile: ProfileIcon,
}

export const TabBar = ({ state, navigation }: TabBarProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.sm }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index
        const Icon = ICONS[route.name as keyof typeof ICONS]
        if (!Icon) return null

        return (
          <Pressable
            key={route.key}
            onPress={() => { if (!isFocused) navigation.navigate(route.name) }}
            style={styles.tab}
          >
            <Icon active={isFocused} />
            <View style={[styles.dot, isFocused && styles.dotActive]} />
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.linen,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.sand,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  dotActive: {
    backgroundColor: Colors.moss,
  },
})
