import { AuthContext, AuthProvider } from "@/context/authContext/authContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false, // 👈 Oculta los headers globalmente
        }}
      >
        <Stack.Screen name="auth" />
        <Stack.Screen name="(app)" />
      </Stack>
    </AuthProvider>
  );
}
