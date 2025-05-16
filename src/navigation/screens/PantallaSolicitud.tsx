import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput as RNTextInput,
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
  descripcion?: string;
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
  tipo_ausencia?: { nombre: string };
  motivo?: string;
}

const EstadoIndicator = ({ estado }: { estado: Solicitud["estado"] }) => {
  switch (estado) {
    case "aceptada":
      return (
        <View style={styles.estadoBox}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color="#2E7D32"
          />
          <Text style={[styles.estadoText, styles.aceptadaText]}>ACEPTADA</Text>
        </View>
      );
    case "rechazada":
      return (
        <View style={styles.estadoBox}>
          <MaterialCommunityIcons
            name="close-circle"
            size={16}
            color="#D32F2F"
          />
          <Text style={[styles.estadoText, styles.rechazadaText]}>
            RECHAZADA
          </Text>
        </View>
      );
    default:
      return (
        <View style={styles.estadoBox}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="#FF9800"
          />
          <Text style={[styles.estadoText, styles.pendienteText]}>
            PENDIENTE
          </Text>
        </View>
      );
  }
};

export default function PantallaSolicitud() {
  const navigation = useNavigation<SolicitudScreenProp>();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGestor, setIsGestor] = useState(false);

  // Modal de motivo
  const [modalVisible, setModalVisible] = useState(false);
  const [motivoText, setMotivoText] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const nif = await AsyncStorage.getItem("nif");
      const rol = await AsyncStorage.getItem("rol");
      const id = await AsyncStorage.getItem("id");
      const gestorRole = rol?.toLowerCase() === "gestor";
      setIsGestor(gestorRole);

      const url = gestorRole
        ? `http://localhost:3001/api/gestor/solicitudes/${parseInt(id!, 10)}`
        : `http://localhost:3001/api/solicitudes/${nif}`;

      try {
        const res = await fetch(url, { credentials: "include" });
        const json = await res.json();
        setSolicitudes(json.datos || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
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
    return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const openRejectModal = (id: number) => {
    setSelectedId(id);
    setMotivoText("");
    setModalVisible(true);
  };

  const confirmReject = async () => {
    if (selectedId == null) return;
    try {
      await fetch(
        `http://localhost:3001/api/gestor/solicitudes/${selectedId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estado: "rechazada",
            motivo: motivoText.trim(),
          }),
        }
      );
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id_solicitud === selectedId
            ? { ...s, estado: "rechazada", motivo: motivoText.trim() }
            : s
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setModalVisible(false);
    }
  };

  const aceptarSolicitud = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/gestor/solicitudes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "aceptada" }),
      });
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id_solicitud === id ? { ...s, estado: "aceptada" } : s
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#D50032" />
      </SafeAreaView>
    );
  }

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
          />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  <Text style={styles.cardTitle}>{s.titulo}</Text>
                  <EstadoIndicator estado={s.estado} />
                </View>

                {s.descripcion && (
                  <Text style={styles.descripcion}>{s.descripcion}</Text>
                )}

                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <View style={{ flex: 4 }}>
                      <Text style={styles.labelText}>Solicitado por:</Text>
                      <Text style={styles.valueText}>
                        {s.usuario
                          ? `${s.usuario.nombre} ${s.usuario.primer_apellido}`
                          : ""}
                      </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.labelText}>Tipo:</Text>
                      <Text style={styles.valueText}>
                        {s.tipo_ausencia?.nombre || ""}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dateRow}>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>Env:</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(s.created_at)}
                      </Text>
                    </View>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>Inicio:</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(s.fecha_inicio)}
                      </Text>
                    </View>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>Fin:</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(s.fecha_fin)}
                      </Text>
                    </View>
                  </View>

                  {s.motivo && (
                    <View style={styles.motivoContainer}>
                      <Text style={styles.labelText}>Motivo:</Text>
                      <Text style={styles.valueText}>{s.motivo}</Text>
                    </View>
                  )}

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
                        onPress={() => openRejectModal(s.id_solicitud)}
                        style={styles.rejectButton}
                        labelStyle={styles.buttonLabel}
                      >
                        RECHAZAR
                      </Button>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Modal personalizado */}
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Rechazo de solicitud</Text>
              <Text style={styles.modalLabel}>Motivo:</Text>
              <RNTextInput
                style={styles.modalInput}
                placeholder="Escriba el motivo del rechazo de la solicitud"
                multiline
                value={motivoText}
                onChangeText={setMotivoText}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[styles.modalButton, styles.cancelButton]}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmReject}
                  style={[styles.modalButton, styles.modalAcceptButton]}
                  disabled={!motivoText.trim()}
                >
                  <Text style={styles.acceptText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  appbar: { backgroundColor: "#D50032" },
  title: { fontSize: 20, fontWeight: "bold", color: "white" },
  scrollContent: { padding: 12 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  },
  estadoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 4,
    padding: 4,
  },
  estadoText: {
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 12,
  },
  aceptadaText: { color: "#2E7D32" },
  rechazadaText: { color: "#D32F2F" },
  pendienteText: { color: "#FF9800" },
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
  infoContainer: { marginTop: 6 },
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
  dateItem: { flex: 1 },
  dateLabel: { fontSize: 12, color: "#666" },
  dateValue: { fontSize: 14, color: "#333", fontWeight: "500" },
  labelText: { fontSize: 12, color: "#666", marginBottom: 2 },
  valueText: { fontSize: 14, color: "#333333", fontWeight: "500" },
  motivoContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#F8F8F8",
    borderRadius: 6,
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
  buttonLabel: { color: "#FFFFFF", fontWeight: "bold" },

  // estilos del modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 8,
    
  },
  modalInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelButton: { backgroundColor: "#424242" },
  modalAcceptButton: { backgroundColor: "#2979FF" },
  cancelText: { color: "#FFF" },
  acceptText: { color: "#FFF" },
});
