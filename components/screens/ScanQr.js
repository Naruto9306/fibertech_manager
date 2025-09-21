import React, { useState, useEffect } from 'react';
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
  Clipboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { useDevice } from '../context/DeviceContext';
import { importProjectData } from '../../service/storage';

const ScanQr = ({ navigation }) => {
  const { topInset, bottomInset, stylesFull } = useDevice;
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

  const { t } = useTranslation();
  const { isDarkMode } = useApp();

  // Cargar historial de escaneos desde almacenamiento local
  useEffect(() => {
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('scanHistory');
      if (history) {
        setScanHistory(JSON.parse(history));
      } else {
        const exampleScans = [
          {
            id: 1,
            type: 'Fiber Project',
            code: 'FBR-PROJECT-001',
            location: 'Main Distribution Frame',
            timestamp: '2024-03-15 10:30:45',
            status: 'Active',
            data: null
          }
        ];
        setScanHistory(exampleScans);
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

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return; // Prevenir múltiples escaneos
    
    setScanned(true);
    setCameraVisible(false);
    
    // Procesar el código QR escaneado
    processScannedData(data);
  };

  // const processScannedData = async (data) => {
  //   try {
  //     // Intentar parsear como JSON (si es un proyecto)
  //     const parsedData = JSON.parse(data);
      
  //     // Verificar si es un proyecto de Fiber
  //     if (parsedData.projectType === 'fiberProject' || parsedData.propertyName) {
  //       // Verificar si ya existe en el historial
  //       const existingScan = scanHistory.find(scan => 
  //         scan.data && (
  //           scan.data.projectId === parsedData.projectId || 
  //           scan.data.propertyName === parsedData.propertyName
  //         )
  //       );

  //       if (existingScan) {
  //         Alert.alert(
  //           t('projectAlreadyExists'),
  //           t('projectAlreadyExistsMessage'),
  //           [
  //             {
  //               text: t('viewDetails'),
  //               onPress: () => viewScanDetails(existingScan)
  //             },
  //             {
  //               text: t('scanAgain'),
  //               onPress: () => resetScanner(),
  //               style: 'cancel'
  //             }
  //           ]
  //         );
  //         return;
  //       }

  //       // Es un proyecto nuevo de Fiber
  //       const newScan = {
  //         id: Date.now(),
  //         type: 'Fiber Project',
  //         code: parsedData.projectId || parsedData.propertyName,
  //         location: parsedData.propertyAddress || 'Unknown Location',
  //         timestamp: new Date().toLocaleString(),
  //         status: 'Pending Import',
  //         data: parsedData
  //       };
        
  //       // Guardar en el estado y mostrar modal
  //       setScannedData(newScan);
  //       setShowResultsModal(true);
        
  //     } else {
  //       // Es otro tipo de datos JSON
  //       addToHistory(data, 'JSON Data');
  //     }
  //   } catch (error) {
  //     // Si no es JSON, tratar como código simple
  //     addToHistory(data, 'Text Code');
  //   }
  // };

//   const processScannedData = async (data) => {
//   try {

//     // Verificar si los datos son demasiado grandes
//     if (data.length > 2000) {
//       Alert.alert(
//         t('largeData'),
//         t('largeDataMessage'),
//         [
//           {
//             text: t('viewContent'),
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
//             text: t('scanAgain'),
//             onPress: () => resetScanner(),
//             style: 'cancel'
//           }
//         ]
//       );
//       return;
//     }
//     // Intentar parsear como JSON
//     const parsedData = JSON.parse(data);
    
//     // Verificar si es un proyecto de Fiber (con datos más específicos)
//     if (parsedData.projectType === 'fiberProject' || parsedData.projectId) {
//       // Crear objeto con solo la información esencial para mostrar
//       const displayData = {
//         projectType: parsedData.projectType,
//         projectId: parsedData.projectId,
//         propertyName: parsedData.propertyName,
//         propertyAddress: parsedData.propertyAddress,
//         city: parsedData.city,
//         totalUnits: parsedData.totalUnits,
//         buildType: parsedData.buildType,
//         // No incluir arrays grandes como fibers y splices
//       };
      
//       const newScan = {
//         id: Date.now(),
//         type: 'Fiber Project',
//         code: parsedData.projectId || parsedData.propertyName,
//         location: parsedData.propertyAddress || 'Unknown Location',
//         timestamp: new Date().toLocaleString(),
//         status: 'Pending Import',
//         data: parsedData, // Guardamos todos los datos para importar
//         displayData: displayData // Datos para mostrar en el modal
//       };
      
//       setScannedData(newScan);
//       setShowResultsModal(true);
      
//     } else {
//       addToHistory(data, 'JSON Data');
//     }
//   } catch (error) {
//     // Si no es JSON o hay error, tratar como texto
//     addToHistory(data, 'Text Code');
//   }
// };

const processScannedData = async (data) => {
  try {
    // Verificar si los datos son demasiado grandes
    if (data.length > 2000) {
      Alert.alert(
        t('largeData'),
        t('largeDataMessage'),
        [
          {
            text: t('viewContent'),
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
            text: t('scanAgain'),
            onPress: () => resetScanner(),
            style: 'cancel'
          }
        ]
      );
      return;
    }

    // Intentar parsear como JSON
    const parsedData = JSON.parse(data);
    
    // Verificar si es un proyecto de Fiber
    if (parsedData.projectType === 'fiberProject' || parsedData.projectId) {
      // Navegar directamente a la vista de detalles del proyecto
      console.log('Navigating to ProjectDetails with data:', parsedData);
      navigation.navigate('DetallesProyecto', { 
        projectData: parsedData,
        fromScan: true 
      });
      
      // Opcional: resetear el scanner después de un breve delay
      setTimeout(() => {
        resetScanner();
      }, 1000);
      
    } else {
      // Para otros tipos de datos JSON, mostrar en modal
      addToHistory(data, 'JSON Data');
    }
  } catch (error) {
    // Si no es JSON, tratar como texto simple
    addToHistory(data, 'Text Code');
  }
};

// Nueva función para renderizar detalles del proyecto en el modal
const renderProjectDetailsModal = () => {
  if (!scannedData || !scannedData.displayData) return null;
  
  const project = scannedData.displayData;
  
  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailTitle}>{t('projectInformation')}</Text>
      
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>{t('basicInfo')}</Text>
        <View style={styles.detailItem}>
          <Ionicons name="business-outline" size={16} color="#3498db" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>{t('propertyName')}</Text>
            <Text style={styles.detailValue}>{project.propertyName || project.projectId || t('unknown')}</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#3498db" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>{t('address')}</Text>
            <Text style={styles.detailValue}>{project.propertyAddress || t('unknown')}</Text>
          </View>
        </View>
        
        {project.city && (
          <View style={styles.detailItem}>
            <Ionicons name="navigate-outline" size={16} color="#3498db" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>{t('city')}</Text>
              <Text style={styles.detailValue}>{project.city}</Text>
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>{t('projectDetails')}</Text>
        <View style={styles.detailsGrid}>
          {project.totalUnits && (
            <View style={styles.detailCard}>
              <Ionicons name="people-outline" size={20} color="#2ecc71" />
              <Text style={styles.detailCardValue}>{project.totalUnits}</Text>
              <Text style={styles.detailCardLabel}>{t('totalUnits')}</Text>
            </View>
          )}
          
          {project.buildType && (
            <View style={styles.detailCard}>
              <Ionicons name="construct-outline" size={20} color="#e67e22" />
              <Text style={styles.detailCardValue}>{project.buildType}</Text>
              <Text style={styles.detailCardLabel}>{t('buildType')}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.importButton]}
          onPress={() => importProject(scannedData.data)}
          disabled={importing}
        >
          {importing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="download-outline" size={18} color="#ffffff" />
              <Text style={styles.actionButtonText}>{t('importProject')}</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewDetailsButton]}
          onPress={() => {
            setShowResultsModal(false);
            // Navegar a la vista de detalles del proyecto
            navigation.navigate('ProjectDetails', { 
              projectData: scannedData.data,
              fromScan: true 
            });
          }}
        >
          <Ionicons name="eye-outline" size={18} color="#ffffff" />
          <Text style={styles.actionButtonText}>{t('viewFullDetails')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
  
  // const addToHistory = (data, type = 'Unknown') => {
  //   const newScan = {
  //     id: Date.now(),
  //     type: type,
  //     code: data.length > 30 ? data.substring(0, 30) + '...' : data,
  //     location: 'Scanned Location',
  //     timestamp: new Date().toLocaleString(),
  //     status: 'New Scan',
  //     data: data
  //   };
    
  //   const updatedHistory = [newScan, ...scanHistory];
  //   setScanHistory(updatedHistory);
  //   saveScanHistory(updatedHistory);
    
  //   setScannedData(newScan);
  //   setShowResultsModal(true);
  // };

  const addToHistory = (data, type = 'Unknown') => {
  const newScan = {
    id: Date.now(),
    type: type,
    code: data.length > 30 ? data.substring(0, 30) + '...' : data,
    location: 'Scanned Location',
    timestamp: new Date().toLocaleString(),
    status: 'New Scan',
    data: data
  };
  
  const updatedHistory = [newScan, ...scanHistory];
  setScanHistory(updatedHistory);
  saveScanHistory(updatedHistory);
  
  // Para datos que no son proyectos, mostrar en modal
  if (type !== 'Fiber Project') {
    setScannedData(newScan);
    setShowResultsModal(true);
  }
};

  const importProject = async (projectData) => {
    try {
      setImporting(true);
      
      // Verificar si ya existe en AsyncStorage
      const existingProjects = await AsyncStorage.getItem('fiberProjects');
      const projects = existingProjects ? JSON.parse(existingProjects) : [];
      
      const projectExists = projects.some(project => 
        project.projectId === projectData.projectId || 
        project.propertyName === projectData.propertyName
      );
      
      if (projectExists) {
        Alert.alert(
          t('projectAlreadyImported'),
          t('projectAlreadyImportedMessage'),
          [
            {
              text: t('ok'),
              onPress: () => {
                setShowResultsModal(false);
                resetScanner();
              }
            }
          ]
        );
        return;
      }
      
      // Usar la función de importación del servicio de almacenamiento
      const success = await importProjectData(projectData);
      
      if (success) {
        // Actualizar el estado del scan en el historial
        const updatedHistory = scanHistory.map(scan =>
          scan.id === scannedData.id 
            ? { ...scan, status: 'Imported' }
            : scan
        );
        
        setScanHistory(updatedHistory);
        saveScanHistory(updatedHistory);
        
        Alert.alert(
          t('success'),
          t('projectImportedSuccessfully'),
          [
            {
              text: t('ok'),
              onPress: () => {
                setShowResultsModal(false);
                resetScanner();
                navigation.navigate('Projects');
              }
            }
          ]
        );
      } else {
        throw new Error('Import failed');
      }
    } catch (error) {
      console.error('Error importing project:', error);
      Alert.alert(t('error'), t('couldNotImportProject'));
    } finally {
      setImporting(false);
    }
  };

  const viewScanDetails = (scan) => {
    setSelectedScan(scan);
    setModalVisible(true);
    setShowResultsModal(false);
  };

  const resetScanner = () => {
    setScanned(false);
    setCameraVisible(true);
    setScannedData(null);
    setShowResultsModal(false);
  };

  const openHistory = () => {
    setModalVisible(true);
  };

  // Función para seleccionar imagen de la galería
  const pickImageFromGallery = async () => {
    try {
      setLoadingImage(true);
      
      const isExpoGo = Constants.appOwnership === 'expo';
      
      if (isExpoGo) {
        Alert.alert(
          '📱 Limitación de Expo Go',
          'Para escanear QR desde galería necesitas crear un development build.',
          [
            {
              text: 'Entrada manual',
              onPress: () => manualQRInput()
            },
            {
              text: 'Entendido',
              style: 'cancel'
            }
          ]
        );
        setLoadingImage(false);
        return;
      }
      
      // Para development builds
      Alert.alert(
        'Función en desarrollo',
        'El escaneo de QR desde galería está disponible solo en development builds completos.',
        [
          {
            text: 'Entrada manual',
            onPress: () => manualQRInput()
          }
        ]
      );
    } catch (error) {
      console.error('Error accediendo a galería:', error);
      Alert.alert('Error', 'No se pudo acceder a la galería');
    } finally {
      setLoadingImage(false);
    }
  };

  // Alternativa: permitir al usuario ingresar manualmente el código QR
  const manualQRInput = () => {
    Alert.prompt(
      t('manualQRInput'),
      t('enterQRCodeManually'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('process'),
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

  // const simulateScan = () => {
  //   // Simular escaneo de un código QR de proyecto Fiber
  //   const mockProjectData = JSON.stringify({
  //     projectType: 'fiberProject',
  //     projectId: 'FBR-' + Date.now(),
  //     propertyName: 'OAK GATE CONDO PH3',
  //     propertyAddress: '601-615 NW 29th AVE',
  //     city: 'GAINESVILLE',
  //     totalUnits: 128,
  //     buildType: 'MDU',
  //     scanDate: new Date().toISOString(),
  //     fibers: [
  //       { id: 'F1', status: 'active', length: 150 },
  //       { id: 'F2', status: 'active', length: 150 }
  //     ],
  //     splices: [
  //       { id: 'S1', location: 'Main Panel', loss: 0.2 }
  //     ]
  //   });
    
  //   processScannedData(mockProjectData);
  // };

  // Modal para mostrar resultados del escaneo
  
  const simulateScan = () => {
  // Simular escaneo de un código QR de proyecto Fiber con datos esenciales
  const mockProjectData = JSON.stringify({
    projectType: 'fiberProject',
    projectId: 'FBR-' + Date.now(),
    propertyName: 'OAK GATE CONDO PH3',
    propertyAddress: '601-615 NW 29th AVE',
    city: 'GAINESVILLE',
    totalUnits: 128,
    buildType: 'MDU',
    scanDate: new Date().toISOString(),
    // No incluir arrays grandes en la simulación
    // fibers: [], // Comentado para evitar datos grandes
    // splices: []  // Comentado para evitar datos grandes
  });
  
  processScannedData(mockProjectData);
};

  // const renderResultsModal = () => {
  //   if (!scannedData) return null;

  //   return (
  //     <Modal
  //       visible={showResultsModal}
  //       animationType="slide"
  //       transparent={true}
  //       onRequestClose={() => setShowResultsModal(false)}
  //     >
  //       <View style={styles.modalContainer}>
  //         <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
  //           <View style={styles.modalHeader}>
  //             <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
  //               {t('scanResults')}
  //             </Text>
  //             <TouchableOpacity onPress={() => setShowResultsModal(false)}>
  //               <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
  //             </TouchableOpacity>
  //           </View>

  //           <ScrollView style={styles.resultsScroll}>
  //             {scannedData.type === 'Fiber Project' ? (
  //               <View style={styles.detailsContainer}>
  //                 <Text style={styles.detailTitle}>{t('projectInformation')}</Text>
                  
  //                 <View style={styles.detailItem}>
  //                   <Text style={styles.detailLabel}>{t('propertyName')}:</Text>
  //                   <Text style={styles.detailValue}>{scannedData.data.propertyName || scannedData.data.projectId || t('unknown')}</Text>
  //                 </View>
                  
  //                 <View style={styles.detailItem}>
  //                   <Text style={styles.detailLabel}>{t('address')}:</Text>
  //                   <Text style={styles.detailValue}>{scannedData.data.propertyAddress || t('unknown')}</Text>
  //                 </View>
                  
  //                 {scannedData.data.city && (
  //                   <View style={styles.detailItem}>
  //                     <Text style={styles.detailLabel}>{t('city')}:</Text>
  //                     <Text style={styles.detailValue}>{scannedData.data.city}</Text>
  //                   </View>
  //                 )}
                  
  //                 {scannedData.data.totalUnits && (
  //                   <View style={styles.detailItem}>
  //                     <Text style={styles.detailLabel}>{t('totalUnits')}:</Text>
  //                     <Text style={styles.detailValue}>{scannedData.data.totalUnits}</Text>
  //                   </View>
  //                 )}
                  
  //                 {scannedData.data.buildType && (
  //                   <View style={styles.detailItem}>
  //                     <Text style={styles.detailLabel}>{t('buildType')}:</Text>
  //                     <Text style={styles.detailValue}>{scannedData.data.buildType}</Text>
  //                   </View>
  //                 )}
                  
  //                 <TouchableOpacity 
  //                   style={styles.viewProjectButton}
  //                   onPress={() => importProject(scannedData.data)}
  //                   disabled={importing}
  //                 >
  //                   {importing ? (
  //                     <ActivityIndicator color="#ffffff" />
  //                   ) : (
  //                     <Text style={styles.viewProjectButtonText}>{t('importProject')}</Text>
  //                   )}
  //                 </TouchableOpacity>
  //               </View>
  //             ) : (
  //               <View style={styles.detailsContainer}>
  //                 <Text style={styles.detailTitle}>{t('scannedContent')}</Text>
                  
  //                 <View style={styles.dataContainer}>
  //                   <Text style={styles.dataText}>{scannedData.data}</Text>
  //                 </View>
                  
  //                 <TouchableOpacity 
  //                   style={styles.actionButton}
  //                   onPress={() => {
  //                     Clipboard.setString(scannedData.data);
  //                     Alert.alert(t('success'), t('copiedToClipboard'));
  //                   }}
  //                 >
  //                   <Text style={styles.actionButtonText}>{t('copyToClipboard')}</Text>
  //                 </TouchableOpacity>
                  
  //                 {scannedData.data && scannedData.data.startsWith('http') && (
  //                   <TouchableOpacity 
  //                     style={[styles.actionButton, { backgroundColor: '#3498db' }]}
  //                     onPress={() => Linking.openURL(scannedData.data)}
  //                   >
  //                     <Text style={styles.actionButtonText}>{t('openLink')}</Text>
  //                   </TouchableOpacity>
  //                 )}
  //               </View>
  //             )}
  //           </ScrollView>

  //           <TouchableOpacity 
  //             style={[styles.modalCloseButton, { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
  //             onPress={() => {
  //               setShowResultsModal(false);
  //               resetScanner();
  //             }}
  //           >
  //             <Text style={[styles.modalCloseButtonText, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
  //               {t('scanAnother')}
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </Modal>
  //   );
  // };

//   return (
//     <View style={[styles.container, { paddingBottom: bottomInset }]}>
//       {/* Header */}
//       <View style={[styles.header, { paddingTop: topInset + 15 }]}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#ffffff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{t('scanQrCode')}</Text>
//         <TouchableOpacity onPress={openHistory}>
//           <Ionicons name="time-outline" size={24} color="#3498db" />
//         </TouchableOpacity>
//       </View>

//       {/* Camera View */}
//       {cameraVisible && (
//         <View style={styles.cameraContainer}>
//           <CameraView
//             style={styles.camera}
//             facing="back"
//             onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
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
            
//             <Text style={styles.scanText}>{t('alignQrInFrame')}</Text>
            
//             <View style={styles.controls}>
//               <TouchableOpacity 
//                 style={styles.simulateButton}
//                 onPress={simulateScan}
//               >
//                 <Ionicons name="qr-code-outline" size={20} color="#ffffff" />
//                 <Text style={styles.simulateButtonText}>{t('simulateScan')}</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[styles.simulateButton, { backgroundColor: '#9b59b6', marginTop: 10 }]}
//                 onPress={pickImageFromGallery}
//                 disabled={loadingImage}
//               >
//                 {loadingImage ? (
//                   <ActivityIndicator size="small" color="#ffffff" />
//                 ) : (
//                   <>
//                     <Ionicons name="image-outline" size={20} color="#ffffff" />
//                     <Text style={styles.simulateButtonText}>{t('loadFromGallery')}</Text>
//                   </>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.simulateButton, { backgroundColor: '#e67e22', marginTop: 10 }]}
//                 onPress={manualQRInput}
//               >
//                 <Ionicons name="create-outline" size={20} color="#ffffff" />
//                 <Text style={styles.simulateButtonText}>{t('manualInput')}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Results View */}
//       {scanned && !cameraVisible && (
//         <View style={styles.resultsContainer}>
//           <Ionicons name="checkmark-circle" size={64} color="#2ecc71" />
//           <Text style={styles.resultsTitle}>{t('scanSuccessful')}</Text>
//           <Text style={styles.resultsText}>
//             {t('qrCodeProcessed')}
//           </Text>
          
//           <TouchableOpacity 
//             style={styles.scanAgainButton}
//             onPress={resetScanner}
//           >
//             <Ionicons name="scan-outline" size={20} color="#ffffff" />
//             <Text style={styles.scanAgainButtonText}>{t('scanAnotherCode')}</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Scan History Modal */}
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
//                 {selectedScan ? t('scanDetails') : t('scanHistory')}
//               </Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
//               </TouchableOpacity>
//             </View>

//             {selectedScan ? (
//               selectedScan.type === 'Fiber Project' ? renderProjectDetails() : renderTextDetails()
//             ) : (
//               <ScrollView style={styles.historyScroll}>
//                 {scanHistory.length > 0 ? (
//                   scanHistory.map((item) => (
//                     <TouchableOpacity
//                       key={item.id}
//                       style={[styles.historyItem, { backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa' }]}
//                       onPress={() => viewScanDetails(item)}
//                     >
//                       <View style={styles.historyIcon}>
//                         <Ionicons 
//                           name={item.type === 'Fiber Project' ? 'business' : 'qr-code'} 
//                           size={20} 
//                           color="#3498db" 
//                         />
//                       </View>
//                       <View style={styles.historyContent}>
//                         <Text style={[styles.historyCode, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
//                           {item.code}
//                         </Text>
//                         <Text style={styles.historyType}>{item.type}</Text>
//                         <Text style={styles.historyTime}>{item.timestamp}</Text>
//                       </View>
//                       <View style={[
//                         styles.statusBadge,
//                         { backgroundColor: item.status === 'Active' ? '#2ecc71' : '#e67e22' }
//                       ]}>
//                         <Text style={styles.statusText}>{item.status}</Text>
//                       </View>
//                     </TouchableOpacity>
//                   ))
//                 ) : (
//                   <View style={styles.emptyHistory}>
//                     <Ionicons name="time-outline" size={48} color="#7f8c8d" />
//                     <Text style={[styles.emptyHistoryText, { color: isDarkMode ? '#b0b0b0' : '#7f8c8d' }]}>
//                       {t('noScanHistory')}
//                     </Text>
//                   </View>
//                 )}
//               </ScrollView>
//             )}

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
//                 {selectedScan ? t('backToHistory') : t('close')}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {(importing || loadingImage) && (
//         <View style={styles.importingOverlay}>
//           <ActivityIndicator size="large" color="#3498db" />
//           <Text style={styles.importingText}>
//             {importing ? t('importingProject') : t('processingImage')}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

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
              {scannedData.type === 'Large Data' ? t('largeData') : t('scanResults')}
            </Text>
            <TouchableOpacity onPress={() => setShowResultsModal(false)}>
              <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.resultsScroll}>
            {scannedData.type === 'Large Data' ? (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>{t('largeDataContent')}</Text>
                
                <View style={styles.dataContainer}>
                  <Text style={styles.dataText}>
                    {scannedData.data.length > 500 
                      ? scannedData.data.substring(0, 500) + '...' 
                      : scannedData.data
                    }
                  </Text>
                </View>
                
                <Text style={styles.infoText}>
                  {t('largeDataInfo')}
                </Text>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    Clipboard.setString(scannedData.data);
                    Alert.alert(t('success'), t('copiedToClipboard'));
                  }}
                >
                  <Ionicons name="copy-outline" size={18} color="#ffffff" />
                  <Text style={styles.actionButtonText}>{t('copyToClipboard')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>{t('scannedContent')}</Text>
                
                <View style={styles.dataContainer}>
                  <Text style={styles.dataText}>{scannedData.data}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    Clipboard.setString(scannedData.data);
                    Alert.alert(t('success'), t('copiedToClipboard'));
                  }}
                >
                  <Ionicons name="copy-outline" size={18} color="#ffffff" />
                  <Text style={styles.actionButtonText}>{t('copyToClipboard')}</Text>
                </TouchableOpacity>
                
                {scannedData.data && scannedData.data.startsWith('http') && (
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#3498db' }]}
                    onPress={() => Linking.openURL(scannedData.data)}
                  >
                    <Ionicons name="open-outline" size={18} color="#ffffff" />
                    <Text style={styles.actionButtonText}>{t('openLink')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity 
            style={[styles.modalCloseButton, { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
            onPress={() => {
              setShowResultsModal(false);
              resetScanner();
            }}
          >
            <Text style={[styles.modalCloseButtonText, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
              {t('scanAnother')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}; 

return (
    <View style={[styles.container, { paddingBottom: bottomInset }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 15 }]}>
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

      {/* Camera View */}
      {cameraVisible && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
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
              <TouchableOpacity 
                style={styles.simulateButton}
                onPress={simulateScan}
              >
                <Ionicons name="qr-code-outline" size={20} color="#ffffff" />
                <Text style={styles.simulateButtonText}>{t('simulateScan')}</Text>
              </TouchableOpacity>
              
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
                    <Text style={styles.simulateButtonText}>{t('loadFromGallery')}</Text>
                  </>
                )}
              </TouchableOpacity>

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

      {/* Results View */}
      {scanned && !cameraVisible && !showResultsModal && (
        <View style={styles.resultsContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#2ecc71" />
          <Text style={styles.resultsTitle}>{t('scanSuccessful')}</Text>
          <Text style={styles.resultsText}>
            {t('qrCodeProcessed')}
          </Text>
          
          <TouchableOpacity 
            style={styles.scanAgainButton}
            onPress={resetScanner}
          >
            <Ionicons name="scan-outline" size={20} color="#ffffff" />
            <Text style={styles.scanAgainButtonText}>{t('scanAnotherCode')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de resultados */}
      {renderResultsModal()}

      {/* Scan History Modal */}
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
                {selectedScan ? t('scanDetails') : t('scanHistory')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>

            {selectedScan ? (
              selectedScan.type === 'Fiber Project' ? renderProjectDetails() : renderTextDetails()
            ) : (
              <ScrollView style={styles.historyScroll}>
                {scanHistory.length > 0 ? (
                  scanHistory.map((item) => (
                    <TouchableOpacity
                      key={item.id}
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
                          {item.code}
                        </Text>
                        <Text style={styles.historyType}>{item.type}</Text>
                        <Text style={styles.historyTime}>{item.timestamp}</Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: item.status === 'Imported' ? '#2ecc71' : '#e67e22' }
                      ]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyHistory}>
                    <Ionicons name="time-outline" size={48} color="#7f8c8d" />
                    <Text style={[styles.emptyHistoryText, { color: isDarkMode ? '#b0b0b0' : '#7f8c8d' }]}>
                      {t('noScanHistory')}
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}

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
                {selectedScan ? t('backToHistory') : t('close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {(importing || loadingImage) && (
        <View style={styles.importingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.importingText}>
            {importing ? t('importingProject') : t('processingImage')}
          </Text>
        </View>
      )}
    </View>
  );
};

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
    padding: 16,
    paddingTop: 50,
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
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
    position: 'relative'
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
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    maxWidth: '60%',
    textAlign: 'right',
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
  viewProjectButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#95a5a6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  viewProjectButtonText: {
    color: '#ffffff',
    fontWeight: '600',
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
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  detailCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    minWidth: 100,
  },
  detailCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 5,
  },
  detailCardLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  importButton: {
    backgroundColor: '#2ecc71',
  },
  viewDetailsButton: {
    backgroundColor: '#3498db',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  
  dataText: {
    fontSize: 14,
    // color: isDarkMode ? '#ffffff' : '#2c3e50',
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
});

export default ScanQr;