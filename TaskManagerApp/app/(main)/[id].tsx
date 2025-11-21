import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../api';
import { COLORS } from '../../styles/theme';

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof id !== 'string') {
      Alert.alert('Error', 'Invalid Quest ID');
      router.back();
      return;
    }
    
    setIsLoading(true);
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}/`);
        setTitle(response.data.title);
        setDescription(response.data.description || '');
      } catch (error) {
        console.error('Load task error:', error);
        Alert.alert('Error', 'Failed to load quest data');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSaveTask = async () => {
    if (!title) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }
    if (typeof id !== 'string') return;

    setIsSaving(true);
    try {
      await api.patch(`/tasks/${id}/`, {
        title,
        description,
      });
      router.back();
    } catch (error: any) {
      console.error('Save error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.ACCENT_PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EDIT QUEST</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Quest Title"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.separator} />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSaveTask} 
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</Text>
      </TouchableOpacity>
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
  }
});