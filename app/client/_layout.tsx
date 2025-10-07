import { QueryProvider } from "@/providers/QueryProvider";
import { Stack } from "expo-router";
import React from "react";

const ClientLayout = () => {
  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="auth" options={{ headerShown: false }} /> */}
        {/* Resto de tus screens */}
      </Stack>
    </QueryProvider>
  );
};

export default ClientLayout;
