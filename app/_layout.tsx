// app/_layout.tsx
import { Stack } from "expo-router";
import { DishesProvider } from "@/context/authContext/dishesContext";
import { CartProvider } from "@/context/authContext/cartContext"; // 👈 Asegúrate que la ruta sea correcta
import { AuthProvider } from "@/context/authContext/authContext"; // 👈 Asegúrate que la ruta sea correcta

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <DishesProvider>
          <Stack />
        </DishesProvider>
      </CartProvider>
    </AuthProvider>


  );
}
