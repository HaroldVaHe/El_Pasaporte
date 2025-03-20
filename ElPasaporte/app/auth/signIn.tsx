import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../../context/authContext/authContext";
import { useRouter } from "expo-router";

const signIn = () => {
  const { login, error } = useContext(AuthContext)!;
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso al Sistema POS</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={() => login(email, password)}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.push("/auth/signUp") }>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default signIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1E1E2D", // Fondo oscuro
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F8F8F8",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#575757",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#222",
    color: "#FFF",
  },
  button: {
    backgroundColor: "#FFAA00", // Amarillo POS
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#1E1E2D",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: "#FFAA00",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});