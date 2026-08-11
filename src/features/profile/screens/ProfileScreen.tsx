import { useState } from 'react'
import { ScrollView, StyleSheet, Alert, ActionSheetIOS, View, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useLocaleStore } from '@/shared/stores/localeStore'
import type { SupportedLocale } from '@/shared/i18n'
import { Skeleton } from '@/shared/components/Skeleton'
import { FadeInOnFocus } from '@/shared/components/FadeInOnFocus'
import { ProfileHeader }    from '../components/ProfileHeader'
import { ProfileSection }   from '../components/ProfileSection'
import { ProfileRow }       from '../components/ProfileRow'
import { EditNameModal }    from '../components/EditNameModal'
import { EditSportsModal }  from '../components/EditSportsModal'
import { EditAthleteModal } from '../components/EditAthleteModal'
import { EditGoalModal }    from '../components/EditGoalModal'
import { ProgressionCard }  from '@/features/pet/components/ProgressionCard'
import { useProfile }       from '../hooks/useProfile'
import { useProgression }   from '@/features/pet/hooks/useProgression'
import { useAuthStore }     from '@/shared/stores/authStore'
import { usePetStore }      from '@/shared/stores/petStore'
import { TablerIcon }       from '@/shared/components/TablerIcon'
import type { TablerIconName } from '@/shared/components/TablerIcon'
import { Colors, Spacing }  from '@/shared/constants/tokens'
import { Text }             from '@/shared/components/Text'
import type { SportId }     from '@/shared/constants/sports'
import { PRIVACY_POLICY_URL } from '@/features/aiConsent/config/privacy'

const SPORT_ICONS: Partial<Record<SportId, TablerIconName>> = {
  running:    'run',
  cycling:    'bike',
  swimming:   'swimming',
  strength:   'barbell',
  hiking:     'walk',
  yoga:       'yoga',
  tennis:     'ball-tennis',
  soccer:     'ball-football',
  basketball: 'ball-basketball',
  rowing:     'kayak',
  crossfit:   'barbell',
  triathlon:  'medal',
}

export default function ProfileScreen() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const {
    profile,
    isLoading,
    isUpdating,
    updateName,
    updateSports,
    updateAthleteProfile,
    updateGoal,
    clearChat,
    signOut,
    deleteAccount,
  } = useProfile()

  const totalXp      = usePetStore((s) => s.totalXp)
  const currentStage = usePetStore((s) => s.currentStage)
  const { justChangedStage } = useProgression()

  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)

  const [editName,    setEditName]    = useState(false)
  const [editSports,  setEditSports]  = useState(false)
  const [editAthlete, setEditAthlete] = useState(false)
  const [editGoal,    setEditGoal]    = useState(false)

  if (isLoading || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FadeInOnFocus>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={skeletonStyles.header}>
              <Skeleton width={140} height={22} borderRadius={11} />
              <Skeleton width={180} height={13} borderRadius={7} />
            </View>
            <ProfileSkeletonSection rows={3} />
            <ProfileSkeletonSection rows={1} />
            <ProfileSkeletonSection rows={3} />
          </ScrollView>
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  const sportsIcons = profile.main_sports
    ?.map((id) => SPORT_ICONS[id as SportId])
    .filter((icon): icon is TablerIconName => icon !== undefined)

  const athleteLabel = profile.athlete_profile
    ? t(`athlete_profiles.${profile.athlete_profile}.label`)
    : '—'

  const goalLabel = profile.goal_event_name
    ? profile.goal_event_name
    : t('profile.goal_none')

  const currentGoal = profile.goal_event_name && profile.goal_event_date
    ? { name: profile.goal_event_name, date: profile.goal_event_date }
    : null

  const handleClearChat = () => {
    Alert.alert(
      t('profile.clear_chat'),
      t('profile.clear_chat_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.delete'), style: 'destructive', onPress: () => { void clearChat() } },
      ]
    )
  }

  const handleSignOut = () => {
    Alert.alert(t('profile.sign_out_confirm_title'), t('profile.sign_out_confirm_body'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.sign_out'), style: 'destructive', onPress: () => { void signOut() } },
    ])
  }

  const handleChangeLanguage = () => {
    const options: { label: string; value: SupportedLocale }[] = [
      { label: t('languages.fr'), value: 'fr' },
      { label: t('languages.en'), value: 'en' },
    ]
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: t('profile.language_choice_title'),
        options: [...options.map((o) => o.label), t('common.cancel')],
        cancelButtonIndex: options.length,
        userInterfaceStyle: 'light',
      },
      (index) => {
        const picked = options[index]
        if (picked) setLocale(picked.value)
      }
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FadeInOnFocus>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader firstName={profile.first_name} />

        <View style={styles.progressionSection}>
          <Text size="xs" weight="semibold" color={Colors.stone} style={styles.sectionLabel}>
            {t('profile.progression')}
          </Text>
          <ProgressionCard
            totalXp={totalXp}
            currentStage={currentStage}
            justChangedStage={justChangedStage}
          />
        </View>

        <ProfileSection title={t('profile.my_profile')}>
          <ProfileRow
            label={t('profile.first_name')}
            value={profile.first_name ?? '—'}
            onPress={() => setEditName(true)}
          />
          <ProfileRow
            label={t('profile.sports')}
            valueNode={
              sportsIcons && sportsIcons.length > 0 ? (
                <View style={styles.sportsRow}>
                  {sportsIcons.map((icon, i) => (
                    <TablerIcon key={i} name={icon} size={18} color={Colors.moss} />
                  ))}
                </View>
              ) : undefined
            }
            onPress={() => setEditSports(true)}
          />
          <ProfileRow
            label={t('profile.pace')}
            value={athleteLabel}
            onPress={() => setEditAthlete(true)}
          />
          <ProfileRow
            label={t('profile.goal')}
            value={goalLabel}
            onPress={() => setEditGoal(true)}
            isLast
          />
        </ProfileSection>

        <ProfileSection title={t('profile.uma')}>
          <ProfileRow
            label={t('profile.clear_chat')}
            onPress={handleClearChat}
            isLast
          />
        </ProfileSection>

        <ProfileSection title={t('profile.account')}>
          <ProfileRow
            label={t('profile.email')}
            value={user?.email ?? '—'}
          />
          <ProfileRow
            label={t('profile.language')}
            value={t(`languages.${locale}`)}
            onPress={handleChangeLanguage}
          />
          <ProfileRow
            label={t('profile.sign_out')}
            onPress={handleSignOut}
          />
          <ProfileRow
            label={t('profile.delete_account')}
            onPress={deleteAccount}
            destructive
            isLast
          />
        </ProfileSection>

        <ProfileSection title={t('profile.privacy')}>
          <ProfileRow
            label={t('profile.privacy_policy')}
            onPress={() => { void Linking.openURL(PRIVACY_POLICY_URL) }}
            isLast
          />
        </ProfileSection>
        </ScrollView>
      </FadeInOnFocus>

      <EditNameModal
        visible={editName}
        current={profile.first_name ?? ''}
        onSave={updateName}
        onClose={() => setEditName(false)}
        isLoading={isUpdating}
      />
      <EditSportsModal
        visible={editSports}
        current={profile.main_sports ?? []}
        onSave={updateSports}
        onClose={() => setEditSports(false)}
        isLoading={isUpdating}
      />
      <EditAthleteModal
        visible={editAthlete}
        current={profile.athlete_profile}
        onSave={updateAthleteProfile}
        onClose={() => setEditAthlete(false)}
        isLoading={isUpdating}
      />
      <EditGoalModal
        visible={editGoal}
        current={currentGoal}
        onSave={updateGoal}
        onClose={() => setEditGoal(false)}
      />
    </SafeAreaView>
  )
}

const ProfileSkeletonSection = ({ rows }: { rows: number }) => (
  <View style={skeletonStyles.section}>
    <Skeleton width={72} height={10} borderRadius={5} />
    <View style={skeletonStyles.card}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i}>
          {i > 0 && <View style={skeletonStyles.divider} />}
          <View style={skeletonStyles.row}>
            <Skeleton width={80} height={14} borderRadius={7} />
            <Skeleton width={100} height={14} borderRadius={7} />
          </View>
        </View>
      ))}
    </View>
  </View>
)

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.linen },
  scroll:     { flex: 1 },
  content:    { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  sportsRow:  { flexDirection: 'row', gap: 8, alignItems: 'center' },
  progressionSection: { marginBottom: Spacing.lg, gap: Spacing.sm },
  sectionLabel: { textTransform: 'uppercase', letterSpacing: 0.8 },
})

const skeletonStyles = StyleSheet.create({
  header: {
    alignItems:      'center',
    paddingVertical: Spacing.xl,
    gap:             Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
    gap:          Spacing.sm,
  },
  card: {
    backgroundColor: Colors.sand,
    borderRadius:    20,
    overflow:        'hidden',
  },
  row: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  divider: {
    height:          1,
    backgroundColor: Colors.linen,
    marginHorizontal: Spacing.md,
  },
})
