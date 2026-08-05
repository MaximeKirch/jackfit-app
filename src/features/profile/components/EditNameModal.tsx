import { useState } from 'react'
import { Modal, View, TextInput, Pressable, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius, Typography } from '@/shared/constants/tokens'

interface Props {
  visible:   boolean
  current:   string
  onSave:    (name: string) => Promise<void>
  onClose:   () => void
  isLoading: boolean
}

export const EditNameModal = ({ visible, current, onSave, onClose, isLoading }: Props) => {
  const [name, setName] = useState(current)

  const handleSave = async () => {
    if (name.trim().length < 2) return
    await onSave(name)
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onShow={() => setName(current)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Text variant="body" size="base" color={Colors.stone}>Annuler</Text>
          </Pressable>
          <Text variant="body" size="base" weight="semibold">Prénom</Text>
          <Pressable onPress={handleSave} disabled={isLoading}>
            <Text variant="body" size="base" weight="semibold" color={Colors.moss}>
              {isLoading ? '...' : 'Sauvegarder'}
            </Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoFocus
          autoCapitalize="words"
          placeholder="Ton prénom"
          placeholderTextColor={Colors.stone}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.linen,
    padding:         Spacing.lg,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   Spacing.xl,
    paddingTop:     Spacing.md,
  },
  input: {
    backgroundColor: Colors.sand,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    fontSize:        Typography.xl,
    fontFamily:      'DMSerifDisplay-Regular',
    color:           Colors.charcoal,
  },
})
