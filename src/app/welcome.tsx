import { useEffect, useState } from 'react'
import { View, StyleSheet, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/Text'
import { posthog } from '@/config/posthog'
import { Colors, Spacing, Radius } from '@/shared/constants/tokens'

export default function WelcomeScreen() {
  const { t } = useTranslation()
  const [syncExpanded, setSyncExpanded] = useState(false)

  useEffect(() => {
    posthog.capture('welcome_screen_viewed')
  }, [])

  const handleContinue = () => {
    posthog.capture('welcome_screen_dismissed', { watch_sync_hint_expanded: syncExpanded })
    router.replace('/(tabs)')
  }

  const toggleSync = () => {
    if (!syncExpanded) posthog.capture('watch_sync_hint_expanded')
    setSyncExpanded((v) => !v)
  }

  const points = t('welcome.points', { returnObjects: true }) as { title: string; body: string }[]
  const syncSteps = t('welcome.watch_sync.steps', { returnObjects: true }) as string[]

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="display" size="xxl" style={styles.title}>
            {t('welcome.title')}
          </Text>
          <Text variant="body" size="base" color={Colors.stone} style={styles.subtitle}>
            {t('welcome.subtitle')}
          </Text>

          <View style={styles.points}>
            {points.map((p, i) => (
              <View key={i} style={styles.point}>
                <View style={styles.pointIndex}>
                  <Text variant="mono" size="sm" color={Colors.moss}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={styles.pointText}>
                  <Text
                    variant="body"
                    size="md"
                    weight="semibold"
                    color={Colors.charcoal}
                  >
                    {p.title}
                  </Text>
                  <Text
                    variant="body"
                    size="base"
                    color={Colors.stone}
                    style={styles.pointBody}
                  >
                    {p.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.syncCard}>
            <Pressable
              onPress={toggleSync}
              style={styles.syncHeader}
              accessibilityRole="button"
              accessibilityState={{ expanded: syncExpanded }}
            >
              <Text variant="body" size="md" weight="semibold" color={Colors.charcoal} style={styles.syncQuestion}>
                {t('welcome.watch_sync.question')}
              </Text>
              <Text variant="mono" size="sm" color={Colors.moss}>
                {syncExpanded ? '−' : '+'}
              </Text>
            </Pressable>

            {syncExpanded && (
              <View style={styles.syncBody}>
                <Text variant="body" size="base" color={Colors.stone} style={styles.syncBodyText}>
                  {t('welcome.watch_sync.intro')}
                </Text>
                <View style={styles.syncSteps}>
                  {syncSteps.map((step, i) => (
                    <View key={i} style={styles.syncStep}>
                      <Text variant="mono" size="sm" color={Colors.moss} style={styles.syncStepIndex}>
                        {String(i + 1)}
                      </Text>
                      <Text variant="body" size="base" color={Colors.charcoal} style={styles.syncStepText}>
                        {step}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text variant="body" size="sm" color={Colors.stone} style={styles.syncFooter}>
                  {t('welcome.watch_sync.footer')}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text variant="body" size="base" weight="semibold" color={Colors.white}>
            {t('welcome.cta')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.linen },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  title: {
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  points: {
    gap: Spacing.lg,
  },
  point: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  pointIndex: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointText: {
    flex: 1,
    gap: Spacing.xs,
  },
  pointBody: {
    lineHeight: 22,
  },
  syncCard: {
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  syncQuestion: {
    flex: 1,
    lineHeight: 22,
  },
  syncBody: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  syncBodyText: {
    lineHeight: 22,
  },
  syncSteps: {
    gap: Spacing.sm,
  },
  syncStep: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  syncStepIndex: {
    minWidth: 16,
    marginTop: 2,
  },
  syncStepText: {
    flex: 1,
    lineHeight: 22,
  },
  syncFooter: {
    lineHeight: 20,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: Colors.moss,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    height: 52,
    justifyContent: 'center',
  },
})
