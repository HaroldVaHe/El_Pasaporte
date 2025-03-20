// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore/lite';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey= process.env.EXPO_PUBLIC_API_KEY_AUTH
const firebaseConfig = {
    apiKey: "AIzaSyADep16I-JrtCqaDQyGuaaIlTkRdjAkxw8",
    authDomain: "elpasaporte-b25ab.firebaseapp.com",
    projectId: "elpasaporte-b25ab",
    storageBucket: "elpasaporte-b25ab.firebasestorage.app",
    messagingSenderId: "992029149836",
    appId: "1:992029149836:web:4a04b0083959aad78c49a9",
    measurementId: "G-3XK8DE5EWX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);
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


