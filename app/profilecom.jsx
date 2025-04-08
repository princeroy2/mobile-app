import { StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const Profilesetting = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    about: '',
    status: '',
    role: '',
    avatar: '',
    phone: '',
  });

  useEffect(() => {
    // Fetch data from API when the component is mounted
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://192.168.0.108:1234/users'); // Replace with your API endpoint
      const data = await response.json();
      setUserData({
        name: data.results[0].name,
        email: data.results[0].email,
        password: data.results[0].password,
        about: data.results[0].about,
        status: data.results[0].status,
        role: data.results[0].role,
        avatar: data.results[0].avatar,
        phone: data.results[0].phone,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F8FF' }}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text></Text>
        <Text style={styles.profileText}>Profile</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* Profile Image Section */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: userData.avatar || require('@/assets/images/boy.png') }} // Use avatar URL if available, else fallback to local image
          style={styles.profileImage}
          resizeMode="contain"
        />
        <Text style={styles.profileName}>{userData.name}</Text>
      </View>

      {/* Gradient Section */}
      <LinearGradient
        colors={['#266352', '#19104E']} // Gradient colors
        style={styles.gradientContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.text}>You Have 0 Rides</Text>
          <Text style={styles.text}>Thanks for riding with us! You earned 300 points from your last ride</Text>
        </View>
      </LinearGradient>

      {/* Profile Info Section */}
      <View style={styles.cardContainer}>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Email: {userData.email}</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Phone: {userData.phone}</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Role: {userData.role}</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>About: {userData.about}</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Status: {userData.status}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profilesetting;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 100,
  },
  profileName: {
    marginVertical: 10,
    fontSize: 18,
  },
  gradientContainer: {
    marginHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: 'white',
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 30,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
