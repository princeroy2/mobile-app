// import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
// import React from 'react';
// import { Colors } from '../constants/Colors';
// import { router } from 'expo-router';
// import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
// import { RFValue } from 'react-native-responsive-fontsize'; // Import RFValue for responsive font size
// import { LinearGradient } from 'expo-linear-gradient';
// import AntDesign from '@expo/vector-icons/AntDesign';

// // Get the screen width and height
// const { width, height } = Dimensions.get('window'); 

// const Index = () => {
//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }} screenOptions={{ headerShown: false }}>
//       <StatusBar style="light" />

//       {/* Background Image */}
//       <Image
//         source={require('../assets/images/tuck5.png')}
//         style={styles.backgroundImage}
//         resizeMode="cover" // Ensures the image covers the full screen
//       />

//       {/* Gradient Overlay */}
//       <LinearGradient
//         colors={['#266352', '#19104E']} // Gradient colors
//         style={styles.overlayContainer}
//       >
//         {/* Main Text */}
//         <Animated.Text
//           entering={FadeInRight.delay(300).duration(600)}
//           style={styles.mainText}
//         >
//           FMS
//         </Animated.Text>
//         <Animated.Text
//   entering={FadeInRight.delay(300).duration(600)}
//   style={{
//     color: 'white',
//     textAlign: 'center',
//     fontSize: RFValue(14),
//     fontWeight: '500',
//     lineHeight: RFValue(24),
//     letterSpacing: 1.5,
//     marginVertical: RFValue(10),
//   }}
// >
//   FMS delivers reliable and efficient trucking solutions for your business
//   Track, manage, and optimize your deliveries with ease.
//   Join us for a seamless, faster, and smarter delivery experience.
// </Animated.Text>


//         {/* Button */}
//         <Animated.View entering={FadeInDown.delay(1200).duration(600)} style={{ marginBottom: RFValue(20) }}>
//           <TouchableOpacity
//             activeOpacity={0.7}
//             onPress={() => router.replace('/login')} // Navigate to login screen
//             style={styles.button}
//           >
//             <AntDesign name="arrowright" size={40} color="white" style={{ padding: 5 }} />
//           </TouchableOpacity>
//         </Animated.View>
//       </LinearGradient>
//     </View>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   // Ensure the image takes full screen width and height
//   backgroundImage: {
//     flex: 1,
//     width: '100%', // Make sure it stretches across the screen
//     height: height, // Full screen height
//   },
  
//   overlayContainer: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     gap: RFValue(10), // Responsive gap
//     backgroundColor: 'transparent', // Remove background color, since we have the gradient overlay
//     paddingHorizontal: RFValue(20), // Adjust padding for responsiveness
//     paddingBottom: RFValue(30), // Proper bottom padding for all devices
//   },

//   mainText: {
//     textAlign: 'center',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: RFValue(30), // Responsive font size
//     lineHeight: RFValue(40), // Responsive line height
//     letterSpacing: RFValue(5),
//     marginTop: RFValue(40), // Responsive margin
//   },

//   subText: {
//     textAlign: 'center',
//     color: Colors.white,
//     fontWeight: '500',
//     fontSize: RFValue(10), // Scaled font size
//     lineHeight: RFValue(15), // Scaled line height
//     letterSpacing: RFValue(1.5),
//     marginHorizontal: RFValue(30),
//   },

//   button: {
//     backgroundColor: '#95abd6',
//     alignItems: 'center',
//      // Scaled padding for button
//     borderRadius: RFValue(50), // Scaled border radius for rounded corners
//     width: '80%', // Set width to 80% of the screen width
//     alignSelf: 'center', // Center the button
//   },

//   buttonText: {
//     fontSize: RFValue(12), // Scaled font size
//     color: Colors.white,
//     fontWeight: '700',
//   },
// });
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize'; // Import RFValue for responsive font size
import { LinearGradient } from 'expo-linear-gradient';

// Get the screen width and height
const { width, height } = Dimensions.get('window'); 

const Index = () => {
  return (
    <View style={{ flex: 1 }} screenOptions={{ headerShown: false }}>
      <StatusBar style="light" />

      {/* Upper Image */}
      <Image
        source={require('../assets/images/t2.png')} // Add your image here
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Gradient Overlay and Text at the Bottom */}
      <LinearGradient
        colors={['#000000', '#122043']} // Gradient from black to blue
        style={styles.overlayContainer}
      >
        {/* Main Text */}
        <Animated.Text
          entering={FadeInRight.delay(300).duration(600)}
          style={styles.mainText}
        >
          FMS
        </Animated.Text>

        {/* Description Text */}
        <Animated.Text
          entering={FadeInRight.delay(300).duration(600)}
          style={styles.subText}
        >
          FMS delivers reliable and efficient trucking solutions for your business.
          Track, manage, and optimize your deliveries with ease.
          Join us for a seamless, faster, and smarter delivery experience.
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(1200).duration(600)} style={{ marginBottom: RFValue(20), width: '100%' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.replace('/login')} // Navigate to login screen
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  // Image at the top
  backgroundImage: {
    width: '100%', // Full screen width
    height: height * 0.4, // 20% of screen height
    marginTop: 40, // Set the marginTop to 10 to reduce the space
  },

  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align everything to the top of the screen
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: RFValue(10), // Responsive gap
    backgroundColor: 'transparent', // No background since we have the gradient overlay
    paddingHorizontal: RFValue(10), // Adjust padding for responsiveness
    paddingBottom: RFValue(10), // Proper bottom padding for all devices
  },

  mainText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: RFValue(30), // Responsive font size
    lineHeight: RFValue(40), // Responsive line height
    letterSpacing: RFValue(5),
    marginTop: RFValue(40), // 10 pixels margin top for "FMS" text
  },

  subText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    fontSize: RFValue(14), // Scaled font size
    lineHeight: RFValue(24), // Scaled line height
    letterSpacing: RFValue(1.5),
    marginVertical: RFValue(10),
  },

  button: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: RFValue(50), // Rounded corners
    width: '80%', // 80% of screen width
    alignSelf: 'center', // Center the button
    paddingVertical: RFValue(10),
    marginTop:RFValue(20)
  },

  buttonText: {
    fontSize: RFValue(16), // Scaled font size for button text
    color: 'black',
    fontWeight: '700',
  },
});
