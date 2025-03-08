import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import { Task, TaskFilter } from '../../types/task';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = async (newTask: Partial<Task>) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title || '',
      completed: false,
      category: newTask.category || 'personal',
      priority: newTask.priority || 'medium',
      deadline: newTask.deadline,
      reminder: newTask.reminder || false,
      recurrence: newTask.recurrence || 'none',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const toggleComplete = async (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const reorderTasks = async (from: number, to: number) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(from, 1);
    updatedTasks.splice(to, 0, movedTask);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (filter.category && task.category !== filter.category) {
      return false;
    }
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }
    if (filter.completed !== undefined && task.completed !== filter.completed) {
      return false;
    }
    if (
      filter.date &&
      task.deadline &&
      new Date(task.deadline).toDateString() !==
        new Date(filter.date).toDateString()
    ) {
      return false;
    }
    return true;
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Daily Tasks</Text>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Search size={20} color={isDark ? '#FFFFFF' : '#000000'} />
          <TextInput
            style={[styles.searchInput, isDark && styles.searchInputDark]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tasks..."
            placeholderTextColor={isDark ? '#8E8E93' : '#A0A0A0'}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, isDark && styles.filterButtonDark]}
          onPress={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal
            size={20}
            color={isDark ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={[styles.filterContainer, isDark && styles.filterContainerDark]}>
          {/* Filter options would go here */}
        </View>
      )}

      <TaskForm onSubmit={addTask} />

      <TaskList
        tasks={filteredTasks}
        onToggleComplete={toggleComplete}
        onDeleteTask={deleteTask}
        onReorderTasks={reorderTasks}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 34,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 20,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBarDark: {
    backgroundColor: '#1C1C1E',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonDark: {
    backgroundColor: '#1C1C1E',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterContainerDark: {
    backgroundColor: '#1C1C1E',
  },
});