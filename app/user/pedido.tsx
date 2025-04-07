// DishesList.tsx
import React, { useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useDishes } from "@/context/authContext/dishesContext";
import { useCart } from "@/context/authContext/cartContext";
import type { Dish } from "@/context/authContext/dishesContext";

interface GroupedDishes {
  [key: string]: Dish[];
}

const categoryTitles: Record<string, string> = {
  entrada: "Entradas",
  "plato principal": "Platos Principales",
  postre: "Postres",
  bebida: "Bebidas",
};

export default function DishesList() {
  const { dishes } = useDishes();
  const { addToCart, setTable, table } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const router = useRouter();

  const grouped: GroupedDishes = dishes.reduce((acc, dish) => {
    const cat = dish.category || "otros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dish);
    return acc;
  }, {} as GroupedDishes);

  const handleAddToCart = (dish: Dish) => {
    const quantity = quantities[dish.id] || 1;
    addToCart(dish, quantity);
    Alert.alert("✅ Plato añadido", `${dish.title} x${quantity}`);
    router.push("/user/CartView");
  };

  const changeQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const newQty = (prev[id] || 1) + delta;
      return { ...prev, [id]: newQty > 1 ? newQty : 1 };
    });
  };

  const renderTableSelector = () => (
    <View style={styles.tableSelector}>
      <Text style={styles.sectionTitle}>Selecciona la mesa:</Text>
      <View style={styles.tableButtons}>
        {Array.from({ length: 10 }, (_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.tableButton,
              table === i + 1 && styles.tableButtonSelected,
            ]}
            onPress={() => setTable(i + 1)}
          >
            <Text
              style={[
                styles.tableButtonText,
                table === i + 1 && styles.tableButtonTextSelected,
              ]}
            >
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {renderTableSelector()}

      {Object.entries(grouped).map(([category, platos]) => (
        <View key={category} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {categoryTitles[category] || category}
          </Text>

          <FlatList
            scrollEnabled={false}
            data={platos.sort((a, b) => a.codigo - b.codigo)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const quantity = quantities[item.id] || 1;
              return (
                <View style={styles.card}>
                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.dishImage}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={styles.code}>#{item.codigo}</Text>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>

                  <View style={styles.cartActions}>
                    <View style={styles.qtyButtons}>
                      <TouchableOpacity
                        onPress={() => changeQuantity(item.id, -1)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyText}>{quantity}</Text>

                      <TouchableOpacity
                        onPress={() => changeQuantity(item.id, 1)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleAddToCart(item)}
                      style={styles.addButton}
                    >
                      <Text style={styles.addButtonText}>Añadir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.goToCartButton}
        onPress={() => router.push("/user/CartView")}
      >
        <Text style={styles.goToCartButtonText}>Ir al carrito</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1E1E2D",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#2E2E3E",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  dishImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  code: {
    color: "#888",
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  description: {
    color: "#CCC",
    marginTop: 4,
  },
  price: {
    color: "#90EE90",
    marginTop: 6,
    fontWeight: "bold",
  },
  cartActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
  },
  qtyButtons: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 8,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  qtyText: {
    color: "#FFF",
    fontSize: 16,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  goToCartButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  goToCartButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  tableSelector: {
    marginBottom: 24,
  },
  tableButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  tableButton: {
    backgroundColor: "#2E2E3E",
    padding: 10,
    borderRadius: 8,
    width: 40,
    alignItems: "center",
  },
  tableButtonSelected: {
    backgroundColor: "#FFD700",
  },
  tableButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  tableButtonTextSelected: {
    color: "#000",
  },
});
