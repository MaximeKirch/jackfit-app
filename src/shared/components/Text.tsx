import { Text as RNText, type TextProps } from 'react-native'
import { Colors, Typography } from '../constants/tokens'

type SizeKey = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'

interface AppTextProps extends TextProps {
  variant?: 'display' | 'body' | 'mono'
  size?: SizeKey
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
  color?: string
}

const FONT_FAMILY: Record<'display' | 'mono', string> & {
  body: Record<'regular' | 'medium' | 'semibold' | 'bold', string>
} = {
  display: 'DMSerifDisplay-Regular',
  mono: 'DMMono-Regular',
  body: {
    regular:  'Inter-Regular',
    medium:   'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold:     'Inter-SemiBold',
  },
}

export const Text = ({
  variant = 'body',
  size = 'base',
  weight = 'regular',
  color = Colors.charcoal,
  style,
  ...props
}: AppTextProps) => {
  const fontFamily =
    variant === 'body'
      ? FONT_FAMILY.body[weight]
      : FONT_FAMILY[variant]

  return (
    <RNText
      style={[{ fontFamily, fontSize: Typography[size], color }, style]}
      {...props}
    />
  )
}
