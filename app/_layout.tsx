  // app/_layout.tsx
  import { Stack } from "expo-router";
  import { DishesProvider } from "@/context/authContext/dishesContext";
  import { CartProvider } from "@/context/authContext/cartContext";
  import { AuthProvider } from "@/context/authContext/authContext";

  export default function RootLayout() {
    return (
      <AuthProvider>
        <CartProvider>
          <DishesProvider>
          <Stack
  screenOptions={{
    headerShown: false, // 👈 Esto oculta el header en todas las pantallas que usen este layout
  }}
/>

          </DishesProvider>
        </CartProvider>
      </AuthProvider>
    );
  }
