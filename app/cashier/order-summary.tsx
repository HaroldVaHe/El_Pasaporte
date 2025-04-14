import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
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

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const orderData = snapshot.data();
          console.log("Estado actual de la orden:", orderData.status); // 👈 Debug opcional
          setOrder(orderData);
        } else {
          console.warn("Orden no encontrada");
          setOrder(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error en tiempo real al obtener la orden:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  };

  const totalConImpuesto = order ? order.total * 1.15 : 0;

  const marcarComoPagado = async () => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "pagado" });
      Alert.alert("✅ Orden pagada", "La orden fue marcada como pagada.");
    } catch (error) {
      console.error("Error al marcar como pagado:", error);
      Alert.alert("❌ Error", "No se pudo marcar la orden como pagada.");
    }
  };

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
      <Text style={styles.subtitle}>📅 Fecha: {formatDate(order.createdAt)}</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            )}
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemText}>Cantidad: {item.quantity}</Text>
            <Text style={styles.itemText}>Subtotal: ${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        )}
        ListFooterComponent={
          <View>
            <Text style={styles.totalText}>Subtotal: ${order.total.toFixed(2)}</Text>
            <Text style={styles.totalText}>+ 15% impuestos</Text>
            <Text style={styles.totalText}>
              💵 Total con impuestos: ${totalConImpuesto.toFixed(2)}
            </Text>
          </View>
        }
      />

      {order.status?.toLowerCase?.() === "pagar" && (
        <TouchableOpacity style={styles.payButton} onPress={marcarComoPagado}>
          <Text style={styles.payButtonText}>✅ Marcar como Pagado</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>⬅️ Volver</Text>
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
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "right",
  },
  payButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 15,
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
