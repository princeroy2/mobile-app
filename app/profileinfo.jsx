import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker'; // Import image picker
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userdata, setUserData] = useState();
  const [error, setError] = useState();
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const [loading, setLoading] = useState(false); // Loading state for API calls

  const router = useRouter();
  
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
          setName(data.profile.name);
          setEmail(data.profile.email);
          setPhone(data.profile.phone);
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

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      // Request media library permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access media library is required!');
        return;
      }
  
      // Launch image picker to select an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true,
        aspect: [1, 1], // Square aspect
        quality: 1, // Full quality
      });
  
      if (!result.canceled) {
        // Set the profile image URI after image is picked
        setProfileImage(result.assets[0].uri);
      } else {
        Alert.alert('No image selected', 'You did not select any image.');
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'An error occurred while selecting the image.');
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('Unauthorized', 'You need to login again.');
      router.replace('/login');
      return;
    }

    const updatedProfile = {
      name,
      email,
      phone,
      profileImage, // Assuming this will be handled with an API for image upload
    };

    try {
      const response = await fetch('http://192.168.0.114:1234/users', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      const result = await response.json();
      if (response.ok) {
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('email');
        Alert.alert('Success', 'Profile updated successfully.');
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('email', email);
        
      } else {
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while saving changes.');
    } finally {
      setLoading(false);
    }
  };

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
        {/* Touchable for changing the profile image */}
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require('@/assets/images/boy.png')} // Use selected image or default image
            style={styles.profileImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.profileName}>{name}</Text>
      </View>

      {/* Gradient Section */}
      <LinearGradient colors={['#266352', '#19104E']} style={styles.gradientContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>You Have 0 Rides</Text>
        </View>
      </LinearGradient>

      {/* Editable Profile Fields */}
      <View style={styles.cardContainer}>
        <Text style={styles.line}></Text>

        {/* Editable Name Field */}
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

        {/* Editable Email Field */}
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

        {/* Editable Phone Field */}
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

      {/* Save Changes Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveChanges}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.saveButtonText}>Saving...</Text>
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
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
    height: 150, // Adjust for circular image
    borderRadius: 75, // Make it circular
  },
  profileName: {
    marginVertical: 10,
    fontSize: 18,
  },
  gradientContainer: {
    marginHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 5,
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
    marginVertical: 3,
  },
  saveButton: {
    backgroundColor: '#266352',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
