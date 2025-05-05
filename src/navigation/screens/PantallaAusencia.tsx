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
  Provider as PaperProvider, // Importamos PaperProvider
  DefaultTheme, // Importamos el tema por defecto
} from "react-native-paper";
import { Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DatePickerModal } from "react-native-paper-dates";

// Definimos un tema personalizado
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#D50032", // Cambiamos el color primario a rojo
    accent: "#D50032", // Cambiamos el color de acento a rojo
  },
};

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
    diasPermitidos: number | null;
  } | null>(null);

  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [openInicio, setOpenInicio] = useState(false);
  const [openFin, setOpenFin] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const tiposRes = await fetch(
          "http://10.140.15.36:3000/api/tipoAusencia"
        );
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
        const res = await fetch(
          `http://10.140.15.36:3000/api/usuarios/${nif}`,
          {
            credentials: "include",
          }
        );
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

  const formatDateToLocal = (date: Date): string => {
    const offset: number = date.getTimezoneOffset() * 60000;
    const localDate: Date = new Date(date.getTime() - offset);
    return localDate.toISOString().split("T")[0];
  };

  return (
    // Envolvemos todo en PaperProvider con el tema personalizado
    <PaperProvider theme={customTheme}>
      <SafeAreaView style={styles.container}>
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
          <Text style={styles.diasPermitidos}>
            Días restantes: {user.diasPermitidos ?? "N/A"}
          </Text>
        </Appbar.Header>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Nueva Solicitud</Text>

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
              label="Fecha Inicio"
              value={fechaInicio}
              onFocus={() => setOpenInicio(true)}
              showSoftInputOnFocus={false}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon="calendar"
                  onPress={() => setOpenInicio(true)}
                />
              }
            />
            <TextInput
              label="Fecha Fin"
              value={fechaFin}
              onFocus={() => setOpenFin(true)}
              showSoftInputOnFocus={false}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon="calendar"
                  onPress={() => setOpenFin(true)}
                />
              }
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

            <View style={{ height: 200, backgroundColor: "transparent" }} />
          </View>
        </ScrollView>

        {/* Modal para Fecha Inicio */}
        <DatePickerModal
          locale="es"
          mode="single"
          visible={openInicio}
          onDismiss={() => setOpenInicio(false)}
          date={fechaInicio ? new Date(fechaInicio) : undefined}
          onConfirm={({ date }) => {
            setOpenInicio(false);
            if (date) {
              setFechaInicio(formatDateToLocal(date));
            }
          }}
          saveLabel="Guardar"
          label="Seleccionar fecha de inicio"
          animationType="slide"
        />

        {/* Modal para Fecha Fin */}
        <DatePickerModal
          locale="es"
          mode="single"
          visible={openFin}
          onDismiss={() => setOpenFin(false)}
          date={fechaFin ? new Date(fechaFin) : undefined}
          onConfirm={({ date }) => {
            setOpenFin(false);
            if (date) {
              setFechaFin(formatDateToLocal(date));
            }
          }}
          saveLabel="Guardar"
          label="Seleccionar fecha de fin"
          validRange={{
            startDate: fechaInicio ? new Date(fechaInicio) : undefined,
          }}
          animationType="slide"
        />

        <Snackbar
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          style={styles.snackbar}
        >
          ¡Solicitud enviada con éxito!
        </Snackbar>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  appbar: {
    backgroundColor: "#D50032",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
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
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: windowWidth * 0.9,
    alignSelf: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
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
    alignSelf: "center",
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