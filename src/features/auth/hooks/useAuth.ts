import { useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'

export const useAuth = () => {
  const sendOtp = useCallback(async (email: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    if (error) throw error
  }, [])

  const verifyOtp = useCallback(async (email: string, token: string): Promise<void> => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut()
  }, [])

  return { sendOtp, verifyOtp, signOut }
}
