// src/firebase/crud/ordersCRUD.ts
import { db } from "@/utils/FirebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { CartItem } from "@/context/authContext/cartContext";

export const createOrder = async (
  table: string,
  items: CartItem[],
  total: number
) => {
  try {
    const order = {
      table,
      items,
      total,
      status: "ordenado", // ✅ Añadido
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "orders"), order);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error al crear la orden:", error);
    throw error;
  }
};
