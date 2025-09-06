import { Stack } from "expo-router";
import { useState } from "react";

export default function RootLayout() {
  // For demo purposes, let's set the user as not authenticated to show login first
  const [isAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    );
  }
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="addProduct" 
        options={{ 
          headerShown: true,
          title: "Add New Product",
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="product/[id]" 
        options={{ 
          headerShown: true,
          title: "Product Details",
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}
