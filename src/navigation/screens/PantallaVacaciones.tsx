// src/screens/PantallaVacaciones.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Appbar, Button, Snackbar, TextInput } from 'react-native-paper';
import { Box, Text } from '@gluestack-ui/themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Vacaciones: undefined;
};

type VacacionesScreenProp = StackNavigationProp<
  RootStackParamList,
  'Vacaciones'
>;

const windowWidth = Dimensions.get('window').width;

function PantallaVacaciones() {
  const navigation = useNavigation<VacacionesScreenProp>();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
      alert('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      // Aquí iría la lógica para enviar los datos al servidor
      // Por ejemplo: await fetch('http://localhost:3000/api/vacaciones', { ... })
      console.log('Enviando solicitud de vacaciones:', {
        titulo,
        descripcion,
        fechaInicio,
        fechaFin,
      });

      // Simular una solicitud exitosa
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Limpiar el formulario
        setTitulo('');
        setDescripcion('');
        setFechaInicio('');
        setFechaFin('');
      }, 3000);
    } catch (error) {
      console.error('Error al enviar solicitud de vacaciones:', error);
      alert('Hubo un error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Box style={{ flex: 1 }}>
        {/* Appbar idéntico al de PantallaIncidencia */}
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action
            icon="arrow-left"
            color="white"
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            title="Vacaciones"
            titleStyle={styles.title}
            style={{ marginLeft: 0 }}
          />
        </Appbar.Header>

        {/* Contenido de formulario dentro de ScrollView */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Formulario de Vacaciones</Text>

            <TextInput
              placeholder="Título"
              value={titulo}
              onChangeText={setTitulo}
              style={[styles.input, { width: windowWidth * 0.9 }]}
            />

            <TextInput
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              style={[styles.input, { width: windowWidth * 0.9, height: 100 }]}
            />

            <TextInput
              placeholder="Fecha de inicio (DD/MM/AAAA)"
              value={fechaInicio}
              onChangeText={setFechaInicio}
              style={[styles.input, { width: windowWidth * 0.9 }]}
            />

            <TextInput
              placeholder="Fecha de fin (DD/MM/AAAA)"
              value={fechaFin}
              onChangeText={setFechaFin}
              style={[styles.input, { width: windowWidth * 0.9 }]}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.submitButton, { width: windowWidth * 0.9 }]}
              labelStyle={styles.submitLabel}
              contentStyle={{ paddingVertical: 6 }}
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </View>
        </ScrollView>

        {/* Snackbar para mostrar mensaje de éxito */}
        <Snackbar
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          duration={3000}
          style={styles.snackbar}
        >
          ¡Solicitud de vacaciones enviada con éxito!
        </Snackbar>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: '#D50032',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginBottom: 14,
    backgroundColor: '#F5F5F5',
  },
  submitButton: {
    backgroundColor: '#D50032',
    borderRadius: 20,
    marginTop: 8,
    justifyContent: 'center',
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  snackbar: {
    backgroundColor: '#D50032',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignSelf: 'center',
    zIndex: 1000,
  },
});

export default PantallaVacaciones;