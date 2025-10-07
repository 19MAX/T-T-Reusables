import "../global.css";

import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";

// import { useGeistFont } from '@showcase/hooks/use-geist-font';
import { NAV_THEME } from "@/showcase/lib/theme";
// import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import * as React from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { Stack } from "expo-router";
const IitialLayout = () => {
  const { isAuthenticated } = useAuth();

  // -------------------------------------
  //  const [loaded, error] = useGeistFont();
  const { colorScheme } = useColorScheme();

  // if (!loaded && !error) {
  //   return null;
  // }
  //-------------------------------------

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor:
            NAV_THEME[colorScheme ?? "light"].colors
              .background,
        }}
      >
        <KeyboardProvider>
          <Stack
          screenOptions={
            {
              headerShown:false,
            }
          }
          >
            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="client"
              options={{
                headerLargeTitle: true,
                headerTitle: 'Showcase',
                headerLargeTitleShadowVisible: false,
                headerLargeStyle: {
                  backgroundColor: colorScheme === 'dark' ? 'hsl(0 0% 3.9%)' : 'hsl(0 0% 100%)',
                },
              }}
              />
              {/* <Stack.Screen name="" /> */}
            </Stack.Protected>

            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="auth" />
            </Stack.Protected>
          </Stack>

          <PortalHost />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <IitialLayout />
    </AuthProvider>
  );
}
