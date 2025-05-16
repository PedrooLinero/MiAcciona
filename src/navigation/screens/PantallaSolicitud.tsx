import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Appbar, Provider as PaperProvider, Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
  Incidencia: undefined;
  Ausencia: undefined;
  PantallaPerfil: undefined;
  PantallaSolicitud: undefined;
};

type SolicitudScreenProp = StackNavigationProp<
  RootStackParamList,
  "PantallaSolicitud"
>;

interface Solicitud {
  id_solicitud: number;
  usuario_id: number;
  gestor_id: number;
  tipo_ausencia_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado: "pendiente" | "aceptada" | "rechazada";
  created_at: string;
  usuario?: {
    nombre: string;
    primer_apellido: string;
    email: string;
    nif: string;
  };
  tipo_ausencia?: {
    nombre: string;
  };
}

const EstadoIndicator = ({
  estado,
}: {
  estado: "pendiente" | "aceptada" | "rechazada";
}) => {
  switch (estado) {
    case "aceptada":
      return (
        <View style={styles.estadoBox}>
          <View style={styles.estadoIconContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              size={16}
              color="#2E7D32"
            />
          </View>
          <Text style={[styles.estadoText, styles.aceptadaText]}>ACEPTADA</Text>
        </View>
      );
    case "rechazada":
      return (
        <View style={styles.estadoBox}>
          <View style={styles.estadoIconContainer}>
            <MaterialCommunityIcons
              name="close-circle"
              size={16}
              color="#D32F2F"
            />
          </View>
          <Text style={[styles.estadoText, styles.rechazadaText]}>
            RECHAZADA
          </Text>
        </View>
      );
    default:
      return (
        <View style={styles.estadoBox}>
          <View style={styles.estadoIconContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="#FF9800"
            />
          </View>
          <Text style={[styles.estadoText, styles.pendienteText]}>
            PENDIENTE
          </Text>
        </View>
      );
  }
};

const PantallaSolicitud: React.FC = () => {
  const navigation = useNavigation<SolicitudScreenProp>();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGestor, setIsGestor] = useState(false);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const nif = await AsyncStorage.getItem("nif");
        const rol = await AsyncStorage.getItem("rol");
        const id = await AsyncStorage.getItem("id");

        console.log("🔍 Storage:", { nif, rol, id });

        if (!nif || !rol) {
          console.warn("⚠️ Falta nif o rol en storage, no se hará fetch");
          setSolicitudes([]);
          return;
        }

        const gestor = rol.toLowerCase() === "gestor";
        setIsGestor(gestor);

        const url = gestor
          ? `http://localhost:3001/api/gestor/solicitudes/${parseInt(id!, 10)}`
          : `http://localhost:3001/api/solicitudes/${nif}`;

        const res = await fetch(url, { credentials: "include" });
        const json = await res.json();
        console.log("✅ Respuesta fetch:", json);
        setSolicitudes(json.datos || []);
      } catch (err) {
        console.error("Error cargando solicitudes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  const aceptarSolicitud = async (id_solicitud: number) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/gestor/solicitudes/${id_solicitud}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: "aceptada" }),
        }
      );
      const json = await res.json();
      if (json.ok) {
        setSolicitudes((prev) =>
          prev.map((s) =>
            s.id_solicitud === id_solicitud ? { ...s, estado: "aceptada" } : s
          )
        );
      }
    } catch (err) {
      console.error("Error aceptando solicitud:", err);
    }
  };

  const rechazarSolicitud = async (id_solicitud: number) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/gestor/solicitudes/${id_solicitud}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: "rechazada" }),
        }
      );
      const json = await res.json();
      if (json.ok) {
        setSolicitudes((prev) =>
          prev.map((s) =>
            s.id_solicitud === id_solicitud ? { ...s, estado: "rechazada" } : s
          )
        );
      }
    } catch (err) {
      console.error("Error rechazando solicitud:", err);
    }
  };

  const handleEditarSolicitud = (id_solicitud: number) => {
    // Lógica de edición futura
    console.log("Editar solicitud:", id_solicitud);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#D50032" />
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

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
            title={isGestor ? "Solicitudes de Usuarios" : "Mis Solicitudes"}
            titleStyle={styles.title}
            style={{ marginLeft: 0 }}
          />
        </Appbar.Header>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {solicitudes.length === 0 ? (
            <Text style={styles.noSolicitudes}>
              {isGestor
                ? "No hay solicitudes de usuarios disponibles"
                : "No hay solicitudes disponibles"}
            </Text>
          ) : (
            solicitudes.map((s) => (
              <View key={s.id_solicitud} style={styles.solicitudCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {s.titulo || "SOLICITUD"}
                  </Text>
                  <EstadoIndicator estado={s.estado} />
                </View>

                {s.descripcion && (
                  <Text style={styles.descripcion}>{s.descripcion}</Text>
                )}

                <View style={styles.infoContainer}>
                  {/* Primera fila: Solicitado por y Tipo de ausencia */}
                  <View style={styles.infoRow}>
                    <View style={{ flex: 4 }}>
                      <Text style={styles.labelText}>Solicitado por:</Text>
                      <Text style={styles.valueText}>
                        {s.usuario
                          ? `${s.usuario.nombre} ${s.usuario.primer_apellido}`
                          : "Usuario"}
                      </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.labelText}>Tipo de ausencia:</Text>
                      <Text style={styles.valueText}>
                        {s.tipo_ausencia?.nombre || "-"}
                      </Text>
                    </View>
                  </View>

                  {/* Segunda fila: Fecha de envío, Fecha inicio, Fecha fin */}
                  <View style={styles.dateRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.labelText}>Fecha de envío:</Text>
                      <Text style={styles.valueText}>
                        {formatDate(s.created_at)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.labelText}>Fecha inicio:</Text>
                      <Text style={styles.valueText}>
                        {formatDate(s.fecha_inicio)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.labelText}>Fecha fin:</Text>
                      <Text style={styles.valueText}>
                        {formatDate(s.fecha_fin)}
                      </Text>
                    </View>
                  </View>

                  {/* Botón editar solo para gestor cuando el estado es "rechazada" */}
                  {isGestor && s.estado === "rechazada" && (
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditarSolicitud(s.id_solicitud)}
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={20}
                        color="#FFF"
                      />
                      <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {isGestor && s.estado === "pendiente" && (
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      onPress={() => aceptarSolicitud(s.id_solicitud)}
                      style={styles.acceptButton}
                      labelStyle={styles.buttonLabel}
                    >
                      ACEPTAR
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => rechazarSolicitud(s.id_solicitud)}
                      style={styles.rejectButton}
                      labelStyle={styles.buttonLabel}
                    >
                      RECHAZAR
                    </Button>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  appbar: {
    backgroundColor: "#D50032",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noSolicitudes: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  solicitudCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    position: "relative",
  },
  estadoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  estadoIconContainer: {
    marginRight: 4,
  },
  estadoText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  aceptadaText: {
    color: "#2E7D32",
  },
  rechazadaText: {
    color: "#D32F2F",
  },
  pendienteText: {
    color: "#FF9800",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  descripcion: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateItem: {
    flex: 1,
  },
  submitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  submitDateBox: {
    flex: 1,
  },
  labelText: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 2,
  },
  valueText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D50032",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  acceptButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#2E7D32",
  },
  rejectButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#D32F2F",
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default PantallaSolicitud;