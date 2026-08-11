import { useState } from 'react'
import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius, Typography } from '@/shared/constants/tokens'

export type GoalValue = { name: string; date: string } | null

interface Props {
  onNext:   (goal: GoalValue) => void
  onBack:   () => void
  initial?: GoalValue
  ctaLabel?: string
}

type Choice = 'yes' | 'no' | null

const startOfTomorrow = (): Date => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 1)
  return d
}

const toIsoDate = (d: Date): string => {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

const parseIsoDate = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)
}

export const OnboardingStep4Goal = ({ onNext, onBack, initial, ctaLabel }: Props) => {
  const { t } = useTranslation()
  const tomorrow = startOfTomorrow()

  const [choice, setChoice] = useState<Choice>(
    initial ? 'yes' : initial === null ? null : null
  )
  const [name, setName] = useState<string>(initial?.name ?? '')
  const [date, setDate] = useState<Date | null>(
    initial?.date ? parseIsoDate(initial.date) : null
  )
  const [showAndroidPicker, setShowAndroidPicker] = useState(false)

  const resolvedCta = ctaLabel ?? t('common.continue')

  const isDateValid = date ? date.getTime() >= tomorrow.getTime() : false
  const isValid =
    choice === 'no' ||
    (choice === 'yes' && name.trim().length > 0 && isDateValid)

  const handleContinue = () => {
    if (!isValid) return
    if (choice === 'no') return onNext(null)
    onNext({ name: name.trim(), date: toIsoDate(date!) })
  }

  const handleDateChange = (_e: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowAndroidPicker(false)
    if (selected) setDate(selected)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text variant="body" size="base" color={Colors.stone}>{t('common.back')}</Text>
        </Pressable>
      </View>

      <Text variant="display" size="xxl" style={styles.title}>
        {t('onboarding.goal.title')}
      </Text>
      <Text variant="body" size="base" color={Colors.stone} style={styles.subtitle}>
        {t('onboarding.goal.subtitle')}
      </Text>

      <View style={styles.choices}>
        <Pressable
          onPress={() => setChoice('yes')}
          style={[styles.choiceCard, choice === 'yes' && styles.choiceCardSelected]}
        >
          <Text
            variant="body"
            size="base"
            weight={choice === 'yes' ? 'semibold' : 'medium'}
            color={choice === 'yes' ? Colors.white : Colors.charcoal}
          >
            {t('onboarding.goal.yes')}
          </Text>
          {choice === 'yes' && <Text size="base" color={Colors.white}>✓</Text>}
        </Pressable>

        {choice === 'yes' && (
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text variant="body" size="sm" color={Colors.stone} style={styles.fieldLabel}>
                {t('onboarding.goal.event_name_label')}
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t('onboarding.goal.event_name_placeholder')}
                placeholderTextColor={Colors.stone}
                autoCapitalize="sentences"
                returnKeyType="done"
              />
            </View>

            <View style={styles.field}>
              <Text variant="body" size="sm" color={Colors.stone} style={styles.fieldLabel}>
                {t('onboarding.goal.event_date_label')}
              </Text>
              {Platform.OS === 'ios' ? (
                <View style={styles.iosPickerRow}>
                  <DateTimePicker
                    value={date ?? tomorrow}
                    mode="date"
                    display="compact"
                    minimumDate={tomorrow}
                    onChange={handleDateChange}
                    themeVariant="light"
                    accentColor={Colors.moss}
                  />
                  {!date && (
                    <Text variant="body" size="sm" color={Colors.stone}>
                      {t('onboarding.goal.event_date_placeholder')}
                    </Text>
                  )}
                </View>
              ) : (
                <>
                  <Pressable
                    style={styles.androidDateButton}
                    onPress={() => setShowAndroidPicker(true)}
                  >
                    <Text
                      variant="body"
                      size="base"
                      color={date ? Colors.charcoal : Colors.stone}
                    >
                      {date ? toIsoDate(date) : null}
                    </Text>
                  </Pressable>
                  {showAndroidPicker && (
                    <DateTimePicker
                      value={date ?? tomorrow}
                      mode="date"
                      minimumDate={tomorrow}
                      onChange={handleDateChange}
                    />
                  )}
                </>
              )}
              {date && !isDateValid && (
                <Text variant="body" size="sm" color="#C0392B" style={styles.errorText}>
                  {t('onboarding.goal.date_must_be_future')}
                </Text>
              )}
            </View>
          </View>
        )}

        <Pressable
          onPress={() => setChoice('no')}
          style={[styles.choiceCard, choice === 'no' && styles.choiceCardSelected]}
        >
          <Text
            variant="body"
            size="base"
            weight={choice === 'no' ? 'semibold' : 'medium'}
            color={choice === 'no' ? Colors.white : Colors.charcoal}
          >
            {t('onboarding.goal.no')}
          </Text>
          {choice === 'no' && <Text size="base" color={Colors.white}>✓</Text>}
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!isValid}
      >
        <Text variant="body" size="base" weight="semibold" color={Colors.white}>
          {resolvedCta}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: Spacing.xl },
  header:    { marginBottom: Spacing.lg },
  title: {
    color:        Colors.charcoal,
    marginBottom: Spacing.sm,
    lineHeight:   40,
  },
  subtitle: { marginBottom: Spacing.xl },
  choices:  { flex: 1, gap: Spacing.sm },
  choiceCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: Colors.sand,
    borderRadius:    Radius.lg,
    padding:         Spacing.md,
  },
  choiceCardSelected: { backgroundColor: Colors.moss },
  fields: {
    gap:               Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   Spacing.md,
  },
  field: { gap: Spacing.xs },
  fieldLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: Colors.sand,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    fontSize:        Typography.md,
    fontFamily:      'Inter-Medium',
    color:           Colors.charcoal,
  },
  iosPickerRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
    minHeight:     44,
  },
  androidDateButton: {
    backgroundColor: Colors.sand,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
  },
  errorText: { marginTop: Spacing.xs },
  button: {
    backgroundColor: Colors.moss,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    alignItems:      'center',
    height:          52,
    justifyContent:  'center',
    marginTop:       Spacing.md,
  },
  buttonDisabled: { opacity: 0.4 },
})
