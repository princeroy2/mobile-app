import React from 'react';
import { StyleSheet, Text, View,Image, FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';  // Importing icons from MaterialCommunityIcons
import Entypo from '@expo/vector-icons/Entypo';
const RideHistoryPage = () => {
  // Sample ride history data
  const rideHistory = [
    { id: '1', from: 'New York', to: 'Los Angeles', date: '2025-03-01', distance: '2800 km', duration: '5h 30m' },
    { id: '2', from: 'San Francisco', to: 'San Diego', date: '2025-02-15', distance: '600 km', duration: '1h 30m' },
    { id: '3', from: 'Chicago', to: 'Dallas', date: '2025-01-10', distance: '1500 km', duration: '3h 45m' },
    { id: '4', from: 'Miami', to: 'Orlando', date: '2024-12-25', distance: '350 km', duration: '4h 10m' },
    { id: '5', from: 'Los Angeles', to: 'Las Vegas', date: '2024-11-05', distance: '430 km', duration: '6h 0m' },
  ];

  // Render item for each ride history
  const renderRideItem = ({ item }) => (
    <View style={styles.rideItem}>
      <View style={styles.rideDetails}>
        {/* From City with Icon */}
        <View style={styles.cityRow}>
        <Entypo name="circle" size={20} color="blue" />
                  <Text style={styles.rideText}> {item.from}</Text>
        </View>
        
        {/* To City with Icon */}
        <View style={styles.cityRow}>
          <Icon name="map-marker" size={24} color="red" />
          <Text style={styles.rideText}>{item.to}</Text>
        </View>
        
      </View>

     <View style={{flexDirection:"row",justifyContent:"space-between"}}>
       <Image
                  source={require('@/assets/images/boy.png')} // Correct path to your local image
                  style={styles.profileImage}
                />
                <View>
                  <Text>Date:23-34-53</Text>
                  <Text>payment:200</Text>

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
        showsVerticalScrollIndicator={false} // Remove the scroll indicator
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
});
