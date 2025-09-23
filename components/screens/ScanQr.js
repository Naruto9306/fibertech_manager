// import React, { useState, useEffect, useRef } from 'react'; // Añadir useRef
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   ScrollView,
//   Linking,
//   ActivityIndicator,
//   Clipboard,
//   Platform
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTranslation } from '../hooks/useTranslation';
// import { useApp } from '../context/AppContext';
// import { ProjectService, NetworkMapService } from '../../service/storage';
// import { useDevice } from '../context/DeviceContext';

// const ScanQr = ({ navigation }) => {
//   const { topInset, bottomInset } = useDevice;
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanned, setScanned] = useState(false);
//   const [cameraVisible, setCameraVisible] = useState(true);
//   const [scanHistory, setScanHistory] = useState([]);
//   const [selectedScan, setSelectedScan] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [importing, setImporting] = useState(false);
//   const [loadingImage, setLoadingImage] = useState(false);
//   const [scannedData, setScannedData] = useState(null);
//   const [showResultsModal, setShowResultsModal] = useState(false);
//   const [checkingStorage, setCheckingStorage] = useState(false);

//   // Añadir useRef para controlar el escaneo
//   const scanInProgress = useRef(false);

//   const { t } = useTranslation();
//   const { isDarkMode } = useApp();

//   useEffect(() => {
//     requestGalleryPermission();
//     loadScanHistory();
//   }, []);

//   // Función para verificar si el proyecto ya existe en AsyncStorage
//   const checkProjectExists = async (projectData) => {
//     try {
//       setCheckingStorage(true);
      
//       // Verificar por projectId
//       if (projectData.projectId) {
//         const existingProject = await ProjectService.getProjectById(projectData.projectId);
//         if (existingProject) {
//           return { exists: true, project: existingProject, reason: 'projectId' };
//         }
//       }
      
//       // Verificar por nombre de propiedad
//       if (projectData.propertyName) {
//         const allProjects = await ProjectService.getProjects();
//         const projectByName = allProjects.find(project => 
//           project.propertyName === projectData.propertyName
//         );
//         if (projectByName) {
//           return { exists: true, project: projectByName, reason: 'propertyName' };
//         }
//       }
      
//       return { exists: false, project: null, reason: null };
//     } catch (error) {
//       console.error('Error verificando proyecto:', error);
//       return { exists: false, project: null, reason: 'error' };
//     } finally {
//       setCheckingStorage(false);
//     }
//   };

//   // Función para guardar proyecto en AsyncStorage
//   const saveProjectToStorage = async (projectData) => {
//     try {
//       setImporting(true);
      
//       // Verificar si ya existe
//       const checkResult = await checkProjectExists(projectData);
      
//       if (checkResult.exists) {
//         Alert.alert(
//           t('projectAlreadyExists') || 'Proyecto ya existe',
//           t('projectAlreadyExistsMessage') || `Este proyecto ya existe en la base de datos (${checkResult.reason})`,
//           [
//             {
//               text: t('viewProject') || 'Ver Proyecto',
//               onPress: () => {
//                 navigation.navigate('DetallesProyecto', { 
//                   projectId: checkResult.project.id,
//                   projectData: checkResult.project
//                 });
//                 resetScanner();
//               }
//             },
//             {
//               text: t('scanAgain') || 'Escanear otro',
//               onPress: () => resetScanner(),
//               style: 'cancel'
//             }
//           ]
//         );
//         return { success: false, reason: 'exists', project: checkResult.project };
//       }
      
//       // Crear nuevo proyecto
//       const newProject = await ProjectService.createProject({
//         projectType: projectData.projectType || 'fiberProject',
//         projectId: projectData.projectId,
//         propertyName: projectData.propertyName,
//         propertyAddress: projectData.propertyAddress,
//         city: projectData.city,
//         totalUnits: projectData.totalUnits,
//         buildType: projectData.buildType,
//         ...projectData
//       });
      
//       // Guardar mapa de red si existe en los datos
//       if (projectData.networkMaps || projectData.nodes) {
//         await NetworkMapService.saveNetworkMap(newProject.id, {
//           nodes: projectData.nodes || [],
//           connections: projectData.connections || [],
//         });
//       }
      
//       Alert.alert(
//         t('success') || 'Éxito',
//         t('projectSavedSuccessfully') || 'Proyecto guardado correctamente',
//         [
//           {
//             text: t('viewProject') || 'Ver Proyecto',
//             onPress: () => {
//               navigation.navigate('DetallesProyecto', { 
//                 projectId: newProject.id,
//                 projectData: newProject
//               });
//               resetScanner();
//             }
//           }
//         ]
//       );
      
//       return { success: true, project: newProject };
      
//     } catch (error) {
//       console.error('Error guardando proyecto:', error);
//       Alert.alert(
//         t('error') || 'Error',
//         t('errorSavingProject') || 'Error al guardar el proyecto'
//       );
//       return { success: false, reason: 'error', error: error.message };
//     } finally {
//       setImporting(false);
//     }
//   };

//   // Función principal para procesar datos escaneados - MEJORADA
//   const processScannedData = async (data) => {
//     // Prevenir procesamiento múltiple
//     if (scanInProgress.current) return;
    
//     try {
//       scanInProgress.current = true;
      
//       if (data.length > 5000) {
//         Alert.alert(
//           t('largeData') || 'Datos grandes',
//           t('largeDataMessage') || 'Los datos son muy grandes',
//           [
//             {
//               text: t('viewContent') || 'Ver contenido',
//               onPress: () => {
//                 const newScan = {
//                   id: Date.now(),
//                   type: 'Large Data',
//                   code: data.substring(0, 30) + '...',
//                   timestamp: new Date().toLocaleString(),
//                   status: 'Too Large',
//                   data: data
//                 };
//                 setScannedData(newScan);
//                 setShowResultsModal(true);
//               }
//             },
//             {
//               text: t('scanAgain') || 'Escanear otra vez',
//               onPress: () => resetScanner(),
//               style: 'cancel'
//             }
//           ]
//         );
//         return;
//       }

//       try {
//         const parsedData = JSON.parse(data);
        
//         // Verificar si es un proyecto de fibra
//         if (parsedData.projectType === 'fiberProject' || parsedData.projectId) {
          
//           // Mostrar opciones al usuario
//           Alert.alert(
//             t('fiberProjectDetected') || 'Proyecto de Fibra Detectado',
//             t('fiberProjectOptions') || '¿Qué deseas hacer con este proyecto?',
//             [
//               {
//                 text: t('checkAndSave') || 'Verificar y Guardar',
//                 onPress: async () => {
//                   const result = await saveProjectToStorage(parsedData);
//                   if (!result.success && result.reason !== 'exists') {
//                     addToHistory(data, 'Fiber Project - Error');
//                   }
//                 }
//               },
//               {
//                 text: t('viewDetailsOnly') || 'Solo Ver Detalles',
//                 onPress: () => {
//                   navigation.navigate('DetallesProyecto', { 
//                     projectData: parsedData,
//                     fromScan: true,
//                     previewMode: true
//                   });
//                   setTimeout(() => resetScanner(), 1000);
//                 }
//               },
//               {
//                 text: t('cancel') || 'Cancelar',
//                 style: 'cancel',
//                 onPress: () => resetScanner()
//               }
//             ]
//           );
          
//         } else {
//           addToHistory(data, 'JSON Data from Gallery');
//         }
//       } catch (jsonError) {
//         addToHistory(data, 'Text from Gallery');
//       }
//     } catch (error) {
//       console.error('Error procesando datos:', error);
//       addToHistory(data, 'Unknown from Gallery');
//     } finally {
//       // Resetear el flag después de un delay para evitar escaneos rápidos consecutivos
//       setTimeout(() => {
//         scanInProgress.current = false;
//       }, 1000);
//     }
//   };

//   const addToHistory = (data, type = 'Unknown') => {
//     const newScan = {
//       id: Date.now(),
//       type: type,
//       code: data.length > 30 ? data.substring(0, 30) + '...' : data,
//       location: 'From Gallery',
//       timestamp: new Date().toLocaleString(),
//       status: 'New Scan',
//       data: data
//     };
    
//     const updatedHistory = [newScan, ...scanHistory];
//     setScanHistory(updatedHistory);
//     saveScanHistory(updatedHistory);
    
//     if (!type.includes('Fiber Project')) {
//       setScannedData(newScan);
//       setShowResultsModal(true);
//     }
//   };

//   // HANDLE BARCODE SCANNED - MEJORADO
//   const handleBarCodeScanned = ({ type, data }) => {
//     // Prevenir múltiples escaneos
//     if (scanned || scanInProgress.current) return;
    
//     console.log('QR detectado, procesando...');
    
//     setScanned(true);
//     setCameraVisible(false);
//     scanInProgress.current = true;
    
//     // Procesar después de un pequeño delay para asegurar que el estado se actualice
//     setTimeout(() => {
//       processScannedData(data);
//     }, 100);
//   };

//   const importProject = async (projectData) => {
//     return await saveProjectToStorage(projectData);
//   };

//   const requestGalleryPermission = async () => {
//     if (Platform.OS !== 'web') {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert(
//           t('permissionRequired') || 'Permiso requerido',
//           t('galleryPermissionMessage') || 'Se necesita permiso para acceder a la galería'
//         );
//       }
//     }
//   };

//   const pickImageFromGallery = async () => {
//     try {
//       setLoadingImage(true);
      
//       const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         await requestGalleryPermission();
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//         base64: false,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const imageUri = result.assets[0].uri;
//         await processImageForQR(imageUri);
//       }
//     } catch (error) {
//       console.error('Error al seleccionar imagen:', error);
//       Alert.alert(
//         t('error') || 'Error',
//         t('errorSelectingImage') || 'Error al seleccionar la imagen',
//         [{ text: t('ok') || 'OK' }]
//       );
//     } finally {
//       setLoadingImage(false);
//     }
//   };

//   const processImageForQR = async (imageUri) => {
//     try {
//       setLoadingImage(true);
//       const qrData = await scanQRWithFormData(imageUri);
      
//       if (qrData) {
//         setScanned(true);
//         setCameraVisible(false);
//         processScannedData(qrData);
//         addToHistory(qrData, 'QR from Gallery');
//       } else {
//         Alert.alert(
//           t('noQRFound') || 'QR no encontrado',
//           t('noQRFoundMessage') || 'No se detectó código QR en la imagen',
//           [
//             {
//               text: t('tryAgain') || 'Intentar otra vez',
//               onPress: pickImageFromGallery
//             },
//             {
//               text: t('cancel') || 'Cancelar',
//               style: 'cancel'
//             }
//           ]
//         );
//       }
//     } catch (error) {
//       console.error('Error procesando imagen QR:', error);
//       Alert.alert(
//         t('error') || 'Error',
//         t('errorProcessingQR') || 'Error al procesar QR',
//         [{ text: t('ok') || 'OK' }]
//       );
//     } finally {
//       setLoadingImage(false);
//     }
//   };

//   const scanQRWithFormData = async (imageUri) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', {
//         uri: imageUri,
//         type: 'image/jpeg',
//         name: 'qr.jpg',
//       });

//       const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const data = await response.json();
      
//       if (data && data[0] && data[0].symbol[0] && data[0].symbol[0].data) {
//         return data[0].symbol[0].data;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error escaneando QR:', error);
//       return null;
//     }
//   };

//   const loadScanHistory = async () => {
//     try {
//       const history = await AsyncStorage.getItem('scanHistory');
//       if (history) {
//         setScanHistory(JSON.parse(history));
//       }
//     } catch (error) {
//       console.error('Error loading scan history:', error);
//     }
//   };

//   const saveScanHistory = async (newHistory) => {
//     try {
//       await AsyncStorage.setItem('scanHistory', JSON.stringify(newHistory));
//     } catch (error) {
//       console.error('Error saving scan history:', error);
//     }
//   };

//   const viewScanDetails = (scan) => {
//     setSelectedScan(scan);
//     setModalVisible(true);
//     setShowResultsModal(false);
//   };

//   // RESET SCANNER - MEJORADO
//   const resetScanner = () => {
//     console.log('Reseteando scanner...');
//     setScanned(false);
//     setCameraVisible(true);
//     setScannedData(null);
//     setShowResultsModal(false);
//     scanInProgress.current = false; // Resetear el flag
//   };

//   const openHistory = () => {
//     setModalVisible(true);
//   };

//   const manualQRInput = () => {
//     Alert.prompt(
//       t('manualQRInput') || 'Entrada manual',
//       t('enterQRCodeManually') || 'Ingresa el código QR:',
//       [
//         {
//           text: t('cancel') || 'Cancelar',
//           style: 'cancel',
//         },
//         {
//           text: t('process') || 'Procesar',
//           onPress: (data) => {
//             if (data && data.trim()) {
//               setScanned(true);
//               setCameraVisible(false);
//               processScannedData(data.trim());
//             }
//           },
//         },
//       ],
//       'plain-text'
//     );
//   };

//   const renderGalleryButton = () => (
//     <TouchableOpacity 
//       style={[styles.simulateButton, { backgroundColor: '#9b59b6', marginTop: 10 }]}
//       onPress={pickImageFromGallery}
//       disabled={loadingImage}
//     >
//       {loadingImage ? (
//         <ActivityIndicator size="small" color="#ffffff" />
//       ) : (
//         <>
//           <Ionicons name="image-outline" size={20} color="#ffffff" />
//           <Text style={styles.simulateButtonText}>
//             {loadingImage ? (t('processing') || 'Procesando...') : (t('loadFromGallery') || 'Desde Galería')}
//           </Text>
//         </>
//       )}
//     </TouchableOpacity>
//   );

//   // RENDER HISTORY ITEM - CORREGIDO (evita error de undefined)
//   const renderHistoryItem = (item) => {
//     // Validación para evitar el error
//     if (!item || typeof item !== 'object') {
//       return null;
//     }
    
//     return (
//       <TouchableOpacity
//         key={item.id || Math.random()}
//         style={[styles.historyItem, { backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa' }]}
//         onPress={() => viewScanDetails(item)}
//       >
//         <View style={styles.historyIcon}>
//           <Ionicons 
//             name={item.type === 'Fiber Project' ? 'business' : 'qr-code'} 
//             size={20} 
//             color="#3498db" 
//           />
//         </View>
//         <View style={styles.historyContent}>
//           <Text style={[styles.historyCode, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
//             {item.code || 'Código no disponible'}
//           </Text>
//           <Text style={styles.historyType}>{item.type || 'Tipo desconocido'}</Text>
//           <Text style={styles.historyTime}>{item.timestamp || 'Fecha no disponible'}</Text>
//         </View>
//         <View style={[
//           styles.statusBadge,
//           { backgroundColor: item.status === 'Imported' ? '#2ecc71' : '#e67e22' }
//         ]}>
//           <Text style={styles.statusText}>{item.status || 'Desconocido'}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderResultsModal = () => {
//     if (!scannedData) return null;

//     return (
//       <Modal
//         visible={showResultsModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowResultsModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
//             <View style={styles.modalHeader}>
//               <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
//                 {scannedData.type === 'Large Data' ? (t('largeData') || 'Datos grandes') : (t('scanResults') || 'Resultados')}
//               </Text>
//               <TouchableOpacity onPress={() => setShowResultsModal(false)}>
//                 <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.resultsScroll}>
//               <View style={styles.detailsContainer}>
//                 <Text style={styles.detailTitle}>
//                   {scannedData.type === 'Large Data' ? (t('largeDataContent') || 'Contenido grande') : (t('scannedContent') || 'Contenido escaneado')}
//                 </Text>
                
//                 <View style={styles.dataContainer}>
//                   <Text style={styles.dataText}>
//                     {scannedData.data && scannedData.data.length > 500 
//                       ? scannedData.data.substring(0, 500) + '...' 
//                       : scannedData.data || 'No hay datos'
//                     }
//                   </Text>
//                 </View>
                
//                 {scannedData.type === 'Large Data' && (
//                   <Text style={styles.infoText}>
//                     {t('largeDataInfo') || 'Los datos son demasiado grandes para mostrar completamente'}
//                   </Text>
//                 )}
                
//                 <TouchableOpacity 
//                   style={styles.actionButton}
//                   onPress={() => {
//                     Clipboard.setString(scannedData.data || '');
//                     Alert.alert(t('success') || 'Éxito', t('copiedToClipboard') || 'Copiado al portapapeles');
//                   }}
//                 >
//                   <Ionicons name="copy-outline" size={18} color="#ffffff" />
//                   <Text style={styles.actionButtonText}>{t('copyToClipboard') || 'Copiar'}</Text>
//                 </TouchableOpacity>
                
//                 {scannedData.data && scannedData.data.startsWith('http') && (
//                   <TouchableOpacity 
//                     style={[styles.actionButton, { backgroundColor: '#3498db' }]}
//                     onPress={() => Linking.openURL(scannedData.data)}
//                   >
//                     <Ionicons name="open-outline" size={18} color="#ffffff" />
//                     <Text style={styles.actionButtonText}>{t('openLink') || 'Abrir enlace'}</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </ScrollView>

//             <TouchableOpacity 
//               style={[styles.modalCloseButton, { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
//               onPress={() => {
//                 setShowResultsModal(false);
//                 resetScanner();
//               }}
//             >
//               <Text style={[styles.modalCloseButtonText, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
//                 {t('scanAnother') || 'Escanear otro'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   return (
//     <View style={[styles.container, { paddingBottom: bottomInset }]}>
//       <View style={[styles.header, { paddingTop: topInset + 10 }]}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#ffffff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{t('scanQrCode') || 'Escanear QR'}</Text>
//         <TouchableOpacity onPress={openHistory}>
//           <Ionicons name="time-outline" size={24} color="#3498db" />
//         </TouchableOpacity>
//       </View>

//       {(importing || loadingImage || checkingStorage) && (
//         <View style={styles.importingOverlay}>
//           <ActivityIndicator size="large" color="#3498db" />
//           <Text style={styles.importingText}>
//             {checkingStorage 
//               ? (t('checkingStorage') || 'Verificando...') 
//               : importing 
//                 ? (t('importingProject') || 'Importando...') 
//                 : (t('processingImage') || 'Procesando...')
//             }
//           </Text>
//         </View>
//       )}

//       {cameraVisible && (
//         <View style={styles.cameraContainer}>
//           <CameraView
//             style={styles.camera}
//             facing="back"
//             // IMPORTANTE: Deshabilitar escaneo cuando ya se está procesando
//             onBarcodeScanned={scanned || scanInProgress.current ? undefined : handleBarCodeScanned}
//             barcodeScannerSettings={{
//               barcodeTypes: ['qr', 'pdf417']
//             }}
//           />
//           <View style={styles.overlay}>
//             <View style={styles.scanFrame}>
//               <View style={styles.cornerTopLeft} />
//               <View style={styles.cornerTopRight} />
//               <View style={styles.cornerBottomLeft} />
//               <View style={styles.cornerBottomRight} />
//             </View>
            
//             <Text style={styles.scanText}>{t('alignQrInFrame') || 'Alinea el código QR'}</Text>
            
//             <View style={styles.controls}>
//               {renderGalleryButton()}

//               <TouchableOpacity 
//                 style={[styles.simulateButton, { backgroundColor: '#e67e22', marginTop: 10 }]}
//                 onPress={manualQRInput}
//               >
//                 <Ionicons name="create-outline" size={20} color="#ffffff" />
//                 <Text style={styles.simulateButtonText}>{t('manualInput') || 'Entrada Manual'}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}

//       {scanned && !cameraVisible && !showResultsModal && (
//         <View style={styles.resultsContainer}>
//           <Ionicons name="checkmark-circle" size={64} color="#2ecc71" />
//           <Text style={styles.resultsTitle}>{t('scanSuccessful') || 'Escaneo exitoso'}</Text>
//           <Text style={styles.resultsText}>
//             {t('qrCodeProcessed') || 'Código QR procesado'}
//           </Text>
          
//           <TouchableOpacity 
//             style={styles.scanAgainButton}
//             onPress={resetScanner}
//           >
//             <Ionicons name="scan-outline" size={20} color="#ffffff" />
//             <Text style={styles.scanAgainButtonText}>{t('scanAnotherCode') || 'Escanear otro'}</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {renderResultsModal()}

//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
//             <View style={styles.modalHeader}>
//               <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
//                 {selectedScan ? (t('scanDetails') || 'Detalles') : (t('scanHistory') || 'Historial')}
//               </Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.historyScroll}>
//               {scanHistory && scanHistory.length > 0 ? (
//                 scanHistory.map(renderHistoryItem)
//               ) : (
//                 <View style={styles.emptyHistory}>
//                   <Ionicons name="time-outline" size={48} color="#7f8c8d" />
//                   <Text style={[styles.emptyHistoryText, { color: isDarkMode ? '#b0b0b0' : '#7f8c8d' }]}>
//                     {t('noScanHistory') || 'Sin historial'}
//                   </Text>
//                 </View>
//               )}
//             </ScrollView>

//             <TouchableOpacity 
//               style={[styles.modalCloseButton, { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
//               onPress={() => {
//                 if (selectedScan) {
//                   setSelectedScan(null);
//                 } else {
//                   setModalVisible(false);
//                 }
//               }}
//             >
//               <Text style={[styles.modalCloseButtonText, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
//                 {selectedScan ? (t('backToHistory') || 'Volver') : (t('close') || 'Cerrar')}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#000000',
//     padding: 23,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333333',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#ffffff',
//   },
//   cameraContainer: {
//     flex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   scanFrame: {
//     width: 250, 
//     height: 250, 
//     borderWidth: 2, 
//     borderColor: '#fff', 
//     borderRadius: 12,
//     position: 'relative',
//     top: -20
//   },
//   cornerTopLeft: {
//     position: 'absolute',
//     top: -2,
//     left: -2,
//     width: 30,
//     height: 30,
//     borderTopWidth: 4,
//     borderLeftWidth: 4,
//     borderColor: '#3498db',
//     borderRadius: 2,
//   },
//   cornerTopRight: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     width: 30,
//     height: 30,
//     borderTopWidth: 4,
//     borderRightWidth: 4,
//     borderColor: '#3498db',
//     borderRadius: 2,
//   },
//   cornerBottomLeft: {
//     position: 'absolute',
//     bottom: -2,
//     left: -2,
//     width: 30,
//     height: 30,
//     borderBottomWidth: 4,
//     borderLeftWidth: 4,
//     borderColor: '#3498db',
//     borderRadius: 2,
//   },
//   cornerBottomRight: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     width: 30,
//     height: 30,
//     borderBottomWidth: 4,
//     borderRightWidth: 4,
//     borderColor: '#3498db',
//     borderRadius: 2,
//   },
//   scanText: {
//     color: '#ffffff',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   controls: {
//     position: 'absolute',
//     bottom: 40,
//     alignItems: 'center',
//   },
//   simulateButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3498db',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   simulateButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   resultsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000000',
//     padding: 20,
//   },
//   resultsTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#ffffff',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   resultsText: {
//     fontSize: 16,
//     color: '#bdc3c7',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   scanAgainButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3498db',
//     padding: 16,
//     borderRadius: 8,
//   },
//   scanAgainButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   modalContent: {
//     borderRadius: 16,
//     padding: 24,
//     width: '90%',
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   historyScroll: {
//     maxHeight: 400,
//   },
//   historyItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   historyIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#2c3e50',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   historyContent: {
//     flex: 1,
//   },
//   historyCode: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   historyType: {
//     fontSize: 12,
//     color: '#3498db',
//     marginBottom: 2,
//   },
//   historyTime: {
//     fontSize: 10,
//     color: '#7f8c8d',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 10,
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   detailsContainer: {
//     padding: 16,
//   },
//   detailTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   dataContainer: {
//     backgroundColor: '#f0f0f0',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   dataText: {
//     fontSize: 14,
//     color: '#2c3e50',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#95a5a6',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   actionButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   modalCloseButton: {
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//     backgroundColor: '#3498db',
//   },
//   modalCloseButtonText: {
//     fontWeight: '600',
//     color: '#ffffff',
//   },
//   emptyHistory: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyHistoryText: {
//     fontSize: 16,
//     marginTop: 16,
//     textAlign: 'center',
//     color: '#7f8c8d',
//   },
//   importingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   importingText: {
//     color: '#ffffff',
//     fontSize: 16,
//     marginTop: 16,
//   },
//   infoText: {
//     fontSize: 12,
//     color: '#7f8c8d',
//     textAlign: 'center',
//     marginVertical: 10,
//     fontStyle: 'italic',
//   },
//   resultsScroll: {
//     maxHeight: 400,
//   },
// });

// export default ScanQr;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Linking,
  ActivityIndicator,
  Clipboard,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { ProjectService, NetworkMapService } from '../../service/storage';
import { useDevice } from '../context/DeviceContext';

const ScanQr = ({ navigation }) => {
  const { topInset, bottomInset } = useDevice;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(true);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [importing, setImporting] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showProjectOptions, setShowProjectOptions] = useState(false); // NUEVO ESTADO
  const [detectedProject, setDetectedProject] = useState(null); // NUEVO ESTADO
  const [checkingStorage, setCheckingStorage] = useState(false);

  // Añadir useRef para controlar el escaneo
  const scanInProgress = useRef(false);

  const { t } = useTranslation();
  const { isDarkMode } = useApp();

  useEffect(() => {
    requestGalleryPermission();
    loadScanHistory();
  }, []);

  // Función para verificar si el proyecto ya existe en AsyncStorage
  const checkProjectExists = async (projectData) => {
    try {
      setCheckingStorage(true);
      
      // Verificar por projectId
      if (projectData.projectId) {
        const existingProject = await ProjectService.getProjectById(projectData.projectId);
        if (existingProject) {
          return { exists: true, project: existingProject, reason: 'projectId' };
        }
      }
      
      // Verificar por nombre de propiedad
      if (projectData.propertyName) {
        const allProjects = await ProjectService.getProjects();
        const projectByName = allProjects.find(project => 
          project.propertyName === projectData.propertyName
        );
        if (projectByName) {
          return { exists: true, project: projectByName, reason: 'propertyName' };
        }
      }
      
      return { exists: false, project: null, reason: null };
    } catch (error) {
      console.error('Error verificando proyecto:', error);
      return { exists: false, project: null, reason: 'error' };
    } finally {
      setCheckingStorage(false);
    }
  };

  // Función para guardar proyecto en AsyncStorage
  const saveProjectToStorage = async (projectData) => {
    try {
      setImporting(true);
      
      // Verificar si ya existe
      const checkResult = await checkProjectExists(projectData);
      
      if (checkResult.exists) {
        Alert.alert(
          t('projectAlreadyExists') || 'Proyecto ya existe',
          t('projectAlreadyExistsMessage') || `Este proyecto ya existe en la base de datos (${checkResult.reason})`,
          [
            {
              text: t('viewProject') || 'Ver Proyecto',
              onPress: () => {
                navigation.navigate('DetallesProyecto', { 
                  projectId: checkResult.project.id,
                  projectData: checkResult.project
                });
                resetScanner();
              }
            },
            {
              text: t('scanAgain') || 'Escanear otro',
              onPress: () => resetScanner(),
              style: 'cancel'
            }
          ]
        );
        return { success: false, reason: 'exists', project: checkResult.project };
      }
      
      // Crear nuevo proyecto
      const newProject = await ProjectService.createProject({
        projectType: projectData.projectType || 'fiberProject',
        projectId: projectData.projectId,
        propertyName: projectData.propertyName,
        propertyAddress: projectData.propertyAddress,
        city: projectData.city,
        totalUnits: projectData.totalUnits,
        buildType: projectData.buildType,
        ...projectData
      });
      
      // Guardar mapa de red si existe en los datos
      if (projectData.networkMaps || projectData.nodes) {
        await NetworkMapService.saveNetworkMap(newProject.id, {
          nodes: projectData.nodes || [],
          connections: projectData.connections || [],
        });
      }
      
      Alert.alert(
        t('success') || 'Éxito',
        t('projectSavedSuccessfully') || 'Proyecto guardado correctamente',
        [
          {
            text: t('viewProject') || 'Ver Proyecto',
            onPress: () => {
              navigation.navigate('DetallesProyecto', { 
                projectId: newProject.id,
                projectData: newProject
              });
              resetScanner();
            }
          }
        ]
      );
      
      return { success: true, project: newProject };
      
    } catch (error) {
      console.error('Error guardando proyecto:', error);
      Alert.alert(
        t('error') || 'Error',
        t('errorSavingProject') || 'Error al guardar el proyecto'
      );
      return { success: false, reason: 'error', error: error.message };
    } finally {
      setImporting(false);
    }
  };

  // Función para mostrar opciones del proyecto detectado
  // const showProjectOptionsModal = (projectData) => {
  //   setDetectedProject(projectData);
  //   setShowProjectOptions(true);
  // };
  const showProjectOptionsModal = (projectData) => {
  setDetectedProject(projectData);
  setShowProjectOptions(true);
  // Asegurarse de que el modal de resultados NO se muestre
  setShowResultsModal(false);
  setScannedData(null); // Limpiar datos escaneados para evitar conflicto
};

  // Función principal para procesar datos escaneados - MEJORADA
  // const processScannedData = async (data) => {
  //   // Prevenir procesamiento múltiple
  //   if (scanInProgress.current) return;
    
  //   try {
  //     scanInProgress.current = true;
      
  //     if (data.length > 5000) {
  //       Alert.alert(
  //         t('largeData') || 'Datos grandes',
  //         t('largeDataMessage') || 'Los datos son muy grandes',
  //         [
  //           {
  //             text: t('viewContent') || 'Ver contenido',
  //             onPress: () => {
  //               const newScan = {
  //                 id: Date.now(),
  //                 type: 'Large Data',
  //                 code: data.substring(0, 30) + '...',
  //                 timestamp: new Date().toLocaleString(),
  //                 status: 'Too Large',
  //                 data: data
  //               };
  //               setScannedData(newScan);
  //               setShowResultsModal(true);
  //             }
  //           },
  //           {
  //             text: t('scanAgain') || 'Escanear otra vez',
  //             onPress: () => resetScanner(),
  //             style: 'cancel'
  //           }
  //         ]
  //       );
  //       return;
  //     }

  //     try {
  //       const parsedData = JSON.parse(data);
        
  //       // Verificar si es un proyecto de fibra
  //       if (parsedData.projectType === 'fiberProject' || parsedData.projectId) {
  //         // Mostrar opciones al usuario en lugar del Alert directamente
  //         showProjectOptionsModal(parsedData);
  //       } else {
  //         addToHistory(data, 'JSON Data from Gallery');
  //       }
  //     } catch (jsonError) {
  //       addToHistory(data, 'Text from Gallery');
  //     }
  //   } catch (error) {
  //     console.error('Error procesando datos:', error);
  //     addToHistory(data, 'Unknown from Gallery');
  //   } finally {
  //     // Resetear el flag después de un delay para evitar escaneos rápidos consecutivos
  //     setTimeout(() => {
  //       scanInProgress.current = false;
  //     }, 1000);
  //   }
  // };
  const processScannedData = async (data) => {
  // Prevenir procesamiento múltiple
  if (scanInProgress.current) return;
  
  try {
    scanInProgress.current = true;
    
    if (data.length > 5000) {
      Alert.alert(
        t('largeData') || 'Datos grandes',
        t('largeDataMessage') || 'Los datos son muy grandes',
        [
          {
            text: t('viewContent') || 'Ver contenido',
            onPress: () => {
              const newScan = {
                id: Date.now(),
                type: 'Large Data',
                code: data.substring(0, 30) + '...',
                timestamp: new Date().toLocaleString(),
                status: 'Too Large',
                data: data
              };
              setScannedData(newScan);
              setShowResultsModal(true);
            }
          },
          {
            text: t('scanAgain') || 'Escanear otra vez',
            onPress: () => resetScanner(),
            style: 'cancel'
          }
        ]
      );
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      
      // Verificar si es un proyecto de fibra
      if (parsedData.projectType === 'fiberProject' || parsedData.projectId) {
        // Mostrar opciones al usuario en lugar del Alert directamente
        showProjectOptionsModal(parsedData);
        
        // NO llamar a addToHistory aquí para evitar que se muestre el modal de resultados
        return; // Importante: salir de la función aquí
      } else {
        addToHistory(data, 'JSON Data from Gallery');
      }
    } catch (jsonError) {
      addToHistory(data, 'Text from Gallery');
    }
  } catch (error) {
    console.error('Error procesando datos:', error);
    addToHistory(data, 'Unknown from Gallery');
  } finally {
    // Resetear el flag después de un delay para evitar escaneos rápidos consecutivos
    setTimeout(() => {
      scanInProgress.current = false;
    }, 1000);
  }
};


  // const addToHistory = (data, type = 'Unknown') => {
  //   const newScan = {
  //     id: Date.now(),
  //     type: type,
  //     code: data.length > 30 ? data.substring(0, 30) + '...' : data,
  //     location: 'From Gallery',
  //     timestamp: new Date().toLocaleString(),
  //     status: 'New Scan',
  //     data: data
  //   };
    
  //   const updatedHistory = [newScan, ...scanHistory];
  //   setScanHistory(updatedHistory);
  //   saveScanHistory(updatedHistory);
    
  //   if (!type.includes('Fiber Project')) {
  //     setScannedData(newScan);
  //     setShowResultsModal(true);
  //   }
  // };

  // HANDLE BARCODE SCANNED - MEJORADO
  
  const addToHistory = (data, type = 'Unknown') => {
  const newScan = {
    id: Date.now(),
    type: type,
    code: data.length > 30 ? data.substring(0, 30) + '...' : data,
    location: 'From Gallery',
    timestamp: new Date().toLocaleString(),
    status: 'New Scan',
    data: data
  };
  
  const updatedHistory = [newScan, ...scanHistory];
  setScanHistory(updatedHistory);
  saveScanHistory(updatedHistory);
  
  // SOLO mostrar modal de resultados si NO es un proyecto de fibra
  if (!type.includes('Fiber Project') && !type.includes('fiberProject')) {
    setScannedData(newScan);
    setShowResultsModal(true);
  }
};

  const handleBarCodeScanned = ({ type, data }) => {
    // Prevenir múltiples escaneos
    if (scanned || scanInProgress.current) return;
    
    console.log('QR detectado, procesando...');
    
    setScanned(true);
    setCameraVisible(false);
    scanInProgress.current = true;
    
    // Procesar después de un pequeño delay para asegurar que el estado se actualice
    setTimeout(() => {
      processScannedData(data);
    }, 100);
  };

  const importProject = async (projectData) => {
    return await saveProjectToStorage(projectData);
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired') || 'Permiso requerido',
          t('galleryPermissionMessage') || 'Se necesita permiso para acceder a la galería'
        );
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      setLoadingImage(true);
      
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        await requestGalleryPermission();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        await processImageForQR(imageUri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert(
        t('error') || 'Error',
        t('errorSelectingImage') || 'Error al seleccionar la imagen',
        [{ text: t('ok') || 'OK' }]
      );
    } finally {
      setLoadingImage(false);
    }
  };

  const processImageForQR = async (imageUri) => {
    try {
      setLoadingImage(true);
      const qrData = await scanQRWithFormData(imageUri);
      
      if (qrData) {
        setScanned(true);
        setCameraVisible(false);
        processScannedData(qrData);
        addToHistory(qrData, 'QR from Gallery');
      } else {
        Alert.alert(
          t('noQRFound') || 'QR no encontrado',
          t('noQRFoundMessage') || 'No se detectó código QR en la imagen',
          [
            {
              text: t('tryAgain') || 'Intentar otra vez',
              onPress: pickImageFromGallery
            },
            {
              text: t('cancel') || 'Cancelar',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error procesando imagen QR:', error);
      Alert.alert(
        t('error') || 'Error',
        t('errorProcessingQR') || 'Error al procesar QR',
        [{ text: t('ok') || 'OK' }]
      );
    } finally {
      setLoadingImage(false);
    }
  };

  const scanQRWithFormData = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'qr.jpg',
      });

      const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      
      if (data && data[0] && data[0].symbol[0] && data[0].symbol[0].data) {
        return data[0].symbol[0].data;
      }
      return null;
    } catch (error) {
      console.error('Error escaneando QR:', error);
      return null;
    }
  };

  const loadScanHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('scanHistory');
      if (history) {
        setScanHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  const saveScanHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('scanHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving scan history:', error);
    }
  };

  const viewScanDetails = (scan) => {
    setSelectedScan(scan);
    setModalVisible(true);
    setShowResultsModal(false);
  };

  // RESET SCANNER - MEJORADO
  // const resetScanner = () => {
  //   console.log('Reseteando scanner...');
  //   setScanned(false);
  //   setCameraVisible(true);
  //   setScannedData(null);
  //   setShowResultsModal(false);
  //   setShowProjectOptions(false); // Resetear también el modal de opciones
  //   setDetectedProject(null); // Resetear proyecto detectado
  //   scanInProgress.current = false; // Resetear el flag
  // };

  const resetScanner = () => {
  console.log('Reseteando scanner...');
  setScanned(false);
  setCameraVisible(true);
  setScannedData(null);
  setShowResultsModal(false);
  setShowProjectOptions(false); // Resetear también el modal de opciones
  setDetectedProject(null); // Resetear proyecto detectado
  scanInProgress.current = false; // Resetear el flag
};

  const openHistory = () => {
    setModalVisible(true);
  };

  const manualQRInput = () => {
    Alert.prompt(
      t('manualQRInput'),
      t('enterQRCodeManually'),
      [
        {
          text: t('cancel') || 'Cancelar',
          style: 'cancel',
        },
        {
          text: t('process') || 'Procesar',
          onPress: (data) => {
            if (data && data.trim()) {
              setScanned(true);
              setCameraVisible(false);
              processScannedData(data.trim());
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderGalleryButton = () => (
    <TouchableOpacity 
      style={[styles.simulateButton, { backgroundColor: '#9b59b6', marginTop: 10 }]}
      onPress={pickImageFromGallery}
      disabled={loadingImage}
    >
      {loadingImage ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          <Ionicons name="image-outline" size={20} color="#ffffff" />
          <Text style={styles.simulateButtonText}>
            {loadingImage ? (t('processing') || 'Procesando...') : (t('loadFromGallery') || 'Desde Galería')}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  // MODAL DE OPCIONES DEL PROYECTO DETECTADO - NUEVO
  const renderProjectOptionsModal = () => {
    if (!detectedProject) return null;

    return (
      <Modal
        visible={showProjectOptions}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProjectOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
                {t('fiberProjectDetected') || 'Proyecto de Fibra Detectado'}
              </Text>
              <TouchableOpacity onPress={() => setShowProjectOptions(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailTitle}>
                {detectedProject.propertyName || detectedProject.projectId || 'Proyecto de Fibra'}
              </Text>
              
              {detectedProject.propertyAddress && (
                <View style={styles.projectDetailItem}>
                  <Ionicons name="location-outline" size={16} color="#3498db" />
                  <Text style={styles.projectDetailText}>
                    {detectedProject.propertyAddress}
                  </Text>
                </View>
              )}
              
              {(detectedProject.totalUnits || detectedProject.buildType) && (
                <View style={styles.projectDetailsRow}>
                  {detectedProject.totalUnits && (
                    <View style={styles.projectDetailBadge}>
                      <Text style={styles.projectDetailBadgeText}>
                        {detectedProject.totalUnits} unidades
                      </Text>
                    </View>
                  )}
                  {detectedProject.buildType && (
                    <View style={styles.projectDetailBadge}>
                      <Text style={styles.projectDetailBadgeText}>
                        {detectedProject.buildType}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              
              <Text style={styles.optionsTitle}>
                {t('fiberProjectOptions') || '¿Qué deseas hacer con este proyecto?'}
              </Text>
              
              <TouchableOpacity 
                style={[styles.optionButton, styles.saveButton]}
                onPress={async () => {
                  setShowProjectOptions(false);
                  const result = await saveProjectToStorage(detectedProject);
                  if (!result.success && result.reason !== 'exists') {
                    addToHistory(JSON.stringify(detectedProject), 'Fiber Project - Error');
                  }
                }}
                disabled={importing}
              >
                {importing ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={20} color="#ffffff" />
                    <Text style={styles.optionButtonText}>
                      {t('checkAndSave') || 'Verificar y Guardar'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.optionButton, styles.viewButton]}
                onPress={() => {
                  setShowProjectOptions(false);
                  navigation.navigate('DetallesProyecto', { 
                    projectData: detectedProject,
                    fromScan: true,
                    previewMode: true
                  });
                  setTimeout(() => resetScanner(), 1000);
                }}
              >
                <Ionicons name="eye-outline" size={20} color="#ffffff" />
                <Text style={styles.optionButtonText}>
                  {t('viewDetailsOnly') || 'Solo Ver Detalles'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.optionButton, styles.cancelButton]}
                onPress={() => {
                  setShowProjectOptions(false);
                  resetScanner();
                }}
              >
                <Ionicons name="close-outline" size={20} color="#ffffff" />
                <Text style={styles.optionButtonText}>
                  {t('cancel') || 'Cancelar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // RENDER HISTORY ITEM - CORREGIDO (evita error de undefined)
  const renderHistoryItem = (item) => {
    // Validación para evitar el error
    if (!item || typeof item !== 'object') {
      return null;
    }
    
    return (
      <TouchableOpacity
        key={item.id || Math.random()}
        style={[styles.historyItem, { backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa' }]}
        onPress={() => viewScanDetails(item)}
      >
        <View style={styles.historyIcon}>
          <Ionicons 
            name={item.type === 'Fiber Project' ? 'business' : 'qr-code'} 
            size={20} 
            color="#3498db" 
          />
        </View>
        <View style={styles.historyContent}>
          <Text style={[styles.historyCode, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
            {item.code || 'Código no disponible'}
          </Text>
          <Text style={styles.historyType}>{item.type || 'Tipo desconocido'}</Text>
          <Text style={styles.historyTime}>{item.timestamp || 'Fecha no disponible'}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'Imported' ? '#2ecc71' : '#e67e22' }
        ]}>
          <Text style={styles.statusText}>{item.status || 'Desconocido'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderResultsModal = () => {
    if (!scannedData) return null;

    return (
      <Modal
        visible={showResultsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResultsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
                {scannedData.type === 'Large Data' ? (t('largeData') || 'Datos grandes') : (t('scanResults') || 'Resultados')}
              </Text>
              <TouchableOpacity onPress={() => setShowResultsModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.resultsScroll}>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {scannedData.type === 'Large Data' ? (t('largeDataContent') || 'Contenido grande') : (t('scannedContent') || 'Contenido escaneado')}
                </Text>
                
                <View style={styles.dataContainer}>
                  <Text style={styles.dataText}>
                    {scannedData.data && scannedData.data.length > 500 
                      ? scannedData.data.substring(0, 500) + '...' 
                      : scannedData.data || 'No hay datos'
                    }
                  </Text>
                </View>
                
                {scannedData.type === 'Large Data' && (
                  <Text style={styles.infoText}>
                    {t('largeDataInfo') || 'Los datos son demasiado grandes para mostrar completamente'}
                  </Text>
                )}
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    Clipboard.setString(scannedData.data || '');
                    Alert.alert(t('success') || 'Éxito', t('copiedToClipboard') || 'Copiado al portapapeles');
                  }}
                >
                  <Ionicons name="copy-outline" size={18} color="#ffffff" />
                  <Text style={styles.actionButtonText}>{t('copyToClipboard') || 'Copiar'}</Text>
                </TouchableOpacity>
                
                {scannedData.data && scannedData.data.startsWith('http') && (
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#3498db' }]}
                    onPress={() => Linking.openURL(scannedData.data)}
                  >
                    <Ionicons name="open-outline" size={18} color="#ffffff" />
                    <Text style={styles.actionButtonText}>{t('openLink') || 'Abrir enlace'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
              onPress={() => {
                setShowResultsModal(false);
                resetScanner();
              }}
            >
              <Text style={[styles.modalCloseButtonText, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
                {t('scanAnother') || 'Escanear otro'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomInset }]}>
      <View style={[styles.header, { paddingTop: topInset + 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('scanQrCode')}</Text>
        <TouchableOpacity onPress={openHistory}>
          <Ionicons name="time-outline" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      {(importing || loadingImage || checkingStorage) && (
        <View style={styles.importingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.importingText}>
            {checkingStorage 
              ? (t('checkingStorage') || 'Verificando...') 
              : importing 
                ? (t('importingProject') || 'Importando...') 
                : (t('processingImage') || 'Procesando...')
            }
          </Text>
        </View>
      )}

      {cameraVisible && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            // IMPORTANTE: Deshabilitar escaneo cuando ya se está procesando
            onBarcodeScanned={scanned || scanInProgress.current ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'pdf417']
            }}
          />
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
            
            <Text style={styles.scanText}>{t('alignQrInFrame')}</Text>
            
            <View style={styles.controls}>
              {renderGalleryButton()}

              <TouchableOpacity 
                style={[styles.simulateButton, { backgroundColor: '#e67e22', marginTop: 10 }]}
                onPress={manualQRInput}
              >
                <Ionicons name="create-outline" size={20} color="#ffffff" />
                <Text style={styles.simulateButtonText}>{t('manualInput')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {scanned && !cameraVisible && !showResultsModal && !showProjectOptions && (
  <View style={styles.resultsContainer}>
    <Ionicons name="checkmark-circle" size={64} color="#2ecc71" />
    <Text style={styles.resultsTitle}>{t('scanSuccessful') || 'Escaneo exitoso'}</Text>
    <Text style={styles.resultsText}>
      {t('qrCodeProcessed') || 'Código QR procesado'}
    </Text>
    
    <TouchableOpacity 
      style={styles.scanAgainButton}
      onPress={resetScanner}
    >
      <Ionicons name="scan-outline" size={20} color="#ffffff" />
      <Text style={styles.scanAgainButtonText}>{t('scanAnotherCode') || 'Escanear otro'}</Text>
    </TouchableOpacity>
  </View>
)}

      {/* MODALES */}
      {renderProjectOptionsModal()}
      {renderResultsModal()}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
                {selectedScan ? (t('scanDetails') || 'Detalles') : (t('scanHistory') || 'Historial')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.historyScroll}>
              {scanHistory && scanHistory.length > 0 ? (
                scanHistory.map(renderHistoryItem)
              ) : (
                <View style={styles.emptyHistory}>
                  <Ionicons name="time-outline" size={48} color="#7f8c8d" />
                  <Text style={[styles.emptyHistoryText, { color: isDarkMode ? '#b0b0b0' : '#7f8c8d' }]}>
                    {t('noScanHistory') || 'Sin historial'}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
              onPress={() => {
                if (selectedScan) {
                  setSelectedScan(null);
                } else {
                  setModalVisible(false);
                }
              }}
            >
              <Text style={[styles.modalCloseButtonText, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
                {selectedScan ? (t('backToHistory') || 'Volver') : (t('close') || 'Cerrar')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ESTILOS ACTUALIZADOS - Añadir nuevos estilos para el modal de opciones
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    padding: 23,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scanFrame: {
    width: 250, 
    height: 250, 
    borderWidth: 2, 
    borderColor: '#fff', 
    borderRadius: 12,
    position: 'relative',
    top: -20
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#3498db',
    borderRadius: 2,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#3498db',
    borderRadius: 2,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#3498db',
    borderRadius: 2,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#3498db',
    borderRadius: 2,
  },
  scanText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  simulateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
    marginBottom: 32,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
  },
  scanAgainButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  historyScroll: {
    maxHeight: 400,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyCode: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyType: {
    fontSize: 12,
    color: '#3498db',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dataText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalCloseButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#3498db',
  },
  modalCloseButtonText: {
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyHistoryText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  importingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  resultsScroll: {
    maxHeight: 400,
  },
  // NUEVOS ESTILOS PARA EL MODAL DE OPCIONES
  projectDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  projectDetailText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  projectDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  projectDetailBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  projectDetailBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  viewButton: {
    backgroundColor: '#3498db',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  optionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default ScanQr;