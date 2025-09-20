// screens/ConnectivityDevices.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeviceConfigService, FiberConfigService } from '../../service/storage';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../../components/context/AppContext';
import { useDevice } from '../../components/context/DeviceContext';

const ConnectivityDevices = ({ route, navigation, theme }) => {
  const { projectId } = route.params;
  const { t } = useTranslation();
  const { isDarkMode } = useApp();
  const { topInset } = useDevice();

  // Colores dinámicos basados en el tema
  const colors = {
    background: isDarkMode ? '#121212' : '#f8f9fa',
    cardBackground: isDarkMode ? '#1e1e1e' : 'white',
    text: isDarkMode ? '#ffffff' : '#2c3e50',
    secondaryText: isDarkMode ? '#b0b0b0' : '#7f8c8d',
    border: isDarkMode ? '#333333' : '#ecf0f1',
    inputBackground: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    placeholder: isDarkMode ? '#888888' : '#a0a0a0',
    primary: '#3498db',
    success: '#2ecc71',
    warning: '#f39c12',
    danger: '#e74c3c',
    purple: '#9b59b6'
  };

  const [devices, setDevices] = useState([
    { id: 1, type: 'Switch', selected: false, ports: 24, count: 1, fibers: [] },
    { id: 2, type: 'Router', selected: false, ports: 8, count: 1, fibers: [] },
    { id: 3, type: 'Access Point', selected: false, ports: 4, count: 1, fibers: [] },
    { id: 4, type: 'OLT', selected: false, ports: 16, count: 1, fibers: [] },
    { id: 5, type: 'ONT', selected: false, ports: 1, count: 1, fibers: [] },
    { id: 6, type: 'Splitter', selected: false, ports: 8, count: 1, fibers: [] }
  ]);

  const [fiberTypes, setFiberTypes] = useState([
    { id: 1, type: '12F', selected: false, count: 1 },
    { id: 2, type: '24F', selected: false, count: 1 },
    { id: 3, type: '48F', selected: false, count: 1 },
    { id: 4, type: '96F', selected: false, count: 1 },
    { id: 5, type: '192F', selected: false, count: 1 }
  ]);

  // Cargar configuración existente al montar el componente
  useEffect(() => {
    loadExistingConfig();
  }, []);

  const loadExistingConfig = async () => {
    try {
      const existingDevices = await DeviceConfigService.getDeviceConfig(projectId);
      const existingFibers = await FiberConfigService.getFiberConfig(projectId);

      if (existingDevices && existingDevices.length > 0) {
        setDevices(prevDevices => 
          prevDevices.map(device => {
            const existingDevice = existingDevices.find(d => d.type === device.type);
            return existingDevice ? { ...device, ...existingDevice } : device;
          })
        );
      }

      if (existingFibers && existingFibers.length > 0) {
        setFiberTypes(prevFibers => 
          prevFibers.map(fiber => {
            const existingFiber = existingFibers.find(f => f.type === fiber.type);
            return existingFiber ? { ...fiber, ...existingFiber } : fiber;
          })
        );
      }
    } catch (error) {
      console.log('Error loading existing config:', error);
    }
  };

  const toggleDeviceSelection = (deviceId) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, selected: !device.selected }
          : device
      )
    );
  };

  const toggleFiberSelection = (fiberId) => {
    setFiberTypes(prevFibers => 
      prevFibers.map(fiber => 
        fiber.id === fiberId 
          ? { ...fiber, selected: !fiber.selected }
          : fiber
      )
    );
  };

  const updateDeviceCount = (deviceId, count) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              count: count === '' ? '' : Math.max(1, parseInt(count) || 1)
            }
          : device
      )
    );
  };

  const normalizeOnBlur = (deviceId) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === deviceId && d.count === '' ? { ...d, count: 1 } : d
      )
    );
  };

  const updateDevicePorts = (deviceId, ports) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, ports: Math.max(1, parseInt(ports) || 24) }
          : device
      )
    );
  };

  const updateFiberCount = (fiberId, count) => {
    setFiberTypes(prevFibers => 
      prevFibers.map(fiber => 
        fiber.id === fiberId 
          // ? { ...fiber, count: Math.max(1, parseInt(count) || 1) }
          ? { 
              ...fiber, 
              count: count === '' ? '' : Math.max(1, parseInt(count) || 1)
            }
          : fiber
      )
    );
  };

  const saveConfiguration = async () => {
    try {
      const selectedDevices = devices.filter(device => device.selected);
      const selectedFibers = fiberTypes.filter(fiber => fiber.selected);

      if (selectedDevices.length === 0) {
        Alert.alert(t('error'), t('selectAtLeastOneDevice'));
        return;
      }

      // Guardar en AsyncStorage
      await DeviceConfigService.saveDeviceConfig(projectId, selectedDevices);
      await FiberConfigService.saveFiberConfig(projectId, selectedFibers);

      Alert.alert('✅ ' + t('success'), t('configurationSaved1'), [
        {
          text: t('ok'),
          onPress: () => navigation.navigate('Dashboard')
        }
      ]);
      
      // Navegar al mapa de la red
      // navigation.navigate('NetworkMap', { projectId })

      // Alert.alert('✅ ' + t('success'), t('configurationSaved'), [
      //   {
      //     text: t('configureNetworkMap'),
      //     onPress: () => navigation.navigate('NetworkMap', { projectId })
      //   },
      //   {
      //     text: t('ok'),
      //     onPress: () => navigation.navigate('Dashboard')
      //   }
      // ]);

    } catch (error) {
      console.log('Error saving configuration:', error);
      Alert.alert(t('error'), t('failedToSaveConfig'));
    }
  };

  const getFiberLabel = (fiberType, index) => {
    const fiberCount = fiberTypes.find(f => f.type === fiberType)?.count || 1;
    if (fiberCount > 1) {
      return `${fiberType}-${index + 1}`;
    }
    return fiberType;
  };

  // Calcular total de puertos
  const calculateTotalPorts = () => {
    return devices
      .filter(device => device.selected)
      .reduce((total, device) => total + (device.ports * device.count), 0);
  };

  // Calcular total de fibras
  const calculateTotalFibers = () => {
    return fiberTypes
      .filter(fiber => fiber.selected)
      .reduce((total, fiber) => {
        const fiberCount = parseInt(fiber.type.replace('F', ''));
        return total + (fiberCount * fiber.count);
      }, 0);
  };

  // Estilos dinámicos que responden al tema
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBackground,
      padding: 16,
      paddingTop: 50,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    scrollView: {
      flex: 1,
      padding: 16,
    },
    quickStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.secondaryText,
      marginBottom: 16,
    },
    deviceCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    fiberCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    fiberName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    deviceDescription: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 2,
    },
    fiberDescription: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 2,
    },
    deviceConfig: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    fiberConfig: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    configLabel: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    configInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 8,
      width: 80,
      textAlign: 'center',
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    summaryCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    summaryItem: {
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    summaryText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    summarySubtext: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 2,
    },
    totalSection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 2,
      borderTopColor: colors.primary,
    },
    totalText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      marginBottom: 30,
    },
    saveButtonText: {
      color: '#ffffff',
      fontWeight: '600',
      marginLeft: 8,
      fontSize: 16,
    },
  });

  // Combinar estilos estáticos con dinámicos
  const combinedStyles = {
    ...styles,
    ...dynamicStyles
  };

  return (
    <View style={combinedStyles.container}>
      {/* Header */}
      <View style={[combinedStyles.header, { paddingTop: topInset + 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={combinedStyles.headerTitle}>{t('connectivityDevices')}</Text>
        <TouchableOpacity onPress={saveConfiguration}>
          <Ionicons name="save-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={combinedStyles.scrollView}>
        {/* Resumen rápido */}
        <View style={combinedStyles.quickStats}>
          <View style={styles.statItem}>
            <Text style={combinedStyles.statNumber}>{devices.filter(d => d.selected).length}</Text>
            <Text style={combinedStyles.statLabel}>{t('devices')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={combinedStyles.statNumber}>{calculateTotalPorts()}</Text>
            <Text style={combinedStyles.statLabel}>{t('totalPorts')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={combinedStyles.statNumber}>{calculateTotalFibers()}</Text>
            <Text style={combinedStyles.statLabel}>{t('totalFibers')}</Text>
          </View>
        </View>

        {/* Devices Section */}
        <View style={styles.section}>
          <Text style={combinedStyles.sectionTitle}>{t('networkDevices')}</Text>
          <Text style={combinedStyles.sectionSubtitle}>{t('selectDevicesConfigurePorts')}</Text>

          {devices.map(device => (
            <View key={device.id} style={combinedStyles.deviceCard}>
              <View style={styles.deviceHeader}>
                <Switch
                  value={device.selected}
                  onValueChange={() => toggleDeviceSelection(device.id)}
                  trackColor={{ false: '#bdc3c7', true: colors.primary }}
                />
                <View style={styles.deviceInfo}>
                  <Text style={combinedStyles.deviceName}>{device.type}</Text>
                  <Text style={combinedStyles.deviceDescription}>
                    {device.type === 'Switch' ? t('ethernetSwitching') : 
                     device.type === 'Router' ? t('networkRouting') :
                     device.type === 'Access Point' ? t('wirelessConnectivity') :
                     device.type === 'OLT' ? t('opticalLineTerminal') :
                     device.type === 'ONT' ? t('opticalNetworkTerminal') :
                     t('opticalSignalSplitting')}
                  </Text>
                </View>
              </View>

              {device.selected && (
                <View style={combinedStyles.deviceConfig}>
                  <View style={styles.configRow}>
                    <Text style={combinedStyles.configLabel}>{t('quantity')}:</Text>
                    <TextInput
                      style={combinedStyles.configInput}
                      value={device.count.toString()}
                      onChangeText={(text) => updateDeviceCount(device.id, text)}
                      onBlur={() => normalizeOnBlur(device.id)}
                      keyboardType="numeric"
                      placeholder="1"
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>

                  <View style={styles.configRow}>
                    <Text style={combinedStyles.configLabel}>{t('ports')}:</Text>
                    <TextInput
                      style={combinedStyles.configInput}
                      value={device.ports.toString()}
                      onChangeText={(text) => updateDevicePorts(device.id, text)}
                      keyboardType="numeric"
                      placeholder="24"
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Fiber Types Section */}
        <View style={styles.section}>
          <Text style={combinedStyles.sectionTitle}>{t('fiberTypes')}</Text>
          <Text style={combinedStyles.sectionSubtitle}>{t('selectFiberTypesQuantities')}</Text>

          {fiberTypes.map(fiber => (
            <View key={fiber.id} style={combinedStyles.fiberCard}>
              <View style={styles.fiberHeader}>
                <Switch
                  value={fiber.selected}
                  onValueChange={() => toggleFiberSelection(fiber.id)}
                  trackColor={{ false: '#bdc3c7', true: colors.success }}
                />
                <View style={styles.fiberInfo}>
                  <Text style={combinedStyles.fiberName}>{fiber.type}</Text>
                  <Text style={combinedStyles.fiberDescription}>
                    {fiber.type === '12F' ? t('fiber12FDescription') :
                     fiber.type === '24F' ? t('fiber24FDescription') :
                     fiber.type === '48F' ? t('fiber48FDescription') :
                     fiber.type === '96F' ? t('fiber96FDescription') :
                     t('fiber192FDescription')}
                  </Text>
                </View>
              </View>

              {fiber.selected && (
                <View style={combinedStyles.fiberConfig}>
                  <Text style={combinedStyles.configLabel}>{t('quantity')}:</Text>
                  <TextInput
                    style={combinedStyles.configInput}
                    value={fiber.count.toString()}
                    onChangeText={(text) => updateFiberCount(fiber.id, text)}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={combinedStyles.sectionTitle}>{t('configurationSummary')}</Text>
          <View style={combinedStyles.summaryCard}>
            <Text style={combinedStyles.summaryTitle}>{t('selectedEquipment')}</Text>
            
            {devices.filter(d => d.selected).map(device => (
              <View key={device.id} style={combinedStyles.summaryItem}>
                <Text style={combinedStyles.summaryText}>
                  {device.count}x {device.type} ({device.ports} {t('portsEach')})
                </Text>
                <Text style={combinedStyles.summarySubtext}>
                  {t('total')}: {device.ports * device.count} {t('ports')}
                </Text>
              </View>
            ))}
            
            <Text style={combinedStyles.summaryTitle}>{t('selectedFiberTypes')}</Text>
            {fiberTypes.filter(f => f.selected).map(fiber => (
              <View key={fiber.id} style={combinedStyles.summaryItem}>
                <Text style={combinedStyles.summaryText}>
                  {fiber.count}x {fiber.type} {t('fiberCable')}
                </Text>
                <Text style={combinedStyles.summarySubtext}>
                  {t('total')}: {parseInt(fiber.type.replace('F', '')) * fiber.count} {t('fibers')}
                  {fiber.count > 1 && ` (${Array.from({length: fiber.count}, (_, i) => getFiberLabel(fiber.type, i)).join(', ')})`}
                </Text>
              </View>
            ))}

            <View style={combinedStyles.totalSection}>
              <Text style={combinedStyles.totalText}>
                {t('totalPorts')}: {calculateTotalPorts()}
              </Text>
              <Text style={combinedStyles.totalText}>
                {t('totalFibers')}: {calculateTotalFibers()}
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={combinedStyles.saveButton}
          onPress={saveConfiguration}
        >
          <Ionicons name="save-outline" size={24} color="#ffffff" />
          <Text style={combinedStyles.saveButtonText}>{t('continueNetworkConfiguration')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Estilos base (sin colores específicos para mantener la estructura)
const styles = StyleSheet.create({
  backButton: {
    padding: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fiberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  fiberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

export default ConnectivityDevices;