import { StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  // State to store any error or message from API response
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      // Get the access token from AsyncStorage
      const token = await AsyncStorage.getItem('accessToken');

      if (token) {
        // Call the logout API with the access token
        const response = await fetch('http://192.168.0.114:1234/auth/logOut', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send the token as Authorization header
          },
        });

        // Check if the response is OK
        if (response.ok) {
          // If logout is successful, clear the token from AsyncStorage
          await AsyncStorage.removeItem('accessToken');
      
                        await AsyncStorage.removeItem('login'); 
                        await AsyncStorage.removeItem('id');

          // Navigate the user to the login screen
          router.replace('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Logout failed');
        }
      } else {
        setError('No token found');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('An error occurred while logging out');
    }
  };

  return (
    // Wrap your content with SafeAreaView to ensure content is within the safe area
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
          source={require('@/assets/images/boy.png')} // Use require for local images
          style={styles.profileImage}
          resizeMode="contain"
        />
        <Text style={styles.profileName}>Hasnain Haider</Text>
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

      {/* Menu Card Section */}
      <View style={styles.cardContainer}>
        {/* Profile Info */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profileinfo')}>
          <View style={styles.menuItemLeft}>
            <Feather name="user" size={24} color="blue" />
            <Text style={styles.menuText}>Profile Info</Text>
          </View>
          <Entypo name="chevron-small-right" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.line}></Text>

        {/* Booking */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/booking')}>
          <View style={styles.menuItemLeft}>
            <Feather name="shopping-bag" size={24} color="blue" />
            <Text style={styles.menuText}>Booking</Text>
          </View>
          <Entypo name="chevron-small-right" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.line}></Text>

        {/* Activate */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/activate')}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="access-time" size={24} color="blue" />
            <Text style={styles.menuText}>Activate</Text>
          </View>
          <Entypo name="chevron-small-right" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.line}></Text>

        {/* Logout */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="logout" size={24} color="blue" />
            <Text style={styles.menuText}>Logout</Text>
          </View>
          <Entypo name="chevron-small-right" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.line}></Text>
      </View>

      {/* Show any error if occurred during logout */}
      {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}
    </SafeAreaView>
  );
};

export default Profile;

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
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20, // Optional padding for spacing
  },
  textContainer: {
    alignItems: 'center', // Align text in the center
  },
  text: {
    color: 'white', // White text color for contrast
    fontSize: 15, // Adjust font size as needed
    textAlign: 'center', // Ensure text is centered
    marginBottom: 10, // Optional margin between text
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
  menuItemLeft: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  line: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
    marginVertical: 3, // Adjust spacing between the line and the next content
  },
});
