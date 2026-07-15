import { View, Pressable, StyleSheet } from 'react-native'
import { Text } from './Text'
import { Colors, Spacing, Radius } from '../constants/tokens'

interface Props {
  message: string
  onRetry?: () => void
}

export const ErrorState = ({ message, onRetry }: Props) => (
  <View style={styles.container}>
    <Text size="base" color={Colors.stone} style={styles.message}>
      {message}
    </Text>
    {onRetry && (
      <Pressable onPress={onRetry} style={styles.button}>
        <Text size="sm" weight="semibold" color={Colors.moss}>
          Réessayer
        </Text>
      </Pressable>
    )}
  </View>
)

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: Spacing.lg, gap: Spacing.sm },
  message:   { textAlign: 'center', lineHeight: 20 },
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.sand,
  },
})
