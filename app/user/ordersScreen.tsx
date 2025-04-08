// app/user/orders.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "@/context/authContext/authContext";
import { db } from "@/utils/FirebaseConfig";
import { collection, getDocs, query, where, onSnapshot  } from "firebase/firestore";
import { useRouter } from "expo-router";

interface Order {
  id: string;
  table: string;
  items: { title: string; quantity: number }[];
  total: number;
  status: string;
  createdAt: any;
}

export default function OrdersScreen() {
  const { currentUser } = useContext(AuthContext)!;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser?.uid) return;
  
    const q = query(collection(db, "orders"), where("user", "==", currentUser.uid));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersList: Order[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, "id">),
      }));
      setOrders(ordersList);
      setLoading(false);
    }, (error) => {
      console.error("Error en tiempo real al obtener órdenes:", error);
      setLoading(false);
    });
  
    return () => unsubscribe(); // limpia el listener al desmontar
  }, [currentUser]);
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
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
      <Text style={styles.title}>📜 Tus Pedidos</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
              pathname: "./order-summary",
              params: { orderId: item.id },
            })}
          >
            <Text style={styles.cardTitle}>🪑 Mesa: {item.table}</Text>
            <Text style={styles.cardText}>Estado: {item.status}</Text>
            <Text style={styles.cardText}>Total: ${item.total.toFixed(2)}</Text>
            <Text style={styles.cardText}>Fecha: {formatDate(item.createdAt)}</Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#2E2E3E",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  cardText: {
    fontSize: 14,
    color: "#CCC",
    marginTop: 4,
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
