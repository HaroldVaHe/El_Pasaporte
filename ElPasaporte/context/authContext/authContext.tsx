import { User } from "@/interfaces/common";
import { createContext } from "react";
import { ReactNode, useState } from "react";

<<<<<<< Updated upstream
interface authContextProps {
    login: (email: string, password: string) => void;
    register: (user: User) => void;
    updateRole: (role: string) => void;
    logout: () => void;
=======

 export interface AuthContextProps {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  updateRole: (role: string) => void;
  logout: () => Promise<void>;
  user: User | null;
  error: string;
  role: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setRole: (role: string) => void;
>>>>>>> Stashed changes
}

export const AuthContext = createContext<authContextProps | null>(null);

export const AuthProvider = ({ children }:any) => {

    const login=(email:string, password:string)=>{

<<<<<<< Updated upstream
    }
    const register=(user:User)=>{
=======
    const login = async (email: string, password: string) => {
        try {
          setError(""); // Resetear error antes del intento de login
          const response = await signInWithEmailAndPassword(auth, email, password);
          console.log({ response: response.user });
          if (response.user) {
            router.push("../app/(app)/index"); // Replace with a valid route
          }
        } catch (error: any) {
          console.log("Error Login: ", error.message);
          setError("Correo o contraseña incorrectos"); // Mensaje de error amigable
        }
      };
    const register=async(email: string, password: string)=>{
      try {
        setError(""); // Resetear error antes del intento de registro
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log({ response: response.user });
            if (response.user) {
              router.push("/auth");
            }
          } catch (error: any) {
            console.log("Error Registro: ", error.message);
          }
        };
    
>>>>>>> Stashed changes

    }

    const updateRole=(role:string)=>{

    }

    const logout=()=>{

    }

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