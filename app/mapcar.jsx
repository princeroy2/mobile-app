import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
const MapScreen = () => {
  // Set initial region (Rahim Yar Khan coordinates)
  const [region, setRegion] = useState({
    latitude: 29.0959,
    longitude: 70.3082,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Sample car locations (latitude and longitude)
  const carLocations = [
    { id: 1, latitude: 29.0959, longitude: 70.3082, carName: 'Car 1' },
    { id: 2, latitude: 29.1069, longitude: 70.3122, carName: 'Car 2' },
    { id: 3, latitude: 29.1159, longitude: 70.3202, carName: 'Car 3' },
    { id: 4, latitude: 29.1259, longitude: 70.3302, carName: 'Car 4' },
  ];

  // Path coordinates (Rahim Yar Khan to Khanpur)
  const polylineCoordinates = [
    { latitude: 29.0959, longitude: 70.3082 }, // Rahim Yar Khan
    { latitude: 28.2850, longitude: 70.6427 }, // Khanpur
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
        {/* Marker for each car with custom image */}
        {carLocations.map((car) => (
          <Marker
            key={car.id}
            coordinate={{ latitude: car.latitude, longitude: car.longitude }}
            title={car.carName}
          >
            {/* Custom car image as marker */}
            <Image
              source={require('@/assets/images/car.png')} // Path to your car image
              style={styles.carIcon}
            />
          </Marker>
        ))}

        {/* Polyline between Rahim Yar Khan and Khanpur */}
        <Polyline
          coordinates={polylineCoordinates}
          strokeColor="#FF0000" // Line color (Red)
          strokeWidth={4} // Line width
        />
      </MapView>

       <View style={styles.bottomView}>
            <Text style={styles.title}>Driver is On way</Text>
    
            {/* Search Bar with Icon Inside */}
         
            <View style={{flexDirection:"row", gap:40,marginVertical:20,justifyContent:"",alignItems:'center'}}>
           <View style={{flexDirection:'row',gap:20}}>
           <Image
                source={require('@/assets/images/boy.png')} // Use require for local images
                style={{  width: 40,
                  height: 40,}}
                resizeMode="contain"
              />
              <View>
                <Text style={{}}>your driver</Text>
                <Text>Hasnain Haider</Text>
    
              </View>
           </View>
     <View style={{flexDirection:"row",gap:30}}>
     <Feather name="phone" size={20} color="blue" />
     <Feather name="mail" size={20} color="blue" />
     </View>
            </View>
            <View style={{backgroundColor:"#ccc",   width: '100%', // You can change the width as needed, or use a specific value like 200
    height: 1,     
    }}>

<View>

</View>

            </View>


<View style={{flexDirection:'row',gap:10,marginTop:10}}>
<Entypo name="circle" size={20} color="green" />
<View >
    <Text style={{fontSize:10}}>Pickup Location</Text>
    <Text>Taranda saway kahn rhym yar khan</Text>

</View>
</View>
<View style={{backgroundColor:"#ccc",marginTop:20,   width: '100%', // You can change the width as needed, or use a specific value like 200
    height: 1,     
    }}>

<View>
    

</View>

            </View>

            <View style={{flexDirection:'row',gap:10,marginTop:10}}>
            <EvilIcons name="location" size={24} color="red" /><View >
    <Text style={{fontSize:10}}>Pickup Location</Text>
    <Text>Taranda saway kahn rhym yar khan</Text>

</View>
</View>



          </View>
    </View>
  );
};

const styles = StyleSheet.create({
    bottomView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height:'40%',
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingBottom: 20,
        zIndex: 1,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        justifyContent:'center',
        // textAlign:"center",
        marginBottom: 15,
      },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  carIcon: {
    width: 30, // Adjust size as per your need
    height: 30, // Adjust size as per your need
    resizeMode: 'contain',
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
