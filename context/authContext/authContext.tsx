import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from '../../utils/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "expo-router";
import { setDoc, doc } from "firebase/firestore";
import { User } from "@/interfaces/common";

interface AuthContextProps {
  currentUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (user: { name: string; email: string; password: string; role: "client" | "chef" | "cashier" }) => Promise<void>;
  updateRole: (role: "client" | "chef" | "cashier") => void;
  updateUser: (user: any) => Promise<void>
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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<"client" | "chef" | "cashier" | null>("client");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
        setCurrentUser(user);
    });
    return () => unsubscribe();
}, []);

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

  const register = async (user: { name: string; email: string; password: string; role: "client" | "chef" | "cashier" }) => {
    try {
      setError(""); // Resetear error antes del intento de registro
      const response = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const firebaseUser = response.user;
      await updateProfile(firebaseUser, { displayName: user.name });

      await setDoc(doc(db, "users", firebaseUser.uid), {
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: new Date()
      });
      console.log({ response: response.user });
      if (response.user) {
        setUser({
          email: user.email,
          name: user.name,
          password: "", // No se debe almacenar la contraseña en el contexto por seguridad
          role: user.role,
        });
        router.push("/auth");
      }
    } catch (error: any) {
      console.error("Error Registro: ", error.message);
      setError("Error al registrarse");
    }
  };


    const updateRole = async (role: "client" | "chef" | "cashier") => {
        if (auth.currentUser) {
            await setDoc(doc(db, "users", auth.currentUser.uid), { role }, { merge: true });
        }
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

  const updateUser = async (user: User) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: user.name });
        await setDoc(doc(db, "users", auth.currentUser.uid), user, { merge: true });
    }
    } catch (error) {
      console.error("Error al actualizar usuario: ", error);
      setError("Error al actualizar usuario");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateUser,
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
