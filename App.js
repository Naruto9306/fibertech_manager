import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';
import AppNavigator from './components/navigation/AppNavigator';
import { initializeStorage } from './service/storage';

const App = () => {
  useEffect(() => {
  const initializeApp = async () => {
    try {
      await initializeStorage();
      console.log('✅ App initialized successfully');
    } catch (error) {
      console.log('❌ App initialization failed:', error);
    }
  };

  initializeApp();
}, []);

  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <AppNavigator />
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default App;