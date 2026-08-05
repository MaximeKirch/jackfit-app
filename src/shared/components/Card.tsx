import { View, type ViewProps } from 'react-native'
import { Colors, Radius, Shadow, Spacing } from '../constants/tokens'

interface CardProps extends ViewProps {
  padding?: number
}

export const Card = ({ padding = Spacing.md, style, ...props }: CardProps) => (
  <View
    style={[{ backgroundColor: Colors.white, borderRadius: Radius.lg, padding, ...Shadow.soft }, style]}
    {...props}
  />
)
