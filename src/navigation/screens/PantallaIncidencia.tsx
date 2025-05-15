// src/screens/PantallaIncidencia.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { Box, Text } from '@gluestack-ui/themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


type RootStackParamList = {
  Home: undefined;
  Incidencia: undefined;
};

type IncidenciaScreenProp = StackNavigationProp<
  RootStackParamList,
  'Incidencia'
>;

function PantallaIncidencia() {
  const navigation = useNavigation<IncidenciaScreenProp>();
  const windowWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Box style={{ flex: 1 }}>
        {/* Appbar idéntico al de PantallaCombinada */}
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action
            icon="arrow-left"
            color="white"
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            title="Incidencia"
            titleStyle={styles.title}
            style={{ marginLeft: 0 }}
          />
        </Appbar.Header>

        {/* Contenido de formulario dentro de ScrollView */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Formulario de Incidencia</Text>

            <TextInput
              placeholder="Título"
              style={[styles.input, { width: windowWidth * 0.9 }]}
            />

            <TextInput
              placeholder="Descripción"
              multiline
              style={[
                styles.input,
                { width: windowWidth * 0.9, height: 100 },
              ]}
            />

            <Button
              mode="contained"
              onPress={() => {
                /* lógica de envío */
              }}
              style={[styles.submitButton, { width: windowWidth * 0.9 }]}
              labelStyle={styles.submitLabel}
              contentStyle={{ paddingVertical: 6 }}
            >
              Enviar
            </Button>
          </View>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}

export default PantallaIncidencia;

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
});
