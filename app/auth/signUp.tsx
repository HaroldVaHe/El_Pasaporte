import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../../context/authContext/authContext";
import { useRouter } from "expo-router";

const SignupScreen = () => {
  const { register, setError, error } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!register || !setError) return;
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    await register(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#ccc"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/signIn")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E2D", // Fondo negro
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // Texto blanco
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#222", // Fondo oscuro para inputs
    color: "#fff", // Texto blanco
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFAA00", // Amarillo POS
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#000", // Texto negro en el botón
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#FFC107", // Amarillo POS para el link
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignupScreen;
