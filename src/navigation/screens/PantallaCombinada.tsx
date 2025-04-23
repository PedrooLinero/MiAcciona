import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Animated,
  TextInput,
  View,
} from "react-native";
import { Appbar, Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Box, Text, Input, InputField, VStack, HStack } from "@gluestack-ui/themed";

function PantallaCombinada() {
  const [modalVisible, setModalVisible] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250));
  const windowWidth = Dimensions.get("window").width;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-50 dark:bg-background-950">
      <Box className="flex-1">
        {/* Modal de Login */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={[styles.modalContainer, { width: windowWidth * 0.85 }]}>
              <View style={styles.header}>
                <Image
                  source={require("./../../assets/adaptive-icon.png")} // Asegúrate de que esta ruta sea correcta
                  style={styles.modalLogo}
                />
                <Text style={styles.modalTitle}>MiAcciona</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Usuario"
                placeholderTextColor="#B0B0B0"
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                placeholderTextColor="#B0B0B0"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)} // Oculta el modal al "iniciar sesión"
              >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
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
              <Appbar.Content title="MiAcciona" titleStyle={styles.title} />
              <Appbar.Action icon="account" color="white" />
            </Appbar.Header>

            {/* Menú deslizante */}
            <Modal visible={menuVisible} transparent animationType="none">
              <View style={styles.menuOverlay}>
                <Animated.View
                  style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}
                >
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Incidencias</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Reportes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Vacaciones</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Notificaciones</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Soporte</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Documentos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Cerrar Sesión</Text>
                  </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
              </View>
            </Modal>

{/* Contenido principal */}
<ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("./../../assets/Logo_aplicacion.png")} // Asegúrate de que esta ruta sea correcta
                  style={styles.logo}
                />
              </View>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>¡Bienvenido a MiAcciona!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Gestiona tus incidencias, reportes y vacaciones de manera eficiente.
                </Text>
              </View>
              <View style={styles.quickActionsContainer}>
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.quickActions}>
                  <Button
                    mode="contained"
                    icon="alert-circle"
                    style={[styles.quickActionButton, { width: windowWidth * 0.4 }]}
                    labelStyle={styles.quickActionButtonLabel}
                    contentStyle={styles.quickActionButtonContent}
                  >
                    Incidencia
                  </Button>
                  <Button
                    mode="contained"
                    icon="calendar"
                    style={[styles.quickActionButton, { width: windowWidth * 0.4 }]}
                    labelStyle={styles.quickActionButtonLabel}
                    contentStyle={styles.quickActionButtonContent}
                  >
                    Vacaciones
                  </Button>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Acerca de MiAcciona</Text>
                <Text style={styles.infoText}>
                  MiAcciona es tu herramienta para simplificar la gestión diaria en
                  Acciona. Reporta incidencias, consulta reportes, planifica tus
                  vacaciones... desde un solo lugar.
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
            </ScrollView>
          </>
        )}
      </Box>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // Estilos del modal de login (PantallaBienvenida)
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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

  // Estilos de PantallaPrincipal
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  appbar: {
    backgroundColor: "#D50032",
  },
  title: {
    color: "white",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  menuContainer: {
    width: 250,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: "100%",
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  logoContainer: {
    marginVertical: 20,
  },
  logo: {
    width: 450,
    height: 150,
    resizeMode: "contain",
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
  quickActionsContainer: {
    marginBottom: 40,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
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
    paddingHorizontal: 15, // Aumentado para más espacio
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centra el contenido (ícono + texto)
  },
  quickActionButtonLabel: {
    fontSize: 14, // Aumentado de 12 a 14
    fontWeight: "600",
    color: "#FFF",
    flexShrink: 1,
    textAlign: "center", // Asegura que el texto esté centrado
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
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
    fontSize: 18, // Aumentado de 16 a 18
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center", // Asegura que el texto esté centrado
  },
});

export default PantallaCombinada;