import { Stack } from "expo-router";
import { useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  // For demo purposes, let's set the user as not authenticated to show login first
  const [isAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack 
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    );
  }
  
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="addProduct" 
          options={{ 
            headerShown: true,
            title: "Add New Product",
            presentation: 'modal',
            headerShadowVisible: false,
            contentStyle: { backgroundColor: 'white' },
          }} 
        />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            headerShown: true,
            title: "Product Details",
            presentation: 'card',
            headerShadowVisible: false,
            contentStyle: { backgroundColor: 'white' },
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
