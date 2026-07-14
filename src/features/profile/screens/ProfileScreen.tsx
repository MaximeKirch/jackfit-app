import { useState } from 'react'
import { ScrollView, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ProfileHeader }    from '../components/ProfileHeader'
import { ProfileSection }   from '../components/ProfileSection'
import { ProfileRow }       from '../components/ProfileRow'
import { EditNameModal }    from '../components/EditNameModal'
import { EditSportsModal }  from '../components/EditSportsModal'
import { EditAthleteModal } from '../components/EditAthleteModal'
import { useProfile }       from '../hooks/useProfile'
import { useAuthStore }     from '@/shared/stores/authStore'
import { ATHLETE_PROFILES } from '@/shared/constants/athleteProfiles'
import { SPORTS }           from '@/shared/constants/sports'
import { Colors, Spacing }  from '@/shared/constants/tokens'

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

  const [editName,    setEditName]    = useState(false)
  const [editSports,  setEditSports]  = useState(false)
  const [editAthlete, setEditAthlete] = useState(false)

  if (isLoading || !profile) return null

  const sportsLabel = profile.main_sports
    ?.map((id) => SPORTS.find((s) => s.id === id)?.emoji)
    .filter(Boolean)
    .join(' ') || '—'

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

        <ProfileSection title="Mon profil">
          <ProfileRow
            label="Prénom"
            value={profile.first_name ?? '—'}
            onPress={() => setEditName(true)}
          />
          <ProfileRow
            label="Sports"
            value={sportsLabel}
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

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.linen },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
})
