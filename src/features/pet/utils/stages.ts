export type StageName = 'JEUNE_CHIOT' | 'CHIOT' | 'ADULTE_ACTIF' | 'VÉTÉRAN' | 'ATHLÈTE_ÉLITE'

export const STAGES: ReadonlyArray<{ name: StageName; minXp: number }> = [
  { name: 'JEUNE_CHIOT',   minXp: 0    },
  { name: 'CHIOT',         minXp: 200  },
  { name: 'ADULTE_ACTIF',  minXp: 600  },
  { name: 'VÉTÉRAN',       minXp: 1400 },
  { name: 'ATHLÈTE_ÉLITE', minXp: 3000 },
]

export const stageInfo = (name: StageName) =>
  STAGES.find((s) => s.name === name) ?? STAGES[0]!

export const nextStage = (name: StageName) => {
  const idx = STAGES.findIndex((s) => s.name === name)
  return idx >= 0 && idx < STAGES.length - 1 ? STAGES[idx + 1]! : null
}

export const xpProgress = (totalXp: number, name: StageName): number => {
  const current = stageInfo(name)
  const next    = nextStage(name)
  if (!next) return 1
  return Math.min((totalXp - current.minXp) / (next.minXp - current.minXp), 1)
}
