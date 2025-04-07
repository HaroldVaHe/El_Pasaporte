import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList, StatusBar } from "react-native";
import { useRouter } from "expo-router";

const foodImages = [
  { id: "1", uri: "https://source.unsplash.com/400x300/?sushi,food" },
  { id: "2", uri: "https://source.unsplash.com/400x300/?pasta,italian" },
  { id: "3", uri: "https://source.unsplash.com/400x300/?paella,spanish" },
  { id: "4", uri: "https://source.unsplash.com/400x300/?steak,food" },
  { id: "5", uri: "https://source.unsplash.com/400x300/?indian,food" },
];

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Ajuste dinámico para evitar que el contenido se sobreponga con la barra de estado */}
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: "https://source.unsplash.com/600x400/?restaurant,dining" }}
          style={styles.headerImage}
        />

        <Text style={styles.title}>Bienvenido a **El Pasaporte**</Text>

        <Text style={styles.description}>
          🍽️ **El Pasaporte** es mucho más que un restaurante, es una experiencia gastronómica que te 
          transporta a diferentes rincones del mundo a través de los sabores más auténticos.  
          
          🌍 Con **5 estrellas Michelin**, somos el destino favorito de los amantes de la buena comida, 
          aquellos que buscan calidad, autenticidad y un viaje culinario sin salir de su mesa.  

          🏆 Cada plato ha sido elaborado con recetas originales, ingredientes frescos y técnicas 
          tradicionales que capturan la esencia de cada cultura. 

          🔥 En **El Pasaporte**, podrás disfrutar desde un **sushi artesanal japonés**, un **filete jugoso argentino**, 
          hasta una **cremosa pasta italiana** o una **paella española perfectamente preparada**.
        </Text>

        <Text style={styles.subTitle}>🌟 Explora nuestra gastronomía</Text>

        <FlatList
          data={foodImages}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.imageCard}>
              <Image source={{ uri: item.uri }} style={styles.foodImage} />
            </View>
          )}
        />
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={() => router.push("./orders-sumamary")}>
        <Text style={styles.buttonText}>Ver Pedidos 🍽️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6b1554",
    paddingTop: StatusBar.currentHeight || 30, // Asegura que el contenido no quede muy arriba
  },
  scrollContent: {
    flexGrow: 1, // Permite que el contenido se expanda correctamente
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start", // Se asegura que el contenido empiece desde arriba
  },
  headerImage: {
    width: "100%",
    height: 200, // Se ajustó la altura para que no empuje el contenido demasiado abajo
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFC107",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "justify",
    marginBottom: 20,
    lineHeight: 24,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFAA00",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  imageCard: {
    backgroundColor: "#2A2A3A",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  foodImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#FFAA00",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
