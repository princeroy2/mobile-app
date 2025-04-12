// import React, { useState, useEffect } from 'react';
// import { StyleSheet, ScrollView, Image, Text, View, TouchableOpacity, Dimensions } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import * as SecureStore from 'expo-secure-store';
// import { router } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import FullScreenMap1 from '@/app/main1';  // FullScreenMap for the map

// const { width, height } = Dimensions.get('window'); // Get screen width and height

// const IndexTab = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // Retrieve token from AsyncStorage
//         const token = await AsyncStorage.getItem('accessToken');
//         console.log('Retrieved token:', token);
//         if (!token) {
//           router.replace('/login');
//           return;
//         }

//         // Fetch user data using token
//         const response = await fetch('http://192.168.0.114:1234/auth/me', {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         console.log(data);

//         if (response.ok) {
//           setUserData(data.profile); // Access the correct profile data
//         } else {
//           setError('Failed to fetch user data');
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Error fetching user data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Loading state
//   if (loading) {
//     return (
//       <View style={styles.scrollContent}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <View style={styles.scrollContent}>
//         <Text>{error}</Text>
//       </View>
//     );
//   }

//   // Display user data if available
//   return (
//     <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//       {/* Header section */}
//       <View style={styles.header}>
//         <View style={styles.userInfo}>
//           <View style={{ marginHorizontal: 10 }}>
//             <Text style={styles.greeting}>Good Morning</Text>
//             <Text style={styles.userName}>{userData?.name || 'User'}</Text>
//           </View>
//         </View>

//         <Ionicons name="notifications-outline" size={24} color="black" />
//       </View>

//       {/* Image section */}
//       <View style={styles.imageSection}>
//         <Image
//           source={require('@/assets/images/loadmian.png')}
//           style={styles.mainImage}
//           resizeMode="cover"
//         />
//       </View>

//       {/* Select section */}
//       <View style={styles.selectSection}>
//         <Text style={styles.selectTitle}>Select</Text>
//         <View style={styles.selectOptions}>
//           {['truck1', 'truck2', 'truck3', 'truck4'].map((truck, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.selectOption}
//               onPress={() => {
//                 router.push('/main');
//               }}
//             >
//               <View style={styles.truckWrapper}>
//                 <Image
//                   source={require('@/assets/images/truck4.png')}
//                   style={styles.truckImage}
//                   resizeMode="cover"
//                 />
//               </View>
//               <Text style={styles.truckLabel}>Car</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* History section */}
//       <View style={styles.historySection}>
//         <FullScreenMap1 />
//       </View>
//     </ScrollView>
//   );
// };

// export default IndexTab;

// const styles = StyleSheet.create({
//   scrollContent: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingHorizontal: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: height * 0.05,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//   },
//   greeting: {
//     fontSize: width * 0.03,
//   },
//   userName: {
//     fontSize: width * 0.04,
//     fontWeight: '500',
//   },
//   imageSection: {
//     width: '100%',
//     height: height * 0.29,
//     overflow: 'hidden',
//     borderRadius: 10,
//   },
//   mainImage: {
//     width: '100%',
//     height: '100%',
//   },
//   selectSection: {
//     paddingHorizontal: 20,
//     marginTop: 20,
//   },
//   selectTitle: {
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   selectOptions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//   },
//   selectOption: {
//     alignItems: 'center',
//     marginBottom: height * 0.03,
//   },
//   truckWrapper: {
//     backgroundColor: '#ccc',
//     padding: 5,
//     borderRadius: 40,
//   },
//   truckImage: {
//     width: width * 0.11,
//     height: width * 0.11,
//   },
//   truckLabel: {
//     fontSize: width * 0.03,
//     marginTop: 4,
//   },
//   historySection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom:30,
//     // marginVertical: height * 0.01,
//     // marginHorizontal: 20,
//   },
//   historyTitle: {
//     fontWeight: 'bold',
//     // fontSize: width * 0.045,
//   },
//   seeAllText: {
//     color: '#007AFF',
//     fontSize: width * 0.04,
//   },
// });

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Image,Alert, SafeAreaView, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar'; // Import StatusBar from expo-status-bar
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FullScreenMap1 from '@/app/main1';  // FullScreenMap for the map

const { width, height } = Dimensions.get('window'); 

const IndexTab = () => {
    const navigation = useNavigation();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vehicleData, setVehicleData] = useState();  // State for vehicle data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          router.replace('/login');
          return;
        }

        // Fetch user data using token
        const response = await fetch('http://192.168.0.114:1234/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data.profile); // Access the correct profile data
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    const fetchVehicleData = async () => {
      try {
        // Example API call to fetch vehicle data
        const response = await fetch('http://192.168.0.114:1234/vehicle', {
          method: 'GET',
        });
        const data = await response.json();
      
        // Check if the response is ok
        if (response.ok) {
          // Use a Set to track unique vehicle names
          const uniqueVehicles = [];
          const vehicleNames = new Set();
      
          // Filter out vehicles with duplicate names
          data.data.forEach(vehicle => {
            if (!vehicleNames.has(vehicle.title)) {
              vehicleNames.add(vehicle.title);
              uniqueVehicles.push(vehicle);
            }
          });
      
          // Set the filtered (unique) vehicles data to state
          setVehicleData(uniqueVehicles);
        } else {
          setError('Failed to fetch vehicle data');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching vehicle data');
      }
      
    };

    fetchVehicleData()
    fetchUserData();
  }, [userData]);

  const selectTruck = async (truckId,vehicletitle) => {
        console.log(truckId)
      // Save the selected truck ID to AsyncStorage
      // await AsyncStorage.setItem('Truckid', truckId);
      navigation.navigate('main', { truckId,vehicletitle });

   
  };


  const handleBooking = async () => {
    const booking = await AsyncStorage.getItem('booking');

    if (booking==='start') {
      // Show an alert or prevent the navigation
      Alert.alert('Booking already started', 'You cannot book again at the moment.');
    } else {
      // Proceed to the booking screen
      router.push('/booking');
    }
  };

  const handleBookingmain= async () => {
    const booking = await AsyncStorage.getItem('booking');

    if (booking==='start') {
      // Show an alert or prevent the navigation
      Alert.alert('Booking already started', 'You cannot book again at the moment.');
    } else {
      // Proceed to the booking screen
      router.push('/main');
    }
  };
  // Loading state
  if (loading) {
    return (
      <View style={styles.scrollContent}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.scrollContent}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Display user data if available
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.rowContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Hello {userData?.name}</Text>
            <Text style={{ fontWeight: '600', fontSize: width * 0.03, color: 'white' }}>Where you deliver</Text>
          </View>
          <Image
  source={userData.avatar ? { uri: userData.avatar } : require('@/assets/images/boy.png')}
  style={styles.profileImage}
/>

        </View>
        <View style={{ height: 120, borderRadius: 100 }}>
          <FullScreenMap1 />
        </View>

        {/* Row containing "Ride Now" and "Book Truck" */}
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          {/* Ride Now Box (Left Box) */}
          <TouchableOpacity style={styles.rideNowBox} onPress={handleBooking}>
            <Image
              source={require('@/assets/images/location-icon.png')} // Correct path to your local image
              style={styles.icon}
            />
            <Text style={styles.boxText}>Order Now</Text>
          </TouchableOpacity>


          {/* Book Truck Box (Right Box) */}
          <TouchableOpacity style={styles.bookTruckBox} onPress={handleBookingmain}>
          <Text style={styles.t1text}>Order Truck</Text>

            <Image
              source={require('@/assets/images/lefttruck.png')} // Correct path to your local image (Truck Icon)
              style={styles.t1icon}
            />
          </TouchableOpacity>
        </View>



        <View style={{ flexDirection: 'row',marginTop:10 ,gap:10}}>
                 {/* Book Truck Box (Right Box) */}
                 <TouchableOpacity style={styles.bookTruckBox1}   onPress={() => {
                router.push('/main');
              }}>
                 <Text style={styles.shipment}>Shipment</Text>

            <Image
              source={require('@/assets/images/d.png')} // Correct path to your local image (Truck Icon)
              style={styles.shipicon}
            />
          </TouchableOpacity>
          {/* Ride Now Box (Left Box) */}
          
          <TouchableOpacity style={styles.rideNowBox1} onPress={() => {
                router.push('/office');
              }} >
            <Image
              source={require('@/assets/images/briefcase.png')} // Correct path to your local image
              style={styles.icon}
            />
            <Text style={styles.boxText}>Office</Text>
          </TouchableOpacity>

   
        </View>

      <View style={{backgroundColor:"#36454F",flex:1,borderTopLeftRadius:20,borderTopRightRadius:20,marginTop:20}}>
        <View style={{height:4,width:70,borderRadius:50,backgroundColor:"black",alignSelf:"center",marginTop:5}}></View>
      <View style={{ marginVertical: 20 }}>
          <Text style={{ color: 'white', fontWeight: '500', fontSize: 15,marginHorizontal:10 }}>
            Recommending For you
          </Text>
        </View>
        
        {/* Horizontal Scroll for Cards */}
         <ScrollView horizontal={true} contentContainerStyle={styles.cardContainer}>
            {vehicleData.map((vehicle, index) => (
              <TouchableOpacity style={styles.card} key={index} onPress={() => selectTruck(vehicle._id,vehicle.title)}>
                <Image
                  source={{ uri: `http://192.168.0.114:1234/uploads/${vehicle.image[0]}` }} // Assuming images are stored in a specific folder
                  style={styles.cardImage}
                />
                <Text style={styles.cardText}>{vehicle.title}</Text>
                {/* <Text style={styles.cardText}>{vehicle.brand}</Text> */}
              </TouchableOpacity>
            ))}
          </ScrollView>



      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndexTab;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20, // Adjust for iOS notch if needed
  },
  scrollContent: {
    flexGrow: 1,  // To make ScrollView take full space
    paddingHorizontal: 20,
    paddingVertical: 20, // Additional padding if necessary
    backgroundColor: 'black',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,  // Vertical margin for the row
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', // Align text vertically
    marginRight: 10, // Ensure space between text and image
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: width * 0.05,  // Dynamic font size based on screen width
    marginBottom: 5,  // Space between lines of text
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,  // Circle profile image
  },
  // Left Box (Ride Now)
  rideNowBox: {
    flexDirection:"column",
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 10,
    width: (width - 40) / 3, // Smaller width for "Ride Now" box
    height: 100,  // Set a specific height for the box
    justifyContent:"center",
  },

  // Right Box (Book Truck)
  bookTruckBox: {
    flexDirection:'column',
    // alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal:5,
    backgroundColor: '#f9d057',  // Green background for differentiation
    borderRadius: 20,
    width: (width - 40) * 0.65,  // Larger width for "Book Truck" box
    height: 100,  // Set a specific height for the box
  },












   rideNowBox1: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    // marginRight: 10,
    justifyContent:"center",
    width: (width - 40) / 3, // Smaller width for "Ride Now" box
    height: 100,  // Set a specific height for the box
  },

  // Right Box (Book Truck)
  bookTruckBox1: {
    flexDirection: 'column',
    paddingVertical:10 ,
    paddingHorizontal:5,
   
    backgroundColor: '#9aea9f',  // Green background for differentiation
    borderRadius: 20,
    width: (width - 40) * 0.65,  // Larger width for "Book Truck" box
    height: 100,  // Set a specific height for the box
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  shipicon: {
    width: '100%',
    height: '100%',
    // marginRight: -10,
    alignSelf:"flex-start"
  },
  t1icon:{
    width: '100%',
    height: '90%',
    alignSelf:'flex-end',
    alignItems:"flex-end",
    // marginLeft:10
  },
  boxText: {
    fontSize: width * 0.04,
    fontWeight: '600',
 

  },
  t1text: {
    fontSize: width * 0.04,
    fontWeight: '600',
 alignSelf:"flex-start"

  },

  shipment: {
    fontSize: width * 0.04,
    fontWeight: '600',
    // color
    alignSelf:'flex-end',
    letterSpacing:2
    // alignItems:"flex-end"

  },
  cardContainer: {
    flexDirection: 'row',  // Ensures that the cards are displayed horizontally
    paddingHorizontal: 10,
    justifyContent: "space-between", 
    gap:20,
       // paddingBottom: 20,
  },
  card: {
    flexDirection:'column',
    alignItems: 'center',
    padding: 7,
    backgroundColor: '#F0F8FF',
    borderRadius: 20,
    marginRight: 10, // Space between cards
    width: 80,  // Fixed width for each card
    height: 80,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    // marginRight: 15,
  },
  cardText: {
    marginTop:7,
    fontSize: width * 0.03,
    fontWeight: '600',
    color:'white'
  },
});
