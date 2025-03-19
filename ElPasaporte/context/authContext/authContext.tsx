import { User } from "@/interfaces/common";
import { createContext } from "react";
import { ReactNode, useState } from "react";
import { auth } from '../../utils/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { router, useRouter } from "expo-router";


interface authContextProps {
    login: (email: string, password: string) => void;
    register: (user: User) => void;
    updateRole: (role: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<authContextProps | null>(null);

export const AuthProvider = ({ children }:any) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("");


    const login = async () => {
        try {
          setError(""); // Resetear error antes del intento de login
          const response = await signInWithEmailAndPassword(auth, email, password);
          console.log({ response: response.user });
          if (response.user) {
            router.push("/app");
          }
        } catch (error: any) {
          console.log("Error Login: ", error.message);
          setError("Correo o contraseña incorrectos"); // Mensaje de error amigable
        }
      };
    const register=async()=>{
      try {
        setError(""); // Resetear error antes del intento de registro
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log({ response: response.user });
            if (response.user) {
              router.push("/login");
            }
          } catch (error: any) {
            console.log("Error Registro: ", error.message);
          }
        };
    }

    const updateRole=async() =>{
      try {
      setError(""); // Resetear error antes del intento de cambio de rol
      
    }
    catch (error: any) {
      console.log("Error Login: ", error.message);
      setError("Error al cambiar el rol"); // Mensaje de error amigable
    }

    //const handleLogout -> signOut function from firebase auth module
    const logout = async () => {
      try {
          await signOut(auth);
          router.replace("/");
      } catch (error) {
          console.error("Error al cerrar sesión: ", error);
      }
  };

    return (
        <AuthContext.Provider
         value={{

            login,
            register,
            updateRole,
            logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};