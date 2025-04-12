import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, distance, price, fuel, status } = route.params || {};
  console.log(price)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle function for sending data to API
  const handlePayment = async () => {
    if (userId && distance && price && status && fuel) {
      try {
        setLoading(true); // Set loading state to true when starting the process

        // Save data to AsyncStorage
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('distance', distance.toString());
        await AsyncStorage.setItem('price', price.toString());
        await AsyncStorage.setItem('status', status);
        await AsyncStorage.setItem('fuel', fuel.toString());
        console.log('peeeeeeeeeeeeeeeeee',userId,distance,price)

        // Example: You can replace this with your API call
        // const response = await fetch('YOUR_API_ENDPOINT', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     userId,
        //     distance,
        //     price,
        //     fuel,
        //     status,
        //   }),
        // });

        // Handle API response
        // if (response.ok) {
        //   const data = await response.json();
        //   // If successful, navigate or show success message
        //   navigation.navigate('PaymentSuccess');  // Example navigation
        // } else {
        //   throw new Error('Payment failed');
        // }

        // After processing, stop loading
        setLoading(false);
        // Optionally, you can navigate to a success screen after the payment is completed
        // Reset the stack and navigate to the 'stripe' screen
navigation.reset({
  index: 0,  // Reset the stack to have only one screen.
  routes: [
    { 
      name: 'stripe', 
      params: { userId, distance, price, fuel, status } // Pass parameters
    }
  ]
});

        } catch (error) {
        setLoading(false); // Stop loading
        setError('Error processing payment');
        console.error('Payment error:', error);
      }
    } else {
      setError('Missing required data');
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
