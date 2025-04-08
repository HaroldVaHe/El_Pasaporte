import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from '../../utils/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "expo-router";
import { setDoc, doc, getDoc } from "firebase/firestore";
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
  
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role as "client" | "chef" | "cashier");
            setUser({
              email: firebaseUser.email || "",
              name: userData.name || "",
              password: "",
              role: userData.role as "client" | "chef" | "cashier",
            });
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const login = async (email: string, password: string) => {
    try {
      setError(""); // Resetear error antes del intento de login
      const response = await signInWithEmailAndPassword(auth, email, password);

      if (response.user) {
        // Obtener el documento del usuario en Firestore
        const userDocRef = doc(db, "users", response.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role as "client" | "chef" | "cashier");
          setUser({
            email: response.user.email || "",
            name: userData.name || "",
            password: "", // No se almacena la contraseña por seguridad
            role: userData.role as "client" | "chef" | "cashier",
          });

          // Redirigir según el rol
          switch (userData.role) {
            case "client":
              router.push("../user/homeScreen");
              break;
            case "chef":
              router.push("../chef/homeScreen");
              break;
            case "cashier":
              router.push("../cashier/homeScreen");
              break;
            default:
              setError("Rol no válido");
          }
        } else {
          setError("No se encontró información del usuario");
        }
      }
    } catch (error: any) {
      //console.error("Error Login: ", error.message);
      setError("Correo o contraseña incorrectos");
    }
  };

  const register = async (user: any) => {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    const firebaseUser = userCredential.user;
    await updateProfile(firebaseUser, { displayName: user.name });

    await setDoc(doc(db, "users", firebaseUser.uid), {
      name: user.name,
      email: user.email,
      role: user.role || "client",
      createdAt: new Date()
    });
  };


  const updateRole = async (role: "client" | "chef" | "cashier") => {
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, "users", auth.currentUser.uid), { role }, { merge: true });
      }
    } catch (error) {
      console.error("Error al actualizar rol: ", error);
      setError("Error al actualizar rol");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      setEmail(""); // 🔒 Limpia el email

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
