// // // screens/ConnectivityDevices.js
// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   TextInput,
// //   Alert,
// //   Switch
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { DeviceConfigService, FiberConfigService } from '../../service/storage';
// // import { useTranslation } from '../hooks/useTranslation';
// // import { useApp } from '../context/AppContext';
// // import { useDevice } from '../context/DeviceContext';

// // const ConnectivityDevices = ({ route, navigation, theme }) => {
// //   const { projectId } = route.params;
// //   const { t } = useTranslation();
// //   const { isDarkMode } = useApp();
// //   const { topInset, bottomInset, stylesFull } = useDevice();

// //   // Colores dinámicos basados en el tema
// //   const colors = {
// //     background: isDarkMode ? '#121212' : '#f8f9fa',
// //     cardBackground: isDarkMode ? '#1e1e1e' : 'white',
// //     text: isDarkMode ? '#ffffff' : '#2c3e50',
// //     secondaryText: isDarkMode ? '#b0b0b0' : '#7f8c8d',
// //     border: isDarkMode ? '#333333' : '#ecf0f1',
// //     inputBackground: isDarkMode ? '#2a2a2a' : '#f8f9fa',
// //     placeholder: isDarkMode ? '#888888' : '#a0a0a0',
// //     primary: '#3498db',
// //     success: '#2ecc71',
// //     warning: '#f39c12',
// //     danger: '#e74c3c',
// //     purple: '#9b59b6'
// //   };

// //   const [devices, setDevices] = useState([
// //     { id: 1, type: 'Switch', selected: false, ports: 24, count: 1, fibers: [] },
// //     { id: 2, type: 'Router', selected: false, ports: 8, count: 1, fibers: [] },
// //     { id: 3, type: 'Access Point', selected: false, ports: 4, count: 1, fibers: [] },
// //     { id: 4, type: 'OLT', selected: false, ports: 16, count: 1, fibers: [] },
// //     { id: 5, type: 'ONT', selected: false, ports: 1, count: 1, fibers: [] },
// //     { id: 6, type: 'Splitter', selected: false, ports: 8, count: 1, fibers: [] }
// //   ]);

// //   const [fiberTypes, setFiberTypes] = useState([
// //     { id: 1, type: '12F', selected: false, count: 1 },
// //     { id: 2, type: '24F', selected: false, count: 1 },
// //     { id: 3, type: '48F', selected: false, count: 1 },
// //     { id: 4, type: '96F', selected: false, count: 1 },
// //     { id: 5, type: '192F', selected: false, count: 1 }
// //   ]);

// //   // Cargar configuración existente al montar el componente
// //   useEffect(() => {
// //     loadExistingConfig();
// //   }, []);

// //   const loadExistingConfig = async () => {
// //     try {
// //       const existingDevices = await DeviceConfigService.getDeviceConfig(projectId);
// //       const existingFibers = await FiberConfigService.getFiberConfig(projectId);

// //       if (existingDevices && existingDevices.length > 0) {
// //         setDevices(prevDevices => 
// //           prevDevices.map(device => {
// //             const existingDevice = existingDevices.find(d => d.type === device.type);
// //             return existingDevice ? { ...device, ...existingDevice } : device;
// //           })
// //         );
// //       }

// //       if (existingFibers && existingFibers.length > 0) {
// //         setFiberTypes(prevFibers => 
// //           prevFibers.map(fiber => {
// //             const existingFiber = existingFibers.find(f => f.type === fiber.type);
// //             return existingFiber ? { ...fiber, ...existingFiber } : fiber;
// //           })
// //         );
// //       }
// //     } catch (error) {
// //       console.log('Error loading existing config:', error);
// //     }
// //   };

// //   const toggleDeviceSelection = (deviceId) => {
// //     setDevices(prevDevices => 
// //       prevDevices.map(device => 
// //         device.id === deviceId 
// //           ? { ...device, selected: !device.selected }
// //           : device
// //       )
// //     );
// //   };

// //   const toggleFiberSelection = (fiberId) => {
// //     setFiberTypes(prevFibers => 
// //       prevFibers.map(fiber => 
// //         fiber.id === fiberId 
// //           ? { ...fiber, selected: !fiber.selected }
// //           : fiber
// //       )
// //     );
// //   };

// //   const updateDeviceCount = (deviceId, count) => {
// //     setDevices(prevDevices => 
// //       prevDevices.map(device => 
// //         device.id === deviceId 
// //           ? { 
// //               ...device, 
// //               count: count === '' ? '' : Math.max(1, parseInt(count) || 1)
// //             }
// //           : device
// //       )
// //     );
// //   };

// //   const normalizeOnBlur = (deviceId) => {
// //     setDevices(prev =>
// //       prev.map(d =>
// //         d.id === deviceId && d.count === '' ? { ...d, count: 1 } : d
// //       )
// //     );
// //   };

// //   const updateDevicePorts = (deviceId, ports) => {
// //     setDevices(prevDevices => 
// //       prevDevices.map(device => 
// //         device.id === deviceId 
// //           ? { ...device, ports: Math.max(1, parseInt(ports) || 24) }
// //           : device
// //       )
// //     );
// //   };

// //   const updateFiberCount = (fiberId, count) => {
// //     setFiberTypes(prevFibers => 
// //       prevFibers.map(fiber => 
// //         fiber.id === fiberId 
// //           // ? { ...fiber, count: Math.max(1, parseInt(count) || 1) }
// //           ? { 
// //               ...fiber, 
// //               count: count === '' ? '' : Math.max(1, parseInt(count) || 1)
// //             }
// //           : fiber
// //       )
// //     );
// //   };

// //   const saveConfiguration = async () => {
// //     try {
// //       const selectedDevices = devices.filter(device => device.selected);
// //       const selectedFibers = fiberTypes.filter(fiber => fiber.selected);

// //       if (selectedDevices.length === 0) {
// //         Alert.alert(t('error'), t('selectAtLeastOneDevice'));
// //         return;
// //       }

// //       // Guardar en AsyncStorage
// //       await DeviceConfigService.saveDeviceConfig(projectId, selectedDevices);
// //       await FiberConfigService.saveFiberConfig(projectId, selectedFibers);

// //       // Alert.alert('✅ ' + t('success'), t('configurationSaved1'), [
// //       //   {
// //       //     text: t('ok'),
// //       //     onPress: () => navigation.navigate('Dashboard')
// //       //   }
// //       // ]);
      
// //       // Navegar al mapa de la red
// //       navigation.navigate('NetworkMap', { projectId })

// //       // Alert.alert('✅ ' + t('success'), t('configurationSaved'), [
// //       //   {
// //       //     text: t('configureNetworkMap'),
// //       //     onPress: () => navigation.navigate('NetworkMap', { projectId })
// //       //   },
// //       //   {
// //       //     text: t('ok'),
// //       //     onPress: () => navigation.navigate('Dashboard')
// //       //   }
// //       // ]);

// //     } catch (error) {
// //       console.log('Error saving configuration:', error);
// //       Alert.alert(t('error'), t('failedToSaveConfig'));
// //     }
// //   };

// //   const getFiberLabel = (fiberType, index) => {
// //     const fiberCount = fiberTypes.find(f => f.type === fiberType)?.count || 1;
// //     if (fiberCount > 1) {
// //       return `${fiberType}-${index + 1}`;
// //     }
// //     return fiberType;
// //   };

// //   // Calcular total de puertos
// //   const calculateTotalPorts = () => {
// //     return devices
// //       .filter(device => device.selected)
// //       .reduce((total, device) => total + (device.ports * device.count), 0);
// //   };

// //   // Calcular total de fibras
// //   const calculateTotalFibers = () => {
// //     return fiberTypes
// //       .filter(fiber => fiber.selected)
// //       .reduce((total, fiber) => {
// //         const fiberCount = parseInt(fiber.type.replace('F', ''));
// //         return total + (fiberCount * fiber.count);
// //       }, 0);
// //   };

// //   // Estilos dinámicos que responden al tema
// //   const dynamicStyles = StyleSheet.create({
// //     container: {
// //       flex: 1,
// //       backgroundColor: colors.background,
// //     },
// //     header: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       justifyContent: 'space-between',
// //       backgroundColor: colors.cardBackground,
// //       padding: 16,
// //       paddingTop: 50,
// //       borderBottomWidth: 1,
// //       borderBottomColor: colors.border,
// //     },
// //     headerTitle: {
// //       fontSize: 18,
// //       fontWeight: '600',
// //       color: colors.text,
// //     },
// //     scrollView: {
// //       flex: 1,
// //       padding: 16,
// //     },
// //     quickStats: {
// //       flexDirection: 'row',
// //       justifyContent: 'space-around',
// //       backgroundColor: colors.cardBackground,
// //       borderRadius: 12,
// //       padding: 16,
// //       marginBottom: 20,
// //       shadowColor: '#000',
// //       shadowOffset: { width: 0, height: 1 },
// //       shadowOpacity: 0.1,
// //       shadowRadius: 3,
// //       elevation: 2,
// //     },
// //     statNumber: {
// //       fontSize: 20,
// //       fontWeight: 'bold',
// //       color: colors.primary,
// //     },
// //     statLabel: {
// //       fontSize: 12,
// //       color: colors.secondaryText,
// //       marginTop: 4,
// //     },
// //     sectionTitle: {
// //       fontSize: 18,
// //       fontWeight: '600',
// //       color: colors.text,
// //       marginBottom: 8,
// //     },
// //     sectionSubtitle: {
// //       fontSize: 14,
// //       color: colors.secondaryText,
// //       marginBottom: 16,
// //     },
// //     deviceCard: {
// //       backgroundColor: colors.cardBackground,
// //       borderRadius: 12,
// //       padding: 16,
// //       marginBottom: 12,
// //       shadowColor: '#000',
// //       shadowOffset: { width: 0, height: 1 },
// //       shadowOpacity: 0.1,
// //       shadowRadius: 3,
// //       elevation: 2,
// //     },
// //     fiberCard: {
// //       backgroundColor: colors.cardBackground,
// //       borderRadius: 12,
// //       padding: 16,
// //       marginBottom: 12,
// //       shadowColor: '#000',
// //       shadowOffset: { width: 0, height: 1 },
// //       shadowOpacity: 0.1,
// //       shadowRadius: 3,
// //       elevation: 2,
// //     },
// //     deviceName: {
// //       fontSize: 16,
// //       fontWeight: '500',
// //       color: colors.text,
// //     },
// //     fiberName: {
// //       fontSize: 16,
// //       fontWeight: '500',
// //       color: colors.text,
// //     },
// //     deviceDescription: {
// //       fontSize: 12,
// //       color: colors.secondaryText,
// //       marginTop: 2,
// //     },
// //     fiberDescription: {
// //       fontSize: 12,
// //       color: colors.secondaryText,
// //       marginTop: 2,
// //     },
// //     deviceConfig: {
// //       marginTop: 12,
// //       paddingTop: 12,
// //       borderTopWidth: 1,
// //       borderTopColor: colors.border,
// //     },
// //     fiberConfig: {
// //       marginTop: 12,
// //       paddingTop: 12,
// //       borderTopWidth: 1,
// //       borderTopColor: colors.border,
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       justifyContent: 'space-between',
// //     },
// //     configLabel: {
// //       fontSize: 14,
// //       color: colors.text,
// //       fontWeight: '500',
// //     },
// //     configInput: {
// //       borderWidth: 1,
// //       borderColor: colors.border,
// //       borderRadius: 8,
// //       padding: 8,
// //       width: 80,
// //       textAlign: 'center',
// //       backgroundColor: colors.inputBackground,
// //       color: colors.text,
// //     },
// //     summaryCard: {
// //       backgroundColor: colors.cardBackground,
// //       borderRadius: 12,
// //       padding: 16,
// //       shadowColor: '#000',
// //       shadowOffset: { width: 0, height: 1 },
// //       shadowOpacity: 0.1,
// //       shadowRadius: 3,
// //       elevation: 2,
// //     },
// //     summaryTitle: {
// //       fontSize: 16,
// //       fontWeight: '600',
// //       color: colors.text,
// //       marginBottom: 12,
// //       marginTop: 8,
// //     },
// //     summaryItem: {
// //       marginBottom: 12,
// //       paddingBottom: 12,
// //       borderBottomWidth: 1,
// //       borderBottomColor: colors.border,
// //     },
// //     summaryText: {
// //       fontSize: 14,
// //       color: colors.text,
// //       fontWeight: '500',
// //     },
// //     summarySubtext: {
// //       fontSize: 12,
// //       color: colors.secondaryText,
// //       marginTop: 2,
// //     },
// //     totalSection: {
// //       marginTop: 16,
// //       paddingTop: 16,
// //       borderTopWidth: 2,
// //       borderTopColor: colors.primary,
// //     },
// //     totalText: {
// //       fontSize: 16,
// //       fontWeight: 'bold',
// //       color: colors.text,
// //       marginBottom: 8,
// //     },
// //     saveButton: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       backgroundColor: colors.primary,
// //       padding: 16,
// //       borderRadius: 8,
// //       marginBottom: 30,
// //     },
// //     saveButtonText: {
// //       color: '#ffffff',
// //       fontWeight: '600',
// //       marginLeft: 8,
// //       fontSize: 16,
// //     },
// //   });

// //   // Combinar estilos estáticos con dinámicos
// //   const combinedStyles = {
// //     ...styles,
// //     ...dynamicStyles
// //   };

// //   return (
// //     <View style={[stylesFull.screen, {paddingBottom: bottomInset }]}>
// //       {/* Header */}
// //       <View style={[combinedStyles.header, { paddingTop: topInset - 10 }]}>
// //         <TouchableOpacity 
// //           onPress={() => navigation.goBack()}
// //           style={styles.backButton}
// //         >
// //           <Ionicons name="arrow-back" size={24} color={colors.text} />
// //         </TouchableOpacity>
// //         <Text style={combinedStyles.headerTitle}>{t('connectivityDevices')}</Text>
// //         <TouchableOpacity onPress={saveConfiguration}>
// //           <Ionicons name="save-outline" size={24} color={colors.primary} />
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView style={combinedStyles.scrollView}>
// //         {/* Resumen rápido */}
// //         <View style={combinedStyles.quickStats}>
// //           <View style={styles.statItem}>
// //             <Text style={combinedStyles.statNumber}>{devices.filter(d => d.selected).length}</Text>
// //             <Text style={combinedStyles.statLabel}>{t('devices')}</Text>
// //           </View>
// //           <View style={styles.statItem}>
// //             <Text style={combinedStyles.statNumber}>{calculateTotalPorts()}</Text>
// //             <Text style={combinedStyles.statLabel}>{t('totalPorts')}</Text>
// //           </View>
// //           <View style={styles.statItem}>
// //             <Text style={combinedStyles.statNumber}>{calculateTotalFibers()}</Text>
// //             <Text style={combinedStyles.statLabel}>{t('totalFibers')}</Text>
// //           </View>
// //         </View>

// //         {/* Devices Section */}
// //         <View style={styles.section}>
// //           <Text style={combinedStyles.sectionTitle}>{t('networkDevices')}</Text>
// //           <Text style={combinedStyles.sectionSubtitle}>{t('selectDevicesConfigurePorts')}</Text>

// //           {devices.map(device => (
// //             <View key={device.id} style={combinedStyles.deviceCard}>
// //               <View style={styles.deviceHeader}>
// //                 <Switch
// //                   value={device.selected}
// //                   onValueChange={() => toggleDeviceSelection(device.id)}
// //                   trackColor={{ false: '#bdc3c7', true: colors.primary }}
// //                 />
// //                 <View style={styles.deviceInfo}>
// //                   <Text style={combinedStyles.deviceName}>{device.type}</Text>
// //                   <Text style={combinedStyles.deviceDescription}>
// //                     {device.type === 'Switch' ? t('ethernetSwitching') : 
// //                      device.type === 'Router' ? t('networkRouting') :
// //                      device.type === 'Access Point' ? t('wirelessConnectivity') :
// //                      device.type === 'OLT' ? t('opticalLineTerminal') :
// //                      device.type === 'ONT' ? t('opticalNetworkTerminal') :
// //                      t('opticalSignalSplitting')}
// //                   </Text>
// //                 </View>
// //               </View>

// //               {device.selected && (
// //                 <View style={combinedStyles.deviceConfig}>
// //                   <View style={styles.configRow}>
// //                     <Text style={combinedStyles.configLabel}>{t('quantity')}:</Text>
// //                     <TextInput
// //                       style={combinedStyles.configInput}
// //                       value={device.count.toString()}
// //                       onChangeText={(text) => updateDeviceCount(device.id, text)}
// //                       onBlur={() => normalizeOnBlur(device.id)}
// //                       keyboardType="numeric"
// //                       placeholder="1"
// //                       placeholderTextColor={colors.placeholder}
// //                     />
// //                   </View>

// //                   <View style={styles.configRow}>
// //                     <Text style={combinedStyles.configLabel}>{t('ports')}:</Text>
// //                     <TextInput
// //                       style={combinedStyles.configInput}
// //                       value={device.ports.toString()}
// //                       onChangeText={(text) => updateDevicePorts(device.id, text)}
// //                       keyboardType="numeric"
// //                       placeholder="24"
// //                       placeholderTextColor={colors.placeholder}
// //                     />
// //                   </View>
// //                 </View>
// //               )}
// //             </View>
// //           ))}
// //         </View>

// //         {/* Fiber Types Section */}
// //         <View style={styles.section}>
// //           <Text style={combinedStyles.sectionTitle}>{t('fiberTypes')}</Text>
// //           <Text style={combinedStyles.sectionSubtitle}>{t('selectFiberTypesQuantities')}</Text>

// //           {fiberTypes.map(fiber => (
// //             <View key={fiber.id} style={combinedStyles.fiberCard}>
// //               <View style={styles.fiberHeader}>
// //                 <Switch
// //                   value={fiber.selected}
// //                   onValueChange={() => toggleFiberSelection(fiber.id)}
// //                   trackColor={{ false: '#bdc3c7', true: colors.success }}
// //                 />
// //                 <View style={styles.fiberInfo}>
// //                   <Text style={combinedStyles.fiberName}>{fiber.type}</Text>
// //                   <Text style={combinedStyles.fiberDescription}>
// //                     {fiber.type === '12F' ? t('fiber12FDescription') :
// //                      fiber.type === '24F' ? t('fiber24FDescription') :
// //                      fiber.type === '48F' ? t('fiber48FDescription') :
// //                      fiber.type === '96F' ? t('fiber96FDescription') :
// //                      t('fiber192FDescription')}
// //                   </Text>
// //                 </View>
// //               </View>

// //               {fiber.selected && (
// //                 <View style={combinedStyles.fiberConfig}>
// //                   <Text style={combinedStyles.configLabel}>{t('quantity')}:</Text>
// //                   <TextInput
// //                     style={combinedStyles.configInput}
// //                     value={fiber.count.toString()}
// //                     onChangeText={(text) => updateFiberCount(fiber.id, text)}
// //                     keyboardType="numeric"
// //                     placeholder="1"
// //                     placeholderTextColor={colors.placeholder}
// //                   />
// //                 </View>
// //               )}
// //             </View>
// //           ))}
// //         </View>

// //         {/* Summary Section */}
// //         <View style={styles.section}>
// //           <Text style={combinedStyles.sectionTitle}>{t('configurationSummary')}</Text>
// //           <View style={combinedStyles.summaryCard}>
// //             <Text style={combinedStyles.summaryTitle}>{t('selectedEquipment')}</Text>
            
// //             {devices.filter(d => d.selected).map(device => (
// //               <View key={device.id} style={combinedStyles.summaryItem}>
// //                 <Text style={combinedStyles.summaryText}>
// //                   {device.count}x {device.type} ({device.ports} {t('portsEach')})
// //                 </Text>
// //                 <Text style={combinedStyles.summarySubtext}>
// //                   {t('total')}: {device.ports * device.count} {t('ports')}
// //                 </Text>
// //               </View>
// //             ))}
            
// //             <Text style={combinedStyles.summaryTitle}>{t('selectedFiberTypes')}</Text>
// //             {fiberTypes.filter(f => f.selected).map(fiber => (
// //               <View key={fiber.id} style={combinedStyles.summaryItem}>
// //                 <Text style={combinedStyles.summaryText}>
// //                   {fiber.count}x {fiber.type} {t('fiberCable')}
// //                 </Text>
// //                 <Text style={combinedStyles.summarySubtext}>
// //                   {t('total')}: {parseInt(fiber.type.replace('F', '')) * fiber.count} {t('fibers')}
// //                   {fiber.count > 1 && ` (${Array.from({length: fiber.count}, (_, i) => getFiberLabel(fiber.type, i)).join(', ')})`}
// //                 </Text>
// //               </View>
// //             ))}

// //             <View style={combinedStyles.totalSection}>
// //               <Text style={combinedStyles.totalText}>
// //                 {t('totalPorts')}: {calculateTotalPorts()}
// //               </Text>
// //               <Text style={combinedStyles.totalText}>
// //                 {t('totalFibers')}: {calculateTotalFibers()}
// //               </Text>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Save Button */}
// //         <TouchableOpacity 
// //           style={combinedStyles.saveButton}
// //           onPress={saveConfiguration}
// //         >
// //           <Ionicons name="save-outline" size={24} color="#ffffff" />
// //           <Text style={combinedStyles.saveButtonText}>{t('continueNetworkConfiguration')}</Text>
// //         </TouchableOpacity>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // // Estilos base (sin colores específicos para mantener la estructura)
// // const styles = StyleSheet.create({
// //   backButton: {
// //     padding: 4,
// //   },
// //   statItem: {
// //     alignItems: 'center',
// //   },
// //   section: {
// //     marginBottom: 24,
// //   },
// //   deviceHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   fiberHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   deviceInfo: {
// //     marginLeft: 12,
// //     flex: 1,
// //   },
// //   fiberInfo: {
// //     marginLeft: 12,
// //     flex: 1,
// //   },
// //   configRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginBottom: 8,
// //   },
// // });

// // export default ConnectivityDevices;

// // screens/ConnectivityDevices.js
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   Switch,
//   Modal,
//   FlatList
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { DeviceConfigService, FiberConfigService } from '../../service/storage';
// import { useTranslation } from '../hooks/useTranslation';
// import { useApp } from '../context/AppContext';
// import { useDevice } from '../context/DeviceContext';

// const ConnectivityDevices = ({ route, navigation, theme }) => {
//   const { projectId } = route.params;
//   const { t } = useTranslation();
//   const { isDarkMode } = useApp();
//   const { topInset, bottomInset, stylesFull } = useDevice();

//   // Colores dinámicos basados en el tema
//   const colors = {
//     background: isDarkMode ? '#121212' : '#f8f9fa',
//     cardBackground: isDarkMode ? '#1e1e1e' : 'white',
//     text: isDarkMode ? '#ffffff' : '#2c3e50',
//     secondaryText: isDarkMode ? '#b0b0b0' : '#7f8c8d',
//     border: isDarkMode ? '#333333' : '#ecf0f1',
//     inputBackground: isDarkMode ? '#2a2a2a' : '#f8f9fa',
//     placeholder: isDarkMode ? '#888888' : '#a0a0a0',
//     primary: '#3498db',
//     success: '#2ecc71',
//     warning: '#f39c12',
//     danger: '#e74c3c',
//     purple: '#9b59b6'
//   };

//   // Tipos disponibles de dispositivos y fibras
//   const deviceTypes = [
//     { id: 'switch', name: 'Switch', description: 'ethernetSwitching', defaultPorts: 24 },
//     { id: 'router', name: 'Router', description: 'networkRouting', defaultPorts: 8 },
//     { id: 'access_point', name: 'Access Point', description: 'wirelessConnectivity', defaultPorts: 4 },
//     { id: 'olt', name: 'OLT', description: 'opticalLineTerminal', defaultPorts: 16 },
//     { id: 'ont', name: 'ONT', description: 'opticalNetworkTerminal', defaultPorts: 1 },
//     { id: 'splitter', name: 'Splitter', description: 'opticalSignalSplitting', defaultPorts: 8 }
//   ];

//   const fiberTypesList = [
//     { id: '12F', name: '12F', description: 'fiber12FDescription' },
//     { id: '24F', name: '24F', description: 'fiber24FDescription' },
//     { id: '48F', name: '48F', description: 'fiber48FDescription' },
//     { id: '96F', name: '96F', description: 'fiber96FDescription' },
//     { id: '192F', name: '192F', description: 'fiber192FDescription' }
//   ];

//   const [selectedDevices, setSelectedDevices] = useState([]);
//   const [selectedFibers, setSelectedFibers] = useState([]);
//   const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
//   const [showAddFiberModal, setShowAddFiberModal] = useState(false);

//   // Cargar configuración existente al montar el componente
//   useEffect(() => {
//     loadExistingConfig();
//   }, []);

//   const loadExistingConfig = async () => {
//     try {
//       const existingDevices = await DeviceConfigService.getDeviceConfig(projectId);
//       const existingFibers = await FiberConfigService.getFiberConfig(projectId);

//       if (existingDevices && existingDevices.length > 0) {
//         setSelectedDevices(existingDevices);
//       }

//       if (existingFibers && existingFibers.length > 0) {
//         setSelectedFibers(existingFibers);
//       }
//     } catch (error) {
//       console.log('Error loading existing config:', error);
//     }
//   };

//   const addDevice = (deviceType) => {
//     const newDevice = {
//       id: Date.now().toString(),
//       type: deviceType.name,
//       ports: deviceType.defaultPorts,
//       count: 1,
//       description: deviceType.description
//     };
//     setSelectedDevices(prev => [...prev, newDevice]);
//     setShowAddDeviceModal(false);
//   };

//   const addFiber = (fiberType) => {
//     const newFiber = {
//       id: Date.now().toString(),
//       type: fiberType.name,
//       count: 1,
//       description: fiberType.description
//     };
//     setSelectedFibers(prev => [...prev, newFiber]);
//     setShowAddFiberModal(false);
//   };

//   const removeDevice = (deviceId) => {
//     setSelectedDevices(prev => prev.filter(device => device.id !== deviceId));
//   };

//   const removeFiber = (fiberId) => {
//     setSelectedFibers(prev => prev.filter(fiber => fiber.id !== fiberId));
//   };

//   const updateDeviceCount = (deviceId, count) => {
//     setSelectedDevices(prev => 
//       prev.map(device => 
//         device.id === deviceId 
//           ? { 
//               ...device, 
//               count: count === '' ? '' : Math.max(1, parseInt(count) || 1)
//             }
//           : device
//       )
//     );
//   };

//   const updateDevicePorts = (deviceId, ports) => {
//     setSelectedDevices(prev => 
//       prev.map(device => 
//         device.id === deviceId 
//           ? { ...device, ports: ports === '' ? '': Math.max(1, parseInt(ports) || device.ports) }
//           : device
//       )
//     );
//   };

//   const updateFiberCount = (fiberId, count) => {
//     setSelectedFibers(prev => 
//       prev.map(fiber => 
//         fiber.id === fiberId 
//           ? { 
//               ...fiber, 
//               count: count === '' ? '' : Math.max(1, parseInt(count) || 1)
//             }
//           : fiber
//       )
//     );
//   };

//   const normalizeOnBlur = (array, id, setter) => {
//     setter(prev =>
//       prev.map(item =>
//         item.id === id && item.count === '' ? { ...item, count: 1 } : item
//       )
//     );
//   };

//   const saveConfiguration = async () => {
//     try {
//       if (selectedDevices.length === 0) {
//         Alert.alert(t('error'), t('selectAtLeastOneDevice'));
//         return;
//       }

//       // Guardar en AsyncStorage
//       await DeviceConfigService.saveDeviceConfig(projectId, selectedDevices);
//       await FiberConfigService.saveFiberConfig(projectId, selectedFibers);

//       // Navegar al mapa de la red
//       navigation.navigate('NetworkMap', { projectId });

//     } catch (error) {
//       console.log('Error saving configuration:', error);
//       Alert.alert(t('error'), t('failedToSaveConfig'));
//     }
//   };

//   // Calcular total de puertos
//   const calculateTotalPorts = () => {
//     return selectedDevices.reduce((total, device) => total + (device.ports * device.count), 0);
//   };

//   // Calcular total de fibras
//   const calculateTotalFibers = () => {
//     return selectedFibers.reduce((total, fiber) => {
//       const fiberCount = parseInt(fiber.type.replace('F', ''));
//       return total + (fiberCount * fiber.count);
//     }, 0);
//   };

//   // Estilos dinámicos que responden al tema
//   const dynamicStyles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: colors.background,
//     },
//     header: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       backgroundColor: colors.cardBackground,
//       padding: 16,
//       paddingTop: topInset + 10,
//       borderBottomWidth: 1,
//       borderBottomColor: colors.border,
//     },
//     headerTitle: {
//       fontSize: 18,
//       fontWeight: '600',
//       color: colors.text,
//     },
//     scrollView: {
//       flex: 1,
//       padding: 16,
//     },
//     quickStats: {
//       flexDirection: 'row',
//       justifyContent: 'space-around',
//       backgroundColor: colors.cardBackground,
//       borderRadius: 12,
//       padding: 16,
//       marginBottom: 20,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.1,
//       shadowRadius: 3,
//       elevation: 2,
//     },
//     statNumber: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       color: colors.primary,
//     },
//     statLabel: {
//       fontSize: 12,
//       color: colors.secondaryText,
//       marginTop: 4,
//     },
//     sectionTitle: {
//       fontSize: 18,
//       fontWeight: '600',
//       color: colors.text,
//       marginBottom: 16,
//     },
//     sectionSubtitle: {
//       fontSize: 14,
//       color: colors.secondaryText,
//       marginBottom: 16,
//     },
//     addButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: colors.primary,
//       padding: 12,
//       borderRadius: 8,
//       marginBottom: 16,
//     },
//     addButtonText: {
//       color: '#ffffff',
//       fontWeight: '600',
//       marginLeft: 8,
//       fontSize: 16,
//     },
//     deviceCard: {
//       backgroundColor: colors.cardBackground,
//       borderRadius: 12,
//       padding: 16,
//       marginBottom: 12,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.1,
//       shadowRadius: 3,
//       elevation: 2,
//     },
//     fiberCard: {
//       backgroundColor: colors.cardBackground,
//       borderRadius: 12,
//       padding: 16,
//       marginBottom: 12,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.1,
//       shadowRadius: 3,
//       elevation: 2,
//     },
//     deviceHeader: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginBottom: 12,
//     },
//     deviceInfo: {
//       flex: 1,
//     },
//     deviceName: {
//       fontSize: 16,
//       fontWeight: '500',
//       color: colors.text,
//     },
//     deviceDescription: {
//       fontSize: 12,
//       color: colors.secondaryText,
//       marginTop: 2,
//     },
//     configRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginBottom: 8,
//     },
//     configLabel: {
//       fontSize: 14,
//       color: colors.text,
//       fontWeight: '500',
//     },
//     configInput: {
//       borderWidth: 1,
//       borderColor: colors.border,
//       borderRadius: 8,
//       padding: 8,
//       width: 80,
//       textAlign: 'center',
//       backgroundColor: colors.inputBackground,
//       color: colors.text,
//     },
//     removeButton: {
//       padding: 4,
//     },
//     modalOverlay: {
//       flex: 1,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     modalContent: {
//       backgroundColor: colors.cardBackground,
//       borderRadius: 12,
//       padding: 20,
//       width: '80%',
//       maxHeight: '80%',
//     },
//     modalTitle: {
//       fontSize: 18,
//       fontWeight: '600',
//       color: colors.text,
//       marginBottom: 16,
//       textAlign: 'center',
//     },
//     modalItem: {
//       padding: 16,
//       borderBottomWidth: 1,
//       borderBottomColor: colors.border,
//     },
//     modalItemText: {
//       fontSize: 16,
//       color: colors.text,
//     },
//     summaryCard: {
//       backgroundColor: colors.cardBackground,
//       borderRadius: 12,
//       padding: 16,
//       marginBottom: 20,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.1,
//       shadowRadius: 3,
//       elevation: 2,
//     },
//     summaryTitle: {
//       fontSize: 16,
//       fontWeight: '600',
//       color: colors.text,
//       marginBottom: 12,
//     },
//     summaryItem: {
//       marginBottom: 12,
//       paddingBottom: 12,
//       borderBottomWidth: 1,
//       borderBottomColor: colors.border,
//     },
//     summaryText: {
//       fontSize: 14,
//       color: colors.text,
//       fontWeight: '500',
//     },
//     summarySubtext: {
//       fontSize: 12,
//       color: colors.secondaryText,
//       marginTop: 2,
//     },
//     totalSection: {
//       marginTop: 16,
//       paddingTop: 16,
//       borderTopWidth: 2,
//       borderTopColor: colors.primary,
//     },
//     totalText: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: colors.text,
//       marginBottom: 8,
//     },
//     saveButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: colors.primary,
//       padding: 16,
//       borderRadius: 8,
//       marginBottom: 30,
//     },
//     saveButtonText: {
//       color: '#ffffff',
//       fontWeight: '600',
//       marginLeft: 8,
//       fontSize: 16,
//     },
//   });

//   return (
//     <View style={[stylesFull.screen, {paddingBottom: bottomInset }]}>
//       {/* Header */}
//       <View style={[dynamicStyles.header, { paddingTop: topInset - 10 }]}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={dynamicStyles.headerTitle}>{t('connectivityDevices')}</Text>
//         <TouchableOpacity onPress={saveConfiguration}>
//           <Ionicons name="save-outline" size={24} color={colors.primary} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={dynamicStyles.scrollView}>
//         {/* Resumen rápido */}
//         <View style={dynamicStyles.quickStats}>
//           <View style={styles.statItem}>
//             <Text style={dynamicStyles.statNumber}>{selectedDevices.length}</Text>
//             <Text style={dynamicStyles.statLabel}>{t('devices')}</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={dynamicStyles.statNumber}>{calculateTotalPorts()}</Text>
//             <Text style={dynamicStyles.statLabel}>{t('totalPorts')}</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={dynamicStyles.statNumber}>{selectedFibers.length}</Text>
//             <Text style={dynamicStyles.statLabel}>{t('fiberTypes')}</Text>
//           </View>
//         </View>

//         {/* Devices Section */}
//         <View style={styles.section}>
//           <Text style={dynamicStyles.sectionTitle}>{t('networkDevices')}</Text>
//           <Text style={dynamicStyles.sectionSubtitle}>{t('selectDevicesConfigurePorts')}</Text>

//           <TouchableOpacity 
//             style={dynamicStyles.addButton}
//             onPress={() => setShowAddDeviceModal(true)}
//           >
//             <Ionicons name="add" size={24} color="#ffffff" />
//             <Text style={dynamicStyles.addButtonText}>{t('addDevice')}</Text>
//           </TouchableOpacity>

//           {selectedDevices.map(device => (
//             <View key={device.id} style={dynamicStyles.deviceCard}>
//               <View style={dynamicStyles.deviceHeader}>
//                 <View style={dynamicStyles.deviceInfo}>
//                   <Text style={dynamicStyles.deviceName}>{device.type}</Text>
//                   <Text style={dynamicStyles.deviceDescription}>
//                     {t(device.description)}
//                   </Text>
//                 </View>
//                 <TouchableOpacity 
//                   style={dynamicStyles.removeButton}
//                   onPress={() => removeDevice(device.id)}
//                 >
//                   <Ionicons name="close-circle" size={24} color={colors.danger} />
//                 </TouchableOpacity>
//               </View>

//               <View style={dynamicStyles.configRow}>
//                 <Text style={dynamicStyles.configLabel}>{t('quantity')}:</Text>
//                 <TextInput
//                   style={dynamicStyles.configInput}
//                   value={device.count.toString()}
//                   onChangeText={(text) => updateDeviceCount(device.id, text)}
//                   onBlur={() => normalizeOnBlur(selectedDevices, device.id, setSelectedDevices)}
//                   keyboardType="numeric"
//                   placeholder="1"
//                   placeholderTextColor={colors.placeholder}
//                 />
//               </View>

//               <View style={dynamicStyles.configRow}>
//                 <Text style={dynamicStyles.configLabel}>{t('ports')}:</Text>
//                 <TextInput
//                   style={dynamicStyles.configInput}
//                   value={device.ports.toString()}
//                   onChangeText={(text) => updateDevicePorts(device.id, text)}
//                   keyboardType="numeric"
//                   placeholder="24"
//                   placeholderTextColor={colors.placeholder}
//                 />
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Fiber Types Section */}
//         <View style={styles.section}>
//           <Text style={dynamicStyles.sectionTitle}>{t('fiberTypes')}</Text>
//           <Text style={dynamicStyles.sectionSubtitle}>{t('selectFiberTypesQuantities')}</Text>

//           <TouchableOpacity 
//             style={[dynamicStyles.addButton, { backgroundColor: colors.success }]}
//             onPress={() => setShowAddFiberModal(true)}
//           >
//             <Ionicons name="add" size={24} color="#ffffff" />
//             <Text style={dynamicStyles.addButtonText}>{t('addFiberType')}</Text>
//           </TouchableOpacity>

//           {selectedFibers.map(fiber => (
//             <View key={fiber.id} style={dynamicStyles.fiberCard}>
//               <View style={dynamicStyles.deviceHeader}>
//                 <View style={dynamicStyles.deviceInfo}>
//                   <Text style={dynamicStyles.deviceName}>{fiber.type}</Text>
//                   <Text style={dynamicStyles.deviceDescription}>
//                     {t(fiber.description)}
//                   </Text>
//                 </View>
//                 <TouchableOpacity 
//                   style={dynamicStyles.removeButton}
//                   onPress={() => removeFiber(fiber.id)}
//                 >
//                   <Ionicons name="close-circle" size={24} color={colors.danger} />
//                 </TouchableOpacity>
//               </View>

//               <View style={dynamicStyles.configRow}>
//                 <Text style={dynamicStyles.configLabel}>{t('quantity')}:</Text>
//                 <TextInput
//                   style={dynamicStyles.configInput}
//                   value={fiber.count.toString()}
//                   onChangeText={(text) => updateFiberCount(fiber.id, text)}
//                   onBlur={() => normalizeOnBlur(selectedFibers, fiber.id, setSelectedFibers)}
//                   keyboardType="numeric"
//                   placeholder="1"
//                   placeholderTextColor={colors.placeholder}
//                 />
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Summary Section */}
//         <View style={styles.section}>
//           <Text style={dynamicStyles.sectionTitle}>{t('configurationSummary')}</Text>
//           <View style={dynamicStyles.summaryCard}>
//             <Text style={dynamicStyles.summaryTitle}>{t('selectedEquipment')}</Text>
            
//             {selectedDevices.map(device => (
//               <View key={device.id} style={dynamicStyles.summaryItem}>
//                 <Text style={dynamicStyles.summaryText}>
//                   {device.count}x {device.type} ({device.ports} {t('portsEach')})
//                 </Text>
//                 <Text style={dynamicStyles.summarySubtext}>
//                   {t('total')}: {device.ports * device.count} {t('ports')}
//                 </Text>
//               </View>
//             ))}
            
//             <Text style={dynamicStyles.summaryTitle}>{t('selectedFiberTypes')}</Text>
//             {selectedFibers.map(fiber => (
//               <View key={fiber.id} style={dynamicStyles.summaryItem}>
//                 <Text style={dynamicStyles.summaryText}>
//                   {fiber.count}x {fiber.type} {t('fiberCable')}
//                 </Text>
//                 <Text style={dynamicStyles.summarySubtext}>
//                   {t('total')}: {parseInt(fiber.type.replace('F', '')) * fiber.count} {t('fibers')}
//                 </Text>
//               </View>
//             ))}

//             <View style={dynamicStyles.totalSection}>
//               <Text style={dynamicStyles.totalText}>
//                 {t('totalPorts')}: {calculateTotalPorts()}
//               </Text>
//               <Text style={dynamicStyles.totalText}>
//                 {t('totalFibers')}: {calculateTotalFibers()}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Save Button */}
//         <TouchableOpacity 
//           style={dynamicStyles.saveButton}
//           onPress={saveConfiguration}
//         >
//           <Ionicons name="save-outline" size={24} color="#ffffff" />
//           <Text style={dynamicStyles.saveButtonText}>{t('continueNetworkConfiguration')}</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Modales para agregar dispositivos y fibras */}
//       <Modal
//         visible={showAddDeviceModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowAddDeviceModal(false)}
//       >
//         <View style={dynamicStyles.modalOverlay}>
//           <View style={dynamicStyles.modalContent}>
//             <Text style={dynamicStyles.modalTitle}>{t('selectDeviceType')}</Text>
//             <FlatList
//               data={deviceTypes}
//               keyExtractor={item => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={dynamicStyles.modalItem}
//                   onPress={() => addDevice(item)}
//                 >
//                   <Text style={dynamicStyles.modalItemText}>{item.name}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         visible={showAddFiberModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowAddFiberModal(false)}
//       >
//         <View style={dynamicStyles.modalOverlay}>
//           <View style={dynamicStyles.modalContent}>
//             <Text style={dynamicStyles.modalTitle}>{t('selectFiberType')}</Text>
//             <FlatList
//               data={fiberTypesList}
//               keyExtractor={item => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={dynamicStyles.modalItem}
//                   onPress={() => addFiber(item)}
//                 >
//                   <Text style={dynamicStyles.modalItemText}>{item.name}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// // Estilos base (sin colores específicos para mantener la estructura)
// const styles = StyleSheet.create({
//   backButton: {
//     padding: 4,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   section: {
//     marginBottom: 24,
//   },
// });

// export default ConnectivityDevices;

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
  Switch,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeviceConfigService, FiberConfigService } from '../../service/storage';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { useDevice } from '../context/DeviceContext';

const ConnectivityDevices = ({ route, navigation, theme }) => {
  const { projectId } = route.params;
  const { t } = useTranslation();
  const { isDarkMode } = useApp();
  const { topInset, bottomInset, stylesFull } = useDevice();

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

  // Tipos disponibles de dispositivos y fibras
  const deviceTypes = [
    { id: 'switch', name: 'Switch', description: 'ethernetSwitching', defaultPorts: 24 },
    { id: 'router', name: 'Router', description: 'networkRouting', defaultPorts: 8 },
    { id: 'access_point', name: 'Access Point', description: 'wirelessConnectivity', defaultPorts: 4 },
    { id: 'olt', name: 'OLT', description: 'opticalLineTerminal', defaultPorts: 16 },
    { id: 'ont', name: 'ONT', description: 'opticalNetworkTerminal', defaultPorts: 1 },
    { id: 'splitter', name: 'Splitter', description: 'opticalSignalSplitting', defaultPorts: 8 }
  ];

  const fiberTypesList = [
    { id: '12F', name: '12F', description: 'fiber12FDescription' },
    { id: '24F', name: '24F', description: 'fiber24FDescription' },
    { id: '48F', name: '48F', description: 'fiber48FDescription' },
    { id: '96F', name: '96F', description: 'fiber96FDescription' },
    { id: '192F', name: '192F', description: 'fiber192FDescription' }
  ];

  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedFibers, setSelectedFibers] = useState([]);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showAddFiberModal, setShowAddFiberModal] = useState(false);

  // Cargar configuración existente al montar el componente
  useEffect(() => {
    loadExistingConfig();
  }, []);

  const loadExistingConfig = async () => {
    try {
      const existingDevices = await DeviceConfigService.getDeviceConfig(projectId);
      const existingFibers = await FiberConfigService.getFiberConfig(projectId);

      if (existingDevices && existingDevices.length > 0) {
        setSelectedDevices(existingDevices);
      }

      if (existingFibers && existingFibers.length > 0) {
        setSelectedFibers(existingFibers);
      }
    } catch (error) {
      console.log('Error loading existing config:', error);
    }
  };

  const addDevice = (deviceType) => {
    const newDevice = {
      id: Date.now().toString(),
      type: deviceType.name,
      ports: deviceType.defaultPorts,
      count: 1,
      description: deviceType.description,
      macAddress: '' // Nuevo campo para dirección MAC
    };
    setSelectedDevices(prev => [...prev, newDevice]);
    setShowAddDeviceModal(false);
  };

  const addFiber = (fiberType) => {
    const newFiber = {
      id: Date.now().toString(),
      type: fiberType.name,
      count: 1,
      description: fiberType.description
    };
    setSelectedFibers(prev => [...prev, newFiber]);
    setShowAddFiberModal(false);
  };

  const removeDevice = (deviceId) => {
    setSelectedDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  const removeFiber = (fiberId) => {
    setSelectedFibers(prev => prev.filter(fiber => fiber.id !== fiberId));
  };

  const updateDeviceCount = (deviceId, count) => {
    setSelectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              count: count === '' ? '' : Math.max(1, parseInt(count) || 1)
            }
          : device
      )
    );
  };

  const updateDevicePorts = (deviceId, ports) => {
    setSelectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, ports: ports === '' ? '': Math.max(1, parseInt(ports) || device.ports) }
          : device
      )
    );
  };

  const updateDeviceMacAddress = (deviceId, macAddress) => {
    setSelectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, macAddress }
          : device
      )
    );
  };

  const updateFiberCount = (fiberId, count) => {
    setSelectedFibers(prev => 
      prev.map(fiber => 
        fiber.id === fiberId 
          ? { 
              ...fiber, 
              count: count === '' ? '' : Math.max(1, parseInt(count) || 1)
            }
          : fiber
      )
    );
  };

  const normalizeOnBlur = (array, id, setter) => {
    setter(prev =>
      prev.map(item =>
        item.id === id && item.count === '' ? { ...item, count: 1 } : item
      )
    );
  };

  // Función para simular el escaneo de código de barras (MAC address)
  const scanMacAddress = (deviceId) => {
    // En una implementación real, aquí se integraría con una librería de escaneo de código de barras
    // Por ahora, simulamos un escaneo generando una MAC address aleatoria
    const randomMac = generateRandomMacAddress();
    updateDeviceMacAddress(deviceId, randomMac);
    
    Alert.alert(
      t('macAddressScanned'),
      `${t('macAddress')}: ${randomMac}`,
      [{ text: t('ok') }]
    );
  };

  // Generar una dirección MAC aleatoria (formato XX:XX:XX:XX:XX:XX)
  const generateRandomMacAddress = () => {
    const hexDigits = '0123456789ABCDEF';
    let macAddress = '';
    for (let i = 0; i < 6; i++) {
      macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
      macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
      if (i < 5) macAddress += ':';
    }
    return macAddress;
  };

  const saveConfiguration = async () => {
    try {
      if (selectedDevices.length === 0) {
        Alert.alert(t('error'), t('selectAtLeastOneDevice'));
        return;
      }

      // Validar que todos los dispositivos tengan MAC address si es necesario
      // (opcional, dependiendo de los requisitos)
      const devicesWithoutMac = selectedDevices.filter(device => !device.macAddress);
      if (devicesWithoutMac.length > 0) {
        Alert.alert(
          t('warning'),
          t('someDevicesMissingMac'),
          [
            { text: t('cancel'), style: 'cancel' },
            { 
              text: t('continueAnyway'), 
              onPress: async () => {
                await DeviceConfigService.saveDeviceConfig(projectId, selectedDevices);
                await FiberConfigService.saveFiberConfig(projectId, selectedFibers);
                navigation.navigate('NetworkMap', { projectId });
              }
            }
          ]
        );
        return;
      }

      // Guardar en AsyncStorage
      await DeviceConfigService.saveDeviceConfig(projectId, selectedDevices);
      await FiberConfigService.saveFiberConfig(projectId, selectedFibers);

      // Navegar al mapa de la red
      navigation.navigate('NetworkMap', { projectId });

    } catch (error) {
      console.log('Error saving configuration:', error);
      Alert.alert(t('error'), t('failedToSaveConfig'));
    }
  };

  // Calcular total de puertos
  const calculateTotalPorts = () => {
    return selectedDevices.reduce((total, device) => total + (device.ports * device.count), 0);
  };

  // Calcular total de fibras
  const calculateTotalFibers = () => {
    return selectedFibers.reduce((total, fiber) => {
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
      paddingTop: topInset + 10,
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
      marginBottom: 16,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.secondaryText,
      marginBottom: 16,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    addButtonText: {
      color: '#ffffff',
      fontWeight: '600',
      marginLeft: 8,
      fontSize: 16,
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
    deviceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    deviceInfo: {
      flex: 1,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    deviceDescription: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 2,
    },
    configRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    macAddressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
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
    macAddressInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 8,
      flex: 1,
      marginRight: 8,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    scanButton: {
      backgroundColor: colors.purple,
      padding: 8,
      borderRadius: 6,
    },
    scanButtonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '500',
    },
    removeButton: {
      padding: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 20,
      width: '80%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalItemText: {
      fontSize: 16,
      color: colors.text,
    },
    summaryCard: {
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
    summaryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
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
    macAddressText: {
      fontSize: 12,
      color: colors.secondaryText,
      fontFamily: 'monospace',
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

  return (
    <View style={[stylesFull.screen,{ backgroundColor: colors.background}, {paddingBottom: bottomInset }]}>
      {/* Header */}
      <View style={[dynamicStyles.header, { paddingTop: topInset - 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>{t('connectivityDevices')}</Text>
        <TouchableOpacity onPress={saveConfiguration}>
          <Ionicons name="save-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={dynamicStyles.scrollView}>
        {/* Resumen rápido */}
        <View style={dynamicStyles.quickStats}>
          <View style={styles.statItem}>
            <Text style={dynamicStyles.statNumber}>{selectedDevices.length}</Text>
            <Text style={dynamicStyles.statLabel}>{t('devices')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={dynamicStyles.statNumber}>{calculateTotalPorts()}</Text>
            <Text style={dynamicStyles.statLabel}>{t('totalPorts')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={dynamicStyles.statNumber}>{selectedFibers.length}</Text>
            <Text style={dynamicStyles.statLabel}>{t('fiberTypes')}</Text>
          </View>
        </View>

        {/* Devices Section */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>{t('networkDevices')}</Text>
          <Text style={dynamicStyles.sectionSubtitle}>{t('selectDevicesConfigurePorts')}</Text>

          <TouchableOpacity 
            style={dynamicStyles.addButton}
            onPress={() => setShowAddDeviceModal(true)}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
            <Text style={dynamicStyles.addButtonText}>{t('addDevice')}</Text>
          </TouchableOpacity>

          {selectedDevices.map(device => (
            <View key={device.id} style={dynamicStyles.deviceCard}>
              <View style={dynamicStyles.deviceHeader}>
                <View style={dynamicStyles.deviceInfo}>
                  <Text style={dynamicStyles.deviceName}>{device.type}</Text>
                  <Text style={dynamicStyles.deviceDescription}>
                    {t(device.description)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={dynamicStyles.removeButton}
                  onPress={() => removeDevice(device.id)}
                >
                  <Ionicons name="close-circle" size={24} color={colors.danger} />
                </TouchableOpacity>
              </View>

              <View style={dynamicStyles.configRow}>
                <Text style={dynamicStyles.configLabel}>{t('quantity')}:</Text>
                <TextInput
                  style={dynamicStyles.configInput}
                  value={device.count.toString()}
                  onChangeText={(text) => updateDeviceCount(device.id, text)}
                  onBlur={() => normalizeOnBlur(selectedDevices, device.id, setSelectedDevices)}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={dynamicStyles.configRow}>
                <Text style={dynamicStyles.configLabel}>{t('ports')}:</Text>
                <TextInput
                  style={dynamicStyles.configInput}
                  value={device.ports.toString()}
                  onChangeText={(text) => updateDevicePorts(device.id, text)}
                  keyboardType="numeric"
                  placeholder="24"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={dynamicStyles.macAddressRow}>
                <Text style={dynamicStyles.configLabel}>{t('macAddress')}:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <TextInput
                    style={dynamicStyles.macAddressInput}
                    value={device.macAddress}
                    onChangeText={(text) => updateDeviceMacAddress(device.id, text)}
                    placeholder="XX:XX:XX:XX:XX:XX"
                    placeholderTextColor={colors.placeholder}
                  />
                  <TouchableOpacity 
                    style={dynamicStyles.scanButton}
                    onPress={() => scanMacAddress(device.id)}
                  >
                    <Text style={dynamicStyles.scanButtonText}>{t('scan')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Fiber Types Section */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>{t('fiberTypes')}</Text>
          <Text style={dynamicStyles.sectionSubtitle}>{t('selectFiberTypesQuantities')}</Text>

          <TouchableOpacity 
            style={[dynamicStyles.addButton, { backgroundColor: colors.success }]}
            onPress={() => setShowAddFiberModal(true)}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
            <Text style={dynamicStyles.addButtonText}>{t('addFiberType')}</Text>
          </TouchableOpacity>

          {selectedFibers.map(fiber => (
            <View key={fiber.id} style={dynamicStyles.fiberCard}>
              <View style={dynamicStyles.deviceHeader}>
                <View style={dynamicStyles.deviceInfo}>
                  <Text style={dynamicStyles.deviceName}>{fiber.type}</Text>
                  <Text style={dynamicStyles.deviceDescription}>
                    {t(fiber.description)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={dynamicStyles.removeButton}
                  onPress={() => removeFiber(fiber.id)}
                >
                  <Ionicons name="close-circle" size={24} color={colors.danger} />
                </TouchableOpacity>
              </View>

              <View style={dynamicStyles.configRow}>
                <Text style={dynamicStyles.configLabel}>{t('quantity')}:</Text>
                <TextInput
                  style={dynamicStyles.configInput}
                  value={fiber.count.toString()}
                  onChangeText={(text) => updateFiberCount(fiber.id, text)}
                  onBlur={() => normalizeOnBlur(selectedFibers, fiber.id, setSelectedFibers)}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>{t('configurationSummary')}</Text>
          <View style={dynamicStyles.summaryCard}>
            <Text style={dynamicStyles.summaryTitle}>{t('selectedEquipment')}</Text>
            
            {selectedDevices.map(device => (
              <View key={device.id} style={dynamicStyles.summaryItem}>
                <Text style={dynamicStyles.summaryText}>
                  {device.count}x {device.type} ({device.ports} {t('portsEach')})
                </Text>
                <Text style={dynamicStyles.summarySubtext}>
                  {t('total')}: {device.ports * device.count} {t('ports')}
                </Text>
                {device.macAddress && (
                  <Text style={dynamicStyles.macAddressText}>
                    MAC: {device.macAddress}
                  </Text>
                )}
              </View>
            ))}
            
            <Text style={dynamicStyles.summaryTitle}>{t('selectedFiberTypes')}</Text>
            {selectedFibers.map(fiber => (
              <View key={fiber.id} style={dynamicStyles.summaryItem}>
                <Text style={dynamicStyles.summaryText}>
                  {fiber.count}x {fiber.type} {t('fiberCable')}
                </Text>
                <Text style={dynamicStyles.summarySubtext}>
                  {t('total')}: {parseInt(fiber.type.replace('F', '')) * fiber.count} {t('fibers')}
                </Text>
              </View>
            ))}

            <View style={dynamicStyles.totalSection}>
              <Text style={dynamicStyles.totalText}>
                {t('totalPorts')}: {calculateTotalPorts()}
              </Text>
              <Text style={dynamicStyles.totalText}>
                {t('totalFibers')}: {calculateTotalFibers()}
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={dynamicStyles.saveButton}
          onPress={saveConfiguration}
        >
          <Ionicons name="save-outline" size={24} color="#ffffff" />
          <Text style={dynamicStyles.saveButtonText}>{t('continueNetworkConfiguration')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modales para agregar dispositivos y fibras */}
      <Modal
        visible={showAddDeviceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddDeviceModal(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>{t('selectDeviceType')}</Text>
            <FlatList
              data={deviceTypes}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={dynamicStyles.modalItem}
                  onPress={() => addDevice(item)}
                >
                  <Text style={dynamicStyles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddFiberModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddFiberModal(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>{t('selectFiberType')}</Text>
            <FlatList
              data={fiberTypesList}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={dynamicStyles.modalItem}
                  onPress={() => addFiber(item)}
                >
                  <Text style={dynamicStyles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
});

export default ConnectivityDevices;