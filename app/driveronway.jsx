import React, { useState } from 'react';
import { StyleSheet,Image, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MapScreen = () => {
  // Set initial region (Rahim Yar Khan coordinates)
  const [region, setRegion] = useState({
    latitude: 29.0959,
    longitude: 70.3082,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Coordinates for Rahim Yar Khan and Khanpur
  const rahimYarKhan = {
    latitude: 29.0959,
    longitude: 70.3082,
    locationName: 'Rahim Yar Khan',
  };

  const khanpur = {
    latitude: 28.2850,
    longitude: 70.6427,
    locationName: 'Khanpur',
  };

  // Polyline coordinates (Rahim Yar Khan to Khanpur)
  const polylineCoordinates = [
    { latitude: rahimYarKhan.latitude, longitude: rahimYarKhan.longitude },
    { latitude: khanpur.latitude, longitude: khanpur.longitude },
  ];

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        provider="google" // Use Google Maps
      >
        {/* Marker for Rahim Yar Khan */}
        <Marker
          coordinate={{ latitude: rahimYarKhan.latitude, longitude: rahimYarKhan.longitude }}
          title={rahimYarKhan.locationName}
        >
          <Ionicons name="location-sharp" size={30} color="blue" />
        </Marker>

        {/* Marker for Khanpur */}
        <Marker
          coordinate={{ latitude: khanpur.latitude, longitude: khanpur.longitude }}
          title={khanpur.locationName}
        >
          <Ionicons name="location-sharp" size={30} color="green" />
        </Marker>

        {/* Polyline between Rahim Yar Khan and Khanpur */}
        <Polyline
          coordinates={polylineCoordinates}
          strokeColor="#FF0000" // Line color (Red)
          strokeWidth={4} // Line width
        />
      </MapView>

      {/* Footer Section */}
      <View style={styles.footer}>
          <View style={{flexDirection:"row", gap:20,marginVertical:20}}>
               <Image
                   source={require('@/assets/images/boy.png')} // Use require for local images
                   style={{  width: 40,
                     height: 40,}}
                   resizeMode="contain"
                 />
                 <View>
                   <Text style={{fontWeight:"bold"}}>Taranda saway kahn rahim yar khan</Text>
                   <Text>32 station tsk rahim yar khan</Text>
       
                 </View>
               </View>
               <TouchableOpacity onPress={() => {
                                       router.push('/mapcar'); // Trigger the navigation to the next screen
                                     }} style={{backgroundColor:"green",padding:10,paddingHorizontal:20,borderRadius:20}}>
                <Text>Confirm</Text>
               </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;
