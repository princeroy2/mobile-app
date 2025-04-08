import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const FullScreenMapWithAddress = () => {
  // Hardcoded coordinates for Rahim Yar Khan, Pakistan
  const [location, setLocation] = useState({
    latitude: 28.4207,
    longitude: 70.3085,
  });

  // Define the address for Rahim Yar Khan Office
  const address = "Rahim Yar Khan Office, Pakistan";
  const phoneNumber = "+92 234"; // Example contact number
  const supportEmail = "support@example.com"; // Example support email

  const openPhoneDialer = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openEmailClient = () => {
    Linking.openURL(`mailto:${supportEmail}`);
  };

  return (
    <View style={styles.container}>
      {/* Address Section */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>Rahim Yar Khan Office</Text>
        <Text style={styles.addressDetails}>{address}</Text>
      </View>

      {/* Map Section */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,  // Adjust for zoom level
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}  // Show user's current location on the map as a blue dot
        followsUserLocation={true} // Keep the map focused on the user's location
      >
        {/* Marker for the Rahim Yar Khan office */}
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title="Rahim Yar Khan Office"
          description={address}
        />
      </MapView>

      {/* Contact Us Section */}
      <View style={styles.contactContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={openPhoneDialer}>
          <Text style={styles.contactButtonText}>Call Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={openEmailClient}>
          <Text style={styles.contactButtonText}>Email Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addressContainer: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addressDetails: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  map: {
    flex: 1,  // Make sure the map takes up the full container space
    width: '100%',
  },
  contactContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  contactButton: {
    backgroundColor: '#266352',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default FullScreenMapWithAddress;
