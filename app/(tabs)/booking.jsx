import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';  // Importing icons from MaterialCommunityIcons
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Polyline } from 'react-native-maps';

const RideHistoryPage = () => {
  // State to store ride history data and the map region for Pakistan
  const [rideHistory, setRideHistory] = useState();
  const [region, setRegion] = useState({
    latitude: 30.3753,  // Approximate latitude of Pakistan
    longitude: 69.3451,  // Approximate longitude of Pakistan
    latitudeDelta: 5.0,  // Adjust zoom level (larger delta for more zoomed-out view)

    longitudeDelta: 5.0,  // Adjust zoom level (larger delta for more zoomed-out view)
  });
  const [routeData, setRouteData] = useState([]); // To store the route data

  // Function to format date as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to format time as HH:MM:SS
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Fetch ride history data from API
  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const routeData = await AsyncStorage.getItem('routeData');  // Retrieve route data
        const EndLocation = await AsyncStorage.getItem('EndLocation');  // Retrieve route data
        const startLocation = await AsyncStorage.getItem('startLocation');  // Retrieve route data
        
        // If routeData exists, parse it
        if (routeData) {
          setRouteData(JSON.parse(routeData)); // Parse and store route data
        } 
        console.log(token)

        // API request with Authorization header
        const response = await fetch('http://192.168.0.114:1234/booking/getUserBookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Sending the token in the headers
          },
        });
        // Handle the response
        const data = await response.json();
        setRideHistory(data); // Store data in state
        console.log(data.length)
        
      } catch (error) {
        console.error('Error fetching ride history:', error);
      }
    };

    fetchRideHistory();
  }, []); // Empty dependency array means this runs once when component mounts

  // Render item for each ride history
  const renderRideItem = ({ item }) => (
    <View style={styles.rideItem}>
      <View style={styles.rideDetails}>
   

        <View style={styles.cityRow}>
          <Text style={styles.rideText}>{item.status}</Text>
        </View>
      </View>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        followsUserLocation={true}
      >


         {/* {rideHistory[0].startLocation.coordinates && (
                  <Marker
                    coordinate={{
                      latitude: rideHistory[0].startLocation.coordinates[1],
                      longitude: rideHistory[0].startLocation.coordinates[0
                      ]
                    }}
                    
                  />
                )} */}


{/* {rideHistory[0].endLocation.coordinates && (
                  <Marker
                    coordinate={{
                      latitude: rideHistory[0].endLocation.coordinates[1],
                      longitude: rideHistory[0].endLocation.coordinates[0]
                    }}
                    
                  />
                )} */}


                
        {routeData.length > 0 && (
          <Polyline
            coordinates={routeData.map(([lng, lat]) => ({
              latitude: lat,
              longitude: lng,
            }))}
            strokeColor="green"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Image
          source={item.avatar ? { uri: item.avatar } : require('@/assets/images/boy.png')}
          style={styles.profileImage}
        />
        <View>
          <Text>Date: {formatDate(item.startDate)}</Text>  {/* Date part */}
          <Text>Time: {formatTime(item.startDate)}</Text>  {/* Time part */}
          <Text>Payment: {item.price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your current Booking</Text>
      <FlatList
        data={rideHistory}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default RideHistoryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#19104E',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,  // Circle profile image
  },
  rideItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rideDetails: {
    marginBottom: 10,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rideText: {
    fontSize: 16,
    color: '#19104E',
    marginLeft: 8,
  },
  map: {
    height: 120,  // Small map size
    marginVertical: 2,
    borderRadius: 8,
  },
});
