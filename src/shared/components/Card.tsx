import { View, StyleSheet, type ViewStyle } from 'react-native'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  style?: ViewStyle
}

export const Card = ({ children, style }: CardProps) => (
  <View style={[styles.card, style]}>{children}</View>
)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
})
