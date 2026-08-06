import { Linking, Pressable, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/Text'
import { Colors, Radius, Spacing } from '@/shared/constants/tokens'

interface Props {
  title?: string
  body?:  string
}

export const HealthPermissionDenied = ({ title, body }: Props) => {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <Text variant="display" size="lg" style={styles.title}>
        {title ?? t('health_permission.title')}
      </Text>
      <Text size="base" color={Colors.stone} style={styles.body}>
        {body ?? t('health_permission.body')}
      </Text>
      <Pressable
        onPress={() => void Linking.openURL('app-settings:')}
        style={styles.button}
      >
        <Text weight="semibold" color={Colors.white}>
          {t('health_permission.open_settings')}
        </Text>
      </Pressable>
      <Text size="sm" color={Colors.stone} style={styles.hint}>
        {t('health_permission.path')}
      </Text>
    </View>
  )
}

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
