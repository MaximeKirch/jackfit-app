import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PetStatus } from '@/shared/types/pet.types'
import type { StageName } from '@/features/pet/utils/stages'
import {
  DEFAULT_SCORING_CONFIG,
  type ScoringConfig,
  type ScoreBreakdown,
  type ScoreResult,
} from '@/features/pet/utils/scoring'

interface PetStore {
  status: PetStatus
  score: number
  breakdown: ScoreBreakdown | null
  hasEnoughData: boolean
  lastMessage: string
  scoringConfig: ScoringConfig
  lastVisit: string | null
  totalXp: number
  currentStage: StageName
  stageEnteredAt: string | null
  setStatus: (status: PetStatus) => void
  setScore: (score: number) => void
  setScoreResult: (result: ScoreResult) => void
  setLastMessage: (message: string) => void
  setScoringConfig: (config: ScoringConfig) => void
  setProgression: (p: { totalXp: number; currentStage: StageName; stageEnteredAt: string }) => void
  getPreviousVisit: () => string | null
  recordVisit: () => void
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      status: 'NEW',
      score: 0,
      breakdown: null,
      hasEnoughData: false,
      lastMessage: '',
      scoringConfig: DEFAULT_SCORING_CONFIG,
      lastVisit: null,
      totalXp: 0,
      currentStage: 'JEUNE_CHIOT',
      stageEnteredAt: null,

      setStatus: (status) => set({ status }),
      setScore: (score) => set({ score }),
      setScoreResult: (result) => set({
        score: result.score,
        status: result.status,
        breakdown: result.breakdown,
        hasEnoughData: result.hasEnoughData,
        totalXp: result.totalXp,
        currentStage: result.currentStage,
      }),
      setLastMessage: (lastMessage) => set({ lastMessage }),
      setScoringConfig: (scoringConfig) => set({ scoringConfig }),
      setProgression: (p) => set({
        totalXp: p.totalXp,
        currentStage: p.currentStage,
        stageEnteredAt: p.stageEnteredAt,
      }),

      getPreviousVisit: () => get().lastVisit,
      recordVisit: () => set({ lastVisit: new Date().toISOString() }),
    }),
    {
      name: 'pet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
