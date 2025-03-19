// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey= process.env.EXPO_PUBLIC_API_KEY_DB
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "chatgpt2025-2f05c.firebaseapp.com",
    projectId: "chatgpt2025-2f05c",
    storageBucket: "chatgpt2025-2f05c.firebasestorage.app",
    messagingSenderId: "832896693731",
    appId: "1:832896693731:web:052ce40b2619355aee5cd6",
    measurementId: "G-CM3QC9C2SY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// Inicializar Analytics solo en el navegador
let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { analytics };

// Inicializar Auth
export const auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
});


