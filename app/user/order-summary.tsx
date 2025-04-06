import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";
import { useCart } from "@/context/authContext/cartContext"; // ✅ Contexto del carrito

export default function OrderSummary() {
  const localParams = useLocalSearchParams();
  const router = useRouter();
  const { orderId: contextOrderId } = useCart(); // ✅ OrderId desde el contexto

  const orderId = String(localParams.orderId || contextOrderId); // ✅ Usa URL primero, luego contexto
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", orderId);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setOrder(snapshot.data());
        } else {
          console.warn("Orden no encontrada");
        }
      } catch (error) {
        console.error("Error obteniendo la orden:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Orden no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Resumen de la Orden</Text>

      <Text style={styles.subtitle}>🪑 Mesa: {order.table}</Text>
      <Text style={styles.subtitle}>📦 Estado: {order.status}</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemText}>Cantidad: {item.quantity}</Text>
            <Text style={styles.itemText}>
              Subtotal: ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.totalText}>💵 Total: ${order.total.toFixed(2)}</Text>
        }
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("../user/homeScreen")}
      >
        <Text style={styles.backButtonText}>⬅️ Volver al inicio</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCC",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: "#FF7777",
    textAlign: "center",
  },
  item: {
    backgroundColor: "#2E2E3E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  itemTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemText: {
    color: "#CCC",
    marginTop: 4,
  },
  totalText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "right",
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: "#FFC107",
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
