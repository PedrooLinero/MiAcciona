import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  TextInput,
  View,
  Alert,
} from "react-native";
import { Appbar, Button, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import { Box, Text } from "@gluestack-ui/themed";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView } from "react-native-gesture-handler";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

type RootStackParamList = {
  Home: undefined;
  Incidencia: undefined;
  Ausencia: undefined;
  PantallaPerfil: undefined;
};
type HomeScreenProp = StackNavigationProp<RootStackParamList, "Home">;

function PantallaCombinada() {
  const [modalVisible, setModalVisible] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width / 2)
  ).current;

  const windowWidth = Dimensions.get("window").width;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [nif, setNif] = useState("");
  const [password, setPassword] = useState("");

  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [loginSuccess, setLoginSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [biometricData, setBiometricData] = useState({});

  const navigation = useNavigation<HomeScreenProp>();

  interface UserData {
    id: number;
    nombre: string;
    primer_apellido: string;
    rol: string;
    token?: string;
  }

  const playWelcomeSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sound/sonidoMensaje.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  };

  const playErrorSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sound/sonidoError.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  };

  const saveUserSession = async (userId, token) => {
    await SecureStore.setItemAsync("currentUserId", userId);
    await SecureStore.setItemAsync("userToken", token, {
      requireAuthentication: true, // Requiere autenticación biométrica para acceder
    });
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -Dimensions.get("window").width / 2 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    if (!nif || !password) {
      setErrorMessage("Debes ingresar tu NIF y contraseña");
      setShowError(true);
      playErrorSound();
      return;
    }
    setIsLoading(true);
    try {
      const resp = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nif, password }),
      });
      const data = await resp.json();
      if (resp.ok) {
        await AsyncStorage.setItem("usuarioId", data.datos.id.toString());
        await AsyncStorage.setItem("nif", nif);

        setUserData({
          id: data.datos.id,
          nombre: data.datos.nombre,
          primer_apellido: data.datos.primer_apellido,
          rol: data.datos.rol,
        });
        setWelcomeMessage(
          `¡Bienvenido, ${data.datos.nombre} ${data.datos.primer_apellido}!`
        );
        setModalVisible(false);
        setLoginSuccess(true);
      } else {
        setErrorMessage(data.mensaje || "Credenciales inválidas");
        setShowError(true);
        playErrorSound();
      }
    } catch (e) {
      setErrorMessage("No se pudo conectar al servidor");
      setShowError(true);
      playErrorSound();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loginSuccess && !modalVisible) {
      setShowWelcome(true);
      playWelcomeSound();
      setTimeout(() => {
        setShowWelcome(false);
        setLoginSuccess(false);
      }, 3001);
    }
  }, [loginSuccess, modalVisible]);

  const handleLogout = async () => {
    try {
      console.log("Iniciando cierre de sesión...");
      await AsyncStorage.multiRemove(["usuarioId", "token"]);
      console.log("Datos eliminados");

      setUserData(null);
      setNif("");
      setPassword("");
      setShowWelcome(false);
      console.log("Estado reseteado");

      setMenuVisible(false);
      setModalVisible(true);
      console.log("Modal de inicio de sesión visible");
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  // const loginWithBiometrics = async () => {
  //   try {
  //     // Verificar si el dispositivo soporta autenticación biométrica
  //     const hasHardware = await LocalAuthentication.hasHardwareAsync();
  //     if (!hasHardware) {
  //       Alert.alert(
  //         "Error",
  //         "Este dispositivo no soporta autenticación biométrica."
  //       );
  //       console.error("No hay hardware biométrico disponible");
  //       return;
  //     }

  //     // Verificar si hay credenciales biométricas registradas
  //     const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  //     if (!isEnrolled) {
  //       Alert.alert(
  //         "Error",
  //         "No hay credenciales biométricas registradas en el dispositivo."
  //       );
  //       console.error("No hay credenciales biométricas registradas");
  //       return;
  //     }

  //     // Intentar autenticación biométrica
  //     const result = await LocalAuthentication.authenticateAsync({
  //       promptMessage: "Autenticación biométrica",
  //       fallbackLabel: "Usar contraseña",
  //     });

  //     console.log("Resultado de la autenticación:", result);

  //     if (result.success) {
  //       const storedNif = await AsyncStorage.getItem("nif");
  //       if (!storedNif) {
  //         Alert.alert(
  //           "Error",
  //           "No se encontró NIF en memoria. Inicia sesión manualmente al menos una vez."
  //         );
  //         return;
  //       }

  //       const resp = await fetch("http://localhost:3001/api/login", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ nif: storedNif, huella: true }),
  //       });
  //       const data = await resp.json();

  //       if (resp.ok) {
  //         setUserData({
  //           id: data.datos.Idusuario,
  //           nombre: data.datos.nombre,
  //           primer_apellido: data.datos.primer_apellido,
  //           rol: data.datos.rol,
  //         });
  //         setModalVisible(false);
  //         setWelcomeMessage(
  //           `¡Bienvenido de nuevo, ${data.datos.nombre} ${data.datos.primer_apellido}!`
  //         );
  //         setShowWelcome(true);
  //         playWelcomeSound();
  //       } else {
  //         Alert.alert("Error", "No se pudo obtener el usuario.");
  //       }
  //     } else {
  //       Alert.alert("Cancelado", "No se pudo autenticar.");
  //     }
  //   } catch (e) {
  //     console.error("Error en autenticación biométrica:", e);
  //     Alert.alert(
  //       "Error",
  //       "Ocurrió un error durante la autenticación biométrica."
  //     );
  //   }
  // };

  const loginWithBiometrics = async () => {
    try {
      const storedNif = await AsyncStorage.getItem("nif");
      if (!storedNif) {
        Alert.alert(
          "Error",
          "No se encontró NIF en memoria. Inicia sesión manualmente al menos una vez."
        );
        return;
      }

      // Obtener datos del usuario incluyendo activo_biometria
      const resp = await fetch(
        `http://localhost:3001/api/usuarios/${storedNif}`
      );
      const data = await resp.json();

      if (!resp.ok || !data.datos) {
        Alert.alert(
          "Error",
          "No se pudo verificar la configuración biométrica."
        );
        return;
      }

      if (!data.datos.activo_biometria) {
        Alert.alert(
          "Biometría no activada",
          "Este usuario no tiene activada la autenticación por huella."
        );
        return;
      }

      // Verificar hardware y credenciales biométricas
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert(
          "Error",
          "Este dispositivo no soporta autenticación biométrica."
        );
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert("Error", "No hay credenciales biométricas registradas.");
        return;
      }

      // Autenticación biométrica
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación biométrica",
        fallbackLabel: "Usar contraseña",
      });

      if (result.success) {
        const loginResp = await fetch("http://localhost:3001/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nif: storedNif, huella: true }),
        });

        const loginData = await loginResp.json();
        if (loginResp.ok) {
          setUserData({
            id: loginData.datos.Idusuario,
            nombre: loginData.datos.nombre,
            primer_apellido: loginData.datos.primer_apellido,
            rol: loginData.datos.rol,
          });
          setModalVisible(false);
          setWelcomeMessage(
            `¡Bienvenido de nuevo, ${loginData.datos.nombre} ${loginData.datos.primer_apellido}!`
          );
          setShowWelcome(true);
          playWelcomeSound();
        } else {
          Alert.alert("Error", "No se pudo iniciar sesión con huella.");
        }
      } else {
        Alert.alert("Cancelado", "No se pudo autenticar.");
      }
    } catch (e) {
      console.error("Error en autenticación biométrica:", e);
      Alert.alert(
        "Error",
        "Ocurrió un error durante la autenticación biométrica."
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <Box style={{ flex: 1 }}>
        {/* Modal de Login */}
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View
              style={[styles.modalContainer, { width: windowWidth * 0.85 }]}
            >
              <View style={styles.header}>
                <Image
                  source={require("./../../assets/adaptive-icon.png")}
                  style={styles.modalLogo}
                />
                <Text style={styles.modalTitle}>MiAcciona</Text>
              </View>
              <Snackbar
                visible={showError}
                onDismiss={() => setShowError(false)}
                duration={3000}
                style={styles.errorSnackbar}
              >
                {errorMessage}
              </Snackbar>
              <TextInput
                style={styles.input}
                placeholder="NIF"
                placeholderTextColor="#B0B0B0"
                value={nif}
                onChangeText={setNif}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                placeholderTextColor="#B0B0B0"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Cargando..." : "Iniciar sesión"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={loginWithBiometrics}
              >
                <Text style={styles.buttonText}>Iniciar con Huella</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Contenido principal */}
        {!modalVisible && (
          <>
            {/* Appbar */}
            <Appbar.Header style={styles.appbar}>
              <Appbar.Action icon="menu" color="white" onPress={toggleMenu} />
              <Appbar.Content
                title="MiAcciona"
                titleStyle={styles.title}
                style={styles.appbarTitle}
              />
              {userData && (
                <View style={styles.userContainer}>
                  <Text style={styles.userTitle}>
                    {`${userData.nombre} ${userData.primer_apellido}`}
                  </Text>
                </View>
              )}
              <Appbar.Action
                icon="account"
                color="white"
                onPress={() => navigation.navigate("PantallaPerfil")}
              />
            </Appbar.Header>

            <Modal visible={menuVisible} transparent animationType="none">
              <View style={styles.menuOverlay}>
                <Animated.View
                  style={[
                    styles.menuContainer,
                    { transform: [{ translateX: slideAnim }] },
                  ]}
                >
                  <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle}>Menú</Text>
                    <TouchableOpacity onPress={toggleMenu}>
                      <Text style={styles.closeButton}>X</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menuItemsContainer}>
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={handleLogout}
                    >
                      <Text style={styles.menuButtonText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                    {/* Espacio en blanco para ítems futuros */}
                    <View style={styles.menuSpacer} />
                  </View>
                </Animated.View>
                <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
              </View>
            </Modal>

            <View style={styles.logoContainer}>
              <Image
                source={require("./../../assets/Logo_aplicacion.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>¡Bienvenido a MiAcciona!</Text>
              <Text style={styles.welcomeSubtitle}>
                Gestiona tus incidencias, reportes y vacaciones de manera
                eficiente.
              </Text>
            </View>
            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
              <View style={styles.quickActions}>
                <Button
                  mode="contained"
                  icon="alert-circle"
                  style={[
                    styles.quickActionButton,
                    { width: windowWidth * 0.4 },
                  ]}
                  labelStyle={styles.quickActionButtonLabel}
                  contentStyle={styles.quickActionButtonContent}
                  onPress={() => navigation.navigate("Incidencia")}
                >
                  Incidencia
                </Button>
                <Button
                  mode="contained"
                  icon="calendar"
                  style={[
                    styles.quickActionButton,
                    { width: windowWidth * 0.4 },
                  ]}
                  labelStyle={styles.quickActionButtonLabel}
                  contentStyle={styles.quickActionButtonContent}
                  onPress={() => navigation.navigate("Ausencia")}
                >
                  Ausencia
                </Button>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>Acerca de MiAcciona</Text>
              <Text style={styles.infoText}>
                MiAcciona es tu herramienta para simplificar la gestión diaria
                en Acciona. Reporta incidencias, consulta reportes, planifica
                tus vacaciones... desde un solo lugar.
              </Text>
              <Button
                mode="contained"
                style={styles.infoButton}
                labelStyle={styles.infoButtonLabel}
                contentStyle={styles.infoButtonContent}
              >
                Saber más
              </Button>
            </View>
          </>
        )}

        <Snackbar
          visible={showWelcome}
          onDismiss={() => setShowWelcome(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {welcomeMessage}
        </Snackbar>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente para atenuar el contenido detrás
  },
  menuContainer: {
    width: "50%", // Ocupa la mitad del ancho (mitad izquierda)
    height: "100%", // Ocupa toda la altura
    backgroundColor: "#fff",
    position: "absolute",
    left: 0, // Alineado a la izquierda
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D50032",
  },
  menuItemsContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  menuButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  menuSpacer: {
    flex: 1, // Ocupa el resto del espacio en blanco dentro del contenedor
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Debajo del menú para que se pueda tocar y cerrar
  },
  modalContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  modalLogo: {
    width: 30,
    height: 50,
    marginRight: 8,
    marginVertical: 5,
  },
  modalTitle: {
    fontWeight: "700",
    color: "#333",
    fontFamily: "Roboto",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    color: "#333",
    backgroundColor: "#F5F5F5",
  },
  button: {
    backgroundColor: "#D50032",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D50032",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    letterSpacing: 1,
  },
  appbar: {
    backgroundColor: "#D50032",
    flexDirection: "row",
    alignItems: "center",
  },
  appbarTitle: {
    marginLeft: 10,
  },
  userTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    textAlign: "right",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  logoContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  logo: {
    width: 450,
    height: 150,
    resizeMode: "contain",
    alignItems: "center",
  },
  welcomeContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  userContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 5,
  },
  snackbar: {
    backgroundColor: "#D50032",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignSelf: "center",
    zIndex: 1000,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "95%",
    marginLeft: 10,
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  infoButton: {
    backgroundColor: "#D50032",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  infoButtonContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  infoButtonLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
  quickActionsContainer: {
    marginBottom: 40,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    alignContent: "center",
    textAlign: "center",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    flexWrap: "wrap",
  },
  quickActionButton: {
    backgroundColor: "#D50032",
    borderRadius: 12,
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  quickActionButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    flexShrink: 1,
    textAlign: "center",
  },
  errorSnackbar: {
    backgroundColor: "#FF4444",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 20,
    padding: 10,
    marginTop: 40,
    marginHorizontal: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignSelf: "center",
    zIndex: 20,
  },
});

export default PantallaCombinada;
