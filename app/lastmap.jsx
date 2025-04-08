import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, TextInput, Animated, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Make sure to import axios for API calls
import {  useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// Haversine formula to calculate the distance between two lat/lng points in kilometers
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const MapComponent = () => {
  const API_KEY = '02b59fca7af64458bfde7c7772d72845';
  const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf6248b443068b80c24b18ba00bec208b8cdeb';
  const [carPosition] = useState(new Animated.Value(0)); // Animation Value
  const [markerPosition, setMarkerPosition] = useState(null); // Starting marker position
  const [route, setRoute] = useState([]); // Route coordinates
  const [dataa, setData] = useState([]); // Driver data
  const [startCoord, setStartCoord] = useState(null); // Start location
  const [vehiclee, setVehicle] = useState(); // Vehicle data
  const [totalDistance, setTotalDistance] = useState(0); // Total route distance in km
  const [driverway, setDriverway] = useState('Wait for Driver is on way ......'); // Message
  const router= useRouter();
  const [animationDuration, setAnimationDuration] = useState(0); // Animation duration based on distance
  const [isLoading, setIsLoading] = useState(true); // Loading state for data
  const [btnarrived, setBtnarrived] = useState(false); // Loading state for data

  // Fetch vehicle data
  useEffect(() => {
    const vehicleData = async () => {
      try {
        const id = await AsyncStorage.getItem('vehicleid');
        console.log(id);

        if (id) {
          const response = await fetch(`http://192.168.0.114:1234/vehicle/specific/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          console.log(data.currentLocation.coordinates[1]);

          if (data.currentLocation && data.currentLocation.coordinates) {
            setVehicle(data);
          } else {
            console.error('Vehicle location is invalid or missing');
          }
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    };
    vehicleData();
  }, []); // Run once when component mounts

  // Fetch route data when startCoord or vehiclee changes
  useEffect(() => {
    const fetchRoute = async (startLat, startLng, endLat, endLng) => {
      try {
        const response = await axios.get('https://api.openrouteservice.org/v2/directions/driving-car', {
          headers: {
            Authorization: `Bearer ${OPENROUTESERVICE_API_KEY}`,
          },
          params: {
            start: `${startLng},${startLat}`,
            end: `${endLng},${endLat}`,
          },
        });

        const routeData = response.data.features[0].geometry.coordinates;
        setRoute(routeData);
        console.log(routeData);

        await AsyncStorage.setItem('routeData1', JSON.stringify(routeData));
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch route only when both startCoord and vehicle data are available
    if (startCoord && vehiclee && vehiclee.currentLocation?.coordinates) {
      fetchRoute(
        vehiclee.currentLocation.coordinates[0], // latitude
        vehiclee.currentLocation.coordinates[1], // longitude
        startCoord?.latitude,
        startCoord?.longitude
      );
    }
  }, [startCoord, vehiclee]); // Only call when startCoord or vehiclee changes

  // Load start and end locations and calculate total distance
  useEffect(() => {
    const loadRouteData = async () => {
      try {
        const startLocation = await AsyncStorage.getItem('startLocation');
        const endLocation = await AsyncStorage.getItem('endLocation');
        const DriverId = await AsyncStorage.getItem('DriverId');

        if (DriverId) {
          const response = await fetch(`http://192.168.0.114:1234/users/oneUser/${DriverId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          setData(data);
          console.log('Driver Data:', data);
        }

        if (startLocation && endLocation) {
          setStartCoord(JSON.parse(startLocation));

          const parsedRoute = route;
          if (parsedRoute) {
            const distance = parsedRoute.reduce((acc, [lng, lat], index) => {
              if (index === 0) return acc;
              const [prevLng, prevLat] = parsedRoute[index - 1];
              const dist = haversine(lat, lng, prevLat, prevLng);
              return acc + dist;
            }, 0);

            const speed = 60; // Speed in km/h
            const duration = (distance / speed) * 3600000; // Convert hours to milliseconds
            setTotalDistance(distance);
            setAnimationDuration(duration);
          }
        } else {
          console.log('Some data is missing!');
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    loadRouteData();
  }, [route]);

  // Handle the car animation
  useEffect(() => {
    if (startCoord && route.length > 0 && animationDuration > 0) {
      const polylineCoordinates = route.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));

      setDriverway('Driver is on the way ......');
      Animated.timing(carPosition, {
        toValue: 1, // Animate to 1 (End of the route)
        duration: animationDuration, // Adjusted duration based on total distance
        useNativeDriver: false, // Ensure that the animated value updates the state correctly
      }).start();

      carPosition.addListener(({ value }) => {
        const index = Math.floor(value * (polylineCoordinates.length - 1));
        const nextIndex = Math.min(index + 1, polylineCoordinates.length - 1);

        // Interpolate between the current and next polyline coordinates
        const progress = (value * (polylineCoordinates.length - 1)) - index;
        const lat = polylineCoordinates[index].latitude + progress * (polylineCoordinates[nextIndex].latitude - polylineCoordinates[index].latitude);
        const lng = polylineCoordinates[index].longitude + progress * (polylineCoordinates[nextIndex].longitude - polylineCoordinates[index].longitude);

        setMarkerPosition({ latitude: lat, longitude: lng });

        if (value === 1) {
          setDriverway('Driver has arrived!');
          // Alert.alert('Driver has arrived at the destination!');
          setBtnarrived(true)
        }
      });
    }
  }, [carPosition, startCoord, route, animationDuration]);

  return (
    <View style={styles.container}>
      {startCoord && route.length ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: startCoord.latitude,
              longitude: startCoord.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Draw the route (polyline) */}
            {route.length > 0 && (
              <Polyline
                coordinates={route.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))}
                strokeColor="green"
                strokeWidth={3}
              />
            )}
            <Marker coordinate={{ latitude: startCoord?.latitude, longitude: startCoord?.longitude }}>
              <Image
                source={require('../assets/images/loc.png')}
                style={{ width: 40, height: 40 }}
              />
            </Marker>

            {/* Custom Marker for the car */}
            {markerPosition && (
              <Marker coordinate={markerPosition}>
                <Image
                  source={{ uri: `http://192.168.0.114:1234/uploads/${vehiclee.image[0]}` }}
                  style={{ width: 40, height: 40 }}
                />
              </Marker>
            )}
          </MapView>
          <View style={styles.bottomView}>
            <Text style={styles.title}>{driverway}</Text>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.title}>Vehicle</Text>
              {vehiclee && (
                <>
                  <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: 'center' }}>
                    <View>
                      <Text>Name</Text>
                      <Text>{vehiclee.title}</Text>
                    </View>
                    <View>
                      <Text>Number</Text>
                      <Text>{vehiclee.vehicleNumber}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: 'center', marginTop: 10 }}>
                    <View>
                      <Text>Model</Text>
                      <Text>{vehiclee.model}</Text>
                    </View>
                    <View>
                      <Text>Fuel</Text>
                      <Text>{vehiclee.fuelConsumption}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.title}>Driver</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: 'center' }}>
                <View>
                  <Text>Name</Text>
                  <Text>{dataa.name}</Text>
                </View>
                <View>
                  <Text>Phone</Text>
                  <Text>{dataa.phone}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: 'center', marginTop: 10 }}>
                <View>
                  <Image
                    source={require('@/assets/images/boy.png')}
                    style={{ width: 60, height: 60 }}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text>WhatsApp</Text>
                </View>
              </View>
            </View>
            {btnarrived &&(
              <>
              <TouchableOpacity onPress={()=>{
                router.push('/lastmap2');
              }} style={{backgroundColor:'green',padding:10,marginTop:10}}>
                <Text style={{color:"white",textAlign:'center'}}>
                  Start Move Truck To destination
                </Text>
              </TouchableOpacity>
              </>
            )}
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Loading map...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: { width: '100%', height: '50%' },
  bottomView: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginTop: 3 },
});

export default MapComponent;
