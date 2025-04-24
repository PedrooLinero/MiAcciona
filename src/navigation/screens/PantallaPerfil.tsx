// PantallaPerfil.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const PantallaPerfil = () => {
  // Simula los datos del usuario (aquí deberías traerlos de la API o almacenamiento)
  const [user, setUser] = useState<UserData | null>(null);

  interface UserData {
    id: number;
    nombre: string;
    primer_apellido: string;
    email: string;
    rol: string;
    telefono: number;
    token?: string; // opcional si también lo estás guardando en el estado
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Perfil del Usuario</Text>
          <Text style={styles.info}>Nombre: {user.nombre}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>Teléfono: {user.telefono}</Text>
        </>
      ) : (
        <Text>Cargando perfil...</Text>
      )}

      {/* Aquí puedes agregar la lógica para cerrar sesión */}
      <Button title="Cerrar sesión" onPress={() => console.log('Cerrar sesión')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default PantallaPerfil;
