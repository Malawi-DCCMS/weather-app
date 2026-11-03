import React from 'react';
import { Tabs } from 'expo-router';

import AppTabBar from '@/components/AppTabBar';
import { TAB_ROUTES } from '@/lib/layout/constants';

export default function TabsLayout() {
  return (
    <Tabs
      backBehavior="none"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      {TAB_ROUTES.map(name => <Tabs.Screen key={name} name={name} />)}
    </Tabs>
  );
}
