import { Tabs } from 'expo-router'
import { TabBar } from '@/shared/components/TabBar'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Uma' }} />
      <Tabs.Screen name="chat"    options={{ title: 'Chat' }} />
      <Tabs.Screen name="stats"   options={{ title: 'Stats' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  )
}
