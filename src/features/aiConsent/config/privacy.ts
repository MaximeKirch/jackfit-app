// TODO: replace with the final URL once the privacy policy is drafted
// and reviewed by qualified counsel (Apple 5.1.2(i) compliance).
export const PRIVACY_POLICY_URL = 'https://jackfit.app/privacy'

export const AI_PROVIDER = {
  company: 'Anthropic',
  product: 'Claude',
} as const

export const SHARED_DATA_BULLETS = [
  'Le message que tu écris à Uma',
  'L\'historique récent de vos échanges',
  'Ton prénom et les sports que tu pratiques',
  'Un résumé de ta semaine : type et durée de tes séances, sommeil moyen, nombre de pas, score de forme',
] as const

export const NOT_SHARED_DATA_BULLETS = [
  'Ton email',
  'Ta fréquence cardiaque, tes calories brûlées, ni les dates précises de tes workouts',
  'Le détail de chacune de tes nuits de sommeil (seule la moyenne est partagée)',
] as const
