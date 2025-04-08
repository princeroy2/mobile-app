// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
// import { CardField, useStripe,useConfirmPayment } from '@stripe/stripe-react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';

// // Add Stripe publishable key
// const stripePublishableKey = 'pk_test_51QgvsE4RRFp4tU4idxLkVvXZLSIuxe5hMjPFjgtOE29uxUiknQjZe4OJpyx1sa9SwGAqlCAom58mIFrK8kIvEpRe00k2mu8ckK';
// const backendUrl = 'http://192.168.0.108:1234/payments/create-payment-intent'; // Your backend API

// const ConfirmAndPay = () => {
//   const route = useRoute();
//   const { price, title, description } = route.params || {};  // Get passed params
  
//   useEffect(() => {
//     if (!price || !title || !description) {
//       Alert.alert('Error', 'Missing data for payment.');
//     }
//   }, [price, title, description]);

//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
//   const [cardType, setCardType] = useState('');
//   const { confirmPayment } = useStripe();
//   const navigation = useNavigation();

//   const handlePayment = async () => {
//     setIsProcessing(true);
//     setError('');
  
//     try {
//       const paymentAmount = Math.round(Number(price) * 100);  // Ensure price is in cents and number format
  
//       const response = await fetch(backendUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: paymentAmount }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to create payment intent');
//       }
  
//       const { clientSecret } = await response.json();
//       console.log(clientSecret)
//       const {confirmPayment, loading} = useConfirmPayment();
//       const billingDetails = {
//         email: 'jenny.rosen@example.com',
//       };
     
//       const {paymentIntent, error} = await confirmPayment(clientSecret, {
//         paymentMethodType: 'Card',
//         paymentMethodData: {
//           billingDetails,
//         },
//       });
//       console.log(paymentIntent)
//       if (error) {
//         console.error('Payment error:', error);
//         setError(error.message);
//         setIsProcessing(false);
//         return;
//       }
  
//       if (paymentIntent.status === 'Succeeded') {
//         Alert.alert('Payment Successful', 'Your payment was successful!');
//         navigation.navigate('Profile');
//       }
//     } catch (err) {
//       console.error('Complete payment error:', err);
//       setError('Payment processing failed');
//     } finally {
//       setIsProcessing(false);
//     }
//   };
  

//   const handleCardChange = (details) => {
//     setCardDetails(details);
//     if (details.card?.brand) {
//       setCardType(details.card.brand);
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 20, backgroundColor: '#F9F9F9' }}>
//       {/* Headline */}
//       <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 25 }}>
//         Payment with Card
//       </Text>

//       {/* Card Number Field */}
//       <TextInput
//         style={{
//           height: 50,
//           borderWidth: 1,
//           borderColor: '#ddd',
//           borderRadius: 8,
//           paddingLeft: 15,
//           backgroundColor: '#fff',
//           marginBottom: 15,
//         }}
//         placeholder="Card Number"
//         value={cardDetails.number}
//         onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
//       />

//       {/* Expiry and CVC Fields in One Line */}
//       <View style={{ flexDirection: 'row', marginBottom: 25 }}>
//         <View style={{ flex: 1, marginRight: 8 }}>
//           <TextInput
//             style={{
//               height: 50,
//               borderWidth: 1,
//               borderColor: '#ddd',
//               borderRadius: 8,
//               paddingLeft: 15,
//               backgroundColor: '#fff',
//             }}
//             placeholder="MM/YY"
//             value={cardDetails.expiry}
//             onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
//           />
//         </View>
//         <View style={{ flex: 1 }}>
//           <TextInput
//             style={{
//               height: 50,
//               borderWidth: 1,
//               borderColor: '#ddd',
//               borderRadius: 8,
//               paddingLeft: 15,
//               backgroundColor: '#fff',
//             }}
//             placeholder="CVC"
//             value={cardDetails.cvc}
//             onChangeText={(text) => setCardDetails({ ...cardDetails, cvc: text })}
//           />
//         </View>
//       </View>

//       {/* Card Type (Visa or MasterCard) */}
//       {cardType && (
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
//           <Text style={{ fontSize: 16, color: '#333', marginRight: 8 }}>Card Type:</Text>
//           {cardType === 'visa' ? (
//             <Image source={require('@/assets/images/visa.png')} style={{ width: 40, height: 25 }} />
//           ) : cardType === 'mastercard' ? (
//             <Image source={require('@/assets/images/mastercard.png')} style={{ width: 40, height: 25 }} />
//           ) : null}
//         </View>
//       )}

//       {/* Price Display */}
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
//         <Text style={{ fontSize: 18, color: '#555' }}>Total:</Text>
//         <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2C9C96' }}>
//           PKR {price?.toFixed(2)}
//         </Text>
//       </View>

//       {/* Payment Button */}
//       {isProcessing ? (
//         <ActivityIndicator size="large" color="#2C9C96" />
//       ) : (
//         <TouchableOpacity
//           style={{
//             backgroundColor: '#2C9C96',
//             paddingVertical: 12,
//             paddingHorizontal: 30,
//             borderRadius: 8,
//             marginTop: 10,
//             alignItems: 'center',
//           }}
//           onPress={handlePayment}
//           disabled={isProcessing}
//         >
//           <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Pay Now</Text>
//         </TouchableOpacity>
//       )}

//       {/* Error Message */}
//       {error && (
//         <Text style={{ color: 'red', marginTop: 20, textAlign: 'center' }}>
//           {error}
//         </Text>
//       )}
//     </View>
//   );
// };

// export default ConfirmAndPay;




import React from 'react';
import {View, Button, Platform} from 'react-native';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';

function CheckoutScreen() {
  const fetchPaymentIntentClientSecret = async () => {
    const apiEndpoint =
      Platform.OS === 'ios' ? 'http://localhost:4242' : 'http://10.0.2.2:4567';

    const response = await fetch(`http://192.168.0.108:1234/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 400 }),
    });
    const {clientSecret} = await response.json();
    console.log(clientSecret)
    return clientSecret;
  };

  const {confirmPayment, loading} = useConfirmPayment();

  const handlePayPress = async () => {
    // Gather the customer's billing information (for example, email)
    const billingDetails = {
      email: 'jenny.rosen@example.com',
    };

    // Fetch the intent client secret from the backend
    const clientSecret = await fetchPaymentIntentClientSecret();

    // Confirm the payment with the card details
    const {paymentIntent, error} = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails,
      },
    });

    if (error) {
      console.log('Payment confirmation error', error);
    } else if (paymentIntent) {
      console.log('Success from promise', paymentIntent);
    }
  };

  return (
    <View>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={cardDetails => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
    </View>
  );
}

export default CheckoutScreen;