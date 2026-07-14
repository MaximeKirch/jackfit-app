import { View, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TablerIcon } from './TablerIcon'
import type { TablerIconName } from './TablerIcon'
import { Colors, Spacing } from '../constants/tokens'

type TabBarProps = {
  state: { routes: { key: string; name: string }[]; index: number }
  navigation: { navigate: (name: string) => void }
}

const ROUTE_ICONS: Record<string, TablerIconName> = {
  index:   'paw',
  chat:    'message-circle',
  stats:   'chart-bar',
  profile: 'user',
}

export const TabBar = ({ state, navigation }: TabBarProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.sm }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index
        const iconName = ROUTE_ICONS[route.name]
        if (!iconName) return null

        return (
          <Pressable
            key={route.key}
            onPress={() => { if (!isFocused) navigation.navigate(route.name) }}
            style={styles.tab}
          >
            <TablerIcon
              name={iconName}
              size={22}
              color={isFocused ? Colors.moss : Colors.stone}
            />
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
