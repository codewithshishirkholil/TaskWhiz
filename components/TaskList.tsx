import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import {
  Check,
  Trash2,
  Share2,
  Flag,
  Calendar,
  Bell,
  ArrowUpDown,
} from 'lucide-react-native';
import { Task } from '../types/task';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks?: (from: number, to: number) => void;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onReorderTasks,
}: TaskListProps) {
  const shareTask = async (task: Task) => {
    try {
      const message = `Task: ${task.title}\nDue: ${
        task.deadline ? format(task.deadline, 'PPP') : 'No deadline'
      }\nPriority: ${task.priority}\nCategory: ${task.category}`;

      await Share.share({
        message,
        title: 'Share Task',
      });
    } catch (error) {
      console.error('Error sharing task:', error);
    }
  };

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#007AFF';
    }
  };

  const renderTask = (task: Task, index: number) => {
    // const dragGesture = Gesture.Pan()
    //   .onUpdate((event) => {
    //     // Implementation for drag gesture would go here
    //     console.log('Dragging task:', event.translationY);
    //   })
    //   .onEnd((event) => {
    //     if (onReorderTasks) {
    //       const newIndex = Math.round(event.translationY / 80);
    //       if (newIndex !== 0) {
    //         onReorderTasks(index, index + newIndex);
    //       }
    //     }
    //   });

    // const animatedStyle = useAnimatedStyle(() => ({
    //   transform: [{ scale: withSpring(1) }],
    // }));

    return (
      // <GestureDetector gesture={dragGesture} key={task.id}>
        // <Animated.View style={[styles.taskItem, animatedStyle]}>
         <View style={styles.taskItem} key={task.id}>
           <TouchableOpacity
            style={[styles.checkbox, task.completed && styles.checkboxChecked]}
            onPress={() => onToggleComplete(task.id)}>
            {task.completed && <Check size={16} color="#FFFFFF" />}
          </TouchableOpacity>

          <View style={styles.taskContent}>
            <View style={styles.taskHeader}>
              <Text
                style={[
                  styles.taskText,
                  task.completed && styles.taskTextCompleted,
                ]}>
                {task.title}
              </Text>
              <Flag
                size={16}
                color={getPriorityColor(task.priority)}
                style={styles.priorityIcon}
              />
            </View>

            <View style={styles.taskDetails}>
              <View style={styles.tagContainer}>
                <Text style={[styles.tag, { backgroundColor: '#E5E5EA' }]}>
                  {task.category}
                </Text>
                {task.recurrence !== 'none' && (
                  <Text style={[styles.tag, { backgroundColor: '#E5E5EA' }]}>
                    {task.recurrence}
                  </Text>
                )}
              </View>

              <View style={styles.taskMeta}>
                {task.deadline && (
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#8E8E93" />
                    <Text style={styles.metaText}>
                      {format(new Date(task.deadline), 'MMM d')}
                    </Text>
                  </View>
                )}
                {task.reminder && (
                  <View style={styles.metaItem}>
                    <Bell size={14} color="#8E8E93" />
                    <Text style={styles.metaText}>Reminder</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            {Platform.OS !== 'web' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => shareTask(task)}>
                <Share2 size={20} color="#007AFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDeleteTask(task.id)}>
              <Trash2 size={20} color="#FF3B30" />
            </TouchableOpacity>
            {onReorderTasks && (
              <TouchableOpacity style={styles.dragHandle}>
                <ArrowUpDown size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
         </View>
        // </Animated.View>
      // </GestureDetector>
    );
  };

  return <View style={styles.container}>{tasks.map(renderTask)}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  taskContent: {
    flex: 1,
    marginLeft: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  priorityIcon: {
    marginLeft: 8,
  },
  taskDetails: {
    marginTop: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  tag: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  dragHandle: {
    padding: 4,
    marginLeft: 4,
  },
});