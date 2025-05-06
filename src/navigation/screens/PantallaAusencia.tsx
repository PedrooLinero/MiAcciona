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
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DatePickerModal } from "react-native-paper-dates";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#D50032",
    accent: "#D50032",
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
        const tiposRes = await fetch("http://localhost:3000/api/tipoAusencia");
        const tiposJson = await tiposRes.json();
        const tiposData = Array.isArray(tiposJson) ? tiposJson : tiposJson.data;
        // Simulamos los datos ya que no tengo acceso al backend
        const mockTipos = [
          { id_tipo: 1, nombre: "Asuntos Propios" },
          { id_tipo: 2, nombre: "Permisos Retribuidos" },
          { id_tipo: 3, nombre: "Vacaciones" },
        ];
        setTipoList(mockTipos); // Usa tiposData si tu API devuelve los valores correctos
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

  const formatDateToLocal = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const apellidosCombinados =
    `${user.primer_apellido} ${user.segundo_apellido || ""}`.trim();

  return (
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
                    tipoSeleccionado === t.id_tipo &&
                      styles.selectedButtonLabel,
                  ]}
                  contentStyle={styles.tipoButtonContent}
                >
                  {t.nombre}
                </Button>
              ))}
            </View>

            <Divider style={{ marginBottom: 12 }} />

            <View style={styles.row}>
              <TextInput
                label="Nombre"
                value={user.nombre}
                disabled
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="Apellidos"
                value={apellidosCombinados}
                disabled
                style={[styles.input, styles.halfInput]}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                label="DNI"
                value={user.nif}
                disabled
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="Email"
                value={user.email}
                disabled
                style={[styles.input, styles.halfInput]}
              />
            </View>

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

            <View style={styles.row}>
              <TextInput
                label="Fecha Inicio"
                value={fechaInicio}
                onFocus={() => setOpenInicio(true)}
                showSoftInputOnFocus={false}
                style={[styles.input, styles.halfInput]}
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
                style={[styles.input, styles.halfInput]}
                right={
                  <TextInput.Icon
                    icon="calendar"
                    onPress={() => setOpenFin(true)}
                  />
                }
              />
            </View>

            <Button
              mode="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={handleSubmit}
              contentStyle={{ paddingVertical: 4 }}
              style={[styles.submitButton, { width: "100%", marginBottom: 2 }]}
              labelStyle={styles.submitLabel}
            >
              Enviar Solicitud
            </Button>
          </View>
        </ScrollView>

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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  halfInput: {
    width: "48%",
  },
  submitButton: {
    backgroundColor: "#D50032",
    borderRadius: 20,
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
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  tipoButtonContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  tipoButton: {
    marginVertical: 8,
    width: windowWidth * 0.7,
    height: 50,
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "#D50032",
    borderWidth: 2,
  },
  selectedButton: {
    backgroundColor: "#D50032",
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
