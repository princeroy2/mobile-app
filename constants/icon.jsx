import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import Feather from '@expo/vector-icons/Feather';
// Ensure that the icon names are correctly mapped
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export const icon = {
    profile: ({  focused }) =>
      focused ? (
<Entypo name="user" size={24} color="#266352" />    ) : (
  <Feather name="user" size={18} color="black" />       ),
      index: ({ color, focused }) =>
        focused ? (
          <Ionicons name="home" size={24} color='#266352' />
        ) : (
          <Ionicons name="home-outline" size={18} color='black' />
        ),
      
      booking: ({ color, focused }) =>
    focused ? (
<MaterialCommunityIcons name="clock-time-four" size={24} color="#266352" /> ) : (
  <Octicons name="history" size={14} color="black" />
    ),
    chat: ({ color, focused }) =>
      focused ? (
        <Ionicons name="chatbox" size={24} color="#266352" />
      ) : (
        <Ionicons name="chatbox-outline" size={18} color="black" />
 
      )
    
   
};
