import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

function CheckoutScreen() {
  const route = useRoute();
  const { userId, distance, price, fuel, status } = route.params || {};

    const priceInt = Number(price);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userid, setuseid] = useState(userId);
  const [error, setError] = useState();
  const [distancee, setdistance] = useState(distance);
  const [pricee, setprice] = useState(price);
  const [fuell, setfuel] = useState(fuel);
  const [statuss, setstatus] = useState(status);

  // Fetch client secret from the backend
  const fetchPaymentIntentClientSecret = async () => {
  

    const apiEndpoint =
      Platform.OS === 'ios' ? 'http://localhost:4242' : 'http://10.0.2.2:4567';

    const response = await fetch(`http://192.168.0.114:1234/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: priceInt }),
    });

    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const { confirmPayment } = useConfirmPayment();

  const handlePayPress = async () => {
    setLoading(true);
    const email = await AsyncStorage.getItem('email');
    console.log(email)
    if (!email) {
      setLoading(false);
      setError('Email not found');
      return;
    }

    const billingDetails = { email };

    // Fetch the intent client secret from the backend
    const clientSecret = await fetchPaymentIntentClientSecret();

    // Confirm the payment with the card details
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: { billingDetails },
    });

    if (error) {
      console.log('Payment confirmation error', error);
      setError('Payment failed. Please try again.');
      setLoading(false);
    } else if (paymentIntent) {
      console.log('Success from promise', paymentIntent);
      await handleBooking();

      setLoading(false);
    }
  };

  // Handle booking data submission
  const handleBooking = async () => {
    console.log('Booking Data:', userid, distancee, pricee, statuss, fuell);
    const u = await AsyncStorage.getItem('userId');
    console.log(u)

    if (userid && distancee && pricee && statuss && fuell) {
      console.log(userid,distancee,pricee)
      setLoading(true);
      setError(null);
      const today = new Date();
      const startDate = today.toISOString();
      const endDate = today.toISOString();

      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const startLocation = await AsyncStorage.getItem('startLocation');
        const endLocation = await AsyncStorage.getItem('endLocation');

        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const startLocationObj = JSON.parse(startLocation);
        const endLocationObj = JSON.parse(endLocation);

        const startLatitude = startLocationObj?.latitude;
        const startLongitude = startLocationObj?.longitude;

        const endLatitude = endLocationObj?.latitude;
        const endLongitude = endLocationObj?.longitude;
        console.log(endLatitude)
        const isPaid='false'
        const response = await fetch('http://192.168.0.114:1234/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId:userid,
            // isPaid,
            status: 'confirmed',
            totalDistance: String(distancee),
            fuelConsumption: String(fuell),
            startDate,
            endDate,
            title: 'Trip to',
            description: `Distance: ${distancee} km`,
            price: String(pricee),
            startLocation: {
              coordinates: [startLongitude, startLatitude],
            },
            endLocation: {
              coordinates: [endLongitude, endLatitude],
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          await AsyncStorage.setItem('bookingId', data._id);
          await AsyncStorage.setItem('booking', 'start');
// Navigate to 'waiting' screen and reset the navigation stack
navigation.reset({
  index: 0,  // Reset the stack to have only one screen.
  routes: [{ name: 'waiting' }],  // Navigate to 'waiting' screen
});
        } else {
          const errorText = await response.text();
          throw new Error(`API Error: ${errorText}`);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Missing data to send to API');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Details</Text>

      {/* Card Input Field */}
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.cardField}
        style={styles.cardFieldContainer}
        onCardChange={(cardDetails) => {
          console.log('Card details', cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log('Focused field', focusedField);
        }}
      />

      {/* Payment Information */}
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>Total:</Text>
        <Text style={styles.amount}>PKR {price?.toFixed(2)}</Text>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePayPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Pay Now</Text>
        )}
      </TouchableOpacity>

      {/* Error Handling */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  cardField: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
  cardFieldContainer: {
    width: '100%',
    height: 50,
    marginVertical: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  priceText: {
    fontSize: 18,
    color: '#555',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C9C96',
  },
  payButton: {
    backgroundColor: '#2C9C96',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  payButtonDisabled: {
    backgroundColor: '#A0D0C9',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});

export default CheckoutScreen;
