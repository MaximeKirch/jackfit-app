import { Pressable, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing } from '@/shared/constants/tokens'

interface Props {
  label:        string
  value?:       string
  onPress?:     () => void
  destructive?: boolean
  isLast?:      boolean
}

export const ProfileRow = ({ label, value, onPress, destructive, isLast }: Props) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={({ pressed }) => [
      styles.row,
      pressed && !!onPress && styles.rowPressed,
      !isLast && styles.rowBorder,
    ]}
  >
    <Text
      variant="body"
      size="base"
      color={destructive ? '#C0392B' : Colors.charcoal}
    >
      {label}
    </Text>
    {value !== undefined ? (
      <Text variant="body" size="base" color={Colors.stone}>{value}</Text>
    ) : onPress ? (
      <Text variant="body" size="base" color={Colors.stone}>›</Text>
    ) : null}
  </Pressable>
)

const styles = StyleSheet.create({
  row: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    alignItems:       'center',
    paddingVertical:  Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  rowPressed: { backgroundColor: Colors.linen },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.linen,
  },
})
