import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";

import PantallaCombinada from "./navigation/screens/PantallaCombinada";
import PantallaIncidencia from "./navigation/screens/PantallaIncidencia";
import PantallaAusencia from "./navigation/screens/PantallaAusencia";
import PantallaPerfil from "./navigation/screens/PantallaPerfil";

type RootStackParamList = {
  Home: undefined;
  Incidencia: undefined;
  Ausencia: undefined;
  PantallaPerfil: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={PantallaCombinada} />
              <Stack.Screen name="Incidencia" component={PantallaIncidencia} />
              <Stack.Screen name="Ausencia" component={PantallaAusencia} />
              <Stack.Screen name="PantallaPerfil" component={PantallaPerfil} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}