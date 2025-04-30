import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { initInventoryTable } from './src/database/queries';

export default function App() {
  useEffect(() => {
    initInventoryTable();
  }, []);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
// This is a simple React Native app that initializes a SQLite database for inventory tracking.