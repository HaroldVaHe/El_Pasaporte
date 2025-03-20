import { createContext, ReactNode, useState } from "react";
import { auth } from '../../utils/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from "expo-router";
import { User } from "@/interfaces/common";

interface AuthContextProps {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  updateRole: (role: "client" | "chef" | "cashier") => void;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<"client" | "chef" | "cashier" | null>("client");

  const login = async (email: string, password: string) => {
    try {
      setError(""); // Resetear error antes del intento de login
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log({ response: response.user });
      if (response.user) {
        setUser({
          email: response.user.email || "",
          name: "", // Add default or fetched value
          password: "", // Add default or fetched value
          role: role as "client" | "chef" | "cashier", // Ensure role matches the expected type
        });
        router.push("../app/(app)");
      }
    } catch (error: any) {
      console.error("Error Login: ", error.message);
      setError("Correo o contraseña incorrectos");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(""); // Resetear error antes del intento de registro
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log({ response: response.user });
      if (response.user) {
        setUser({
          email: response.user.email || "",
          name: "", // Provide a default or fetched value for name
          password: "", // Provide a default or fetched value for password
          role: role as "client" | "chef" | "cashier", // Ensure role matches the expected type
        });
        router.push("/auth");
      }
    } catch (error: any) {
      console.error("Error Registro: ", error.message);
      setError("Error al registrarse");
    }
  };

  const updateRole = (role: "client" | "chef" | "cashier") => {
      setRole(role);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
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
        user,
        error,
        role: role || "client",
        setEmail,
        setPassword,
        setError,
        setRole: (role: string) => setRole(role as "client" | "chef" | "cashier" | null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
