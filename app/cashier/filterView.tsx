import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getFirestore, collection, getDocs, Timestamp } from "firebase/firestore";
import { app } from "../../utils/FirebaseConfig";
import { useRouter } from "expo-router";

const db = getFirestore(app);

interface Order {
  id: string;
  table: string;
  items: { title: string; quantity: number }[];
  status: string;
  createdAt?: Timestamp;
}

const states = ["ordenado", "Cocinando", "Pagar"];

const getTableEmoji = (tableNumber: string) => {
  const emojis = ["🪑", "🍽️", "🥂", "🕯️", "🍷", "🍴"];
  const index = parseInt(tableNumber) % emojis.length;
  return emojis[index];
};

const getDateLabel = (timestamp?: Timestamp): string => {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const isThisMonth =
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const isLastMonth =
    date.getMonth() === lastMonth.getMonth() &&
    date.getFullYear() === lastMonth.getFullYear();

  const isThisYear = date.getFullYear() === now.getFullYear();

  if (isToday) return "📅 Hoy";
  if (isYesterday) return "📆 Ayer";
  if (isThisMonth) return "🗓️ Este mes";
  if (isLastMonth) return "📉 Mes pasado";
  if (isThisYear) return "📘 Este año";
  return "📚 Años anteriores";
};

const KitchenScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("ordenado");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const fetchedOrders: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        const sortedOrders = fetchedOrders.sort((a, b) => {
          const dateA = a.createdAt?.toDate().getTime() || 0;
          const dateB = b.createdAt?.toDate().getTime() || 0;
          return dateB - dateA;
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => order.status === selectedStatus);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Cocina</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.radioGroup}>
        {states.map((state) => (
          <TouchableOpacity
            key={state}
            style={[
              styles.radioButton,
              selectedStatus === state && styles.selectedRadio,
            ]}
            onPress={() => setSelectedStatus(state)}
          >
            <Text
              style={[
                styles.radioText,
                selectedStatus === state && styles.radioTextSelected,
              ]}
            >
              {state}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredOrders.length === 0 ? (
        <Text style={styles.emptyText}>No hay órdenes en este estado.</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => router.push(`/user/order-summary?orderId=${item.id}`)}
            >
              <Text style={styles.orderTitle}>
                {getTableEmoji(item.table)} Mesa: {item.table}
              </Text>
              <Text style={styles.orderStatus}>Estado: {item.status}</Text>
              <Text style={styles.dateText}>{getDateLabel(item.createdAt)}</Text>
              <Text style={styles.itemsLabel}>Platos:</Text>
              {item.items.map((dish, index) => (
                <Text key={index} style={styles.itemText}>
                  - {dish.title} x{dish.quantity}
                </Text>
              ))}
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
    backgroundColor: "#1E1E2D",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 12,
  },
  radioButton: {
    width: 110, // ancho fijo
    height: 40, // alto fijo
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 20,
    marginRight: 8,
  },
  selectedRadio: {
    backgroundColor: "#FFD700",
  },
  radioText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  radioTextSelected: {
    color: "#000",
  },
  emptyText: {
    color: "#CCC",
    textAlign: "center",
    marginTop: 50,
  },
  orderCard: {
    backgroundColor: "#2E2E3E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  orderStatus: {
    color: "#ccc",
  },
  dateText: {
    fontStyle: "italic",
    color: "#aaa",
    marginBottom: 8,
  },
  itemsLabel: {
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  itemText: {
    color: "#ccc",
    marginLeft: 10,
  },
});

export default KitchenScreen;
