import { AuthContext, AuthProvider } from "@/context/authContext/authContext";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack> 
                <Stack.Screen name="auth" />
                <Stack.Screen name="(app)" />
                </Stack> 
        </AuthProvider>
    );
}