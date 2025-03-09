import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

const lightTheme = {
      ...MD3LightTheme,
      colors: {
            ...MD3LightTheme.colors,
            primary: '#6366F1',
            primaryContainer: '#E0E7FF',
            secondary: '#EC4899',
            secondaryContainer: '#FCE7F3',
            background: '#F9FAFB',
            surface: '#FFFFFF',
            surfaceVariant: '#F3F4F6',
            error: '#EF4444',
            text: '#111827',
            onSurface: '#111827',
            outline: '#E5E7EB',
            elevation: {
                  level0: 'transparent',
                  level1: '#FFFFFF',
                  level2: '#F9FAFB',
                  level3: '#F3F4F6',
                  level4: '#E5E7EB',
                  level5: '#D1D5DB',
            },
      },
};

const darkTheme = {
      ...MD3DarkTheme,
      colors: {
            ...MD3DarkTheme.colors,
            primary: '#818CF8',
            primaryContainer: '#312E81',
            secondary: '#F472B6',
            secondaryContainer: '#831843',
            background: '#111827',
            surface: '#1F2937',
            surfaceVariant: '#374151',
            error: '#F87171',
            text: '#F9FAFB',
            onSurface: '#F9FAFB',
            outline: '#4B5563',
            elevation: {
                  level0: 'transparent',
                  level1: '#1F2937',
                  level2: '#374151',
                  level3: '#4B5563',
                  level4: '#6B7280',
                  level5: '#9CA3AF',
            },
      },
};

export default function RootLayout() {
      useFrameworkReady(); // Ensure framework is ready before rendering
      const colorScheme = useColorScheme(); // Detect the current color scheme (light or dark)
      const theme = colorScheme === 'dark' ? darkTheme : lightTheme; // Choose the appropriate theme

      return (
            <PaperProvider theme={theme}>
                  <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </PaperProvider>
      );
}
