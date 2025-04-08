import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const Index = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [role, setRole] = useState('USER'); // Default role
  const [dberror, setdbError] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSignup = async () => {
    setError('');
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setPhoneError('');

    let formValid = true;

    if (!name) {
      setNameError('Please enter your name.');
      formValid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email.');
      formValid = false;
    }

    if (!phone || phone.length !== 11 || isNaN(phone)) {
      setPhoneError('Please enter a valid 11-digit phone number.');
      formValid = false;
    }
    

    if (!password) {
      setPasswordError('Please enter your password.');
      formValid = false;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      formValid = false;
    }

    if (!formValid) {
      return;
    }

    const signupData = {
      name,
      email,
      phone,
      password,
      role,
    };
    console.log(signupData);

    try {
      const response = await fetch('http://192.168.0.114:1234/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }

      const data = await response.json();

      if (data) {
        console.log('Signup successful:', data);
        router.replace('/login');
      } else {
        setError(data.message || 'An error occurred during signup.');
      }
    } catch (error) {
      console.error(error.message);
      setdbError(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.fms}>Create an Account 👋</Text>
      <Image source={require('../assets/images/logo1.jpg')} style={styles.image} resizeMode="contain" />

      {/* Name Input */}
      <TextInput
        style={[styles.input, nameError && { borderColor: 'red' }]}
        placeholder="Enter your name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      {nameError && <Text style={styles.error}>{nameError}</Text>}

      {/* Email Input */}
      <TextInput
        style={[styles.input, emailError && { borderColor: 'red' }]}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {emailError && <Text style={styles.error}>{emailError}</Text>}

      {/* Phone Number Input */}
      <TextInput
        style={[styles.input, phoneError && { borderColor: 'red' }]}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      {phoneError && <Text style={styles.error}>{phoneError}</Text>}

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputWithIcon, passwordError && { borderColor: 'red' }]}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="black" />
        </TouchableOpacity>
      </View>
      {passwordError && <Text style={styles.error}>{passwordError}</Text>}

      {/* Confirm Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputWithIcon, passwordError && { borderColor: 'red' }]}
          placeholder="Confirm your password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconContainer}>
          <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={18} color="black" />
        </TouchableOpacity>
      </View>
      {passwordError && <Text style={styles.error}>{passwordError}</Text>}
      {dberror && <Text style={styles.error}>{dberror}</Text>}

      {/* Role Selection */}
      <Text style={styles.label}>Select your role:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={[styles.input, { borderColor: '#266352', height: 50 }]}
      >
        <Picker.Item label="User" value="USER" />
        <Picker.Item label="Driver" value="DRIVER" />
      </Picker>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Navigation */}
      <View style={styles.signupContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={{ color: '#266352' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 5,
    fontSize: 16,
    color: '#266352',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#d3f2f5',
    paddingBottom: 30,
  },
  image: {
    width: 300,
    height: 100,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#266352',
    borderWidth: 1,
    marginBottom: 0,
    // paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  inputWithIcon: {
    flex: 1,
    height: 50,
    borderColor: '#266352',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  button: {
    backgroundColor: '#266352',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#d3f2f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fms: {
    color: '#266352',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginBottom: 1,
    fontSize: 10,
    alignSelf: 'flex-start',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default Index;
