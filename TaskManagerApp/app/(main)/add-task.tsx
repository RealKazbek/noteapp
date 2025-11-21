import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api';
import { COLORS } from '../../styles/theme';

export default function AddTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timerInput, setTimerInput] = useState('');
  const canGoBack = router.canGoBack();

  const handleAddTask = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a quest title');
      return;
    }
    setIsLoading(true);
    const taskData = {
      title,
      description,
    };
    try {
      const response = await api.post('/tasks/', taskData);
      const newTask = response.data;
      const delaySeconds = parseInt(timerInput, 10);

      if (newTask && !isNaN(delaySeconds) && delaySeconds > 0) {
        const delayMs = delaySeconds * 1000;
        Alert.alert(
          'Timer Set!', 
          `Reminder for "${newTask.title}" will trigger in ${delaySeconds} sec.`
        );
        setTimeout(() => {
          Alert.alert(
            'REMINDER!', 
            newTask.title
          );
        }, delayMs);
      }
      if (canGoBack) {
        router.back();
      }
    } catch (error: any) {
      console.error('Create task error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create quest');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEW QUEST</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Quest Title (e.g. Defeat 10 slimes)"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={title}
        onChangeText={setTitle}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={description}
        onChangeText={setDescription}
        multiline
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Remind in (seconds)"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={timerInput}
        onChangeText={setTimerInput}
        keyboardType="numeric"
        editable={!isLoading}
      />
      
      <View style={styles.separator} />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleAddTask} 
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'SAVING...' : 'ACCEPT QUEST'}</Text>
      </TouchableOpacity>
      
      {Platform.OS === 'ios' && (
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.back()} 
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center',
    backgroundColor: COLORS.BG_PRIMARY,
  }, 
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    fontWeight: 'bold', 
    textAlign: 'center',
    color: COLORS.ACCENT_PRIMARY,
    fontFamily: 'monospace',
  },
  input: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT_PRIMARY,
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    minHeight: 50,
    backgroundColor: COLORS.BG_TERTIARY,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
  },
  separator: {
    height: 20,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.ACCENT_PRIMARY,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.BG_PRIMARY,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  linkButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  }
});