import { Stack } from "expo-router";
import { useState } from "react";

export default function RootLayout() {
  // For demo purposes, let's set the user as authenticated
  const [isAuthenticated] = useState(true);
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </>
      ) : (
        <>
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
        </>
      )}
    </Stack>
  );
}
