// screens/LoadingScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
// import { useApp } from '../components/context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';

const LoadingScreen = () => {
  const { isDarkMode } = useApp();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Logo de la aplicación */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/logo2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Spinner de carga */}
      <ActivityIndicator 
        size="large" 
        color={isDarkMode ? "#3498db" : "#2c3e50"} 
        style={styles.spinner}
      />

      {/* Texto de carga */}
      <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
        {t('loading')}...
      </Text>

      {/* Versión de la app */}
      <Text style={[styles.versionText, isDarkMode && styles.darkVersionText]}>
        v1.0 • FTTH Manager
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '300',
    marginBottom: 10,
  },
  darkText: {
    color: '#ecf0f1',
  },
  versionText: {
    fontSize: 12,
    color: '#7f8c8d',
    position: 'absolute',
    bottom: 30,
  },
  darkVersionText: {
    color: '#95a5a6',
  },
});

export default LoadingScreen;