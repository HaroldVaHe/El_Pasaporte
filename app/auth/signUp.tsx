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
  const [userType, setUserType] = useState<"client" | "Otro">("client");
  const [specialPassword, setSpecialPassword] = useState("");

  const SPECIAL_KEY_CHEF = "Chefsito123";
  const SPECIAL_KEY_CASHIER = "Cashier123";

  const handleRegister = async () => {
    if (!register || !setError) return;
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    let role: "client" | "chef" | "cashier" = "client";
    if (userType === "Otro") {
      if (specialPassword === SPECIAL_KEY_CHEF) {
        role = "chef";
      } else if (specialPassword === SPECIAL_KEY_CASHIER) {
        role = "cashier";
      } else {
        setError("Contraseña de autorización incorrecta");
        return;
      }
    }
    await register({
      name: email.split("@")[0], // Tomar el nombre a partir del email (puedes modificarlo si necesitas un campo de nombre explícito)
      email,
      password,
      role,
    });
    switch (role) {
      case "client":
        router.push("../user/homeScreen");
        break;
      case "chef":
        router.push("../chef/homeScreen");
        break;
      case "cashier":
        router.push("../cashier/homeScreen");
        break;
      default:
        setError("Rol no válido");
    }
  };
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1E2D",
        padding: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#fff",
      },
      input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#555",
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: "#222",
        color: "#fff",
        marginBottom: 15,
      },
      button: {
        width: "100%",
        height: 50,
        backgroundColor: "#FFAA00",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      },
      buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
      },
      link: {
        marginTop: 15,
        color: "#FFC107",
      },
      error: {
        color: "red",
        marginBottom: 10,
      },
      radioContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
      },
      radioButton: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
      },
      radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#FFC107",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
      },
      radioSelected: {
        backgroundColor: "#FFC107",
        width: 12,
        height: 12,
        borderRadius: 6,
      },
      radioText: {
        color: "#fff",
      },
    });


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


        {/* Radio Buttons */}
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setUserType("client")}
          >
            <View style={[styles.radioCircle, userType === "client" && styles.radioSelected]} />
            <Text style={styles.radioText}>Usuario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setUserType("Otro")}
          >
            <View style={[styles.radioCircle, userType === "Otro" && styles.radioSelected]} />
            <Text style={styles.radioText}>Otro</Text>
          </TouchableOpacity>
        </View>

        {/* Input adicional si el usuario selecciona "Otro" */}
        {userType === "Otro" && (
          <TextInput
            style={styles.input}
            placeholder="Contraseña especial"
            placeholderTextColor="#ccc"
            value={specialPassword}
            onChangeText={setSpecialPassword}
            secureTextEntry
          />
        )}

        {/* Botón de registro */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/signIn")}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }
;



export default SignupScreen;
