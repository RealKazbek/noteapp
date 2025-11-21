import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { COLORS } from '../../styles/theme';

export default function MainLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.BG_SECONDARY,
          borderTopColor: COLORS.BG_TERTIARY,
        },
        tabBarActiveTintColor: COLORS.ACCENT_PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        
        headerStyle: {
          backgroundColor: COLORS.BG_SECONDARY,
        },
        headerTintColor: COLORS.TEXT_PRIMARY,
        headerTitleStyle: {
          fontFamily: 'monospace',
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'QUEST LOG',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          // Кнопка "+" в хедере
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/(main)/add-task')}>
              <Ionicons name="add-circle" size={32} color={COLORS.ACCENT_PRIMARY} style={{ marginRight: 15 }} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'PROFILE',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }} 
      />

      <Tabs.Screen
        name="add-task"
        options={{
          title: 'NEW QUEST',
          presentation: 'modal',
          href: null,
        }}
      />
      
      {/* Модальное окно "Редактировать" */}
      <Tabs.Screen
        name="[id]"
        options={{
          title: 'EDIT QUEST',
          presentation: 'modal',
          href: null,
        }}
      />
    </Tabs>
  );
}