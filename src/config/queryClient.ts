import { QueryClient } from '@tanstack/react-query'
import { AppState } from 'react-native'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 2,
    },
  },
})

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    void queryClient.invalidateQueries()
  }
})
