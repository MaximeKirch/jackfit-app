import { Linking, Pressable, StyleSheet, View } from 'react-native'
import { Text } from '@/shared/components/Text'
import { Colors, Radius, Spacing } from '@/shared/constants/tokens'

interface Props {
  title?: string
  body?:  string
}

export const HealthPermissionDenied = ({
  title = 'Uma a besoin de tes données',
  body  = 'Sans accès à Apple Santé, Uma ne peut pas savoir comment tu vas.',
}: Props) => (
  <View style={styles.container}>
    <Text variant="display" size="lg" style={styles.title}>
      {title}
    </Text>
    <Text size="base" color={Colors.stone} style={styles.body}>
      {body}
    </Text>
    <Pressable
      onPress={() => void Linking.openURL('app-settings:')}
      style={styles.button}
    >
      <Text weight="semibold" color={Colors.white}>
        Ouvrir les réglages
      </Text>
    </Pressable>
    <Text size="sm" color={Colors.stone} style={styles.hint}>
      Réglages → Confidentialité → Santé → JackFit
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex:              1,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: Spacing.xl,
    gap:               Spacing.md,
  },
  title: {
    textAlign: 'center',
  },
  body: {
    textAlign:  'center',
    lineHeight: 22,
  },
  button: {
    marginTop:         Spacing.sm,
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius:      Radius.full,
    backgroundColor:   Colors.moss,
  },
  hint: {
    textAlign:  'center',
    lineHeight: 18,
  },
})
