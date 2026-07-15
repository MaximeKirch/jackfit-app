import { useState } from 'react'
import { ScrollView, StyleSheet, Alert, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Skeleton } from '@/shared/components/Skeleton'
import { ProfileHeader }    from '../components/ProfileHeader'
import { ProfileSection }   from '../components/ProfileSection'
import { ProfileRow }       from '../components/ProfileRow'
import { EditNameModal }    from '../components/EditNameModal'
import { EditSportsModal }  from '../components/EditSportsModal'
import { EditAthleteModal } from '../components/EditAthleteModal'
import { ProgressionCard }  from '@/features/pet/components/ProgressionCard'
import { useProfile }       from '../hooks/useProfile'
import { useProgression }   from '@/features/pet/hooks/useProgression'
import { useAuthStore }     from '@/shared/stores/authStore'
import { usePetStore }      from '@/shared/stores/petStore'
import { ATHLETE_PROFILES } from '@/shared/constants/athleteProfiles'
import { TablerIcon }       from '@/shared/components/TablerIcon'
import type { TablerIconName } from '@/shared/components/TablerIcon'
import { Colors, Spacing }  from '@/shared/constants/tokens'
import { Text }             from '@/shared/components/Text'
import type { SportId }     from '@/shared/constants/sports'

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
  const user = useAuthStore((state) => state.user)
  const {
    profile,
    isLoading,
    isUpdating,
    updateName,
    updateSports,
    updateAthleteProfile,
    clearChat,
    signOut,
    deleteAccount,
  } = useProfile()

  const totalXp      = usePetStore((s) => s.totalXp)
  const currentStage = usePetStore((s) => s.currentStage)
  const { justChangedStage } = useProgression()

  const [editName,    setEditName]    = useState(false)
  const [editSports,  setEditSports]  = useState(false)
  const [editAthlete, setEditAthlete] = useState(false)

  if (isLoading || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={skeletonStyles.header}>
            <Skeleton width={140} height={22} borderRadius={11} />
            <Skeleton width={180} height={13} borderRadius={7} />
          </View>
          <ProfileSkeletonSection rows={3} />
          <ProfileSkeletonSection rows={1} />
          <ProfileSkeletonSection rows={3} />
        </ScrollView>
      </SafeAreaView>
    )
  }

  const sportsIcons = profile.main_sports
    ?.map((id) => SPORT_ICONS[id as SportId])
    .filter((icon): icon is TablerIconName => icon !== undefined)

  const athleteLabel = profile.athlete_profile
    ? ATHLETE_PROFILES[profile.athlete_profile].label
    : '—'

  const handleClearChat = () => {
    Alert.alert(
      'Effacer la conversation',
      'Tous tes messages avec Uma seront supprimés. Uma repartira de zéro.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Effacer', style: 'destructive', onPress: () => { void clearChat() } },
      ]
    )
  }

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => { void signOut() } },
    ])
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader firstName={profile.first_name} />

        <View style={styles.progressionSection}>
          <Text size="xs" weight="semibold" color={Colors.stone} style={styles.sectionLabel}>
            PROGRESSION
          </Text>
          <ProgressionCard
            totalXp={totalXp}
            currentStage={currentStage}
            justChangedStage={justChangedStage}
          />
        </View>

        <ProfileSection title="Mon profil">
          <ProfileRow
            label="Prénom"
            value={profile.first_name ?? '—'}
            onPress={() => setEditName(true)}
          />
          <ProfileRow
            label="Sports"
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
            label="Rythme"
            value={athleteLabel}
            onPress={() => setEditAthlete(true)}
            isLast
          />
        </ProfileSection>

        <ProfileSection title="Uma">
          <ProfileRow
            label="Effacer la conversation"
            onPress={handleClearChat}
            isLast
          />
        </ProfileSection>

        <ProfileSection title="Compte">
          <ProfileRow
            label="Email"
            value={user?.email ?? '—'}
          />
          <ProfileRow
            label="Se déconnecter"
            onPress={handleSignOut}
          />
          <ProfileRow
            label="Supprimer le compte"
            onPress={deleteAccount}
            destructive
            isLast
          />
        </ProfileSection>
      </ScrollView>

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
