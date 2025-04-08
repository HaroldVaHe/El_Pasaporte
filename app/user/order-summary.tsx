import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image, // 👈 Importación añadida
} from "react-native";
import { getDoc, doc, onSnapshot  } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";
import { useCart } from "@/context/authContext/cartContext";

export default function OrderSummary() {
  const localParams = useLocalSearchParams();
  const router = useRouter();
  const { orderId: contextOrderId } = useCart();

  const orderId = String(localParams.orderId || contextOrderId);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
  
    const docRef = doc(db, "orders", orderId);
  
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrder(snapshot.data());
      } else {
        console.warn("Orden no encontrada");
        setOrder(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error en tiempo real al obtener la orden:", error);
      setLoading(false);
    });
  
    return () => unsubscribe(); // Cleanup cuando se desmonta el componente
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
  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Resumen de la Orden</Text>

      <Text style={styles.subtitle}>🪑 Mesa: {order.table}</Text>
      <Text style={styles.subtitle}>📦 Estado: {order.status}</Text>
      <Text style={styles.subtitle}>📅 Fecha: {formatDate(order.createdAt)}</Text>

      

      <FlatList
        data={order.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
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
        onPress={() => router.back()}
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
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
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
