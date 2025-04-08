import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StripeProvider } from '@stripe/stripe-react-native';  // Import StripeProvider

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const stripePublishableKey = 'pk_test_51QgvsE4RRFp4tU4idxLkVvXZLSIuxe5hMjPFjgtOE29uxUiknQjZe4OJpyx1sa9SwGAqlCAom58mIFrK8kIvEpRe00k2mu8ckK'; // Replace with your actual Stripe publishable key

  return (
    // Wrap the app in both the ThemeProvider and StripeProvider
    <StripeProvider publishableKey={stripePublishableKey}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="login"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="signup"
            options={{ headerShown: false }} // Hide header for this screen
          />

<Stack.Screen
            name="waiting"
            options={{ headerShown: false }} // Hide header for this screen
          />

<Stack.Screen
            name="office"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="profileinfo"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="lastmap"
            options={{ headerShown: false }} // Hide header for this screen
          />
            <Stack.Screen
            name="lastmap2"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="+not-found"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }} // Hide header for this screen
          />
           <Stack.Screen
            name="activate"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="main"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="mapline"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="profilecom"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="mapcar"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="payment"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="stripe"
            options={{ headerShown: false }} // Hide header for this screen
          />
          <Stack.Screen
            name="index"
            options={{ headerShown: false }} // Hide header for this screen
          />
        </Stack>
      </ThemeProvider>
      <StatusBar style="auto" />
    </StripeProvider>
  );
}
