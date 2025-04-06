import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";  // 🔥 CORREGIDO: Usa getAuth

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const apiKey = process.env.EXPO_PUBLIC_API_KEY_AUTH || "AIzaSyADep16I-JrtCqaDQyGuaaIlTkRdjAkxw8";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "elpasaporte-b25ab.firebaseapp.com",
    projectId: "elpasaporte-b25ab",
    storageBucket: "elpasaporte-b25ab.appspot.com",
    messagingSenderId: "992029149836",
    appId: "1:992029149836:web:4a04b0083959aad78c49a9",
    measurementId: "G-3XK8DE5EWX"
};

// 🔥 Inicializa Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Inicializa Firestore
export const db = getFirestore(app);

// 🔥 Inicializa Storage
export const storage = getStorage(app);

// 🔥 CORREGIDO: Usa `getAuth` en lugar de `initializeAuth`
export const auth = getAuth(app);

// Inicializa Analytics solo en el navegador
let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}
export { analytics };

// 🔥 Configuración de Supabase
const SUPABASE_URL = "https://xyzcompany.supabase.co";  // Reemplaza con tu URL de Supabase
const SUPABASE_ANON_KEY = "your-anon-key";  // Reemplaza con tu clave anónima de Supabase

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,  // Usa AsyncStorage en React Native
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,  // Evita problemas con `window`
    },
});
if (!db) {
    console.error("❌ Firebase Firestore no está inicializado correctamente.");
  }
  