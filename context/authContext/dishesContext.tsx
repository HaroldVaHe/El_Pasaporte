import React, { createContext, useContext, useEffect, useState } from "react";
import { addDish, getDishes, updateDish, deleteDish } from "@/app/services/CRUD/dishesCRUD";
import { uploadImageToSupabase } from '@/app/services/CRUD/uploadToSupabase';

// 🥘 Definir el tipo de un platillo
export interface Dish {
  id: string;
  title: string;
  price: number;
  description: string;
  codigo: number;
  category: string;
  imageUrl?: string; // ✅ Nuevo campo opcional para la imagen
}

// 🛠 Definir el tipo de contexto
interface DishesContextType {
  dishes: Dish[];
  fetchDishes: () => Promise<void>;
  addNewDish: (
    title: string,
    price: number,
    description: string,
    category: string,
    imageUri?: string
  ) => Promise<void>;
  editDish: (id: string, updatedData: Partial<Dish>) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
}

// 📌 Crear el contexto
const DishesContext = createContext<DishesContextType | undefined>(undefined);

// 🔥 Proveedor del contexto
export const DishesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);

  const fetchDishes = async () => {
    const fetchedDishes = await getDishes();
    setDishes(fetchedDishes);
  };

  const addNewDish = async (
    title: string,
    price: number,
    description: string,
    category: string,
    imageUri?: string
  ) => {
    try {
      let imageUrl: string | null = null;

      if (imageUri) {
        const fileName = `dish-${Date.now()}.jpg`;
        imageUrl = await uploadImageToSupabase(imageUri, fileName);
        console.log("✅ Imagen subida correctamente a Supabase:", imageUrl);
      }

      const newDishId = await addDish(title, price, description, category, imageUrl || undefined);
      if (newDishId) fetchDishes();
    } catch (error) {
      console.error("❌ Error al agregar el platillo con imagen:", error);
    }
  };

  const editDish = async (id: string, updatedData: Partial<Dish>) => {
    await updateDish(id, updatedData);
    fetchDishes();
  };

  const removeDish = async (id: string) => {
    await deleteDish(id);
    fetchDishes();
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  return (
    <DishesContext.Provider value={{ dishes, fetchDishes, addNewDish, editDish, removeDish }}>
      {children}
    </DishesContext.Provider>
  );
};

// 🥘 Hook personalizado
export const useDishes = () => {
  const context = useContext(DishesContext);
  if (!context) throw new Error("useDishes debe usarse dentro de un DishesProvider");
  return context;
};
        