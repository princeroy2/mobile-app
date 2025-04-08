import { StyleSheet, Animated, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { icon } from '../constants/icon'; // Assuming icon.js contains your icon map

const TabBar = ({ state, descriptors, navigation }) => {
  const [animations] = useState(
    state.routes.map(() => new Animated.Value(0)) // Array of animated values for each tab
  );

  useEffect(() => {
    // Trigger animations when focused tab changes
    state.routes.forEach((route, index) => {
      const isFocused = state.index === index;

      Animated.timing(animations[index], {
        toValue: isFocused ? 1 : 0, // Animate line to 1 when focused, else to 0
        duration: 200,
        useNativeDriver: false, // Since we are animating width, we can't use native driver
      }).start();
    });
  }, [state.index]); // Runs when focused tab changes

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Ensure route.name matches the correct key in the icon object
        const IconComponent = icon[route.name] ? icon[route.name] : icon.index;

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbaritem}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <View>
              {/* Keep the icon size constant */}
              <IconComponent
                color={isFocused ? 'red' : '#737373'}
                focused={isFocused}
              />
            </View>

            {/* Conditionally render the text only if the tab is not focused */}
            {!isFocused && (
              <Text style={{ color: isFocused ? 'red' : '#737373' ,fontSize:12}}>
                {label}
              </Text>
            )}


            <Animated.View
              style={[
                styles.underline,
                {
                  width: animations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20], // Adjust the width as needed
                  }),
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabbar: {
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 6,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbaritem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  underline: {
    height: 4,
    backgroundColor: '#266352',
    marginTop: 4,
  },
});
