import { View, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius } from '@/shared/constants/tokens'

interface Props {
  title:    string
  children: React.ReactNode
}

export const ProfileSection = ({ title, children }: Props) => (
  <View style={styles.container}>
    <Text variant="body" size="xs" weight="semibold" color={Colors.stone} style={styles.title}>
      {title.toUpperCase()}
    </Text>
    <View style={styles.card}>
      {children}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title:     { marginBottom: Spacing.sm, letterSpacing: 1 },
  card: {
    backgroundColor: Colors.sand,
    borderRadius:    Radius.lg,
    overflow:        'hidden',
  },
})
