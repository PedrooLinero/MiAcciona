import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Appbar,
  Button,
  Snackbar,
  TextInput,
  Divider,
} from "react-native-paper";
import { Box, Text } from "@gluestack-ui/themed";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Home: undefined;
  Vacaciones: undefined;
};

type VacacionesScreenProp = StackNavigationProp<
  RootStackParamList,
  "Vacaciones"
>;

const windowWidth = Dimensions.get("window").width;

export default function PantallaAusencia() {
  const navigation = useNavigation<VacacionesScreenProp>();

  const [tipoList, setTipoList] = useState<
    Array<{ id_tipo: number; nombre: string }>
  >([]);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [user, setUser] = useState<{
    Idusuario: number;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    nif: string;
    email: string;
    diasPermitidos: number | null; // Añadimos diasPermitidos al tipo
  } | null>(null);

  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const tiposRes = await fetch("http://localhost:3000/api/tipoAusencia");
        const tiposJson = await tiposRes.json();
        const tiposData = Array.isArray(tiposJson) ? tiposJson : tiposJson.data;
        setTipoList(tiposData);
      } catch (err) {
        console.error("Error cargando tipos de ausencia:", err);
      } finally {
        setLoadingTipos(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const nif = await AsyncStorage.getItem("nif");
        if (!nif) throw new Error("No se encontró NIF en almacenamiento");
        const res = await fetch(`http://localhost:3000/api/usuarios/${nif}`, {
          credentials: "include",
        });
        const json = await res.json();
        const datos = json.datos ?? json.data ?? json;
        setUser(datos);
      } catch (err) {
        console.error("Error cargando datos de usuario:", err);
      }
    })();
  }, []);

  const handleSubmit = () => {
    if (
      !tipoSeleccionado ||
      !titulo ||
      !descripcion ||
      !fechaInicio ||
      !fechaFin
    ) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTipoSeleccionado(null);
      setTitulo("");
      setDescripcion("");
      setFechaInicio("");
      setFechaFin("");
    }, 1500);
  };

  if (loadingTipos || !user) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Box style={{ flex: 1 }}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action
            icon="arrow-left"
            color="white"
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            title="Solicitar Ausencia"
            titleStyle={styles.title}
            style={{ marginLeft: 0 }}
          />
          {/* Añadimos los días permitidos a la derecha */}
          <Text style={styles.diasPermitidos}>
            Días restantes: {user.diasPermitidos ?? "N/A"}
          </Text>
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Nueva Solicitud</Text>

            {/* Botones para seleccionar el tipo de ausencia */}
            <View style={styles.tipoButtonContainer}>
              {tipoList.map((t) => (
                <Button
                  key={t.id_tipo}
                  mode="outlined"
                  onPress={() => setTipoSeleccionado(t.id_tipo)}
                  style={[
                    styles.tipoButton,
                    tipoSeleccionado === t.id_tipo && styles.selectedButton,
                  ]}
                  labelStyle={[
                    styles.tipoButtonLabel,
                    tipoSeleccionado === t.id_tipo && styles.selectedButtonLabel,
                  ]}
                  contentStyle={styles.tipoButtonContent}
                >
                  {t.nombre}
                </Button>
              ))}
            </View>

            <Divider style={{ marginBottom: 12 }} />

            <TextInput
              label="Nombre"
              value={user.nombre}
              disabled
              style={styles.input}
            />
            <TextInput
              label="Primer Apellido"
              value={user.primer_apellido}
              disabled
              style={styles.input}
            />
            <TextInput
              label="Segundo Apellido"
              value={user.segundo_apellido || ""}
              disabled
              style={styles.input}
            />
            <TextInput
              label="DNI"
              value={user.nif}
              disabled
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={user.email}
              disabled
              style={styles.input}
            />

            <TextInput
              label="Título"
              value={titulo}
              onChangeText={setTitulo}
              style={styles.input}
            />
            <TextInput
              label="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
              style={[styles.input, { height: 100 }]}
            />
            <TextInput
              label="Fecha Inicio (YYYY-MM-DD)"
              value={fechaInicio}
              onChangeText={setFechaInicio}
              style={styles.input}
            />
            <TextInput
              label="Fecha Fin (YYYY-MM-DD)"
              value={fechaFin}
              onChangeText={setFechaFin}
              style={styles.input}
            />

            <Button
              mode="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={handleSubmit}
              contentStyle={{ paddingVertical: 6 }}
              style={[styles.submitButton, { width: windowWidth * 0.9 }]}
              labelStyle={styles.submitLabel}
            >
              Enviar Solicitud
            </Button>
          </View>
        </ScrollView>

        <Snackbar
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          style={styles.snackbar}
        >
          ¡Solicitud enviada con éxito!
        </Snackbar>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "#D50032",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Para alinear el texto a la derecha
    paddingRight: 16, // Espacio a la derecha para el texto
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  diasPermitidos: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingVertical: 20,
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: windowWidth * 0.9,
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    marginBottom: 14,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
  },
  submitButton: {
    backgroundColor: "#D50032",
    borderRadius: 20,
    marginTop: 8,
    justifyContent: "center",
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
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
  tipoButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  tipoButton: {
    margin: 6,
    width: windowWidth * 0.35,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#D50032",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  selectedButton: {
    backgroundColor: "#D50032",
    borderColor: "#D50032",
  },
  tipoButtonContent: {
    paddingHorizontal: 10,
  },
  tipoButtonLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D50032",
    textAlign: "center",
  },
  selectedButtonLabel: {
    color: "#FFFFFF",
  },
});