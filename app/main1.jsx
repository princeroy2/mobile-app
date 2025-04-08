// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location'; // Importing expo-location for location access

// const  FullScreenMap1 = () => {
//   // State for the location and error message
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [region, setRegion] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Get the user's current location when the component mounts
//   useEffect(() => {
//     async function getCurrentLocation() {
//       // Request location permission
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         setLoading(false);
//         return;
//       }

//       // Fetch the current location
//       let location = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = location.coords;

//       // Set the region and location state
//       setLocation(location);
//       setRegion({
//         latitude,
//         longitude,
//         latitudeDelta: 0.0922,  // Adjust for zoom level
//         longitudeDelta: 0.0421,
//       });
//       setLoading(false);
//     }

//     getCurrentLocation();
//   }, []);

//   // If loading, show loading screen
//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   // If there's an error message, show it
//   if (errorMsg) {
//     return (
//       <View style={styles.loading}>
//         <Text>{errorMsg}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Map Section */}
//       <MapView
//         style={styles.map}
//         region={region}
//         onRegionChangeComplete={setRegion} // Update region when the map is moved
//         showsUserLocation={true}  // Show user's current location on the map as a blue dot
//         followsUserLocation={true} // Keep the map focused on the user's location
//       >
//         {/* Marker for the user's current location */}
//         {/* {location && (
//           <Marker
//             coordinate={{
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//             }}
//             title="You are here"
//             description="This is your current location"
//           />
//         )} */}
//       </MapView>
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     height:400
//   },
//   map: {
//     width: '100%',
//     height: '50%',
//   },
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
// });

// export default FullScreenMap1;


import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // Importing expo-location for location access

const FullScreenMap1 = () => {
  // State for the location and error message
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the user's current location when the component mounts
  useEffect(() => {
    async function getCurrentLocation() {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      // Fetch the current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Set the region and location state
      setLocation(location);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,  // Adjust for zoom level
        longitudeDelta: 0.0421,
      });
      setLoading(false);
    }

    getCurrentLocation();
  }, []);

  // If loading, show loading screen
  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If there's an error message, show it
  if (errorMsg) {
    return (
      <View style={styles.loading}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        style={styles.map}
        //  mapType="satellite"
        mapType="hybrid"

        // mapType="standard"
        region={region} // Pass the region state here to control the map view
        onRegionChangeComplete={setRegion} // Update region when the map is moved
        // showsUserLocation={true}  // Show user's current location on the map as a blue dot
        followsUserLocation={true} // Keep the map focused on the user's location
      >
        {/* Marker for the user's current location */}
        {location && (
                <Marker
                coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}}
                image={require('../assets/images/formap.png')}
              />
        )}
 
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius:100,
    height: 400, // Fixed height for the map container
  },
  map: {
    width: '100%',
    borderRadius:200,
    color:"red",
    height: '100%', // Make sure the map takes up the full container
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default FullScreenMap1;
