import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, FlatList,Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const FullScreenMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [vehicaldata, setVehicalData] = useState(null);
  const [allvehicaldata, setAllVehicalData] = useState();
  const [samevehicaldata, setSamevehicaldata] = useState();
  const [fuel, setFuel] = useState(null);
  const [timerr, setTime] = useState(null);
  const [route, setRoute] = useState([]);
  const routerrdata = useRoute();

  const API_KEY = '02b59fca7af64458bfde7c7772d72845'; 
  const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf6248b443068b80c24b18ba00bec208b8cdeb'; 
  const { truckId ,vehicletitle} = routerrdata.params || {};

// console.log('truckiddddd',vehicletitle)
  const prevRegionRef = useRef();
  const navigation = useNavigation(); 

  const fetchPlaces = async (searchText) => {
    if (!searchText) {
      setPlaces([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${searchText}&key=${API_KEY}`
      );
      const results = response.data.results;
      setPlaces(results);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPlaces = useCallback(debounce(fetchPlaces, 1000), []);

  const handleSearchChange = (text) => {
    setSearch(text);
    debouncedFetchPlaces(text);
  };

  const handleSelectPlace =async (place) => {
    const selectedCoords = {
      latitude: place.geometry.lat,
      longitude: place.geometry.lng,
      title: place.formatted,
    };

    setSelectedLocation(selectedCoords);
    await AsyncStorage.setItem('EndLocation', JSON.stringify(selectedCoords));
    setSearch(place.formatted);
    setPlaces([]);

    const newRegion = {
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    setRegion(newRegion);

    if (location) {
      const calculatedDistance = calculateDistance(location.coords.latitude, location.coords.longitude, selectedCoords.latitude, selectedCoords.longitude);
      setDistance(calculatedDistance);

      // Calculate price and fuel based on the distance
      const distancePriceRate = 500; // Example price rate per km
      const calculatedPrice = Math.floor(calculatedDistance * distancePriceRate);
      setPrice(calculatedPrice);

      const fuelEfficiency = 3; // Fuel consumption per km (in liters)
      const fuelConsumed = Math.floor(calculatedDistance / fuelEfficiency);
      setFuel(fuelConsumed);
      const timme=60
      const timer=Math.floor(calculatedDistance/timme)
       setTime(timer)
    }
 

    fetchRoute(location.coords.latitude, location.coords.longitude, selectedCoords.latitude, selectedCoords.longitude);
    
  };

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

      await AsyncStorage.setItem('routeData', JSON.stringify(routeData));
      await AsyncStorage.setItem('startLocation', JSON.stringify(location.coords));
      console.log('',places.geometry)
    } catch (error) {
      console.log('1111111111111',error)
    }
  };

  const fetchTruckData = async () => {
    setLoading(true);
    try {
      // Fetch all vehicle data if truckId is not provided
      if (!truckId) {
        const response = await fetch('http://192.168.0.114:1234/vehicle');
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle data');
        }
        const data = await response.json();
        setAllVehicalData(data.data);
        console.log('all vehival',allvehicaldata[1].currentLocation)

      } else {
        // Fetch specific vehicle data if truckId is provided
        const response = await fetch('http://192.168.0.114:1234/vehicle');
  
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle data');
        }
      
        const data = await response.json();
        console.log(data)
      const vehiclesWithTitleBoung = data.data.filter(vehicle => vehicle.title === vehicletitle);

  // Set the filtered data to display only vehicles with the title 'boung'
  setSamevehicaldata(vehiclesWithTitleBoung);
  console.log('Fetched vehicle data:', vehiclesWithTitleBoung);

        // console.log('dataaaaaaaaaaaaaaaaa',vehicaldata.currentLocation.coordinates[0])

      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the current location (assuming this exists in your component)
   // Request location permission and fetch current location
   async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setLocation(location);
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setLoading(false);
  }


  // Fetch the truck data and location on mount
  useEffect(() => {
    fetchTruckData();
    getCurrentLocation();
  }, [truckId]); 
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; 
    return distance / 1000; 
  };

  if (errorMsg) {
    return (
      <View style={styles.loading}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  const handlePressnav = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError("No access token found.");
        return;
      }

    
      const userId=await AsyncStorage.getItem('id');
      const status = 'pending';
      navigation.navigate('payment', { userId, distance, price, status, fuel });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        followsUserLocation={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="This is your current location"
          />
        )}

        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title={selectedLocation.title}
          />
        )}
{/* 
{vehicaldata && (
          <Marker
            coordinate={{
              latitude: vehicaldata.currentLocation.coordinates[0],
              longitude: vehicaldata.currentLocation.coordinates[1],
            }}
            
            title={vehicaldata.title}
          >
              <Image
                            source={{ uri: `http://192.168.0.114:1234/uploads/${vehicaldata.image[0]}` }} // Replace with your car icon path
                            style={{ width: 40, height: 40 }} // Customize the size of your marker
                          />
            </Marker>
        )} */}

{samevehicaldata && samevehicaldata.map((vehicle, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: vehicle.currentLocation.coordinates[0], // Assuming currentLocation has [latitude, longitude]
            longitude: vehicle.currentLocation.coordinates[1],
          }}
          title={vehicle.title}
        >
          <Image
            source={{ uri: `http://192.168.0.114:1234/uploads/${vehicle.image[0]}` }} // Assuming vehicle.image is an array
            style={{ width: 40, height: 40 }} // Customize the size of your marker
          />
        </Marker>
      ))}


{allvehicaldata && allvehicaldata.map((vehicle, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: vehicle.currentLocation.coordinates[0], // Assuming currentLocation has [latitude, longitude]
            longitude: vehicle.currentLocation.coordinates[1],
          }}
          title={vehicle.title}
        >
          <Image
            source={{ uri: `http://192.168.0.114:1234/uploads/${vehicle.image[0]}` }} // Assuming vehicle.image is an array
            style={{ width: 40, height: 40 }} // Customize the size of your marker
          />
        </Marker>
      ))}

        {route.length > 0 && (
          <Polyline
            coordinates={route.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))}
            strokeColor="green"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.bottomView}>
        <Text style={styles.title}>Quick & Easy Truck Booking – Get Yours Now</Text>

        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Destination"
            value={search}
            onChangeText={handleSearchChange}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {loading && <Text style={styles.loadingText}>Loading...</Text>}

        {!loading && places.length > 0 && (
          <FlatList
            data={places}
            keyExtractor={(item) => item.geometry.lat + item.geometry.lng}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectPlace(item)}>
                <View style={styles.item}>
                  <Text>{item.formatted}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {!loading && places.length === 0 && <Text style={styles.noResultsText}></Text>}

        {distance && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={{ width: '45%',height:80, padding: 5, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 10, alignItems: 'center' }}>
            <Ionicons name="location" size={30} color="green" />
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Distance</Text>
            <Text>{distance ? `${distance.toFixed(2)} km` : 'Calculating...'}</Text>
          </View>
          <View style={{ width: '45%',height:80, padding: 5, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 10, alignItems: 'center' }}>
            <Ionicons name="cash" size={30} color="green" />
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Payment</Text>
            <Text>{price ? `${price.toFixed(2)} pkr` : 'Calculating...'}</Text>
          </View>
          <View style={{ width: '45%',height:80, padding: 5, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 10, alignItems: 'center' }}>
          <MaterialCommunityIcons name="fuel" size={24} color="green" />
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Fuel</Text>
            <Text>{fuel ? `${fuel} liters` : 'Calculating...'}</Text>
          </View>
          <View style={{ width: '45%',height:80, padding: 5, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 10, alignItems: 'center' }}>
            <Ionicons name="time" size={30} color="green" />
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Time</Text>
            <Text>{timerr}h</Text>
          </View>
        </View>

        )}

        {selectedLocation && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePressnav}
            style={styles.button}
          >
            <AntDesign name="arrowright" size={30} color="white" style={{ textAlign: "center" }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '50%' },
  bottomView: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flex: 1,
  },
  button: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 50,
    width: '15%',
    height: '15%',
    alignSelf: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  searchInput: { flex: 1, height: 40, fontSize: 16, color: '#000' },
  searchButton: { paddingLeft: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  loadingText: { fontSize: 16, color: '#999' },
  noResultsText: { fontSize: 16, color: '#999' },
  distanceView: { marginTop: 10 },
  distanceText: { fontSize: 16, fontWeight: 'bold' },
});

export default FullScreenMap;
