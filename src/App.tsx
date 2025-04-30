// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PantallaCombinada from './navigation/screens/PantallaCombinada';
import PantallaIncidencia from './navigation/screens/PantallaIncidencia';
import PantallaVacaciones from './navigation/screens/PantallaVacaciones';

type RootStackParamList = {
  Home: undefined;
  Incidencia: undefined;
  Vacaciones: undefined
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={PantallaCombinada} />
            <Stack.Screen
              name="Incidencia"
              component={PantallaIncidencia}
            />
            <Stack.Screen
              name="Vacaciones"
              component={PantallaVacaciones}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
