import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import PantallaCombinada from './navigation/screens/PantallaCombinada';

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <PantallaCombinada />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}