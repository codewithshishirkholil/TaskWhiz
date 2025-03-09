import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, IconButton, Surface, useTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

export interface Todo {
      id: string;
      title: string;
      description: string;
      date: Date;
      reminderTime: Date;
      priority: 'low' | 'medium' | 'high';
      completed: boolean;
}

interface TodoItemProps {
      todo: Todo;
      onToggle: (id: string) => void;
      onDelete: (id: string) => void;
      onPress: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onPress }) => {
      const theme = useTheme();
      const priorityColors = {
            low: ['#4ADE80', '#22C55E'],
            medium: ['#FBBF24', '#F59E0B'],
            high: ['#F87171', '#EF4444'],
      };

      return (
            <TouchableOpacity onPress={() => onPress(todo)} style={styles.container}>
                  <Surface style={styles.surface}>
                        <View style={styles.checkboxContainer}>
                              <Checkbox
                                    status={todo.completed ? 'checked' : 'unchecked'}
                                    onPress={() => onToggle(todo.id)}
                                    color={theme.colors.primary}
                              />
                        </View>
                        <View style={styles.detailsContainer}>
                              <Text variant="titleMedium" style={todo.completed ? styles.completedText : undefined}>
                                    {todo.title}
                              </Text>
                              <Text variant="bodyMedium" style={styles.description}>
                                    {todo.description}
                              </Text>
                              <Text variant="bodySmall" style={styles.date}>
                                    {format(new Date(todo.date), 'PPP')}
                              </Text>
                              <Text variant="bodySmall" style={styles.time}>
                                    {format(new Date(todo.reminderTime), 'p')}
                              </Text>
                        </View>
                        <View style={styles.priorityContainer}>
                              <LinearGradient
                                    colors={priorityColors[todo.priority]}
                                    style={styles.priorityIndicator}
                              >
                                    <Text style={styles.priorityText}>{todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</Text>
                              </LinearGradient>
                              <IconButton
                                    icon="delete"
                                    onPress={() => onDelete(todo.id)}
                                    size={20}
                                    iconColor={theme.colors.error}
                              />
                        </View>
                  </Surface>
            </TouchableOpacity>
      );
};

const styles = StyleSheet.create({
      container: {
            marginBottom: 12,
      },
      surface: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderRadius: 8,
            elevation: 2,
      },
      checkboxContainer: {
            marginRight: 8,
      },
      detailsContainer: {
            flex: 1,
      },
      completedText: {
            textDecorationLine: 'line-through',
            color: '#6b7280',
      },
      description: {
            color: '#6b7280',
      },
      date: {
            color: '#6b7280',
      },
      time: {
            color: '#6b7280',
      },
      priorityContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 8,
      },
      priorityIndicator: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
      },
      priorityText: {
            color: 'white',
            fontWeight: 'bold',
      },
});

export default TodoItem;
export type { Todo };
