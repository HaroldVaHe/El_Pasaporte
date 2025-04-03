import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";  // Asegúrate de importar tu instancia de Firestore

const DISHES_COLLECTION = "dishes";
// 🥘 Definir la estructura de un platillo
interface Dish {
  id: string;
  title: string;
  price: number;
  description: string;
}

// 🔹 Agregar un platillo
export const addDish = async (title: string, price: number, description: string) => {
    try {
        const docRef = await addDoc(collection(db, DISHES_COLLECTION), { title, price, description });
        console.log("Platillo agregado con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al agregar el platillo:", error);
    }
};

// 🔹 Obtener todos los platillos
export const getDishes = async () => {
  try {
      const querySnapshot = await getDocs(collection(db, "dishes"));
      return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() // Asegura que traiga title, price y description
      })) as Dish[]; // 👈 Especificamos que el resultado es de tipo Dish[]
  } catch (error) {
      console.error("Error al obtener platillos:", error);
      return [];
  }
};


// 🔹 Actualizar un platillo
export const updateDish = async (id: string, updatedData: { title?: string; price?: number; description?: string }) => {
    try {
        const dishRef = doc(db, DISHES_COLLECTION, id);
        await updateDoc(dishRef, updatedData);
        console.log("Platillo actualizado correctamente.");
    } catch (error) {
        console.error("Error al actualizar el platillo:", error);
    }
};

// 🔹 Eliminar un platillo
export const deleteDish = async (id: string) => {
    try {
        const dishRef = doc(db, DISHES_COLLECTION, id);
        await deleteDoc(dishRef);
        console.log("Platillo eliminado correctamente.");
    } catch (error) {
        console.error("Error al eliminar el platillo:", error);
    }
};
