import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

function CheckoutScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { price } = route.params || {};
  const priceInt = Number(price);
  const [loading, setLoading] = useState(false);

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
    const billingDetails = {
      email: 'jenny.rosen@example.com',
    };

    // Fetch the intent client secret from the backend
    const clientSecret = await fetchPaymentIntentClientSecret();

    // Confirm the payment with the card details
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: { billingDetails },
    });

    if (error) {
      console.log('Payment confirmation error', error);
      setLoading(false);
    } else if (paymentIntent) {
      console.log('Success from promise', paymentIntent);
      setLoading(false);
      navigation.navigate('waiting'); // Navigate to the waiting screen on success
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

      {/* Loading Indicator and Error */}
      {/* {loading && <ActivityIndicator size="large" color="#2C9C96" style={styles.loader} />} */}
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
  loader: {
    marginTop: 20,
  },
});

export default CheckoutScreen;
