import { StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const Profile = () => {
  // State to hold editable profile information
  const [name, setName] = useState('Hasnain Haider');
  const [email, setEmail] = useState('hasnain@example.com');
  const [phone, setPhone] = useState('123-456-7890');

  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F8FF' }}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text></Text>
        <Text style={styles.profileText}>Profile</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* Profile Image Section */}
      <View style={styles.profileImageContainer}>
        <Image
          source={require('@/assets/images/boy.png')} // Use require for local images
          style={styles.profileImage}
          resizeMode="contain"
        />
        <Text style={styles.profileName}>Hasnain Haider</Text>
      </View>

      {/* Gradient Section */}
      <LinearGradient
        colors={['#266352', '#19104E']} // Gradient colors
        style={styles.gradientContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.text}>You Have 0 Rides</Text>
          <Text style={styles.text}>Thanks for riding with us! You earned 300 points from your last ride</Text>
        </View>
      </LinearGradient>

      {/* Menu Card Section */}
      <View style={styles.cardContainer}>
        {/* Profile Info */}
       
        <Text style={styles.line}></Text>

        {/* Editable Profile Fields */}
        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Feather name="edit" size={24} color="blue" />
            <TextInput
              style={styles.inputField}
              value={name}
              onChangeText={setName}
              placeholder="Enter Name"
            />
          </View>
        </View>
        <Text style={styles.line}></Text>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Feather name="mail" size={24} color="blue" />
            <TextInput
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email"
            />
          </View>
        </View>
        <Text style={styles.line}></Text>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Feather name="phone" size={24} color="blue" />
            <TextInput
              style={styles.inputField}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter Phone"
            />
          </View>
        </View>
        <Text style={styles.line}></Text>


      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 100,
  },
  profileName: {
    marginVertical: 10,
    fontSize: 18,
  },
  gradientContainer: {
    marginHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20, // Optional padding for spacing
  },
  textContainer: {
    alignItems: 'center', // Align text in the center
  },
  text: {
    color: 'white', // White text color for contrast
    fontSize: 15, // Adjust font size as needed
    textAlign: 'center', // Ensure text is centered
    marginBottom: 10, // Optional margin between text
  },
  cardContainer: {
    backgroundColor: 'white',
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 30,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputField: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    width: '84%',
    paddingHorizontal: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
    marginVertical: 3, // Adjust spacing between the line and the next content
  },
});
