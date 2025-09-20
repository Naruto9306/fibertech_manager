// components/DetallesProyecto.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { useDevice } from '../context/DeviceContext';

const DetallesProyecto = ({ route, navigation }) => {
  const { topInset, bottomInset, stylesFull } = useDevice();
  const { isDarkMode } = useApp();
  const { t } = useTranslation();
  const { proyecto } = route.params;

  const colors = {
    background: isDarkMode ? '#121212' : '#ffffff',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#2c3e50',
    subText: isDarkMode ? '#b0b0b0' : '#7f8c8d',
    border: isDarkMode ? '#333' : '#ecf0f1',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const verEnMapa = () => {
    navigation.navigate('ViewOnMap', { selectedProject: proyecto });
  };

  return (
    <View style={[stylesFull.screen, { backgroundColor: colors.background }, {paddingBottom: bottomInset}]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }, { paddingTop: topInset - 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Detalles del Proyecto
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={verEnMapa} style={styles.mapButton}>
            <Ionicons name="map" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido */}
      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {proyecto.name || 'Proyecto sin nombre'}
          </Text>
          
          {proyecto.description && (
            <Text style={[styles.description, { color: colors.subText }]}>
              {proyecto.description}
            </Text>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="key" size={20} color="#3498db" />
            <Text style={[styles.detailLabel, { color: colors.subText }]}>ID:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{proyecto.id}</Text>
          </View>

          {proyecto.address && (
            <View style={styles.detailRow}>
              <Ionicons name="location" size={20} color="#3498db" />
              <Text style={[styles.detailLabel, { color: colors.subText }]}>{t('address')}:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{proyecto.address}, {proyecto.state}, {proyecto.country}, {proyecto.city}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#3498db" />
            <Text style={[styles.detailLabel, { color: colors.subText }]}>Creado:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatDate(proyecto.createdAt)}</Text>
          </View>

          {proyecto.updatedAt && (
            <View style={styles.detailRow}>
              <Ionicons name="refresh" size={20} color="#3498db" />
              <Text style={[styles.detailLabel, { color: colors.subText }]}>Actualizado:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{formatDate(proyecto.updatedAt)}</Text>
            </View>
          )}

          {/* {proyecto.city && (
            <View style={styles.detailRow}>
              <Ionicons name="location" size={20} color="#3498db" />
              <Text style={[styles.detailLabel, { color: colors.subText }]}>País, ciudad:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{proyecto.country}, {proyecto.city}</Text>
            </View>
          )} */}

          {proyecto.client && (
            <View style={styles.detailRow}>
              <Ionicons name="business" size={20} color="#3498db" />
              <Text style={[styles.detailLabel, { color: colors.subText }]}>Cliente:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{proyecto.client}</Text>
            </View>
          )}

          {proyecto.status && (
            <View style={styles.detailRow}>
              <Ionicons name="information-circle" size={20} color="#3498db" />
              <Text style={[styles.detailLabel, { color: colors.subText }]}>Estado:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{proyecto.status}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.mapButtonLarge, { backgroundColor: '#3498db' }]}
          onPress={verEnMapa}
        >
          <Ionicons name="map" size={24} color="#ffffff" />
          <Text style={styles.mapButtonText}>Ver en Mapa</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 10,
    marginRight: 6,
    fontWeight: '500',
    minWidth: 100,
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    flex: 1,
  },
  mapButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  mapButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default DetallesProyecto;