import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { COLORS } from '../../styles/theme';

export default function LoginScreen() {
  const { setToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/token/', {
        username,
        password,
      });

      const accessToken = response.data.access;

      if (accessToken) {
        await setToken(accessToken); 
      } else {
        Alert.alert('Error', 'Failed to get token');
      }

    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error.message);
      Alert.alert('Login Error', 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>

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
        placeholder="password"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'LOADING...' : 'CONTINUE'}</Text>
      </TouchableOpacity>

      <Link href="/(auth)/register" asChild>
        <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
          <Text style={styles.linkText}>No account? Create one</Text>
        </TouchableOpacity>
      </Link>
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