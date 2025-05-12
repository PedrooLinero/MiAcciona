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
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "@gluestack-ui/themed";

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
};

type PerfilScreenProp = StackNavigationProp<
  RootStackParamList,
  "PantallaPerfil"
>;

interface UserData {
  Idusuario: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  nif: string;
  fechanacimiento: string;
  estado: boolean;
  actividad: boolean;
  rol: string;
  telefono: string | null;
  email: string;
  token_huella: string | null;
  activo_biometria: boolean;
  subdivision_personal: string | null;
  diasPermitidos: number | null;
}

const windowWidth = Dimensions.get("window").width;

export default function PantallaPerfil() {
  const navigation = useNavigation<PerfilScreenProp>();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const nif = await AsyncStorage.getItem("nif");
        if (!nif) throw new Error("No se encontró NIF en almacenamiento");

        const res = await fetch(`http://localhost:3001/api/usuarios/${nif}`, {
          credentials: "include",
        });
        const json = await res.json();
        const datos = json.datos ?? json.data ?? json;
        setUser(datos);
        setChecked(datos.activo_biometria);
      } catch (err) {
        console.error("Error cargando datos de usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#D50032" />
      </SafeAreaView>
    );
  }

  const handleChange = async (event) => {
    setChecked(event);

    console.log("Entra en el handleChange");

    const response = await fetch(
      "http://localhost:3001/api/usuario/" + user.nif,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para aceptar cookies en la respuesta y enviarlas si las hay
        body: JSON.stringify({ activo: event }),
      }
    );

    console.log("Response:", response);

    if (response.status == 204) {
      alert("Cambio realizado correctamente");
    } else {
      const data = await response.json();

      alert(data.mensaje);
    }
  };

  return (
    <>
      {console.log("User data:", user)}
      <PaperProvider theme={customTheme}>
        <SafeAreaView style={styles.container}>
          {/* Mover Appbar afuera del ScrollView */}
          <Appbar.Header style={styles.appbar}>
            <Appbar.Action
              icon="arrow-left"
              color="white"
              onPress={() => navigation.goBack()}
            />
            <Appbar.Content
              title="Perfil"
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
          >
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage} />
              <Text style={styles.profileName}>
                {`${user.nombre} ${user.primer_apellido} ${user.segundo_apellido || ""}`}
              </Text>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>DNI</Text>
                <Text style={styles.value}>{user.nif}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>
                  {user.telefono || "No especificado"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.profileContainer}>
              <Switch
                size="md"
                defaultValue={checked}
                onValueChange={handleChange}
              />
            </View>

            <View style={{ height: 50, backgroundColor: "transparent" }} />
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
    </>
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
  scrollContent: {
    paddingVertical: 0, // Ajustamos para que no haya padding extra
    alignItems: "center",
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
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF",
    borderWidth: 3,
    borderColor: "#D50032",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  profileContainer: {
    backgroundColor: "#FFF",
    width: windowWidth * 0.9,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
    flexShrink: 1,
    textAlign: "right",
  },
});
