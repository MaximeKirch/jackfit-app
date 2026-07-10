export const Colors = {
  // Backgrounds
  linen:    '#F5F0E8',   // background principal
  sand:     '#E8DDD0',   // cards, surfaces secondaires

  // Textes
  charcoal: '#2C2824',   // texte principal
  stone:    '#B8A898',   // texte secondaire, bordures

  // Accent
  moss:     '#6B8F71',   // CTA, éléments actifs

  // Blanc pur pour texte sur fond sombre
  white:    '#FFFFFF',

  // États d'Uma
  pet: {
    PEAK:        '#5B8A5F',  // vert mousse foncé
    GOOD:        '#8BAF8E',  // vert mousse clair
    TIRED:       '#C4956A',  // terracotta doux
    LAZY:        '#B5745A',  // terracotta foncé
    OVERREACHED: '#8B5E52',  // brique
  },
} as const

export const Typography = {
  // Tailles
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  xxl:  32,
  xxxl: 48,

  // Weights
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
} as const

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
} as const

export const Radius = {
  sm:   8,
  md:   16,
  lg:   20,
  xl:   28,
  full: 999,
} as const

export const Shadow = {
  soft: {
    shadowColor: '#2C2824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#2C2824',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const
