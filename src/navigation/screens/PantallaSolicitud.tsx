import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { Appbar, Provider as PaperProvider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme } from 'react-native-paper';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#D50032',
    accent: '#D50032',
  },
};

type RootStackParamList = {
  Home: undefined;
  Incidencia: undefined;
  Ausencia: undefined;
  PantallaPerfil: undefined;
  PantallaSolicitud: undefined;
};

type SolicitudScreenProp = StackNavigationProp<RootStackParamList, 'PantallaSolicitud'>;

interface Solicitud {
  id_solicitud: number;
  usuario_id: number;
  administrador_id: number;
  tipo_ausencia_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  created_at: string;
}

const PantallaSolicitud = () => {
  const navigation = useNavigation<SolicitudScreenProp>();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const nif = await AsyncStorage.getItem('nif');
        if (!nif) throw new Error('No se encontró NIF en almacenamiento');

        const res = await fetch(`http://localhost:3001/api/solicitudes?nif=${nif}`, {
          credentials: 'include',
        });
        const json = await res.json();
        setSolicitudes(json.datos || []);
      } catch (err) {
        console.error('Error cargando solicitudes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

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
            title="Solicitudes"
            titleStyle={styles.title}
            style={{ marginLeft: 0 }}
          />
        </Appbar.Header>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {solicitudes.length === 0 ? (
            <Text style={styles.noSolicitudes}>No hay solicitudes disponibles</Text>
          ) : (
            solicitudes.map((solicitud) => (
              <View key={solicitud.id_solicitud} style={styles.solicitudCard}>
                <Text style={styles.solicitudTitle}>{solicitud.titulo}</Text>
                <Text style={styles.solicitudDetail}>
                  Estado: {solicitud.estado}
                </Text>
                <Text style={styles.solicitudDetail}>
                  Desde: {solicitud.fecha_inicio}
                </Text>
                <Text style={styles.solicitudDetail}>
                  Hasta: {solicitud.fecha_fin}
                </Text>
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
    backgroundColor: '#F5F5F5',
  },
  appbar: {
    backgroundColor: '#D50032',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSolicitudes: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  solicitudCard: {
    backgroundColor: '#FFF',
    width: '90%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  solicitudTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  solicitudDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default PantallaSolicitud;