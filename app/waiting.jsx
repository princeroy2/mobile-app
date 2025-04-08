import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const WaitingScreen = () => {
  const navigation = useNavigation();
  const [driverId, setDriverId] = useState(null);  // State to hold driver ID
  const [driverdata, setDriverdata] = useState(null);  // State to hold driver data
  const [isLoading, setIsLoading] = useState(true);  // State to handle loading status
  const scaleValue = new Animated.Value(0);
  const [location, setLocation] = useState(null); // State to hold current location
  const [vehicalsdata, setVehicalsdata] = useState(null); // State to hold current vehicles data

  // API endpoint to check driver availability
  const checkDriverAvailability = async () => {
    const id = await AsyncStorage.getItem('id');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const bookingId = await AsyncStorage.getItem('bookingId');
    
    try {
      const response = await fetch(`http://192.168.0.114:1234/booking/details/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (data && data.driverId) {
        setDriverId(data.driverId);
        await AsyncStorage.setItem('DriverId', data.driverId);
        return true;  // Successfully got the driverId
      }
    } catch (error) {
      console.error('Error fetching driver availability:', error);
    }
    return false;  // No driver found yet
  };

  // Fetch driver data whenever driverId changes
  useEffect(() => {
    const fetchDriverData = async () => {
      if (driverId) {
        setIsLoading(true);
        try {
          const response = await fetch(`http://192.168.0.114:1234/users/oneUser/${driverId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data12 = await response.json();
          setDriverdata(data12);
          console.log(data12)
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
    };

    fetchDriverData();
  }, [driverId]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();
      setLocation(coords);

      if (coords) {
        const { latitude, longitude } = coords;
        const accessToken = await AsyncStorage.getItem('accessToken');
        const radius = 500;
        const response = await fetch('http://192.168.0.114:1234/vehicle/WithinRadius', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentLocation: {
              coordinates: [latitude, longitude],
            },
            radius,
          }),
        });
        const data = await response.json();
        setVehicalsdata(data);

        const activeVehicles = data.filter(vehicle => vehicle.status === 'active');
        if (activeVehicles.length > 0) {
          const randomIndex = Math.floor(Math.random() * activeVehicles.length);
          const randomVehicle = activeVehicles[randomIndex];
          await AsyncStorage.setItem('vehicleid', randomVehicle._id);
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([  
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    getCurrentLocation();

    // Polling for driver availability until we receive the driverId
    const interval = setInterval(async () => {
      const driverFound = await checkDriverAvailability();
      if (driverFound) {
        clearInterval(interval);  // Stop polling once we find the driver
      }
    }, 5000);  // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Navigate to the next screen when both driver and vehicle are available
  useEffect(() => {
    if (driverdata && vehicalsdata) {
      const activeVehicles = vehicalsdata.filter(vehicle => vehicle.status === 'active');
      if (driverdata && activeVehicles.length > 0) {
        setIsLoading(false);
        navigation.navigate('lastmap');
      }
    }
  }, [driverdata, vehicalsdata, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]} >
        <ActivityIndicator size={80} color="#2C9C96" />
      </Animated.View>

      <Text style={styles.message}>Your payment is done</Text>
      <Text style={styles.subMessage}>Finding a driver for you...</Text>

      {isLoading ? (
        <Text style={styles.loadingText}>Please hold on...</Text>
      ) : (
        <Text style={styles.loadingText}>Driver found! Navigating...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#2C9C96',
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default WaitingScreen;
