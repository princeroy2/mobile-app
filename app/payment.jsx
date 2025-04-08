import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, distance, price, fuel, status } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle function for sending data to API
  const handlePayment = async () => {
    if (userId && distance && price && status && fuel) {
      console.log(price)
      const sendDataToApi = async () => {
        setLoading(true);
        setError(null);
        const today = new Date();
        const startDate = today.toISOString();
        const endDate = today.toISOString();

        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          const startLocation = await AsyncStorage.getItem('startLocation');
          const endLocation = await AsyncStorage.getItem('EndLocation');
          
          // If the location data is stored as a JSON string, we need to parse it
          const startLocationObj = JSON.parse(startLocation);
          const endLocationObj = JSON.parse(endLocation);
          
          // Extract latitude and longitude
          const startLatitude = startLocationObj ? startLocationObj.latitude : null;
          const startLongitude = startLocationObj ? startLocationObj.longitude : null;

          const endLatitude = endLocationObj ? endLocationObj.latitude : null;
          const endLongitude = endLocationObj ? endLocationObj.longitude : null;
          console.log('endLocation',endLatitude)
          
          console.log(`Start Location - Latitude: ${startLatitude}, Longitude: ${startLongitude}`);
          console.log(`endLatitude Location - Latitude: ${endLatitude}, Longitude: ${endLongitude}`);
          
          
          if (!accessToken) {
            throw new Error('Access token not found.');
          }

          const response = await fetch('http://192.168.0.114:1234/booking', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              userId,
              totalDistance: String(distance),
              fuelConsumption: String(fuel),
              startDate,
              endDate,
    
              title: 'Trip to',
              description: `Distance: ${distance} km`,
              price:String(price),
              startLocation:{
                coordinates:[
                  startLongitude,
                  startLatitude
                ]
              },
              endLocation:{
                coordinates:[
                  endLongitude,
                  endLatitude
                ]
              }
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('API response:', data);
            await AsyncStorage.setItem('bookingId',data._id);
            await AsyncStorage.setItem('booking','done');
            // Navigate to next screen if payment is confirmed
            navigation.navigate('stripe', { price });
          } else {
            const errorText = await response.text();
            throw new Error(`API Error: ${errorText}`);
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      sendDataToApi();
    } else {
      setError('Missing data to send to API.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Sending data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Confirm Payment</Text>

        {/* Distance */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Distance:</Text>
          <Text style={styles.value}>{distance.toFixed(2)} km</Text>
        </View>

        {/* Price */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>{price} PKR</Text>
        </View>

        {/* Status */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{status}</Text>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handlePayment}
        >
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
    width: '40%',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: '60%',
  },
  button: {
    backgroundColor: '#4CAF50',  // Stylish green color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
