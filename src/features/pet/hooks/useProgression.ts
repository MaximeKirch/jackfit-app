import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { usePetStore } from '@/shared/stores/petStore'
import type { StageName } from '../utils/stages'

export const useProgression = () => {
  const [isLoading, setIsLoading]         = useState(true)
  const [error, setError]                 = useState<Error | null>(null)
  const [justChangedStage, setJustChanged] = useState(false)
  const prevStageRef                      = useRef<StageName | null>(null)
  const setProgression                    = usePetStore((s) => s.setProgression)

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('pet_progression')
          .select('total_xp, current_stage, stage_entered_at')
          .maybeSingle()

        if (err) throw err

        if (data) {
          const newStage = data.current_stage as StageName
          if (prevStageRef.current !== null && prevStageRef.current !== newStage) {
            setJustChanged(true)
            setTimeout(() => setJustChanged(false), 3000)
          }
          prevStageRef.current = newStage
          setProgression({
            totalXp:        data.total_xp as number,
            currentStage:   newStage,
            stageEnteredAt: data.stage_entered_at as string,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Impossible de charger la progression'))
      } finally {
        setIsLoading(false)
      }
    }
    void fetch()
  }, [setProgression])

  return { isLoading, error, justChangedStage }
}
