import "../global.css";

import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { NAV_THEME } from "@/showcase/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

const InitialLayout = () => {
  const { isAuthenticated } = useAuth();
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: NAV_THEME[colorScheme ?? "light"].colors.background,
        }}
      >
        <KeyboardProvider>
          <ToastProvider>
            {/* Envolver con ToastProvider */}
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen
                  name="client"
                  options={{
                    headerLargeTitle: true,
                    headerTitle: "Showcase",
                    headerLargeTitleShadowVisible: false,
                    headerLargeStyle: {
                      backgroundColor:
                        colorScheme === "dark"
                          ? "hsl(0 0% 3.9%)"
                          : "hsl(0 0% 100%)",
                    },
                  }}
                />
              </Stack.Protected>
              <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="auth" />
              </Stack.Protected>
            </Stack>
            <PortalHost />
          </ToastProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
