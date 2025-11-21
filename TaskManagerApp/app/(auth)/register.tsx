import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api';
import { COLORS } from '../../styles/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/register/', {
        username,
        email,
        password,
      });

      console.log('Registration success:', response.data);
      Alert.alert(
        'Success!',
        'Account created. Please log in.',
        [{ text: 'OK', onPress: () => router.back() }]
      );

    } catch (error: any) {
      console.error('Registration Error:', error.response?.data || error.message);
      Alert.alert('Registration Error', 'Failed to create account. ' + (error.response?.data?.username || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTER</Text>

      <TextInput
        style={styles.input}
        placeholder="username"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => router.back()} 
        disabled={isLoading}
      >
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  title: { 
    fontSize: 32, 
    marginBottom: 30, 
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: COLORS.ACCENT_PRIMARY,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.BG_TERTIARY,
    borderRadius: 0,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: COLORS.TEXT_PRIMARY,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT_PRIMARY,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.ACCENT_PRIMARY,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
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
  },
  linkText: {
    color: COLORS.ACCENT_SECONDARY,
    fontSize: 14,
  }
});