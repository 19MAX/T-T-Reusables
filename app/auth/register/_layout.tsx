import { Stack } from 'expo-router'
import React from 'react'

const LoginLayout = () => {
  return (
    <Stack screenOptions={
        {
            headerShown: false,
        }
    }>
        <Stack.Screen name="Identification" />
        <Stack.Screen name="RegisterData"/>
    </Stack>
  )
}

export default LoginLayout