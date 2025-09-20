import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { useDevice } from '../context/DeviceContext';

const ScanQr = ({ navigation }) => {
  const { topInset } = useDevice;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(true);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { t } = useTranslation();
  const { isDarkMode } = useApp();

  // Datos de ejemplo para el historial
  const exampleScans = [
    {
      id: 1,
      type: 'Fiber Cable',
      code: 'FBR-2024-001',
      location: 'Main Distribution Frame',
      timestamp: '2024-03-15 10:30:45',
      status: 'Active'
    },
    {
      id: 2,
      type: 'Switch',
      code: 'SW-2024-008',
      location: 'Server Room A',
      timestamp: '2024-03-14 14:22:18',
      status: 'Maintenance Needed'
    },
    {
      id: 3,
      type: 'ONT',
      code: 'ONT-2024-123',
      location: 'Apartment 305',
      timestamp: '2024-03-13 09:15:32',
      status: 'Installed'
    }
  ];

  useEffect(() => {
    // Cargar historial de escaneos (simulado)
    setScanHistory(exampleScans);
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setCameraVisible(false);
    
    // Procesar el código QR escaneado
    processScannedData(data);
  };

  const processScannedData = (data) => {
    try {
      // Intentar parsear como JSON (si es un proyecto)
      const parsedData = JSON.parse(data);
      
      Alert.alert(
        'Project QR Scanned',
        `Project: ${parsedData.propertyName}\nAddress: ${parsedData.propertyAddress}`,
        [
          {
            text: 'View Details',
            onPress: () => viewScanDetails(parsedData)
          },
          {
            text: 'Scan Again',
            onPress: () => resetScanner(),
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      // Si no es JSON, tratar como código simple
      Alert.alert(
        'QR Code Scanned',
        `Code: ${data}`,
        [
          {
            text: 'Save to History',
            onPress: () => addToHistory(data)
          },
          {
            text: 'Scan Again',
            onPress: () => resetScanner(),
            style: 'cancel'
          }
        ]
      );
    }
  };

  const addToHistory = (data) => {
    const newScan = {
      id: Date.now(),
      type: 'Unknown Device',
      code: data,
      location: 'Scanned Location',
      timestamp: new Date().toLocaleString(),
      status: 'New Scan'
    };
    
    setScanHistory(prev => [newScan, ...prev]);
    resetScanner();
  };

  const viewScanDetails = (data) => {
    setSelectedScan(data);
    setModalVisible(true);
  };

  const resetScanner = () => {
    setScanned(false);
    setCameraVisible(true);
  };

  const openHistory = () => {
    setModalVisible(true);
  };

  const simulateScan = () => {
    // Simular escaneo de un código QR de proyecto
    const mockProjectData = JSON.stringify({
      propertyName: 'OAK GATE CONDO PH3',
      propertyAddress: '601-615 NW 29th AVE',
      city: 'GAINESVILLE',
      totalUnits: 128,
      buildType: 'MDU',
      scanDate: new Date().toISOString()
    });
    
    processScannedData(mockProjectData);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#7f8c8d" />
          <Text style={styles.permissionTitle}>{t('accesosCamara')}</Text>
          <Text style={styles.permissionText}>
            {t('needAccess')}
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>{t('grantPermission')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
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
            facing="back"  // Cambiado de CameraType.back a string "back"
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
              
              <Text style={styles.scanText}>{t('alignScan')}</Text>
              
              <View style={styles.controls}>
                <TouchableOpacity 
                  style={styles.simulateButton}
                  onPress={simulateScan}
                >
                  <Ionicons name="qr-code-outline" size={20} color="#ffffff" />
                  <Text style={styles.simulateButtonText}>{t('simulateScan')}</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
      )}

      {/* Results View */}
      {scanned && !cameraVisible && (
        <View style={styles.resultsContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#2ecc71" />
          <Text style={styles.resultsTitle}>Scan Successful!</Text>
          <Text style={styles.resultsText}>
            QR code has been processed successfully
          </Text>
          
          <TouchableOpacity 
            style={styles.scanAgainButton}
            onPress={resetScanner}
          >
            <Ionicons name="scan-outline" size={20} color="#ffffff" />
            <Text style={styles.scanAgainButtonText}>Scan Another Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scan History Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedScan ? 'Scan Details' : 'Scan History'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            {selectedScan ? (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>Project Information</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Property Name:</Text>
                  <Text style={styles.detailValue}>{selectedScan.propertyName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>{selectedScan.propertyAddress}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>City:</Text>
                  <Text style={styles.detailValue}>{selectedScan.city}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Total Units:</Text>
                  <Text style={styles.detailValue}>{selectedScan.totalUnits}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Build Type:</Text>
                  <Text style={styles.detailValue}>{selectedScan.buildType}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.viewProjectButton}
                  onPress={() => {
                    setModalVisible(false);
                    // Navegar a vista de proyecto si es necesario
                    Alert.alert('View Project', 'Would open project details view');
                  }}
                >
                  <Text style={styles.viewProjectButtonText}>View Full Project</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={styles.historyScroll}>
                {scanHistory.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyItem}
                    onPress={() => setSelectedScan(item)}
                  >
                    <View style={styles.historyIcon}>
                      <Ionicons name="qr-code" size={20} color="#3498db" />
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyCode}>{item.code}</Text>
                      <Text style={styles.historyType}>{item.type}</Text>
                      <Text style={styles.historyTime}>{item.timestamp}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: item.status === 'Active' ? '#2ecc71' : '#e67e22' }
                    ]}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => {
                if (selectedScan) {
                  setSelectedScan(null);
                } else {
                  setModalVisible(false);
                }
              }}
            >
              <Text style={styles.modalCloseButtonText}>
                {selectedScan ? 'Back to History' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Los estilos permanecen igual...
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
    ...StyleSheet.absoluteFillObject, // cubre toda la pantalla
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scanFrame: {
    width: 250, height: 250, borderWidth: 2, borderColor: '#fff', borderRadius: 12 },
  cornerTopLeft:  { position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#3498db' 
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
    marginTop: 20,
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
    backgroundColor: '#1a1a1a',
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
    color: '#ffffff',
  },
  historyScroll: {
    maxHeight: 400,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
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
    color: '#ffffff',
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
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  detailLabel: {
    fontSize: 14,
    color: '#bdc3c7',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  viewProjectButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  viewProjectButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalCloseButton: {
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default ScanQr;