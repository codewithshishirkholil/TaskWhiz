import { Tabs } from 'expo-router';
import { Calendar, ListTodo, Settings } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
      const theme = useTheme();

      return (
            <SafeAreaView style={styles.container}>
                  <Tabs
                        screenOptions={{
                              headerShown: true,
                              tabBarStyle: {
                                    ...styles.tabBar,
                                    backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.colors.surface,
                                    borderTopColor: theme.colors.outline,
                              },
                              tabBarBackground: () =>
                                    Platform.OS === 'ios' ? (
                                          <BlurView intensity={80} style={StyleSheet.absoluteFill} />
                                    ) : null,
                              tabBarActiveTintColor: theme.colors.primary,
                              tabBarInactiveTintColor: theme.colors.onSurface,
                              headerStyle: {
                                    backgroundColor: theme.colors.surface,
                              },
                              headerTintColor: theme.colors.onSurface,
                              headerShadowVisible: false,
                              tabBarLabelStyle: styles.tabBarLabel,
                              tabBarIconStyle: styles.tabBarIcon,
                        }}
                  >
                        <Tabs.Screen
                              name="index"
                              options={{
                                    title: 'Tasks',
                                    tabBarIcon: ({ color, size }) => (
                                          <View style={styles.iconContainer}>
                                                <ListTodo size={size} color={color} />
                                          </View>
                                    ),
                              }}
                        />
                        <Tabs.Screen
                              name="calendar"
                              options={{
                                    title: 'Calendar',
                                    tabBarIcon: ({ color, size }) => (
                                          <View style={styles.iconContainer}>
                                                <Calendar size={size} color={color} />
                                          </View>
                                    ),
                              }}
                        />
                        <Tabs.Screen
                              name="settings"
                              options={{
                                    title: 'Settings',
                                    tabBarIcon: ({ color, size }) => (
                                          <View style={styles.iconContainer}>
                                                <Settings size={size} color={color} />
                                          </View>
                                    ),
                              }}
                        />
                  </Tabs>
            </SafeAreaView>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
      },
      tabBar: {
            position: 'absolute',
            height: 60,
            borderTopWidth: 0.5,
            elevation: 0,
            bottom: 0,
            left: 0,
            right: 0,
      },
      tabBarLabel: {
            fontWeight: '600',
            fontSize: 12,
            marginBottom: 8,
      },
      tabBarIcon: {
            marginTop: 8,
      },
      iconContainer: {
            alignItems: 'center',
            justifyContent: 'center',
      },
});
