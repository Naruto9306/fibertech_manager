// screens/NetworkMap.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NodeService, DeviceConfigService, FiberConfigService, NetworkMapService } from '../../service/storage';

const { width, height } = Dimensions.get('window');

const NetworkMap = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [nodes, setNodes] = useState([]);
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const [devices, setDevices] = useState([]);
  const [fibers, setFibers] = useState([]);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [configType, setConfigType] = useState(''); 

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [nodeForm, setNodeForm] = useState({
    name: '',
    owner: '',
    address: '',
    selectedFibers: [],
    selectedDevices: []
  });
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Cargar nodos existentes y configuración
  useEffect(() => {
    loadData();
    loadSavedNetworkMap();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Could not access location');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

// const openConfigModal = async (item, type) => {
//   console.log('Opening config modal:', type, item);
  
//   if (!item) {
//     Alert.alert('Error', 'Configuration item not found');
//     return;
//   }
  
//   // Cerrar primero el modal del nodo
//   setShowNodeModal(false);
  
//   // Pequeña pausa para permitir que el modal se cierre completamente
//   await new Promise(resolve => setTimeout(resolve, 100));
  
//   // Crear un objeto limpio con solo las propiedades necesarias
//   let configItem;
//   if (type === 'device') {
//     configItem = {
//       type: item.type,
//       ports: item.ports,
//       quantity: item.quantity,
//       portsUsed: item.portsUsed || Array(item.ports).fill().map((_, i) => ({
//         port: i + 1,
//         description: '',
//         connectedTo: ''
//       }))
//     };
//   } else {
//     configItem = {
//       type: item.type,
//       quantity: item.quantity,
//       colors: item.colors || Array(item.quantity).fill().map((_, i) => ({
//         color: `Color ${i + 1}`,
//         description: '',
//         connectedTo: ''
//       }))
//     };
//   }
  
//   console.log('Clean config item:', configItem);
//   setCurrentConfig(configItem);
//   setConfigType(type);
//   setShowConfigModal(true);
//   console.log('Config modal should be visible now');
// };
// const openConfigModal = async (item, type) => {
//   console.log('Opening config modal:', type, item);
  
//   if (!item) {
//     Alert.alert('Error', 'Configuration item not found');
//     return;
//   }
  
//   // Cerrar primero el modal del nodo
//   setShowNodeModal(false);
  
//   // Pequeña pausa para permitir que el modal se cierre completamente
//   await new Promise(resolve => setTimeout(resolve, 100));
  
//   // Crear un objeto limpio con solo las propiedades necesarias
//   let configItem;
//   if (type === 'device') {
//     configItem = {
//       type: item.type,
//       ports: item.ports,
//       quantity: item.quantity,
//       portsUsed: item.portsUsed || Array(item.ports).fill().map((_, i) => ({
//         port: i + 1,
//         description: '',
//         connectedTo: ''
//       }))
//     };
//   } else {
//     // Para fibra, usar colores estándar
//     const standardColors = getStandardFiberColors(item.type);
//     configItem = {
//       type: item.type,
//       quantity: item.quantity,
//       colors: item.colors || standardColors.map((color, index) => ({
//         color: color,
//         description: '',
//         connectedTo: ''
//       }))
//     };
//   }
  
//   console.log('Clean config item:', configItem);
//   setCurrentConfig(configItem);
//   setConfigType(type);
//   setShowConfigModal(true);
//   console.log('Config modal should be visible now');
// };
const openConfigModal = async (item, type) => {
  console.log('Opening config modal:', type, item);
  console.log('Item colors:', item.colors);
  
  if (!item) {
    Alert.alert('Error', 'Configuration item not found');
    return;
  }
  
  // Cerrar primero el modal del nodo
  setShowNodeModal(false);
  
  // Pequeña pausa para permitir que el modal se cierre completamente
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Crear un objeto limpio con solo las propiedades necesarias
  let configItem;
  if (type === 'device') {
    configItem = {
      type: item.type,
      ports: item.ports,
      quantity: item.quantity,
      portsUsed: item.portsUsed || Array(item.ports).fill().map((_, i) => ({
        port: i + 1,
        description: '',
        connectedTo: ''
      }))
    };
  } else {
    // Para fibra, usar colores estándar pero preservar los existentes
    const standardColors = getStandardFiberColors(item.type);
    
    // Siempre usar todos los colores estándar, preservando los datos existentes
  const existingColors = item.colors || [];
  const colors = standardColors.map((standardColor, index) => {
    const existingColor = existingColors.find(ec => ec.color === standardColor);
    return existingColor || {
      color: standardColor,
      description: '',
      connectedTo: ''
    };
  });
  
  configItem = {
    type: item.type,
    quantity: item.quantity,
    colors: colors // Todos los colores, no solo los de la cantidad
  };
}
  
  console.log('Clean config item:', configItem);
  setCurrentConfig(configItem);
  setConfigType(type);
  setShowConfigModal(true);
  console.log('Config modal should be visible now');
};

// Función para obtener colores estándar según tipo de fibra
// const getStandardFiberColors = (fiberType) => {
//   // Extraer el número de fibras del tipo (ej: "12F" -> 12)
//   const fiberCount = parseInt(fiberType.replace(/\D/g, ''));
  
//   if (isNaN(fiberCount)) return [];
  
//   // Colores estándar para 12 fibras (en orden)
//   const standard12Colors = [
//     "Blue", "Orange", "Green", "Brown", "Slate", "White",
//     "Red", "Black", "Yellow", "Violet", "Rose", "Aqua"
//   ];
  
//   // Para tipos con múltiplos de 12
//   if (fiberCount % 12 === 0) {
//     const tubeCount = fiberCount / 12;
//     const colors = [];
    
//     for (let tube = 1; tube <= tubeCount; tube++) {
//       standard12Colors.forEach(color => {
//         colors.push(`${tube}-${color}`);
//       });
//     }
    
//     return colors;
//   }
  
//   // Para tipos que no son múltiplos de 12
//   const colors = [];
//   for (let i = 1; i <= fiberCount; i++) {
//     colors.push(`Fiber ${i}`);
//   }
  
//   return colors;
// };
// Función para obtener colores estándar según tipo de fibra
// const getStandardFiberColors = (fiberType) => {
//   if (!fiberType) return [];
  
//   // Extraer el número de fibras del tipo (ej: "12F" -> 12)
//   const fiberCount = parseInt(fiberType.replace(/\D/g, ''));
  
//   if (isNaN(fiberCount)) {
//     // Si no es un formato numérico, devolver colores genéricos
//     return Array(12).fill().map((_, i) => `Fiber ${i + 1}`);
//   }
  
//   // Colores estándar para 12 fibras (en orden)
//   const standard12Colors = [
//     "Blue", "Orange", "Green", "Brown", "Slate", "White",
//     "Red", "Black", "Yellow", "Violet", "Rose", "Aqua"
//   ];
  
//   // Para tipos con múltiplos de 12
//   if (fiberCount % 12 === 0) {
//     const tubeCount = fiberCount / 12;
//     const colors = [];
    
//     for (let tube = 1; tube <= tubeCount; tube++) {
//       standard12Colors.forEach(color => {
//         colors.push(`${tube}-${color}`);
//       });
//     }
    
//     return colors;
//   }
  
//   // Para tipos que no son múltiplos de 12
//   const colors = [];
//   for (let i = 1; i <= fiberCount; i++) {
//     colors.push(`Fiber ${i}`);
//   }
  
//   return colors;
// };
// Función para obtener colores estándar según tipo de fibra
const getStandardFiberColors = (fiberType) => {
  if (!fiberType) return [];
  
  console.log('Getting standard colors for fiber type:', fiberType);
  
  // Extraer el número de fibras del tipo (ej: "12F" -> 12)
  const fiberCount = parseInt(fiberType.replace(/\D/g, ''));
  
  if (isNaN(fiberCount)) {
    // Si no es un formato numérico, devolver colores genéricos
    console.log('Non-numeric fiber type, returning generic colors');
    return Array(12).fill().map((_, i) => `Fiber ${i + 1}`);
  }
  
  // Colores estándar para 12 fibras (en orden)
  const standard12Colors = [
    "Blue", "Orange", "Green", "Brown", "Slate", "White",
    "Red", "Black", "Yellow", "Violet", "Rose", "Aqua"
  ];
  
  console.log('Fiber count:', fiberCount);
  
  // Para tipos con múltiplos de 12
  if (fiberCount % 12 === 0) {
    const tubeCount = fiberCount / 12;
    const colors = [];
    
    for (let tube = 1; tube <= tubeCount; tube++) {
      standard12Colors.forEach(color => {
        colors.push(`${tube}-${color}`);
      });
    }
    
    console.log('Multiples of 12, colors:', colors);
    return colors;
  }
  
  // Para tipos que no son múltiplos de 12
  const colors = [];
  for (let i = 1; i <= fiberCount; i++) {
    colors.push(`Fiber ${i}`);
  }
  
  console.log('Non-multiples of 12, colors:', colors);
  return colors;
};


const saveConfig = (updatedConfig) => {
  if (configType === 'device') {
    setNodeForm(prev => ({
      ...prev,
      selectedDevices: prev.selectedDevices.map(d => 
        d.type === updatedConfig.type && d.ports === updatedConfig.ports
          ? updatedConfig 
          : d
      )
    }));
  } else {
    setNodeForm(prev => ({
      ...prev,
      selectedFibers: prev.selectedFibers.map(f => 
        f.type === updatedConfig.type
          ? updatedConfig 
          : f
      )
    }));
  }
  
  setShowConfigModal(false);
  
  // Reabrir el modal del nodo después de guardar la configuración
  setTimeout(() => {
    setShowNodeModal(true);
  }, 100);
};

  const loadData = async () => {
    try {
      console.log('=== LOADING DATA ===');
      
      // Cargar nodos existentes
      const existingNodes = await NodeService.getNodesByProject(projectId);
      const nodesWithIds = existingNodes.map((node, index) => ({
        ...node,
        id: node.id || `temp-${index}-${node.latitude}-${node.longitude}`
      }));
      setNodes(nodesWithIds);
      console.log('Nodes loaded:', nodesWithIds.length);

      // Cargar dispositivos y fibras configurados
      const deviceConfig = await DeviceConfigService.getDeviceConfig(projectId);
      const fiberConfig = await FiberConfigService.getFiberConfig(projectId);
      
      // Normalizar datos
      const normalizedDevices = normalizeData(deviceConfig);
      const normalizedFibers = normalizeData(fiberConfig);
      
      setDevices(normalizedDevices);
      setFibers(normalizedFibers);

    } catch (error) {
      console.log('Error loading data:', error);
      Alert.alert('Error', 'Failed to load network data');
    }
  };

  // Función para obtener dirección desde coordenadas
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      setLoadingAddress(true);
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const addressString = [
          address.street,
          address.city,
          address.region,
          address.country
        ].filter(Boolean).join(', ');
        
        return addressString;
      }
      return 'Address not available';
    } catch (error) {
      console.log('Error getting address:', error);
      return 'Error getting address';
    } finally {
      setLoadingAddress(false);
    }
  };

  // Función para verificar disponibilidad
  const getAvailableCount = (device) => {
    const deviceKey = `${device.type}-${device.ports}`;
    const totalAssigned = nodes.reduce((count, node) => {
      if (node.id === selectedNode?.id) return count;
      
      const assignedCount = node.devices?.filter(d => 
        `${d.type}-${d.ports}` === deviceKey
      ).reduce((sum, d) => sum + (d.quantity || 1), 0) || 0;
      
      return count + assignedCount;
    }, 0);

    return Math.max(0, device.count - totalAssigned);
  };

  // Función para obtener la cantidad ya asignada en este nodo - CORREGIDA
  const getAssignedInThisNode = (device) => {
    if (!selectedNode?.id) return 0;
    
    const deviceKey = `${device.type}-${device.ports}`;
    const node = nodes.find(n => n.id === selectedNode.id);
    
    if (!node || !node.devices) return 0;
    
    const assignedDevice = node.devices.find(d => 
      `${d.type}-${d.ports}` === deviceKey
    );
    
    return assignedDevice ? (assignedDevice.quantity || 1) : 0;
  };

  // Guardar el mapa de red
//   const saveNetworkMap = async () => {
//     try {
//       const networkMapData = {
//         projectId,
//         nodes,
//         createdAt: new Date().toISOString()
//       };
      
//       await AsyncStorage.setItem(`networkMap_${projectId}`, JSON.stringify(networkMapData));
      
//       Alert.alert('Success', 'Network map saved successfully!', [
//         {
//           text: 'View on map',
//           onPress: () => navigation.navigate('NetworkMap', { projectId })
//         },
//         {
//           text: 'Exit',
//           onPress: () => navigation.navigate('Dashboard')
//         }
//       ]);
//     } catch (error) {
//       console.log('Error saving network map:', error);
//       Alert.alert('Error', 'Could not save network map');
//     }
//   };
// Guardar el mapa de red completo con configuraciones
// const saveNetworkMap = async () => {
//   try {
//     const networkMapData = {
//       projectId,
//       nodes: nodes.map(node => ({
//         ...node,
//         // Asegurar que tengamos todos los datos de configuración
//         devices: node.devices || [],
//         fibers: node.fibers || [],
//         // Incluir información de conexiones si es necesario
//         connections: getConnections().filter(conn => 
//           conn.from.id === node.id || conn.to.id === node.id
//         )
//       })),
//       connections: getConnections(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };
    
//     await AsyncStorage.setItem(`networkMap_${projectId}`, JSON.stringify(networkMapData));
    
//     Alert.alert('Success', 'Network map saved successfully!', [
//       {
//         text: 'OK',
//         onPress: () => navigation.navigate('Dashboard')
//       }
//     ]);
//   } catch (error) {
//     console.log('Error saving network map:', error);
//     Alert.alert('Error', 'Could not save network map');
//   }
// };
const saveNetworkMap = async () => {
  try {
    const networkMapData = {
      projectId,
      nodes: nodes,
      connections: getConnections(),
      createdAt: new Date().toISOString()
    };
    
    const result = await NetworkMapService.saveNetworkMap(projectId, networkMapData);
    
    if (result.success) {
    //   Alert.alert('Success', 'Network map saved successfully!');
      Alert.alert('Success', 'Network map saved successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Dashboard')
        }
      ]);
    } else {
      Alert.alert('Error', 'Could not save network map');
    }
  } catch (error) {
    console.log('Error saving network map:', error);
    Alert.alert('Error', 'Could not save network map');
  }
};


// Cargar mapa de red guardado
const loadSavedNetworkMap = async () => {
  try {
    const savedMap = await AsyncStorage.getItem(`networkMap_${projectId}`);
    if (savedMap) {
      const mapData = JSON.parse(savedMap);
      
      // Actualizar el estado con los nodos guardados
      setNodes(mapData.nodes || []);
      
      // Si hay información de región guardada, puedes usarla
      if (mapData.nodes && mapData.nodes.length > 0) {
        const firstNode = mapData.nodes[0];
        setRegion({
          latitude: firstNode.latitude,
          longitude: firstNode.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
      
      console.log('Network map loaded:', mapData.nodes.length, 'nodes');
    }
  } catch (error) {
    console.log('Error loading saved network map:', error);
  }
};


const handleMapPress = async (e) => {
  if (!isAddingMode || !selectedNodeType) return;
  
  const { coordinate } = e.nativeEvent;
  
  // Obtener dirección desde coordenadas
  const address = await getAddressFromCoordinates(coordinate.latitude, coordinate.longitude);
  
  setSelectedNode({
    type: selectedNodeType,
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    name: `${selectedNodeType}_${nodes.filter(n => n.type === selectedNodeType).length + 1}`
  });
  
  setNodeForm({
    name: `${selectedNodeType}_${nodes.filter(n => n.type === selectedNodeType).length + 1}`,
    owner: '',
    address: address,
    selectedFibers: [], // Cambiado de selectedFiber a selectedFibers
    selectedDevices: []
  });
  
  setShowNodeModal(true);
};

const addNode = async () => {
  try {
    const newNode = {
      project_id: projectId,
      name: nodeForm.name,
      type: selectedNode.type,
      description: `${selectedNode.type} node`,
      latitude: selectedNode.latitude,
      longitude: selectedNode.longitude,
      owner: nodeForm.owner,
      address: nodeForm.address,
      fibers: nodeForm.selectedFibers, // Cambiado de fiber a fibers
      devices: nodeForm.selectedDevices,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const savedNode = await NodeService.createNode(newNode);
    setNodes(prev => [...prev, { ...newNode, id: savedNode.insertId }]);
    
    setShowNodeModal(false);
    setIsAddingMode(false);
    setSelectedNodeType(null);
    setSelectedNode(null);
    
    Alert.alert('Success', `${selectedNode.type} node added successfully`);

  } catch (error) {
    console.log('Error adding node:', error);
    Alert.alert('Error', 'Failed to add node');
  }
};

  // Seleccionar tipo de nodo
  const selectNodeType = (type) => {
    setSelectedNodeType(type);
    setIsAddingMode(true);
  };

const selectNode = async (node) => {
  setSelectedNode(node);
  
  const matchedDevices = devices.filter(device => 
    node.devices?.some(nd => 
      nd.type === device.type && nd.ports === device.ports
    )
  ).map(device => {
    const nodeDevice = node.devices.find(nd => 
      nd.type === device.type && nd.ports === device.ports
    );
    return {
      ...device,
      quantity: nodeDevice?.quantity || 1
    };
  });
  
  // Cambiar para manejar múltiples fibras
  const matchedFibers = fibers.filter(fiber => 
    node.fibers?.some(nf => nf.type === fiber.type)
  ).map(fiber => {
    const nodeFiber = node.fibers?.find(nf => nf.type === fiber.type);
    return {
      ...fiber,
      quantity: nodeFiber?.quantity || 1,
      colors: nodeFiber?.colors || []
    };
  });
  
  setNodeForm({
    name: node.name || '',
    owner: node.owner || '',
    address: node.address || '',
    selectedFibers: matchedFibers || [], // Cambiado de selectedFiber a selectedFibers
    selectedDevices: matchedDevices || []
  });
  
  setShowNodeModal(true);
};

const updateNode = async () => {
  try {
    const updatedNodes = nodes.map(node =>
      node.id === selectedNode.id
        ? {
            ...node,
            name: nodeForm.name,
            owner: nodeForm.owner,
            address: nodeForm.address,
            fibers: nodeForm.selectedFibers, // Cambiado de fiber a fibers
            devices: nodeForm.selectedDevices
          }
        : node
    );

    setNodes(updatedNodes);
    
    await NodeService.updateNode(selectedNode.id, {
      name: nodeForm.name,
      owner: nodeForm.owner,
      address: nodeForm.address,
      fibers: nodeForm.selectedFibers, // Cambiado de fiber a fibers
      devices: nodeForm.selectedDevices
    });
    
    setShowNodeModal(false);
    setSelectedNode(null);
    Alert.alert('Success', `Node ${selectedNode.name} updated`);

  } catch (error) {
    console.log('Error updating node:', error);
    Alert.alert('Error', 'Failed to update node');
  }
};


// const updateDeviceQuantity = (device, newQuantity) => {
//   if (newQuantity < 0) return;
  
//   const availableCount = getAvailableCount(device) + getAssignedInThisNode(device);
//   if (newQuantity > availableCount) {
//     Alert.alert('Not available', `Only ${availableCount} ${device.type} available`);
//     return;
//   }
  
//   setNodeForm(prev => {

//     const currentDevices = prev.selectedDevices || [];
//   const currentFibers = prev.selectedFibers || [];
//     const deviceKey = `${device.type}-${device.ports}`;
//     const isSelected = prev.selectedDevices.some(d => 
//       `${d.type}-${d.ports}` === deviceKey
//     );
    
//     if (isSelected) {
//       // Actualizar cantidad
//       return {
//         ...prev,
//         selectedDevices: prev.selectedDevices.map(d => 
//           `${d.type}-${d.ports}` === deviceKey 
//             ? { ...d, quantity: newQuantity }
//             : d
//         )
//       };
//     } else if (newQuantity > 0) {
//       // Agregar nuevo dispositivo
//       return {
//         ...prev,
//         selectedDevices: [...prev.selectedDevices, { 
//           ...device, 
//           quantity: newQuantity,
//           portsUsed: [] // Array para puertos utilizados
//         }]
//       };
//     } else {
//       // Eliminar dispositivo si cantidad es 0
//       return {
//         ...prev,
//         selectedDevices: prev.selectedDevices.filter(d => 
//           `${d.type}-${d.ports}` !== deviceKey
//         )
//       };
//     }
//   });
// };
const updateDeviceQuantity = (device, newQuantity) => {
  if (newQuantity < 0) return;
  
  const availableCount = getAvailableCount(device) + getAssignedInThisNode(device);
  if (newQuantity > availableCount) {
    Alert.alert('Not available', `Only ${availableCount} ${device.type} available`);
    return;
  }
  
  setNodeForm(prev => {
    const deviceKey = `${device.type}-${device.ports}`;
    const isSelected = prev.selectedDevices.some(d => 
      `${d.type}-${d.ports}` === deviceKey
    );
    
    if (isSelected) {
      // Actualizar cantidad
      return {
        ...prev,
        selectedDevices: prev.selectedDevices.map(d => 
          `${d.type}-${d.ports}` === deviceKey 
            ? { 
                ...d, 
                quantity: newQuantity,
                // Asegurar que portsUsed exista
                portsUsed: d.portsUsed || []
              }
            : d
        )
      };
    } else if (newQuantity > 0) {
      // Agregar nuevo dispositivo - SOLO propiedades necesarias
      return {
        ...prev,
        selectedDevices: [...prev.selectedDevices, { 
          type: device.type,
          ports: device.ports,
          quantity: newQuantity,
          portsUsed: [] // Array para puertos utilizados
        }]
      };
    } else {
      // Eliminar dispositivo si cantidad es 0
      return {
        ...prev,
        selectedDevices: prev.selectedDevices.filter(d => 
          `${d.type}-${d.ports}` !== deviceKey
        )
      };
    }
  });
};

const getAvailableFiberCount = (fiber) => {
  const totalAssigned = nodes.reduce((count, node) => {
    if (node.id === selectedNode?.id) return count;
    
    const assignedCount = node.fibers?.filter(f => 
      f.type === fiber.type
    ).reduce((sum, f) => sum + (f.quantity || 1), 0) || 0;
    
    return count + assignedCount;
  }, 0);

  return Math.max(0, fiber.count - totalAssigned);
};

// Función para obtener la cantidad ya asignada en este nodo
const getAssignedFiberInThisNode = (fiber) => {
  if (!selectedNode?.id) return 0;
  
  const node = nodes.find(n => n.id === selectedNode.id);
  
  if (!node || !node.fibers) return 0;
  
  const assignedFiber = node.fibers.find(f => f.type === fiber.type);
  
  return assignedFiber ? (assignedFiber.quantity || 1) : 0;
};

// const updateFiberQuantity = (fiber, newQuantity) => {
//   if (newQuantity < 0) return;
  
//   const availableCount = getAvailableFiberCount(fiber) + getAssignedFiberInThisNode(fiber);
//   if (newQuantity > availableCount) {
//     Alert.alert('Not available', `Only ${availableCount} ${fiber.type} available`);
//     return;
//   }
  
//   setNodeForm(prev => {
//     const currentDevices = prev.selectedDevices || [];
//     const currentFibers = prev.selectedFibers || [];
//     const isSelected = prev.selectedFibers.some(f => f.type === fiber.type);
    
//     if (isSelected) {
//       // Actualizar cantidad
//       return {
//         ...prev,
//         selectedFibers: prev.selectedFibers.map(f => 
//           f.type === fiber.type 
//             ? { 
//                 ...f, 
//                 quantity: newQuantity,
//                 colors: newQuantity > 0 ? 
//                   Array(newQuantity).fill().map((_, i) => ({
//                     color: `Color ${i + 1}`,
//                     used: false
//                   })) : []
//               }
//             : f
//         )
//       };
//     } else if (newQuantity > 0) {
//       // Agregar nueva fibra
//       return {
//         ...prev,
//         selectedFibers: [...prev.selectedFibers, { 
//           ...fiber, 
//           quantity: newQuantity,
//           colors: Array(newQuantity).fill().map((_, i) => ({
//             color: `Color ${i + 1}`,
//             used: false
//           }))
//         }]
//       };
//     } else {
//       // Eliminar fibra si cantidad es 0
//       return {
//         ...prev,
//         selectedFibers: prev.selectedFibers.filter(f => f.type !== fiber.type)
//       };
//     }
//   });
// };
// const updateFiberQuantity = (fiber, newQuantity) => {
//   if (newQuantity < 0) return;
  
//   const availableCount = getAvailableFiberCount(fiber) + getAssignedFiberInThisNode(fiber);
//   if (newQuantity > availableCount) {
//     Alert.alert('Not available', `Only ${availableCount} ${fiber.type} available`);
//     return;
//   }
  
//   setNodeForm(prev => {
//     const isSelected = prev.selectedFibers.some(f => f.type === fiber.type);
    
//     if (isSelected) {
//       // Actualizar cantidad
//       return {
//         ...prev,
//         selectedFibers: prev.selectedFibers.map(f => 
//           f.type === fiber.type 
//             ? { 
//                 type: fiber.type,
//                 quantity: newQuantity,
//                 colors: newQuantity > 0 ? 
//                   Array(newQuantity).fill().map((_, i) => ({
//                     color: `Color ${i + 1}`,
//                     description: '',
//                     connectedTo: ''
//                   })) : []
//               }
//             : f
//         )
//       };
//     } else if (newQuantity > 0) {
//       // Agregar nueva fibra - SOLO propiedades necesarias
//       return {
//         ...prev,
//         selectedFibers: [...prev.selectedFibers, { 
//           type: fiber.type,
//           quantity: newQuantity,
//           colors: Array(newQuantity).fill().map((_, i) => ({
//             color: `Color ${i + 1}`,
//             description: '',
//             connectedTo: ''
//           }))
//         }]
//       };
//     } else {
//       // Eliminar fibra si cantidad es 0
//       return {
//         ...prev,
//         selectedFibers: prev.selectedFibers.filter(f => f.type !== fiber.type)
//       };
//     }
//   });
// };
// const updateFiberQuantity = (fiber, newQuantity) => {
//   if (newQuantity < 0) return;
  
//   const availableCount = getAvailableFiberCount(fiber) + getAssignedFiberInThisNode(fiber);
//   if (newQuantity > availableCount) {
//     Alert.alert('Not available', `Only ${availableCount} ${fiber.type} available`);
//     return;
//   }
  
//   setNodeForm(prev => {
//     const isSelected = prev.selectedFibers.some(f => f.type === fiber.type);
//     const standardColors = getStandardFiberColors(fiber.type);
    
//     if (isSelected) {
//       // Actualizar cantidad usando colores estándar
//       return {
//         ...prev,
//         selectedFibers: prev.selectedFibers.map(f => 
//           f.type === fiber.type 
//             ? { 
//                 type: fiber.type,
//                 quantity: newQuantity,
//                 colors: newQuantity > 0 ? 
//                   standardColors.slice(0, newQuantity).map((color, index) => ({
//                     color: color,
//                     description: f.colors && f.colors[index] ? f.colors[index].description : '',
//                     connectedTo: f.colors && f.colors[index] ? f.colors[index].connectedTo : ''
//                   })) : []
//               }
//             : f
//         )
//       };
//     } else if (newQuantity > 0) {
//       // Agregar nueva fibra usando colores estándar
//       return {
//         ...prev,
//         selectedFibers: [...prev.selectedFibers, { 
//           type: fiber.type,
//           quantity: newQuantity,
//           colors: standardColors.slice(0, newQuantity).map((color, index) => ({
//             color: color,
//             description: '',
//             connectedTo: ''
//           }))
//         }]
//       };
//     } else {
//       // Eliminar fibra si cantidad es 0
//       return {
//         ...prev,
//         selectedFibers: prev.selectedFibers.filter(f => f.type !== fiber.type)
//       };
//     }
//   });
// };
const updateFiberQuantity = (fiber, newQuantity) => {
  if (newQuantity < 0) return;
  
  const availableCount = getAvailableFiberCount(fiber) + getAssignedFiberInThisNode(fiber);
  if (newQuantity > availableCount) {
    Alert.alert('Not available', `Only ${availableCount} ${fiber.type} available`);
    return;
  }
  
  setNodeForm(prev => {
    const isSelected = prev.selectedFibers.some(f => f.type === fiber.type);
    const standardColors = getStandardFiberColors(fiber.type);
    
    if (isSelected) {
      // Actualizar solo la cantidad, preservar los colores existentes
      return {
        ...prev,
        selectedFibers: prev.selectedFibers.map(f => 
          f.type === fiber.type 
            ? { 
                ...f, // Mantener todas las propiedades incluyendo colors
                quantity: newQuantity
              }
            : f
        )
      };
    } else if (newQuantity > 0) {
      // Agregar nueva fibra con todos los colores estándar
      return {
        ...prev,
        selectedFibers: [...prev.selectedFibers, { 
          type: fiber.type,
          quantity: newQuantity,
          colors: standardColors.map((color, index) => ({
            color: color,
            description: '',
            connectedTo: ''
          }))
        }]
      };
    } else {
      // Eliminar fibra si cantidad es 0
      return {
        ...prev,
        selectedFibers: prev.selectedFibers.filter(f => f.type !== fiber.type)
      };
    }
  });
};

  // Obtener color según tipo de nodo
  const getNodeColor = (type) => {
    switch (type) {
      case 'MDF': return '#e74c3c';
      case 'pedestal': return '#3498db';
      case 'IDF': return '#2ecc71';
      case 'unit': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  // Obtener ícono según tipo de nodo
  const getNodeIcon = (type) => {
    switch (type) {
      case 'MDF': return 'server';
      case 'pedestal': return 'cube';
      case 'IDF': return 'hardware-chip';
      case 'unit': return 'home';
      default: return 'help';
    }
  };

 
const getConnections = () => {
  const connections = [];
  
  // Si no hay nodos o solo hay uno, no hay conexiones
  if (nodes.length <= 1) return connections;
  
  // Filtrar nodos válidos (con coordenadas)
  const validNodes = nodes.filter(node => 
    node.latitude && node.longitude && 
    typeof node.latitude === 'number' && 
    typeof node.longitude === 'number'
  );
  
  if (validNodes.length <= 1) return connections;
  
  // Ordenar nodos por fecha de creación (timestamp)
  const sortedNodes = [...validNodes].sort((a, b) => {
    // Ordenar por timestamp si está disponible
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    // Fallback: ordenar por ID si no hay timestamp
    return (a.id || '').localeCompare(b.id || '');
  });
  
  // Asegurar que el MDF sea el primer nodo si existe
  const mdfIndex = sortedNodes.findIndex(node => node.type === 'MDF');
  if (mdfIndex > 0) {
    // Si el MDF no es el primero, moverlo al principio
    const mdfNode = sortedNodes.splice(mdfIndex, 1)[0];
    sortedNodes.unshift(mdfNode);
  }
  
  // Conectar cada nodo con el anterior (empezando desde el segundo nodo)
  for (let i = 1; i < sortedNodes.length; i++) {
    const previousNode = sortedNodes[i - 1];
    const currentNode = sortedNodes[i];
    
    // Verificar que ambos nodos tengan coordenadas válidas
    if (previousNode.latitude && previousNode.longitude && 
        currentNode.latitude && currentNode.longitude) {
      connections.push({
        from: previousNode,
        to: currentNode,
        color: getConnectionColor(previousNode.type, currentNode.type),
        type: `${previousNode.type}-${currentNode.type}`,
        isBackbone: previousNode.type === 'MDF' || currentNode.type === 'MDF'
      });
    }
  }
  
  return connections;
};

// Obtener color de conexión según tipos de nodos
const getConnectionColor = (typeA, typeB) => {
  if (typeA === 'MDF' || typeB === 'MDF') {
    return '#e74c3c'; // Rojo para conexiones con MDF
  }
  
  if (typeA === 'pedestal' && typeB === 'pedestal') {
    return '#3498db'; // Azul para conexiones entre pedestales
  }
  
  if (typeA === 'IDF' && typeB === 'IDF') {
    return '#2ecc71'; // Verde para conexiones entre IDFs
  }
  
  if ((typeA === 'IDF' && typeB === 'unit') || 
      (typeA === 'unit' && typeB === 'IDF')) {
    return '#f39c12'; // Naranja para IDF-Unit
  }
  
  if ((typeA === 'pedestal' && typeB === 'unit') || 
      (typeA === 'unit' && typeB === 'pedestal')) {
    return '#9b59b6'; // Púrpura para Pedestal-Unit
  }
  
  // Conexiones mixtas (diferentes tipos de infraestructura)
  if ((typeA === 'pedestal' && typeB === 'IDF') || 
      (typeA === 'IDF' && typeB === 'pedestal')) {
    return '#1abc9c'; // Turquesa para conexiones mixtas
  }
  
  return '#7f8c8d'; // Gris por defecto
};



// Determinar si dos nodos deberían conectarse
const shouldConnectNodes = (nodeA, nodeB) => {
  // No conectar unidades con otras unidades directamente
  if (nodeA.type === 'unit' && nodeB.type === 'unit') return false;
  
  // No conectar diferentes tipos de infraestructura directamente
  if (nodeA.type === 'IDF' && nodeB.type === 'pedestal') return false;
  if (nodeA.type === 'pedestal' && nodeB.type === 'IDF') return false;
  
  // Conectar nodos del mismo tipo
  if (nodeA.type === nodeB.type) return true;
  
  // Conectar infraestructura con unidades
  if ((nodeA.type === 'IDF' || nodeA.type === 'pedestal') && nodeB.type === 'unit') return true;
  if ((nodeB.type === 'IDF' || nodeB.type === 'pedestal') && nodeA.type === 'unit') return true;
  
  return false;
};

  // Renderizar marcadores
const renderMarkers = () => {
  return nodes.map((node, index) => (
    <Marker
      key={`marker-${node.id || `temp-${index}-${node.latitude}-${node.longitude}`}`}
      coordinate={{
        latitude: node.latitude,
        longitude: node.longitude
      }}
      onPress={() => selectNode(node)}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.marker, { backgroundColor: getNodeColor(node.type) }]}>
          <Ionicons name={getNodeIcon(node.type)} size={16} color="#ffffff" />
        </View>
        <View style={styles.markerLabel}>
          <Text style={styles.markerText}>{node.name}</Text>
          <Text style={styles.markerType}>{node.type}</Text>
        </View>
      </View>
    </Marker>
  ));
};

  // Renderizar conexiones
const renderConnections = () => {
  const connections = getConnections();
  
  // Depuración: mostrar información sobre las conexiones
  console.log('Rendering connections:', connections.length);
  connections.forEach((conn, idx) => {
    console.log(`Connection ${idx}: ${conn.from.name} -> ${conn.to.name}`);
  });
  
  return connections.map((connection, index) => {
    const fromId = connection.from.id || `temp-${connection.from.latitude}-${connection.from.longitude}`;
    const toId = connection.to.id || `temp-${connection.to.latitude}-${connection.to.longitude}`;
    
    // Validación adicional para evitar líneas fantasma
    if (!connection.from.latitude || !connection.from.longitude ||
        !connection.to.latitude || !connection.to.longitude) {
      console.log('Skipping invalid connection:', connection);
      return null;
    }
    
    return (
      <Polyline
        key={`connection-${fromId}-${toId}-${index}`}
        coordinates={[
          {
            latitude: connection.from.latitude,
            longitude: connection.from.longitude
          },
          {
            latitude: connection.to.latitude,
            longitude: connection.to.longitude
          }
        ]}
        strokeColor={connection.color}
        strokeWidth={connection.isBackbone ? 4 : 3}
        lineDashPattern={connection.isBackbone ? [] : [5, 5]}
      />
    );
  }).filter(Boolean); // Filtrar cualquier conexión nula
};

const deleteNode = async (nodeId) => {
  try {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this node? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Eliminar de la base de datos
              const result = await NodeService.deleteNode(nodeId);
              
              if (result.rowsAffected > 0) {
                // Eliminar del estado local
                setNodes(prev => prev.filter(node => node.id !== nodeId));
                
                setShowNodeModal(false);
                setSelectedNode(null);
                
                Alert.alert("Success", "Node deleted successfully");
              } else {
                Alert.alert("Error", "Node could not be deleted");
              }
            } catch (error) {
              console.log('Error deleting node:', error);
              Alert.alert('Error', 'Failed to delete node from database');
            }
          },
          style: "destructive"
        }
      ]
    );
  } catch (error) {
    console.log('Error showing delete confirmation:', error);
    Alert.alert('Error', 'Could not initiate delete operation');
  }
};

// Función para eliminar todos los nodos
const clearAllNodes = async () => {
  try {
    Alert.alert(
      "Confirm Clear All",
      "Are you sure you want to delete ALL nodes? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete All",
          onPress: async () => {
            try {
              // Eliminar todos los nodos de la base de datos
              const deletePromises = nodes.map(node => 
                NodeService.deleteNode(node.id)
              );
              
              await Promise.all(deletePromises);
              
              // Limpiar el estado local
              setNodes([]);
              setSelectedNode(null);
              
              Alert.alert("Success", "All nodes have been deleted");
            } catch (error) {
              console.log('Error deleting all nodes:', error);
              Alert.alert('Error', 'Failed to delete all nodes');
            }
          },
          style: "destructive"
        }
      ]
    );
  } catch (error) {
    console.log('Error showing clear all confirmation:', error);
    Alert.alert('Error', 'Could not initiate clear all operation');
  }
};

  // Normalizar datos
  const normalizeData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter(item => item && typeof item === 'object');
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return normalizeData(parsed);
      } catch (e) {
        return [];
      }
    }
    if (typeof data === 'object') {
      const values = Object.values(data);
      const validValues = values.filter(item => 
        item && typeof item === 'object' && item.type !== undefined
      );
      if (validValues.length > 0) return validValues;
      if (data.type !== undefined) return [data];
    }
    return [];
  };

  // Componente para configuración de dispositivos

const DeviceConfig = ({ device, onSave }) => {
  const [ports, setPorts] = useState(
    device.portsUsed && device.portsUsed.length > 0 
      ? device.portsUsed 
      : Array(device.ports).fill().map((_, i) => ({
          port: i + 1,
          description: '',
          connectedTo: ''
        }))
  );

  const saveConfiguration = () => {
    onSave({
      ...device,
      portsUsed: ports
    });
  };

  return (
    <View>
      <Text style={styles.configSectionTitle}>{device.type} - {device.ports} Ports</Text>
      
      {ports.map((port, index) => (
        <View key={index} style={styles.portItem}>
          <Text style={styles.portLabel}>Port {port.port}:</Text>
          <TextInput
            style={styles.portInput}
            value={port.description}
            onChangeText={(text) => {
              const newPorts = [...ports];
              newPorts[index].description = text;
              setPorts(newPorts);
            }}
            placeholder="Description"
          />
          <TextInput
            style={styles.portInput}
            value={port.connectedTo}
            onChangeText={(text) => {
              const newPorts = [...ports];
              newPorts[index].connectedTo = text;
              setPorts(newPorts);
            }}
            placeholder="Connected to"
          />
        </View>
      ))}
      
      <TouchableOpacity style={styles.saveConfigButton} onPress={saveConfiguration}>
        <Text style={styles.saveConfigButtonText}>Save Configuration</Text>
      </TouchableOpacity>
    </View>
  );
};

// Función para obtener código hexadecimal de color basado en nombre
// const getColorHexCode = (colorName) => {
//   const colorMap = {
//     'Blue': '#0000FF',
//     'Orange': '#FFA500',
//     'Green': '#008000',
//     'Brown': '#A52A2A',
//     'Slate': '#708090',
//     'Gray': '#808080',
//     'White': '#FFFFFF',
//     'Red': '#FF0000',
//     'Black': '#000000',
//     'Yellow': '#FFFF00',
//     'Violet': '#EE82EE',
//     'Rose': '#FF007F',
//     'Pink': '#FF007F',
//     'Aqua': '#00FFFF'
//   };
  
//   return colorMap[colorName] || '#CCCCCC';
// };
// Función para obtener código hexadecimal de color basado en nombre
// const getColorHexCode = (colorName) => {
//   // Limpiar el nombre del color (puede venir con prefijo de tubo como "1-Blue")
//   const cleanColorName = colorName.split('-').pop().trim();
  
//   const colorMap = {
//     'Blue': '#0000FF',
//     'Orange': '#FFA500',
//     'Green': '#008000',
//     'Brown': '#A52A2A',
//     'Slate': '#708090',
//     'Gray': '#808080',
//     'White': '#FFFFFF',
//     'Red': '#FF0000',
//     'Black': '#000000',
//     'Yellow': '#FFFF00',
//     'Violet': '#EE82EE',
//     'Rose': '#FF007F',
//     'Pink': '#FF007F',
//     'Aqua': '#00FFFF'
//   };
  
//   const hexColor = colorMap[cleanColorName] || '#CCCCCC';
//   console.log('Color name:', cleanColorName, '-> Hex:', hexColor);
//   return hexColor;
// };
const getColorHexCode = (colorName) => {
  if (!colorName) return '#CCCCCC';
  
  // Limpiar el nombre del color (puede venir con prefijo de tubo como "1-Blue")
  const cleanColorName = colorName.toString().split('-').pop().trim().toLowerCase();
  
  const colorMap = {
    'blue': '#0000FF',
    'orange': '#FFA500',
    'green': '#008000',
    'brown': '#A52A2A',
    'slate': '#708090',
    'gray': '#808080',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'black': '#000000',
    'yellow': '#FFFF00',
    'violet': '#EE82EE',
    'rose': '#FF007F',
    'pink': '#FF007F',
    'aqua': '#00FFFF'
  };
  
  const hexColor = colorMap[cleanColorName] || '#CCCCCC';
  return hexColor;
};

// const FiberConfig = ({ fiber, onSave }) => {
//   const [colors, setColors] = useState(
//     fiber.colors && fiber.colors.length > 0 
//       ? fiber.colors 
//       : Array(fiber.quantity).fill().map((_, i) => ({
//           color: `Color ${i + 1}`,
//           description: '',
//           connectedTo: ''
//         }))
//   );

//   const saveConfiguration = () => {
//     onSave({
//       ...fiber,
//       colors: colors
//     });
//   };

//   return (
//     <View>
//       <Text style={styles.configSectionTitle}>{fiber.type} Fiber</Text>
      
//       {colors.map((color, index) => (
//         <View key={index} style={styles.colorItem}>
//           <Text style={styles.colorLabel}>{color.color}:</Text>
//           <TextInput
//             style={styles.colorInput}
//             value={color.description}
//             onChangeText={(text) => {
//               const newColors = [...colors];
//               newColors[index].description = text;
//               setColors(newColors);
//             }}
//             placeholder="Description"
//           />
//           <TextInput
//             style={styles.colorInput}
//             value={color.connectedTo}
//             onChangeText={(text) => {
//               const newColors = [...colors];
//               newColors[index].connectedTo = text;
//               setColors(newColors);
//             }}
//             placeholder="Connected to"
//           />
//         </View>
//       ))}
      
//       <TouchableOpacity style={styles.saveConfigButton} onPress={saveConfiguration}>
//         <Text style={styles.saveConfigButtonText}>Save Configuration</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const FiberConfig = ({ fiber, onSave }) => {
//   // Obtener colores estándar según el tipo de fibra
//   const standardColors = getStandardFiberColors(fiber.type);
  
//   const [colors, setColors] = useState(
//     fiber.colors && fiber.colors.length > 0 
//       ? fiber.colors 
//       : standardColors.map((color, index) => ({
//           color: color,
//           description: '',
//           connectedTo: ''
//         }))
//   );

//   const saveConfiguration = () => {
//     onSave({
//       ...fiber,
//       colors: colors
//     });
//   };

//   return (
//     <View>
//       <Text style={styles.configSectionTitle}>{fiber.type} Fiber</Text>
//       <Text style={styles.configSubtitle}>
//         {standardColors.length} fibers with standard colors
//       </Text>
      
//       {colors.map((colorObj, index) => (
//         <View key={index} style={styles.colorItem}>
//           <View style={[styles.colorIndicator, 
//             {backgroundColor: getColorHexCode(colorObj.color.split('-').pop())}]} 
//           />
//           <Text style={styles.colorLabel}>{colorObj.color}:</Text>
//           <TextInput
//             style={styles.colorInput}
//             value={colorObj.description}
//             onChangeText={(text) => {
//               const newColors = [...colors];
//               newColors[index].description = text;
//               setColors(newColors);
//             }}
//             placeholder="Description"
//           />
//           <TextInput
//             style={styles.colorInput}
//             value={colorObj.connectedTo}
//             onChangeText={(text) => {
//               const newColors = [...colors];
//               newColors[index].connectedTo = text;
//               setColors(newColors);
//             }}
//             placeholder="Connected to"
//           />
//         </View>
//       ))}
      
//       <TouchableOpacity style={styles.saveConfigButton} onPress={saveConfiguration}>
//         <Text style={styles.saveConfigButtonText}>Save Configuration</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const FiberConfig = ({ fiber, onSave }) => {
//   // Obtener colores estándar según el tipo de fibra
//   const standardColors = getStandardFiberColors(fiber.type);
  
//   const [colors, setColors] = useState(
//     fiber.colors && fiber.colors.length > 0 
//       ? fiber.colors 
//       : standardColors.map((color, index) => ({
//           color: color,
//           description: '',
//           connectedTo: ''
//         }))
//   );

//   const saveConfiguration = () => {
//     onSave({
//       ...fiber,
//       colors: colors
//     });
//   };

//   return (
//     <View>
//       <Text style={styles.configSectionTitle}>{fiber.type} Fiber</Text>
//       <Text style={styles.configSubtitle}>
//         {standardColors.length} fibers with standard colors
//       </Text>
      
//       {colors.map((colorObj, index) => (
//         <View key={index} style={styles.colorItemWithIndicator}>
//           <View style={[styles.colorIndicator, 
//             {backgroundColor: getColorHexCode(colorObj.color.split('-').pop())}]} 
//           />
//           <Text style={styles.colorLabel}>{colorObj.color}:</Text>
//           <TextInput
//             style={styles.colorInput}
//             value={colorObj.description}
//             onChangeText={(text) => {
//               const newColors = [...colors];
//               newColors[index].description = text;
//               setColors(newColors);
//             }}
//             placeholder="Description"
//           />
//           <TextInput
//             style={styles.colorInput}
//             value={colorObj.connectedTo}
//             onChangeText={(text) => {
//               const newColors = [...colors];
//               newColors[index].connectedTo = text;
//               setColors(newColors);
//             }}
//             placeholder="Connected to"
//           />
//         </View>
//       ))}
      
//       <TouchableOpacity style={styles.saveConfigButton} onPress={saveConfiguration}>
//         <Text style={styles.saveConfigButtonText}>Save Configuration</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const FiberConfig = ({ fiber, onSave }) => {
//   // Obtener colores estándar según el tipo de fibra
//   const standardColors = getStandardFiberColors(fiber.type);

//   console.log('FiberConfig - fiber:', fiber); // ← Agrega este log
//   console.log('FiberConfig - fiber.colors:', fiber.colors); // ← Y este
//   console.log('FiberConfig - standard colors:', standardColors);
  
//   console.log('FiberConfig - fiber type:', fiber.type);
//   console.log('FiberConfig - standard colors:', standardColors);
  
//   const [colors, setColors] = useState(
//     fiber.colors && fiber.colors.length > 0 
//       ? fiber.colors 
//       : standardColors.map((color, index) => ({
//           color: color,
//           description: '',
//           connectedTo: ''
//         }))
//   );

//   const saveConfiguration = () => {
//     onSave({
//       ...fiber,
//       colors: colors
//     });
//   };

//   return (
//     <View>
//       <Text style={styles.configSectionTitle}>{fiber.type} Fiber</Text>
//       <Text style={styles.configSubtitle}>
//         {standardColors.length} fibers with standard colors
//       </Text>
      
//       {colors.map((colorObj, index) => (
//         <View key={index} style={styles.colorItemWithIndicator}>
//           <View style={[styles.colorIndicator, 
//             {backgroundColor: getColorHexCode(colorObj.color.split('-').pop())}]} 
//           />
//           <Text style={styles.colorLabel}>{colorObj.color}:</Text>
//           <TextInput
//             style={styles.colorInput}
//             value={colorObj.description}
//             onChangeText={(text) => {
//               const newColors = [...colors];
//               newColors[index].description = text;
//               setColors(newColors);
//             }}
//             placeholder="Description"
//           />
//           <TextInput
//             style={styles.colorInput}
//             value={colorObj.connectedTo}
//             onChangeText={(text) => {
//               const newColors = [...colors];
//               newColors[index].connectedTo = text;
//               setColors(newColors);
//             }}
//             placeholder="Connected to"
//           />
//         </View>
//       ))}
      
//       <TouchableOpacity style={styles.saveConfigButton} onPress={saveConfiguration}>
//         <Text style={styles.saveConfigButtonText}>Save Configuration</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
const FiberConfig = ({ fiber, onSave }) => {
  // Obtener colores estándar según el tipo de fibra
  const standardColors = getStandardFiberColors(fiber.type);

  console.log('FiberConfig - fiber:', fiber);
  console.log('FiberConfig - fiber.colors:', fiber.colors);
  console.log('FiberConfig - standard colors:', standardColors);
  
  // Siempre mostrar TODOS los colores de la fibra, independientemente de la cantidad
  const [colors, setColors] = useState(() => {
    const existingColors = fiber.colors || [];
    
    // Si ya tenemos colores configurados, usarlos
    if (existingColors.length > 0) {
      return existingColors;
    }
    
    // Si no, crear array con todos los colores estándar
    return standardColors.map((color, index) => ({
      color: color,
      description: '',
      connectedTo: ''
    }));
  });

  const saveConfiguration = () => {
    onSave({
      ...fiber,
      colors: colors // Guardar todos los colores
    });
  };

  return (
    <View>
      <Text style={styles.configSectionTitle}>{fiber.type} Fiber</Text>
      <Text style={styles.configSubtitle}>
        {standardColors.length} fibers with standard colors
      </Text>
      <Text style={styles.configInfo}>
        Quantity: {fiber.quantity} unit(s) - Configure all {standardColors.length} fibers
      </Text>
      
      {colors.map((colorObj, index) => (
        <View key={index} style={styles.colorItemWithIndicator}>
          <View style={[styles.colorIndicator, 
            {backgroundColor: getColorHexCode(colorObj.color.split('-').pop())}]} 
          />
          <Text style={styles.colorLabel}>{colorObj.color}:</Text>
          <TextInput
            style={styles.colorInput}
            value={colorObj.description}
            onChangeText={(text) => {
              const newColors = [...colors];
              newColors[index].description = text;
              setColors(newColors);
            }}
            placeholder="Description"
          />
          <TextInput
            style={styles.colorInput}
            value={colorObj.connectedTo}
            onChangeText={(text) => {
              const newColors = [...colors];
              newColors[index].connectedTo = text;
              setColors(newColors);
            }}
            placeholder="Connected to"
          />
        </View>
      ))}
      
      <TouchableOpacity style={styles.saveConfigButton} onPress={saveConfiguration}>
        <Text style={styles.saveConfigButtonText}>Save Configuration</Text>
      </TouchableOpacity>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        {renderMarkers()}
        {renderConnections()}
      </MapView>

       {/* Mensaje de depuración (puedes eliminarlo después) */}
    <View style={styles.debugInfo}>
      <Text style={styles.debugText}>
        Nodes: {nodes.length} | Connections: {getConnections().length}
      </Text>
    </View>

      {/* Controles de tipo de nodo */}
      <View style={styles.nodeTypeControls}>
        <Text style={styles.sectionTitle}>Add Node</Text>
        <View style={styles.nodeTypeButtons}>
          <TouchableOpacity
            style={[
              styles.nodeTypeButton,
              selectedNodeType === 'MDF' && styles.nodeTypeButtonSelected
            ]}
            onPress={() => selectNodeType('MDF')}
          >
            <Ionicons name="server" size={24} color="#ffffff" />
            <Text style={styles.nodeTypeButtonText}>MDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nodeTypeButton,
              selectedNodeType === 'pedestal' && styles.nodeTypeButtonSelected
            ]}
            onPress={() => selectNodeType('pedestal')}
          >
            <Ionicons name="cube" size={24} color="#ffffff" />
            <Text style={styles.nodeTypeButtonText}>Pedestal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nodeTypeButton,
              selectedNodeType === 'IDF' && styles.nodeTypeButtonSelected
            ]}
            onPress={() => selectNodeType('IDF')}
          >
            <Ionicons name="hardware-chip" size={24} color="#ffffff" />
            <Text style={styles.nodeTypeButtonText}>IDF</Text>
          </TouchableOpacity>

          

          <TouchableOpacity
            style={[
              styles.nodeTypeButton,
              selectedNodeType === 'unit' && styles.nodeTypeButtonSelected
            ]}
            onPress={() => selectNodeType('unit')}
          >
            <Ionicons name="home" size={24} color="#ffffff" />
            <Text style={styles.nodeTypeButtonText}>Unit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón de guardar */}
      <TouchableOpacity style={styles.saveButton} onPress={saveNetworkMap}>
        <Ionicons name="save" size={24} color="#ffffff" />
        <Text style={styles.saveButtonText}>Save Network</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearButton} onPress={clearAllNodes}>
  <Ionicons name="trash" size={24} color="#ffffff" />
  <Text style={styles.clearButtonText}>Clear all</Text>
</TouchableOpacity>

      {/* Modal de detalles del nodo */}
<Modal
  visible={showNodeModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowNodeModal(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {selectedNode?.id ? 'Edit Node' : 'Add Node'}
        </Text>
        <TouchableOpacity onPress={() => setShowNodeModal(false)}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Node Name</Text>
          <TextInput
            style={styles.input}
            value={nodeForm.name}
            onChangeText={(text) => setNodeForm({ ...nodeForm, name: text })}
            placeholder="Enter node name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Owner</Text>
          <TextInput
            style={styles.input}
            value={nodeForm.owner}
            onChangeText={(text) => setNodeForm({ ...nodeForm, owner: text })}
            placeholder="Enter owner name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          {loadingAddress ? (
            <ActivityIndicator size="small" color="#3498db" />
          ) : (
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={nodeForm.address}
              onChangeText={(text) => setNodeForm({ ...nodeForm, address: text })}
              placeholder="Address will be retrieved from coordinates"
              multiline
            />
          )}
        </View>

        {/* Selector de dispositivos - Solo mostrar para MDF y unit */}
{(selectedNode?.type === 'MDF' || selectedNode?.type === 'unit') && (
  <View style={styles.formGroup}>
    <Text style={styles.label}>Devices</Text>
    {devices.length > 0 ? (
      devices.map((device, index) => {
        const availableCount = getAvailableCount(device);
        const assignedInThisNode = getAssignedInThisNode(device);
        {/* Selector de dispositivos */}
        const currentQuantity = nodeForm.selectedDevices?.find(d => 
          d.type === device.type && d.ports === device.ports
        )?.quantity || 0;
        
        return (
          <View key={`device-${index}`} style={styles.deviceItem}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.type} ({device.ports} ports)</Text>
              <Text style={styles.deviceCount}>
                Available: {availableCount + assignedInThisNode}
              </Text>
            </View>
            
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateDeviceQuantity(device, currentQuantity - 1)}
                disabled={currentQuantity <= 0}
              >
                <Ionicons name="remove" size={16} color="#ffffff" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{currentQuantity}</Text>
              
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  currentQuantity >= (availableCount + assignedInThisNode) && styles.quantityButtonDisabled
                ]}
                onPress={() => updateDeviceQuantity(device, currentQuantity + 1)}
                disabled={currentQuantity >= (availableCount + assignedInThisNode)}
              >
                <Ionicons name="add" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {currentQuantity > 0 && (
              <TouchableOpacity
                style={styles.configureButton}
                onPress={() => openConfigModal(
                  nodeForm.selectedDevices.find(d => 
                    d.type === device.type && d.ports === device.ports
                  ), 
                  'device'
                )}
              >
                <Ionicons name="settings" size={20} color="#3498db" />
                <Text style={styles.configureButtonText}>Configure</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })
    ) : (
      <Text style={styles.noItemsText}>No devices configured for this project</Text>
    )}
  </View>
)}

        {/* Selector de fibra - Solo mostrar para MDF y unit */}
{(selectedNode?.type === 'MDF' || selectedNode?.type === 'unit') && (
  <View style={styles.formGroup}>
    <Text style={styles.label}>Fiber Types</Text>
    {fibers.length > 0 ? (
      fibers.map((fiber, index) => {
        const availableCount = getAvailableFiberCount(fiber);
        const assignedInThisNode = getAssignedFiberInThisNode(fiber);
        {/* Selector de fibras */}
        const currentQuantity = nodeForm.selectedFibers?.find(f => f.type === fiber.type)?.quantity || 0;
        
        return (
          <View key={`fiber-${index}`} style={styles.fiberItem}>
            <View style={styles.fiberInfo}>
              <Text style={styles.fiberName}>{fiber.type}</Text>
              <Text style={styles.fiberCount}>
                Available: {availableCount + assignedInThisNode}
              </Text>
            </View>
            
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateFiberQuantity(fiber, currentQuantity - 1)}
                disabled={currentQuantity <= 0}
              >
                <Ionicons name="remove" size={16} color="#ffffff" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{currentQuantity}</Text>
              
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  currentQuantity >= (availableCount + assignedInThisNode) && styles.quantityButtonDisabled
                ]}
                onPress={() => updateFiberQuantity(fiber, currentQuantity + 1)}
                disabled={currentQuantity >= (availableCount + assignedInThisNode)}
              >
                <Ionicons name="add" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {currentQuantity > 0 && (
              <TouchableOpacity
                style={styles.configureButton}
                onPress={() => openConfigModal(
                  nodeForm.selectedFibers.find(f => f.type === fiber.type), 
                  'fiber'
                )}
              >
                <Ionicons name="settings" size={20} color="#3498db" />
                <Text style={styles.configureButtonText}>Configure</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })
    ) : (
      <Text style={styles.noItemsText}>No fiber types configured for this project</Text>
    )}
  </View>
)}

        {/* Mensaje informativo para pedestal e IDF */}
        {(selectedNode?.type === 'pedestal' || selectedNode?.type === 'IDF') && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#3498db" />
            <Text style={styles.infoText}>
              No devices or fiber configuration needed for {selectedNode?.type} nodes.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.modalFooter}>
        {selectedNode?.id && (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteNode(selectedNode.id)}
    >
      <Ionicons name="trash" size={20} color="#ffffff" />
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  )}
  
  <View style={styles.footerRightButtons}>
    <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => setShowNodeModal(false)}
    >
      <Text style={styles.cancelButtonText}>Cancel</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      style={styles.saveModalButton}
      onPress={selectedNode?.id ? updateNode : addNode}
    >
      <Text style={styles.saveModalButtonText}>
        {selectedNode?.id ? 'Update' : 'Add'} Node
      </Text>
    </TouchableOpacity>
      </View>
    </View>
  </View>
  </View>
</Modal>

{/* Modal de configuración de dispositivos/fibras */}
<Modal
  visible={showConfigModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowConfigModal(false)}
>
  <View style={styles.configModalContainer}>
    <View style={styles.configModalContent}>
      <View style={styles.configModalHeader}>
        <Text style={styles.configModalTitle}>
          Configure {configType === 'device' ? 'Device' : 'Fiber'}
        </Text>
        <TouchableOpacity onPress={() => setShowConfigModal(false)}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.configModalBody}>
        {configType === 'device' && currentConfig && (
          <DeviceConfig 
            device={currentConfig} 
            onSave={saveConfig}
          />
        )}
        
        {configType === 'fiber' && currentConfig && (
          <FiberConfig 
            fiber={currentConfig} 
            onSave={saveConfig}
          />
        )}
      </ScrollView>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  nodeTypeControls: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  nodeTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nodeTypeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 10,
    width: 70,
    height: 70,
  },
  nodeTypeButtonSelected: {
    backgroundColor: '#2c3e50',
  },
  nodeTypeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 15,
    maxHeight: '70%',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  addressInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceCount: {
    fontSize: 12,
    color: '#666',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#ccc',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  fiberOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fiberOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  fiberOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  fiberOptionText: {
    color: '#333',
  },
  noItemsText: {
    fontStyle: 'italic',
    color: '#666',
  },
  cancelButton: {
    padding: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  saveModalButton: {
    backgroundColor: '#27ae60',
    borderRadius: 5,
    padding: 10,
  },
  saveModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 15,
  borderTopWidth: 1,
  borderTopColor: '#eee',
},
footerRightButtons: {
  flexDirection: 'row',
  alignItems: 'center',
},
deleteButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#e74c3c',
  borderRadius: 5,
  padding: 10,
},
deleteButtonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 5,
},
cancelButton: {
  padding: 10,
  marginRight: 10,
},
cancelButtonText: {
  color: '#666',
  fontSize: 16,
},
saveModalButton: {
  backgroundColor: '#27ae60',
  borderRadius: 5,
  padding: 10,
},
saveModalButtonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
},
  debugInfo: {
  position: 'absolute',
  top: 100,
  left: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: 5,
  borderRadius: 5,
},
debugText: {
  color: '#ffffff',
  fontSize: 12,
},
clearButton: {
  position: 'absolute',
  bottom: 20,
  left: 20,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#c54034',
  borderRadius: 8,
  padding: 15,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
clearButtonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 5,
},
// Agregar estos estilos al objeto de estilos
configModalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
configModalContent: {
  width: '90%',
  maxHeight: '80%',
  backgroundColor: '#ffffff',
  borderRadius: 10,
  overflow: 'hidden',
},
configModalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
configModalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},
configModalBody: {
  padding: 15,
},
configSectionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 15,
  color: '#333',
},
portItem: {
  marginBottom: 10,
  padding: 10,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 5,
},
portLabel: {
  fontWeight: 'bold',
  marginBottom: 5,
},
portInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 5,
  padding: 8,
  marginBottom: 5,
},
colorItem: {
  marginBottom: 10,
  padding: 10,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 5,
},
colorLabel: {
  fontWeight: 'bold',
  marginBottom: 5,
},
colorInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 5,
  padding: 8,
  marginBottom: 5,
},
saveConfigButton: {
  backgroundColor: '#27ae60',
  borderRadius: 5,
  padding: 15,
  alignItems: 'center',
  marginTop: 10,
},
saveConfigButtonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
},
configureButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 10,
},
configureButtonText: {
  color: '#3498db',
  marginLeft: 5,
  fontSize: 12,
},
fiberItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 10,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 5,
  marginBottom: 5,
},
fiberInfo: {
  flex: 1,
},
fiberName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
fiberCount: {
  fontSize: 12,
  color: '#666',
},
configSubtitle: {
  fontSize: 14,
  color: '#666',
  marginBottom: 15,
},
colorIndicator: {
  width: 20,
  height: 20,
  borderRadius: 10,
  marginRight: 10,
  borderWidth: 1,
  borderColor: '#ddd',
},
colorItemWithIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 80,
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginLeft: 5,
  },
  configSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
});

export default NetworkMap;