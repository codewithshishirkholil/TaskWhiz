import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';
import { Mic, Plus, Calendar, Bell, Tag, Flag } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, TaskCategory, TaskPriority, TaskRecurrence } from '../types/task';
import { format } from 'date-fns';

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');

  const startVoiceRecording = async () => {
    setIsRecording(true);
    try {
      const { isSpeechAvailable } = await Speech.getAvailableVoiceServicesAsync();
      if (isSpeechAvailable) {
        // Implementation would go here - using a mock for web
        setTimeout(() => {
          setTitle('Voice recorded task');
          setIsRecording(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({
        title,
        category,
        priority,
        deadline,
        reminder,
        recurrence,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setTitle('');
      setShowOptions(false);
      setCategory('personal');
      setPriority('medium');
      setDeadline(new Date());
      setReminder(false);
      setRecurrence('none');
    }
  };

  const handleDateChange = (event: Event, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(Platform.OS === 'ios');
    setDeadline(currentDate);
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Add a new task..."
          placeholderTextColor="#A0A0A0"
        />
        {Platform.OS !== 'web' && (
          <TouchableOpacity
            style={[styles.iconButton, isRecording && styles.recording]}
            onPress={startVoiceRecording}>
            <Mic color={isRecording ? '#FF3B30' : '#007AFF'} size={20} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Plus color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => setShowOptions(!showOptions)}>
        <Text style={styles.optionsText}>
          {showOptions ? 'Hide Options' : 'Show Options'}
        </Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <Tag size={20} color="#007AFF" />
            <Text style={styles.optionLabel}>Category:</Text>
            <View style={styles.optionButtons}>
              {['personal', 'work', 'shopping', 'health'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(cat as TaskCategory)}>
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.selectedCategoryText,
                    ]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.optionRow}>
            <Flag size={20} color="#007AFF" />
            <Text style={styles.optionLabel}>Priority:</Text>
            <View style={styles.optionButtons}>
              {['high', 'medium', 'low'].map((pri) => (
                <TouchableOpacity
                  key={pri}
                  style={[
                    styles.priorityButton,
                    priority === pri && styles.selectedPriority,
                    { backgroundColor: getPriorityColor(pri as TaskPriority) },
                  ]}
                  onPress={() => setPriority(pri as TaskPriority)}>
                  <Text style={styles.priorityText}>
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.optionRow}>
            <Calendar size={20} color="#007AFF" />
            <Text style={styles.optionLabel}>Deadline:</Text>
            <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
              <Text style={styles.dateText}>
                {format(deadline, 'MMM dd, yyyy')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
            />
          )}

          <View style={styles.optionRow}>
            <Bell size={20} color="#007AFF" />
            <Text style={styles.optionLabel}>Reminder:</Text>
            <TouchableOpacity
              style={[styles.reminderButton, reminder && styles.reminderActive]}
              onPress={() => setReminder(!reminder)}>
              <Text
                style={[
                  styles.reminderText,
                  reminder && styles.reminderActiveText,
                ]}>
                {reminder ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const getPriorityColor = (priority: TaskPriority): string => {
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

const styles = StyleSheet.create({
  container: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    paddingVertical: 8,
    marginRight: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    marginRight: 10,
  },
  recording: {
    backgroundColor: '#FFE5E5',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsButton: {
    marginTop: 10,
    padding: 8,
    alignItems: 'center',
  },
  optionsText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  optionsContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 15,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    width: 80,
  },
  optionButtons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  selectedPriority: {
    opacity: 1,
  },
  priorityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  dateButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    marginLeft: 10,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  datePickerIOS: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  reminderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    marginLeft: 10,
  },
  reminderActive: {
    backgroundColor: '#007AFF',
  },
  reminderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  reminderActiveText: {
    color: '#FFFFFF',
  },
});