import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, StatusBar, Dimensions } from 'react-native';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';
import { Text, Surface, useTheme, Divider } from 'react-native-paper';
import { format } from 'date-fns';
import TodoItem, { Todo } from '../../components/TodoItem';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import useTodos from '@/hooks/useTodo';


const { width } = Dimensions.get('window');

export default function CalendarScreen() {
      const { todos, toggleTodo, deleteTodo } = useTodos();

      const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
      const theme = useTheme();

      const getMarkedDates = () => {
            const marked: { [key: string]: any } = {};

            todos.forEach(todo => {
                  const dateStr = format(new Date(todo.date), 'yyyy-MM-dd');
                  if (!marked[dateStr]) {
                        marked[dateStr] = {
                              dots: [],
                              marked: true,
                        };
                  }

                  // Add a dot for each priority level that exists on this date
                  const existingPriorities = marked[dateStr].dots.map((dot: any) => dot.key);
                  if (!existingPriorities.includes(todo.priority)) {
                        marked[dateStr].dots.push({
                              key: todo.priority,
                              color: todo.priority === 'high' ? '#EF4444' :
                                    todo.priority === 'medium' ? '#F59E0B' : '#22C55E',
                        });
                  }
            });

            // Add selected date styling
            marked[selectedDate] = {
                  ...(marked[selectedDate] || { dots: [] }),
                  selected: true,
                  selectedColor: theme.colors.primary + '40', // Add transparency
                  selectedTextColor: theme.colors.onSurface,
            };

            return marked;
      };

      const filteredTodos = todos.filter(todo =>
            format(new Date(todo.date), 'yyyy-MM-dd') === selectedDate
      );

      const todosForSelectedDate = {
            high: filteredTodos.filter(todo => todo.priority === 'high'),
            medium: filteredTodos.filter(todo => todo.priority === 'medium'),
            low: filteredTodos.filter(todo => todo.priority === 'low'),
      };

      const priorityLabels = {
            high: 'High Priority',
            medium: 'Medium Priority',
            low: 'Low Priority',
      };

      const priorityColors = {
            high: '#EF4444',
            medium: '#F59E0B',
            low: '#22C55E',
      };

      return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                  <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

                  {/* Header */}
                  <LinearGradient
                        colors={['#f0f9ff', theme.colors.background]}
                        style={styles.headerGradient}
                  >
                        <View style={styles.headerContent}>
                              <View style={styles.headerTop}>
                                    <View>
                                          <Text variant="titleMedium" style={styles.headerDate}>
                                                Calendar
                                          </Text>
                                          <Text variant="headlineMedium" style={styles.headerTitle}>
                                                {format(new Date(selectedDate), 'MMMM yyyy')}
                                          </Text>
                                    </View>
                              </View>
                        </View>
                  </LinearGradient>

                  <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContent}
                        showsVerticalScrollIndicator={true}
                  >
                        {/* Calendar */}
                        <Animated.View entering={FadeInDown.delay(100).springify()}>
                              <Surface
                                    style={[styles.calendarContainer, { backgroundColor: theme.colors.surface }]}
                                    elevation={2}
                              >
                                    <RNCalendar
                                          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                                          markedDates={getMarkedDates()}
                                          markingType="multi-dot"
                                          theme={{
                                                backgroundColor: 'transparent',
                                                calendarBackground: 'transparent',
                                                textSectionTitleColor: theme.colors.onSurface,
                                                selectedDayBackgroundColor: theme.colors.primary,
                                                selectedDayTextColor: '#ffffff',
                                                todayTextColor: theme.colors.primary,
                                                dayTextColor: theme.colors.onSurface,
                                                textDisabledColor: theme.colors.outline,
                                                monthTextColor: theme.colors.onSurface,
                                                indicatorColor: theme.colors.primary,
                                                arrowColor: theme.colors.primary,
                                                textDayFontWeight: '500',
                                                textMonthFontWeight: 'bold',
                                                textDayHeaderFontWeight: '600',
                                          }}
                                    />

                                    <View style={styles.legendContainer}>
                                          <View style={styles.legendItem}>
                                                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                                                <Text variant="labelSmall" style={styles.legendText}>High Priority</Text>
                                          </View>
                                          <View style={styles.legendItem}>
                                                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                                                <Text variant="labelSmall" style={styles.legendText}>Medium Priority</Text>
                                          </View>
                                          <View style={styles.legendItem}>
                                                <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                                                <Text variant="labelSmall" style={styles.legendText}>Low Priority</Text>
                                          </View>
                                    </View>
                              </Surface>
                        </Animated.View>

                        {/* Selected Date Header */}
                        <Animated.View entering={FadeInDown.delay(200).springify()}>
                              <Surface
                                    style={[styles.dateHeaderContainer, { backgroundColor: theme.colors.surface }]}
                                    elevation={1}
                              >
                                    <Text
                                          variant="titleLarge"
                                          style={[styles.dateTitle, { color: theme.colors.onSurface }]}
                                    >
                                          {format(new Date(selectedDate), 'EEEE, MMMM d')}
                                    </Text>
                                    <Text
                                          variant="titleSmall"
                                          style={[styles.taskCount, { color: theme.colors.onSurfaceVariant }]}
                                    >
                                          {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}
                                    </Text>
                              </Surface>
                        </Animated.View>

                        {/* Tasks for Selected Date */}
                        {filteredTodos.length > 0 ? (
                              <Animated.View entering={FadeInUp.delay(300).springify()}>
                                    {(['high', 'medium', 'low'] as const).map(priority =>
                                          todosForSelectedDate[priority].length > 0 && (
                                                <View key={priority} style={styles.prioritySection}>
                                                      <View style={styles.priorityHeader}>
                                                            <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[priority] }]} />
                                                            <Text variant="titleSmall" style={styles.priorityTitle}>
                                                                  {priorityLabels[priority]} ({todosForSelectedDate[priority].length})
                                                            </Text>
                                                      </View>

                                                      {todosForSelectedDate[priority].map((todo) => (
                                                            <View key={todo.id} style={styles.todoItemContainer}>
                                                                  <TodoItem
                                                                        todo={todo}
                                                                        onToggle={toggleTodo}
                                                                        onPress={(todo) => {
                                                                              // Handle todo press - navigate to details or show modal
                                                                              console.log("Todo pressed:", todo.title)
                                                                              // Example: navigation.navigate('TodoDetails', { todoId: todo.id });
                                                                        }}
                                                                        onDelete={() => deleteTodo(todo.id)}
                                                                  />
                                                            </View>
                                                      ))}
                                                </View>
                                          )
                                    )}
                              </Animated.View>
                        ) : (
                              <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.emptyContainer}>
                                    <Surface style={styles.emptyCard} elevation={1}>
                                          <Text
                                                variant="bodyLarge"
                                                style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
                                          >
                                                No tasks scheduled for this date
                                          </Text>
                                          <Text
                                                variant="bodyMedium"
                                                style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}
                                          >
                                                Add tasks from the Tasks tab to see them here
                                          </Text>
                                    </Surface>
                              </Animated.View>
                        )}

                        <View style={styles.bottomPadding} />
                  </ScrollView>
            </View>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
      },
      headerGradient: {
            paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            overflow: 'hidden',
            zIndex: 10,
      },
      headerContent: {
            padding: 20,
      },
      headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
      },
      headerDate: {
            opacity: 0.7,
            fontWeight: '500',
      },
      headerTitle: {
            fontWeight: '700',
      },
      scrollView: {
            flex: 1,
      },
      scrollViewContent: {
            padding: 16,
            paddingTop: 8,
            paddingBottom: 80, // For tab bar
      },
      calendarContainer: {
            borderRadius: 16,
            overflow: 'hidden',
            padding: 12,
            marginBottom: 16,
      },
      legendContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: 12,
            paddingBottom: 4,
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.05)',
            marginTop: 8,
      },
      legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      legendDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: 6,
      },
      legendText: {
            opacity: 0.7,
      },
      dateHeaderContainer: {
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
      },
      dateTitle: {
            fontWeight: '600',
      },
      taskCount: {
            opacity: 0.7,
            marginTop: 4,
      },
      prioritySection: {
            marginBottom: 16,
      },
      priorityHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            paddingLeft: 4,
      },
      priorityIndicator: {
            width: 12,
            height: 12,
            borderRadius: 6,
            marginRight: 8,
      },
      priorityTitle: {
            fontWeight: '600',
      },
      todoItemContainer: {
            marginBottom: 8,
      },
      emptyContainer: {
            marginTop: 16,
      },
      emptyCard: {
            padding: 24,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
      },
      emptyText: {
            textAlign: 'center',
            fontWeight: '500',
            marginBottom: 8,
      },
      emptySubtext: {
            textAlign: 'center',
            opacity: 0.7,
      },
      bottomPadding: {
            height: 100,
      },
});
