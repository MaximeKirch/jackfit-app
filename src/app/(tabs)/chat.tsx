import { lazy, Suspense } from 'react'
import { ChatSkeleton } from '@/features/chat/components/ChatSkeleton'

const ChatList = lazy(() => import('@/features/chat/components/ChatList'))

export default function ChatScreen() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatList />
    </Suspense>
  )
}
