import { Stack } from "expo-router";
import { DishesProvider } from "@/context/authContext/dishesContext";

export default function RootLayout() {
  return (
    <DishesProvider>
      <Stack />
    </DishesProvider>
  );
}
