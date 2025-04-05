import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useCart } from "@/context/authContext/cartContext";
import { useRouter } from "expo-router";

export default function CartView() {
  const { cart, total, addToCart, removeFromCart } = useCart();
  const router = useRouter();

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      "Eliminar plato",
      "¿Estás seguro de que quieres eliminar este plato del carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => removeFromCart(id), style: "destructive" },
      ]
    );
  };

  const increaseQty = (id: string) => {
    const item = cart.find((dish) => dish.id === id);
    if (item) addToCart(item, 1);
  };

  const decreaseQty = (id: string) => {
    const item = cart.find((dish) => dish.id === id);
    if (item) {
      if (item.quantity > 1) {
        addToCart(item, -1);
      } else {
        handleRemoveItem(id);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Carrito de Compras</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.details}>
                  Total: ${(item.price * item.quantity).toFixed(2)}
                </Text>

                <View style={styles.qtyContainer}>
                  <TouchableOpacity onPress={() => decreaseQty(item.id)} style={styles.qtyButton}>
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyValue}>{item.quantity}</Text>

                  <TouchableOpacity onPress={() => increaseQty(item.id)} style={styles.qtyButton}>
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total a pagar: ${total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => Alert.alert("✅ Pedido confirmado", "Gracias por tu compra.")}
      >
        <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>⬅ Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2D",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 16,
  },
  emptyText: {
    color: "#AAA",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
  item: {
    backgroundColor: "#2E2E3E",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  details: {
    color: "#CCC",
    marginTop: 4,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  qtyButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  qtyValue: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 18,
    color: "#FF5555",
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: "#444",
    paddingTop: 16,
    marginTop: 16,
  },
  totalText: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "right",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  confirmButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 10,
    marginTop: 12,
  },
  backButtonText: {
    textAlign: "center",
    color: "#FFD700",
    fontSize: 16,
  },
});
