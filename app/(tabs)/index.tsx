import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, StatusBar, Dimensions, Alert } from 'react-native';
import {
      Button,
      FAB,
      Portal,
      Modal,
      TextInput,
      Surface,
      Text,
      useTheme,
      IconButton,
      Chip,
      Divider,
      Menu,
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useForm, Controller } from 'react-hook-form';
import TodoItem, { Todo } from '../../components/TodoItem';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { MoreVertical, Trash2 } from 'lucide-react-native';
import useTodos from '@/hooks/useTodo';
import { registerForPushNotificationsAsync, scheduleNotification } from '@/hooks/notificationHandler';

const { width } = Dimensions.get('window');

export default function TodoScreen() {
      const { todos, addTodo, deleteTodo, editTodo } = useTodos();
      const [visible, setVisible] = useState(false);
      const [datePickerVisible, setDatePickerVisible] = useState(false);
      const [timePickerVisible, setTimePickerVisible] = useState(false);
      const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
      const [menuVisible, setMenuVisible] = useState(false);

      useEffect(() => {
            registerForPushNotificationsAsync();
      }, []);

      const { control, handleSubmit, reset, setValue, watch } = useForm({
            defaultValues: {
                  title: '',
                  description: '',
                  date: new Date(),
                  time: new Date(),
                  priority: 'low',
            },
      });

      const theme = useTheme();
      const date = watch('date');
      const time = watch('time');

      const handleAddTodo = async  (data: any) => {
            const newTodo: Todo = {
                  id: Date.now().toString(),
                  title: data.title,
                  description: data.description,
                  date: data.date,
                  reminderTime: data.time,
                  priority: data.priority,
                  completed: false,
            };
            await scheduleNotification(newTodo);
            addTodo(newTodo);
            setVisible(false);
            resetForm();
      };

      const resetForm = () => {
            reset({
                  title: '',
                  description: '',
                  date: new Date(),
                  time: new Date(),
                  priority: 'low',
            });
      };

      const toggleTodo = (id: string) => {
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                  editTodo(id, { completed: !todo.completed });
            }
      };

      const clearAllTodos = () => {
            Alert.alert(
                  'Clear All Tasks',
                  'Are you sure you want to delete all tasks? This action cannot be undone.',
                  [
                        { text: 'Cancel', style: 'cancel' },
                        {
                              text: 'Clear All',
                              onPress: () => {
                                    todos.forEach(todo => deleteTodo(todo.id));
                              },
                              style: 'destructive',
                        },
                  ]
            );
      };

      const clearCompletedTodos = () => {
            todos.filter(todo => todo.completed).forEach(todo => deleteTodo(todo.id));
      };

      const getHeaderTitle = () => {
            return format(new Date(), 'EEEE, MMMM d');
      };

      const priorityColors = {
            low: ['#4ADE80', '#22C55E'],
            medium: ['#FBBF24', '#F59E0B'],
            high: ['#F87171', '#EF4444'],
      };

      const getFilteredTodos = () => {
            switch (filter) {
                  case 'active':
                        return todos.filter(todo => !todo.completed);
                  case 'completed':
                        return todos.filter(todo => todo.completed);
                  default:
                        return todos;
            }
      };

      const filteredTodos = getFilteredTodos();
      const completedCount = todos.filter(todo => todo.completed).length;
      const activeCount = todos.length - completedCount;

      // Generate sample todos for testing scrolling
      const generateSampleTodos = () => {
            const sampleTodos = [];
            for (let i = 1; i <= 20; i++) {
                  sampleTodos.push({
                        id: `sample-${i}`,
                        title: `Sample Task ${i}`,
                        description: `This is a sample task description ${i}`,
                        date: new Date(),
                        reminderTime: new Date(),
                        priority: (i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
                        completed: i % 4 === 0,
                  });
            }
            sampleTodos.forEach(todo => addTodo(todo));
      };

      return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                  <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

                  <View style={styles.mainContainer}>
                        {/* Fixed Header */}
                        <LinearGradient
                              colors={['#f0f9ff', theme.colors.background]}
                              style={styles.headerGradient}
                        >
                              <View style={styles.headerContent}>
                                    <View style={styles.headerTop}>
                                          <View>
                                                <Text variant="titleMedium" style={styles.headerDate}>
                                                      Today
                                                </Text>
                                                <Text variant="headlineMedium" style={styles.headerTitle}>
                                                      {getHeaderTitle()}
                                                </Text>
                                          </View>

                                          <View style={styles.headerActions}>
                                                <Menu
                                                      visible={menuVisible}
                                                      onDismiss={() => setMenuVisible(false)}
                                                      anchor={
                                                            <IconButton
                                                                  icon={props => <MoreVertical {...props} />}
                                                                  onPress={() => setMenuVisible(true)}
                                                                  size={24}
                                                            />
                                                      }
                                                      contentStyle={styles.menuContent}
                                                >
                                                      <Menu.Item
                                                            leadingIcon={props => <Trash2 color={theme.colors.error} {...props} />}
                                                            onPress={() => {
                                                                  setMenuVisible(false);
                                                                  clearAllTodos();
                                                            }}
                                                            title="Clear All Tasks"
                                                            titleStyle={{ color: theme.colors.error }}
                                                      />
                                                      {completedCount > 0 && (
                                                            <Menu.Item
                                                                  leadingIcon="check-circle-outline"
                                                                  onPress={() => {
                                                                        setMenuVisible(false);
                                                                        clearCompletedTodos();
                                                                  }}
                                                                  title="Clear Completed Tasks"
                                                            />
                                                      )}
                                                      <Menu.Item
                                                            leadingIcon="plus-circle-outline"
                                                            onPress={() => {
                                                                  setMenuVisible(false);
                                                                  generateSampleTodos();
                                                            }}
                                                            title="Generate Test Tasks"
                                                      />
                                                </Menu>
                                          </View>
                                    </View>

                                    <View style={styles.statsContainer}>
                                          <Animated.View entering={FadeInDown.delay(100).springify()}>
                                                <Surface style={styles.statCard} elevation={1}>
                                                      <Text variant="labelLarge" style={styles.statLabel}>Total Tasks</Text>
                                                      <Text variant="headlineMedium" style={styles.statValue}>{todos.length}</Text>
                                                </Surface>
                                          </Animated.View>

                                          <Animated.View entering={FadeInDown.delay(200).springify()}>
                                                <Surface style={styles.statCard} elevation={1}>
                                                      <Text variant="labelLarge" style={styles.statLabel}>Completed</Text>
                                                      <Text variant="headlineMedium" style={styles.statValue}>{completedCount}</Text>
                                                </Surface>
                                          </Animated.View>

                                          <Animated.View entering={FadeInDown.delay(300).springify()}>
                                                <Surface style={styles.statCard} elevation={1}>
                                                      <Text variant="labelLarge" style={styles.statLabel}>Remaining</Text>
                                                      <Text variant="headlineMedium" style={styles.statValue}>{activeCount}</Text>
                                                </Surface>
                                          </Animated.View>
                                    </View>

                                    <ScrollView
                                          horizontal
                                          showsHorizontalScrollIndicator={false}
                                          contentContainerStyle={styles.filterScrollContainer}
                                    >
                                          {(['all', 'active', 'completed'] as const).map(f => (
                                                <Chip
                                                      key={f}
                                                      selected={filter === f}
                                                      onPress={() => setFilter(f)}
                                                      style={styles.filterChip}
                                                      showSelectedCheck={false}
                                                      elevated
                                                >
                                                      {f.charAt(0).toUpperCase() + f.slice(1)}
                                                </Chip>
                                          ))}
                                    </ScrollView>
                              </View>
                        </LinearGradient>

                        {/* Scrollable Content */}
                        <ScrollView
                              style={styles.scrollView}
                              contentContainerStyle={styles.scrollViewContent}
                              showsVerticalScrollIndicator={true}
                              alwaysBounceVertical={true}
                              overScrollMode="always"
                        >
                              {filteredTodos.length === 0 ? (
                                    <View style={styles.emptyContainer}>
                                          <Text variant="titleMedium" style={styles.emptyText}>
                                                {filter === 'all'
                                                      ? 'No tasks yet. Add your first task!'
                                                      : filter === 'active'
                                                            ? 'No active tasks. Great job!'
                                                            : 'No completed tasks yet.'}
                                          </Text>
                                    </View>
                              ) : (
                                    filteredTodos.map((todo, index) => (
                                          <Animated.View
                                                key={todo.id}
                                                entering={FadeInRight.delay(index * 50).springify()}
                                                style={styles.todoItemContainer}
                                          >
                                                <TodoItem
                                                      todo={todo}
                                                      onToggle={toggleTodo}
                                                      onPress={(todo) => console.log('Todo pressed:', todo.title)}
                                                      onDelete={() => deleteTodo(todo.id)}
                                                />
                                          </Animated.View>
                                    ))
                              )}
                              <View style={styles.bottomPadding} />
                        </ScrollView>

                        <Portal>
                              <Modal
                                    visible={visible}
                                    onDismiss={() => setVisible(false)}
                                    contentContainerStyle={[
                                          styles.modalContainer,
                                          { backgroundColor: theme.colors.surface },
                                    ]}>
                                    {Platform.OS === 'ios' && (
                                          <BlurView intensity={80} style={StyleSheet.absoluteFill} />
                                    )}
                                    <View style={styles.modalHeader}>
                                          <Text variant="headlineSmall" style={styles.modalTitle}>
                                                Add New Task
                                          </Text>
                                          <IconButton
                                                icon="close"
                                                onPress={() => setVisible(false)}
                                                size={24}
                                          />
                                    </View>

                                    <Divider style={styles.divider} />

                                    <ScrollView
                                          style={styles.modalScrollView}
                                          showsVerticalScrollIndicator={true}
                                    >
                                          <Controller
                                                control={control}
                                                name="title"
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                      <TextInput
                                                            label="Title"
                                                            value={value}
                                                            onBlur={onBlur}
                                                            onChangeText={onChange}
                                                            style={styles.input}
                                                            mode="outlined"
                                                            placeholder="What do you need to do?"
                                                      />
                                                )}
                                          />
                                          <Controller
                                                control={control}
                                                name="description"
                                                render={({ field: { onChange, value } }) => (
                                                      <TextInput
                                                            label="Description"
                                                            value={value}
                                                            onChangeText={onChange}
                                                            multiline
                                                            numberOfLines={3}
                                                            style={styles.input}
                                                            mode="outlined"
                                                            placeholder="Add details about your task"
                                                      />
                                                )}
                                          />
                                          <Controller
                                                control={control}
                                                name="date"
                                                render={({ field: { onChange, value } }) => (
                                                      <>
                                                            <Button
                                                                  mode="outlined"
                                                                  onPress={() => setDatePickerVisible(true)}
                                                                  style={styles.input}
                                                                  icon="calendar-outline">
                                                                  Select Date: {format(value, 'yyyy-MM-dd')}
                                                            </Button>
                                                            <DateTimePickerModal
                                                                  isVisible={datePickerVisible}
                                                                  mode="date"
                                                                  onConfirm={(date) => {
                                                                        onChange(date);
                                                                        setDatePickerVisible(false);
                                                                  }}
                                                                  onCancel={() => setDatePickerVisible(false)}
                                                                  date={value}
                                                            />
                                                      </>
                                                )}
                                          />
                                          <Controller
                                                control={control}
                                                name="time"
                                                render={({ field: { onChange, value } }) => (
                                                      <>
                                                            <Button
                                                                  mode="outlined"
                                                                  onPress={() => setTimePickerVisible(true)}
                                                                  style={styles.input}
                                                                  icon="clock-outline">
                                                                  Set Reminder Time: {format(value, 'h:mm a')}
                                                            </Button>
                                                            <DateTimePickerModal
                                                                  isVisible={timePickerVisible}
                                                                  mode="time"
                                                                  onConfirm={(time) => {
                                                                        onChange(time);
                                                                        setTimePickerVisible(false);
                                                                  }}
                                                                  onCancel={() => setTimePickerVisible(false)}
                                                                  date={value}
                                                            />
                                                      </>
                                                )}
                                          />
                                          <Text variant="labelLarge" style={styles.priorityLabel}>
                                                Priority Level
                                          </Text>
                                          <View style={styles.priorityContainer}>
                                                {(['low', 'medium', 'high'] as const).map((p) => (
                                                      <LinearGradient
                                                            key={p}
                                                            colors={priorityColors[p]}
                                                            style={[
                                                                  styles.priorityButton,
                                                                  {
                                                                        borderColor: priorityColors[p][0],
                                                                  },
                                                            ]}>
                                                            <Controller
                                                                  control={control}
                                                                  name="priority"
                                                                  render={({ field: { onChange, value } }) => (
                                                                        <Button
                                                                              mode={value === p ? 'contained' : 'outlined'}
                                                                              onPress={() => onChange(p)}
                                                                              style={{ flex: 1 }}
                                                                              buttonColor={value === p ? 'transparent' : undefined}
                                                                              textColor={value === p ? 'white' : priorityColors[p][0]}>
                                                                              {p.charAt(0).toUpperCase() + p.slice(1)}
                                                                        </Button>
                                                                  )}
                                                            />
                                                      </LinearGradient>
                                                ))}
                                          </View>
                                    </ScrollView>

                                    <Divider style={styles.divider} />

                                    <Button
                                          mode="contained"
                                          onPress={handleSubmit(handleAddTodo)}
                                          style={styles.addButton}
                                          icon="plus">
                                          Add Task
                                    </Button>
                              </Modal>
                        </Portal>

                        <FAB
                              icon="plus"
                              style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                              onPress={() => setVisible(true)}
                              customSize={64}
                        />
                  </View>
            </View>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
      },
      mainContainer: {
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
            marginBottom: 20,
      },
      headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      headerDate: {
            opacity: 0.7,
            fontWeight: '500',
      },
      headerTitle: {
            fontWeight: '700',
      },
      menuContent: {
            borderRadius: 12,
            marginTop: 40,
      },
      statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
      },
      statCard: {
            width: (width - 60) / 3,
            padding: 12,
            borderRadius: 16,
            backgroundColor: '#BEDDEF',
      },
      statLabel: {
            opacity: 0.7,
            marginBottom: 4,
      },
      statValue: {
            fontWeight: 'bold',
      },
      filterScrollContainer: {
            paddingRight: 20,
            paddingBottom: 10,
      },
      filterChip: {
            marginRight: 8,
      },
      scrollView: {
            flex: 1,
      },
      scrollViewContent: {
            padding: 16,
            paddingTop: 8,
            paddingBottom: 80,
      },
      todoItemContainer: {
            marginBottom: 12,
      },
      emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            height: 200,
      },
      emptyText: {
            textAlign: 'center',
            opacity: 0.7,
      },
      modalContainer: {
            padding: 0,
            margin: 20,
            borderRadius: 24,
            maxHeight: '80%',
            overflow: 'hidden',
      },
      modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            paddingBottom: 10,
      },
      modalTitle: {
            fontWeight: '700',
      },
      divider: {
            marginVertical: 10,
      },
      modalScrollView: {
            padding: 20,
            maxHeight: '60%',
      },
      input: {
            marginBottom: 16,
      },
      priorityLabel: {
            marginBottom: 8,
            fontWeight: '600',
      },
      priorityContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
            gap: 8,
      },
      priorityButton: {
            flex: 1,
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 1,
      },
      addButton: {
            margin: 20,
            borderRadius: 12,
            height: 50,
            justifyContent: 'center',
      },
      fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 80,
            borderRadius: 32,
      },
      bottomPadding: {
            height: 100,
      },
});
