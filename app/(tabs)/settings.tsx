import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Moon, Bell, Trash } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem('tasks');
      alert('All tasks have been cleared!');
    } catch (error) {
      console.error('Error clearing tasks:', error);
      alert('Failed to clear tasks');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon size={24} color="#007AFF" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
          />
        </View>

        {Platform.OS !== 'web' && (
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color="#007AFF" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => {
            if (confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
              clearAllTasks();
            }
          }}>
          <Trash size={24} color="#FFFFFF" />
          <Text style={styles.dangerButtonText}>Clear All Tasks</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    marginLeft: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FF3B30',
  },
  dangerButtonText: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  version: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
  },
});