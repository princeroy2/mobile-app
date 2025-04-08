import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [backendError, setBackendError] = useState('');

  // Email validation regex (basic)
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    let isFormValid = true;
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isFormValid = false;
    }

    if (!password) {
      setPasswordError('Password cannot be empty');
      isFormValid = false;
    }

    if (isFormValid) {
      try {
        const response = await fetch('http://192.168.0.114:1234/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();


        if (response.ok) {
          if (result.statuscode !== 400) {
            // Store the accessToken in AsyncStorage after successful login
            try {
              await AsyncStorage.setItem('accessToken', result.accessToken);
              await AsyncStorage.setItem('login', 'true'); 
              await AsyncStorage.setItem('id', result.user.id); 
              
              // console.log(result)
             
              console.log('Token saved');
            } catch (error) {
              console.error('Error saving token:', error);
            }
         
 
            // Navigate to the tabs screen after successful login
            router.replace('/(tabs)');
          } else {
            setBackendError(result.message);
          }
        } else {
          setBackendError(result.message);
        }
      } catch (error) {
        setBackendError('Network error: ' + error.message);
        console.log(error.message)
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.fms}>Hi, Welcome Back! 👋</Text>
      <Image source={require('../assets/images/logo1.jpg')} style={styles.image} resizeMode="contain" />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, emailError && { borderColor: 'red' }]}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {emailError && <Text style={styles.error}>{emailError}</Text>}

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputWithIcon, passwordError && { borderColor: 'red' }]}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="black" />
        </TouchableOpacity>
      </View>
      {passwordError && <Text style={styles.error}>{passwordError}</Text>}

      {backendError && <Text style={styles.error}>{backendError}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={{ color: '#266352' }}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#d3f2f5' },
  image: { width: 300, height: 190, marginBottom: 5, marginTop: 5, borderRadius: 30 },
  input: { width: '100%', height: 50, borderColor: '#266352', borderWidth: 1, paddingHorizontal: 10, borderRadius: 5 },
  inputWithIcon: { flex: 1, height: 50, borderColor: '#266352', borderWidth: 1, paddingHorizontal: 10, borderRadius: 5 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  iconContainer: { position: 'absolute', right: 10, padding: 10 },
  button: { backgroundColor: '#266352', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  buttonText: { color: '#d3f2f5', fontSize: 16, fontWeight: 'bold' },
  fms: { color: '#266352', fontSize: 24, fontWeight: 'bold', marginTop: 50 },
  label: { alignSelf: 'flex-start', color: '#695C5C', marginVertical: 10, fontSize: 14 },
  signupContainer: { flexDirection: 'row', marginTop: 50 },
  error: { color: 'red', fontSize: 12, alignSelf: 'flex-start' },
});

export default Index;
