import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { app } from "../../utils/FirebaseConfig";
import { formatDistanceStrict, formatDistanceToNow } from "date-fns";

import { es } from "date-fns/locale";


const formatElapsedTime = (from: Date, to: Date): string => {
    const diffMs = to.getTime() - from.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    let result = "hace ";
    if (minutes > 0) result += `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    if (minutes > 0 && seconds > 0) result += " y ";
    if (seconds > 0) result += `${seconds} ${seconds === 1 ? "segundo" : "segundos"}`;
    if (minutes === 0 && seconds === 0) result += "0 segundos";
  
    return result;
  };
  
const db = getFirestore(app);

interface Order {
    id: string;
    table: string;
    items: { title: string; quantity: number }[];
    total: number;
    status: string;
    createdAt: any;
}

const OrdersSummary: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState<Date>(new Date());


    const fetchOrders = async () => {
        try {
            const ordersRef = collection(db, "orders");
            const q = query(
                ordersRef,
                where("status", "in", ["ordenado", "Cocinando"]),
                orderBy("createdAt", "asc")
            );
            const querySnapshot = await getDocs(q);
            const ordersList: Order[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Order[];
            setOrders(ordersList);
        } catch (error) {
            console.error("Error al obtener órdenes:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });
            Alert.alert("✅ Éxito", `Estado actualizado a "${newStatus}"`);
            fetchOrders();

            // ⏱ Transición automática según el nuevo estado
            if (newStatus === "Listo") {
                // Cambiar a "Entregado" después de 5 segundos
                setTimeout(async () => {
                    try {
                        await updateDoc(orderRef, { status: "Entregado" });
                        fetchOrders();

                        // Luego de otros 5 segundos, cambiar a "Pagar"
                        setTimeout(async () => {
                            try {
                                await updateDoc(orderRef, { status: "Pagar" });
                                fetchOrders();
                            } catch (error) {
                                console.error("Error actualizando a Pagar:", error);
                            }
                        }, 5000);

                    } catch (error) {
                        console.error("Error actualizando a Entregado:", error);
                    }
                }, 5000);
            }
        } catch (error) {
            console.error("Error actualizando el estado:", error);
            Alert.alert("❌ Error", "No se pudo actualizar el estado.");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000); // cada 30 segundos

        return () => clearInterval(interval); // limpieza al desmontar
    }, []);


    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FFAA00" />
                <Text style={styles.loadingText}>Cargando órdenes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📋 Órdenes pendientes</Text>
            {orders.length === 0 ? (
                <Text style={styles.message}>No hay órdenes actualmente.</Text>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.orderItem,
                                item.status === "ordenado" && { borderColor: "#FFEB3B", borderWidth: 2 },
                            ]}
                        >
                            <Text style={styles.orderText}>
                                <Text style={styles.bold}>Mesa:</Text> {item.table}{"\n"}
                                {/* <Text style={styles.bold}>Total:</Text> ${item.total} */}
                                <Text style={styles.bold}>Estado:</Text> {item.status}{"\n"}
                                <Text style={{ color: "#ccc", fontSize: 12 }}>
                                    Creado {formatElapsedTime(new Date(item.createdAt.seconds * 1000), now)}
                                </Text>

                            </Text>
                            {/* 🆕 Etiqueta visual para nuevas órdenes */}
                            {item.status === "ordenado" && (
                                <Text style={{ color: "#FFEB3B", fontWeight: "bold", marginTop: 5 }}>
                                    🆕 Nueva orden
                                </Text>
                            )}
                            <Text style={styles.itemsText}>
                                <Text style={styles.bold}>Items:</Text>
                            </Text>
                            {item.items.map((product, idx) => (
                                <Text key={idx} style={styles.productText}>
                                    - {product.title} (x{product.quantity})
                                </Text>
                            ))}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.statusButton, { backgroundColor: "#FF9800" }]}
                                    onPress={() => updateStatus(item.id, "Cocinando")}
                                >
                                    <Text style={styles.buttonText}>Cocinando</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.statusButton, { backgroundColor: "#4CAF50" }]}
                                    onPress={() => updateStatus(item.id, "Listo")}
                                >
                                    <Text style={styles.buttonText}>Listo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#6b1554",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6b1554",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#FFC107",
    },
    message: {
        fontSize: 16,
        color: "#ccc",
    },
    orderItem: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: "#2A2A3A",
        borderRadius: 10,
    },
    orderText: {
        fontSize: 16,
        color: "#fff",
    },
    itemsText: {
        fontSize: 14,
        color: "#ddd",
        marginTop: 4,
    },
    productText: {
        fontSize: 14,
        color: "#ccc",
        marginLeft: 10,
    },
    bold: {
        fontWeight: "bold",
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statusButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14,
    },
});

export default OrdersSummary;
