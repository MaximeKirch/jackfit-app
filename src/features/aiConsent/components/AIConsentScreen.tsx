import { Linking, Pressable, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native'
import { Text } from '@/shared/components/Text'
import { Colors, Radius, Spacing } from '@/shared/constants/tokens'
import {
  AI_PROVIDER,
  NOT_SHARED_DATA_BULLETS,
  PRIVACY_POLICY_URL,
  SHARED_DATA_BULLETS,
} from '../config/privacy'

interface Props {
  onAccept:     () => void
  onDecline:    () => void
  isLoading?:   boolean
  acceptLabel?: string
  declineLabel?: string
}

export const AIConsentScreen = ({
  onAccept,
  onDecline,
  isLoading    = false,
  acceptLabel  = "J'accepte",
  declineLabel = 'Je refuse',
}: Props) => {
  const openPrivacyPolicy = () => {
    void Linking.openURL(PRIVACY_POLICY_URL)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text variant="display" size="xxl" style={styles.title}>
          Partager tes données{'\n'}avec {AI_PROVIDER.product}
        </Text>

        <Text variant="body" size="base" color={Colors.stone} style={styles.intro}>
          Pour discuter avec Uma, un résumé de ta semaine et tes messages
          sont envoyés à <Text weight="semibold" color={Colors.charcoal}>{AI_PROVIDER.product}</Text>,
          une IA développée par <Text weight="semibold" color={Colors.charcoal}>{AI_PROVIDER.company}</Text>.
          Rien n'est envoyé sans ton accord.
        </Text>

        <BulletBlock
          heading="Ce qui est partagé"
          items={SHARED_DATA_BULLETS}
          color={Colors.charcoal}
        />
        <BulletBlock
          heading="Ce qui n'est jamais partagé"
          items={NOT_SHARED_DATA_BULLETS}
          color={Colors.stone}
        />

        <Pressable onPress={openPrivacyPolicy} style={styles.linkRow}>
          <Text variant="body" size="sm" color={Colors.moss} weight="medium">
            Lire la politique de confidentialité →
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          onPress={onAccept}
          disabled={isLoading}
          style={[styles.acceptButton, isLoading && styles.buttonDisabled]}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text variant="body" size="base" weight="semibold" color={Colors.white}>
              {acceptLabel}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={onDecline}
          disabled={isLoading}
          style={[styles.declineButton, isLoading && styles.buttonDisabled]}
        >
          <Text variant="body" size="base" weight="semibold" color={Colors.charcoal}>
            {declineLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const BulletBlock = ({
  heading,
  items,
  color,
}: {
  heading: string
  items: readonly string[]
  color: string
}) => (
  <View style={styles.bulletBlock}>
    <Text variant="body" size="sm" weight="semibold" color={Colors.stone} style={styles.bulletHeading}>
      {heading.toUpperCase()}
    </Text>
    {items.map((item) => (
      <View key={item} style={styles.bulletRow}>
        <Text variant="body" size="base" color={color}>•</Text>
        <Text variant="body" size="base" color={color} style={styles.bulletText}>
          {item}
        </Text>
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.linen,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop:        Spacing.lg,
    paddingBottom:     Spacing.xl,
    gap:               Spacing.lg,
  },
  title: {
    color:      Colors.charcoal,
    lineHeight: 40,
  },
  intro: {
    lineHeight: 22,
  },
  bulletBlock: {
    gap: Spacing.xs,
  },
  bulletHeading: {
    letterSpacing: 0.8,
    marginBottom:  Spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    gap:           Spacing.sm,
    alignItems:    'flex-start',
  },
  bulletText: {
    flex:       1,
    lineHeight: 22,
  },
  linkRow: {
    paddingVertical: Spacing.sm,
  },
  actions: {
    paddingHorizontal: Spacing.lg,
    paddingTop:        Spacing.md,
    paddingBottom:     Spacing.lg,
    gap:               Spacing.sm,
    backgroundColor:   Colors.linen,
    borderTopWidth:    StyleSheet.hairlineWidth,
    borderTopColor:    Colors.sand,
  },
  acceptButton: {
    backgroundColor: Colors.moss,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    alignItems:      'center',
    height:          52,
    justifyContent:  'center',
  },
  declineButton: {
    backgroundColor: Colors.sand,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    alignItems:      'center',
    height:          52,
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     Colors.stone,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
})
