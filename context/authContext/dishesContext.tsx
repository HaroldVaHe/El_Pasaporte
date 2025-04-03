import React, { createContext, useContext, useEffect, useState } from "react";
import { addDish, getDishes, updateDish, deleteDish } from "@/app/services/CRUD/dishesCRUD";

// 🥘 Definir el tipo de un platillo
interface Dish {
    id: string;
    title: string;
    price: number;
    description: string;
}

// 🛠 Definir el tipo de contexto
interface DishesContextType {
    dishes: Dish[];
    fetchDishes: () => Promise<void>;
    addNewDish: (title: string, price: number, description: string) => Promise<void>;
    editDish: (id: string, updatedData: Partial<Dish>) => Promise<void>;
    removeDish: (id: string) => Promise<void>;
}

// 📌 Crear el contexto
const DishesContext = createContext<DishesContextType | undefined>(undefined);

// 🔥 Proveedor del contexto
export const DishesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dishes, setDishes] = useState<Dish[]>([]);

    // Obtener platillos desde Firestore
    const fetchDishes = async () => {
        const fetchedDishes = await getDishes();
        setDishes(fetchedDishes);
    };

    // Agregar un nuevo platillo
    const addNewDish = async (title: string, price: number, description: string) => {
        const newDishId = await addDish(title, price, description);
        if (newDishId) fetchDishes();  // Refrescar lista
    };

    // Editar un platillo
    const editDish = async (id: string, updatedData: Partial<Dish>) => {
        await updateDish(id, updatedData);
        fetchDishes();  // Refrescar lista
    };

    // Eliminar un platillo
    const removeDish = async (id: string) => {
        await deleteDish(id);
        fetchDishes();  // Refrescar lista
    };

    // Cargar platillos al iniciar
    useEffect(() => {
        fetchDishes();
    }, []);

    return (
        <DishesContext.Provider value={{ dishes, fetchDishes, addNewDish, editDish, removeDish }}>
            {children}
        </DishesContext.Provider>
    );
};

// 🥘 Hook personalizado para acceder al contexto
export const useDishes = () => {
    const context = useContext(DishesContext);
    if (!context) throw new Error("useDishes debe usarse dentro de un DishesProvider");
    return context;
};
