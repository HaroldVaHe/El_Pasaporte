import { User } from "@/interfaces/common";
import { createContext, ReactNode, useState } from "react";
import { auth } from '../../utils/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { router, useRouter } from "expo-router";


interface AuthContextProps {
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
}


export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }:any) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("");


    const login = async (email: string, password: string) => {
        try {
          setError(""); // Resetear error antes del intento de login
          const response = await signInWithEmailAndPassword(auth, email, password);
          console.log({ response: response.user });
          if (response.user) {
            router.push("/app/(app)");
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
    

        const updateRole = (role: string) => {
          setRole(role);
        };

    //const handleLogout -> signOut function from firebase auth module
    const logout = async () => {
      try {
          await signOut(auth);
          setUser(null);
          setRole("");
          router.replace("/");
      } catch (error) {
          console.error("Error al cerrar sesión: ", error);
          setError("Error al cerrar sesión");
      }
  };

    return (
        <AuthContext.Provider
         value={{
            login,
            register,
            updateRole,
            logout,
            user: null, // Replace with actual user state if available
            error,
            role,
            setEmail,
            setPassword,
            setError,
            setRole
            }}>
            {children}
        </AuthContext.Provider>
    );
};