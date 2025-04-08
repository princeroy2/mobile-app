import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text,TextInput, Animated, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

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
  const [carPosition] = useState(new Animated.Value(0)); // Animation Value
  const [markerPosition, setMarkerPosition] = useState(null); // Starting marker position
  const [route, setRoute] = useState([]); // Route coordinates
  const [dataa, setData] = useState([]); // Route coordinates
  const [startCoord, setStartCoord] = useState(null); // Start location
  const [vehicle, setVehicle] = useState(); // Start location
  const [totalDistance, setTotalDistance] = useState(0); // Total route distance in km
    const routee = useRoute();
  
  const [animationDuration, setAnimationDuration] = useState(0); // Animation duration based on distance
  const { driverId } = routee.params || {};
  // console.log(driverId)

  useEffect(() => {
    // Fetch the route and start location from AsyncStorage
    const loadRouteData = async () => {
      try {
        // Retrieve route data and start location from AsyncStorage
        const routeData = await AsyncStorage.getItem('routeData');
        const startLocation = await AsyncStorage.getItem('startLocation');
        const endLocation = await AsyncStorage.getItem('endLocation');

        try {
      const response = await fetch(`http://192.168.0.114:1234/users/oneUser/${driverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
       
        },
      });

      const data = await response.json();
      setData(data)
      console.log('lastnaaaaaaaaaaaaaaaaaaaaa',data.name)

    } catch (error) {
      console.error('Error fetching driver availability:', error);
      setIsLoading(false);
    }
  
        console.log('Route Data:', routeData);
        console.log('Start Location:', startLocation);
        console.log('end Location:', endLocation);

        

        if (routeData && startLocation) {
          // Parse the data and update state
          const parsedRoute = JSON.parse(routeData);
          setRoute(parsedRoute);
          setStartCoord(JSON.parse(startLocation));

          // Calculate total distance and animation duration based on a speed of 60 km/h
          const distance = parsedRoute.reduce((acc, [lng, lat], index) => {
            if (index === 0) return acc;
            const [prevLng, prevLat] = parsedRoute[index - 1];
            const dist = haversine(lat, lng, prevLat, prevLng);
            return acc + dist;
          }, 0);

          // Assuming the car speed is 60 km/h, calculate the duration (in milliseconds) for the animation
          const speed = 60; // Speed in km/h
          const duration = (distance / speed) * 3600000; // Convert hours to milliseconds
          setTotalDistance(distance);
          setAnimationDuration(duration);
        } else {
          console.log('Some data is missing!');
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };
    const vehicle = async () => {
      try {

        const id = await AsyncStorage.getItem('vehicleid');

        try {
      const response = await fetch(`http://192.168.0.114:1234/vehicle/specific/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
       
        },
      });

      const data = await response.json();
      setVehicle(data)
      console.log('lastnaaaaaaaaaaaaaaaaaaaafaaaaa',data)

    } catch (error) {
      console.error('Error fetching driver availability:', error);
      setIsLoading(false);
    }
  
    

        

      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };





    vehicle()
    loadRouteData();
  }, []); // Empty dependency array means this runs only once on component mount

  useEffect(() => {
    // If we have the route and start coordinates, animate the car
    if (startCoord && route.length > 0 && animationDuration > 0) {
      const polylineCoordinates = route.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));

      // Start the animation for the car moving along the polyline
      Animated.timing(carPosition, {
        toValue: 1, // Animate to 1 (End of the route)
        duration: animationDuration, // Adjusted duration based on total distance
        useNativeDriver: false, // Ensure that the animated value updates the state correctly
      }).start();

      // Update marker position based on the animation value
      carPosition.addListener(({ value }) => {
        const index = Math.floor(value * (polylineCoordinates.length - 1));
        const nextIndex = Math.min(index + 1, polylineCoordinates.length - 1);

        // Interpolate between the current and next polyline coordinates
        const progress = (value * (polylineCoordinates.length - 1)) - index;
        const lat = polylineCoordinates[index].latitude + progress * (polylineCoordinates[nextIndex].latitude - polylineCoordinates[index].latitude);
        const lng = polylineCoordinates[index].longitude + progress * (polylineCoordinates[nextIndex].longitude - polylineCoordinates[index].longitude);

        setMarkerPosition({ latitude: lat, longitude: lng });
      });
    }
  }, [carPosition, startCoord, route, animationDuration]);

  return (
    <View style={styles.container}>
      {startCoord && route.length > 0 ? (
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

          {/* Custom Marker for the car */}
          {markerPosition && (
            <Marker coordinate={markerPosition}>
              {/* Custom Car Image */}
              <Image
                                source={{ uri: `http://192.168.0.114:1234/uploads/${vehicle.image[0]}` }}
                                style={{ width: 40, height: 40 }}
                              />
            </Marker>
          )}
        </MapView>
             <View style={styles.bottomView}>
               <Text style={styles.title}>Quick & Easy Truck Booking – Get Yours Now</Text>
              <View style={{marginTop:10}}>
                <Text style={styles.title}>vehicle</Text>
                {
                  vehicle &&(
                    <>
                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:'center'}}> 
                    <View>
                      <Text> Name</Text>
                      <Text>{vehicle.title}</Text>
                    </View>
                     <View>
                     <Text> Number</Text>
                     <Text>{vehicle.vehicleNumber}</Text>
                   </View>
                   </View>
                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:'center',marginTop:10}}> 
                    <View>
                      <Text>Modal</Text>
                      <Text>{vehicle.model}</Text>
                    </View>
                     <View>
                     <Text> Fuel</Text>
                     <Text>{vehicle.fuelConsumption}</Text>
                   </View>
                   </View>
                   </>
                  )
                }
                </View>



                <View style={{marginTop:10}}>
                <Text style={styles.title}>vehicle</Text>
                {
                  dataa &&(
                    <>
                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:'center'}}> 
                    <View>
                      <Text> Name</Text>
                      <Text>{dataa.name}</Text>
                    </View>
                     <View>
                     <Text> phone</Text>
                     <Text>{dataa.phone}</Text>
                   </View>
                   </View>
                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:'center',marginTop:10}}> 
                    <View>
                       <Image
                              source={require('@/assets/images/boy.png')} // Use require for local images
                              style={{width:40,height:40}}
                              resizeMode="contain"
                            />
                    </View>
                  
                   </View>
                   </>
                  )
                }
                </View>
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
  // container: { flex: 1 },
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

export default MapComponent;
