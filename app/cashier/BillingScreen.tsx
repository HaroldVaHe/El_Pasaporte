// app/user/BillingScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { app } from "../../utils/FirebaseConfig";

const db = getFirestore(app);

interface Order {
  id: string;
  table: string;
  items: { title: string; quantity: number }[];
  total: number;
  status: string;
  createdAt: any;
}

const BillingScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"Pagar" | "pagado">("Pagar");

  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("status", "==", filter));
      const snapshot = await getDocs(q);
      const fetchedOrders: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      const sortedOrders = fetchedOrders.sort((a, b) =>
        b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.()
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.loadingText}>Cargando órdenes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Órdenes para {filter === "Pagar" ? "pagar" : "pagadas"}</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "Pagar" && styles.selectedFilter]}
          onPress={() => setFilter("Pagar")}
        >
          <Text style={styles.filterText}>Pagar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "pagado" && styles.selectedFilter]}
          onPress={() => setFilter("pagado")}
        >
          <Text style={styles.filterText}>Pagado</Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <Text style={styles.message}>No hay órdenes para mostrar.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/cashier/order-summary", params: { orderId: item.id } })}
              style={styles.orderItem}
            >
              <Text style={styles.orderText}>
                <Text style={styles.bold}>Mesa:</Text> {item.table}{"\n"}
                <Text style={styles.bold}>Estado:</Text> {item.status}{"\n"}
                <Text style={styles.bold}>Total:</Text> ${item.total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1e1e2d",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e2d",
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFC107",
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
    gap: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  selectedFilter: {
    backgroundColor: "#FFC107",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  message: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
  },
  orderItem: {
    backgroundColor: "#2E2E3E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  orderText: {
    fontSize: 16,
    color: "#fff",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default BillingScreen;
