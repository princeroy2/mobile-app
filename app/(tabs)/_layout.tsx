import React from 'react';
import {  Tabs } from 'expo-router';
import TabBar from '@/components/TabBar'


// Define the Layout component for the Tab navigation
const Layout = () => {
  return (

    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false, // Hide header for all screens
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="booking" options={{ title: 'booking' }} />
      <Tabs.Screen name="chat" options={{ title: 'chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'profile' }} />

    </Tabs>
  );
};

export default Layout;
