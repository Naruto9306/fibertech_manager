// screens/NetworkMap.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  Dimensions,
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NodeService, DeviceConfigService, FiberConfigService } from '../../service/storage';

const { width, height } = Dimensions.get('window');

const NetworkMap = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [nodes, setNodes] = useState([]);
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const [devices, setDevices] = useState([]);
  const [fibers, setFibers] = useState([]);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
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
    selectedFiber: null,
    selectedDevices: []
  });

  // Cargar nodos existentes y configuración
  useEffect(() => {
    loadData();
    getCurrentLocation();
    debugStorage();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se pudo acceder a la ubicación');
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

// const loadData = async () => {
//   try {
//     console.log('=== INICIANDO CARGA DE DATOS ===');
    
//     // Cargar nodos existentes
//     const existingNodes = await NodeService.getNodesByProject(projectId);
//     const nodesWithIds = existingNodes.map((node, index) => ({
//       ...node,
//       id: node.id || `temp-${index}-${node.latitude}-${node.longitude}`
//     }));
//     setNodes(nodesWithIds);
//     console.log('Nodos cargados:', nodesWithIds.length);

//     // Cargar dispositivos y fibras configurados
//     const deviceConfig = await DeviceConfigService.getDeviceConfig(projectId);
//     const fiberConfig = await FiberConfigService.getFiberConfig(projectId);
    
//     console.log('Configuración cruda - Dispositivos:', deviceConfig);
//     console.log('Configuración cruda - Fibras:', fiberConfig);
    
//     // Normalizar datos
//     const normalizedDevices = normalizeData(deviceConfig);
//     const normalizedFibers = normalizeData(fiberConfig);
    
//     console.log('Dispositivos normalizados:', normalizedDevices);
//     console.log('Fibras normalizadas:', normalizedFibers);
    
//     setDevices(normalizedDevices);
//     setFibers(normalizedFibers);

//     // Si no hay datos, mostrar alerta
//     if (normalizedDevices.length === 0) {
//       console.log('No se encontraron dispositivos configurados');
//     }
//     if (normalizedFibers.length === 0) {
//       console.log('No se encontraron fibras configuradas');
//     }

//   } catch (error) {
//     console.log('Error loading data:', error);
//     Alert.alert('Error', 'Failed to load network data');
//   }
// };
const loadData = async () => {
    try {
      console.log('=== INICIANDO CARGA DE DATOS ===');
      
      // Cargar nodos existentes
      const existingNodes = await NodeService.getNodesByProject(projectId);
      const nodesWithIds = existingNodes.map((node, index) => ({
        ...node,
        id: node.id || `temp-${index}-${node.latitude}-${node.longitude}`
      }));
      setNodes(nodesWithIds);
      console.log('Nodos cargados:', nodesWithIds.length);

      // Cargar dispositivos y fibras configurados
      const deviceConfig = await DeviceConfigService.getDeviceConfig(projectId);
      const fiberConfig = await FiberConfigService.getFiberConfig(projectId);
      
      console.log('Configuración cruda - Dispositivos:', deviceConfig);
      console.log('Configuración cruda - Fibras:', fiberConfig);
      
      // Normalizar datos
      const normalizedDevices = normalizeData(deviceConfig);
      const normalizedFibers = normalizeData(fiberConfig);
      
      console.log('Dispositivos normalizados:', normalizedDevices);
      console.log('Fibras normalizadas:', normalizedFibers);
      
      setDevices(normalizedDevices);
      setFibers(normalizedFibers);

    } catch (error) {
      console.log('Error loading data:', error);
      Alert.alert('Error', 'Failed to load network data');
    }
  };
 // Función para verificar si un dispositivo ya está asignado en otro nodo
  const isDeviceAlreadyAssigned = (device) => {
    const deviceKey = `${device.type}-${device.ports}`;
    
    return nodes.some(node => {
      if (node.id === selectedNode?.id) return false; // Excluir el nodo actual
      
      return node.devices?.some(assignedDevice => 
        `${assignedDevice.type}-${assignedDevice.ports}` === deviceKey
      );
    });
  };

  // Función para verificar si hay disponibilidad del dispositivo
  const isDeviceAvailable = (device) => {
    const deviceKey = `${device.type}-${device.ports}`;
    const totalAssigned = nodes.reduce((count, node) => {
      if (node.id === selectedNode?.id) return count; // Excluir el nodo actual
      
      const assignedCount = node.devices?.filter(d => 
        `${d.type}-${d.ports}` === deviceKey
      ).length || 0;
      
      return count + assignedCount;
    }, 0);

    return totalAssigned < device.count;
  };


const debugStorage = async () => {
  try {
    // Ver todas las keys en AsyncStorage
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('Todas las keys en AsyncStorage:', allKeys);
    
    // Ver datos específicos de dispositivos y fibras
    const deviceData = await AsyncStorage.getItem(`deviceConfig_${projectId}`);
    const fiberData = await AsyncStorage.getItem(`fiberConfig_${projectId}`);
    
    console.log('Dispositivos RAW desde storage:', deviceData);
    console.log('Fibras RAW desde storage:', fiberData);
    
    // Intentar parsear
    try {
      if (deviceData) {
        const parsedDevices = JSON.parse(deviceData);
        console.log('Dispositivos parseados:', parsedDevices);
      }
      if (fiberData) {
        const parsedFibers = JSON.parse(fiberData);
        console.log('Fibras parseadas:', parsedFibers);
      }
    } catch (parseError) {
      console.log('Error parseando datos:', parseError);
    }
    
  } catch (error) {
    console.log('Error en debugStorage:', error);
  }
};

// Función para normalizar dispositivos
const normalizeDevices = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  
  // Si es un objeto, convertirlo a array
  if (typeof data === 'object') {
    return Object.values(data).filter(item => 
      item && typeof item === 'object' && item.type !== undefined
    );
  }
  
  return [];
};

// Función para normalizar fibras
const normalizeFibers = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  
  // Si es un objeto, convertirlo a array
  if (typeof data === 'object') {
    return Object.values(data).filter(item => 
      item && typeof item === 'object' && item.type !== undefined
    );
  }
  
  return [];
};

  // Guardar el mapa de red en AsyncStorage
  const saveNetworkMap = async () => {
    try {
      const networkMapData = {
        projectId,
        nodes,
        createdAt: new Date().toISOString()
      };
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(`networkMap_${projectId}`, JSON.stringify(networkMapData));
      
    //   Alert.alert('Success', 'Network map saved successfully');
      Alert.alert('Success', 'CNetwork map saved successfully!', [
        {
         text: 'View on map',
         onPress: () => navigation.navigate('NetworkMap', { projectId })
        },
        {
          text: 'Exit',
          onPress: () => navigation.navigate('Dashboard')
        }
      ]);
    } catch (error) {
      console.log('Error saving network map:', error);
      Alert.alert('Error', 'Could not save network map');
    }
  };

  // Manejar el press en el mapa para agregar nodo
  const handleMapPress = (e) => {
    if (!isAddingMode || !selectedNodeType) return;
    
    const { coordinate } = e.nativeEvent;
    setSelectedNode({
      type: selectedNodeType,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      name: `${selectedNodeType}_${nodes.filter(n => n.type === selectedNodeType).length + 1}`
    });
    
    // Inicializar formulario
    setNodeForm({
      name: `${selectedNodeType}_${nodes.filter(n => n.type === selectedNodeType).length + 1}`,
      owner: '',
      address: '',
      selectedFiber: null,
      selectedDevices: []
    });
    
    setShowNodeModal(true);
  };

  // Agregar nuevo nodo al mapa en la ubicación seleccionada
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
        fiber: nodeForm.selectedFiber,
        devices: nodeForm.selectedDevices,
        status: 'active'
      };

      const savedNode = await NodeService.createNode(newNode);
      setNodes(prev => [...prev, { ...newNode, id: savedNode.insertId }]);
      
      setShowNodeModal(false);
      setIsAddingMode(false);
      setSelectedNodeType(null);
      setSelectedNode(null);
      
      Alert.alert('Éxito', `Nodo ${selectedNode.type} agregado correctamente`);

    } catch (error) {
      console.log('Error adding node:', error);
      Alert.alert('Error', 'Failed to add node');
    }
  };

  // Seleccionar tipo de nodo y activar modo de adición
  const selectNodeType = (type) => {
    setSelectedNodeType(type);
    setIsAddingMode(true);
  };

  // Seleccionar nodo existente para ver/editar detalles
//   const selectNode = (node) => {
//     setSelectedNode(node);
//     setNodeForm({
//       name: node.name || '',
//       owner: node.owner || '',
//       address: node.address || '',
//       selectedFiber: node.fiber || null,
//       selectedDevices: node.devices || []
//     });
//     setShowNodeModal(true);
//   };
const selectNode = (node) => {
  setSelectedNode(node);
  
  // Para dispositivos, necesitamos encontrar coincidencias por tipo y puertos
  const matchedDevices = devices.filter(device => 
    node.devices?.some(nd => 
      nd.type === device.type && nd.ports === device.ports
    )
  );
  
  // Para fibra, encontrar coincidencia por tipo
  const matchedFiber = fibers.find(fiber => 
    node.fiber?.type === fiber.type
  );
  
  setNodeForm({
    name: node.name || '',
    owner: node.owner || '',
    address: node.address || '',
    selectedFiber: matchedFiber || null,
    selectedDevices: matchedDevices || []
  });
  
  setShowNodeModal(true);
};

  // Actualizar nodo existente
  const updateNode = async () => {
    try {
      const updatedNodes = nodes.map(node =>
        node.id === selectedNode.id
          ? {
              ...node,
              name: nodeForm.name,
              owner: nodeForm.owner,
              address: nodeForm.address,
              fiber: nodeForm.selectedFiber,
              devices: nodeForm.selectedDevices
            }
          : node
      );

      setNodes(updatedNodes);
      
      // Guardar la actualización en storage
      await NodeService.updateNode(selectedNode.id, {
        name: nodeForm.name,
        owner: nodeForm.owner,
        address: nodeForm.address,
        fiber: nodeForm.selectedFiber,
        devices: nodeForm.selectedDevices
      });
      
      setShowNodeModal(false);
      setSelectedNode(null);
      Alert.alert('Éxito', `Nodo ${selectedNode.name} actualizado correctamente`);

    } catch (error) {
      console.log('Error updating node:', error);
      Alert.alert('Error', 'Failed to update node');
    }
  };

  // Toggle selección de dispositivo
//   const toggleDeviceSelection = (device) => {
//     setNodeForm(prev => {
//       const isSelected = prev.selectedDevices.some(d => d.id === device.id);
//       if (isSelected) {
//         return {
//           ...prev,
//           selectedDevices: prev.selectedDevices.filter(d => d.id !== device.id)
//         };
//       } else {
//         return {
//           ...prev,
//           selectedDevices: [...prev.selectedDevices, device]
//         };
//       }
//     });
//   };
// Toggle selección de dispositivo
// const toggleDeviceSelection = (device) => {
//   setNodeForm(prev => {
//     const deviceId = device.id || `temp-${device.type}-${device.ports}`;
//     const isSelected = prev.selectedDevices.some(d => 
//       (d.id || `temp-${d.type}-${d.ports}`) === deviceId
//     );
    
//     if (isSelected) {
//       return {
//         ...prev,
//         selectedDevices: prev.selectedDevices.filter(d => 
//           (d.id || `temp-${d.type}-${d.ports}`) !== deviceId
//         )
//       };
//     } else {
//       return {
//         ...prev,
//         selectedDevices: [...prev.selectedDevices, device]
//       };
//     }
//   });
// };
// Toggle selección de dispositivo - CORREGIDO
// const toggleDeviceSelection = (device) => {
//   setNodeForm(prev => {
//     // Crear un identificador único para comparación
//     const deviceKey = `${device.type}-${device.ports}`;
    
//     const isSelected = prev.selectedDevices.some(d => 
//       `${d.type}-${d.ports}` === deviceKey
//     );
    
//     if (isSelected) {
//       return {
//         ...prev,
//         selectedDevices: prev.selectedDevices.filter(d => 
//           `${d.type}-${d.ports}` !== deviceKey
//         )
//       };
//     } else {
//       return {
//         ...prev,
//         selectedDevices: [...prev.selectedDevices, device]
//       };
//     }
//   });
// };
const toggleDeviceSelection = (device) => {
    if (!isDeviceAvailable(device)) {
      Alert.alert('No disponible', `No hay más ${device.type} disponibles. Solo hay ${device.count} unidades.`);
      return;
    }

    setNodeForm(prev => {
      const deviceKey = `${device.type}-${device.ports}`;
      
      const isSelected = prev.selectedDevices.some(d => 
        `${d.type}-${d.ports}` === deviceKey
      );
      
      if (isSelected) {
        return {
          ...prev,
          selectedDevices: prev.selectedDevices.filter(d => 
            `${d.type}-${d.ports}` !== deviceKey
          )
        };
      } else {
        return {
          ...prev,
          selectedDevices: [...prev.selectedDevices, device]
        };
      }
    });
  };

  // Obtener el color según el tipo de nodo
  const getNodeColor = (type) => {
    switch (type) {
      case 'MDF': return '#e74c3c';
      case 'pedestal': return '#3498db';
      case 'IDF': return '#2ecc71';
      case 'unit': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  // Obtener el ícono según el tipo de nodo
  const getNodeIcon = (type) => {
    switch (type) {
      case 'MDF': return 'server';
      case 'pedestal': return 'cube';
      case 'IDF': return 'hardware-chip';
      case 'unit': return 'home';
      default: return 'help';
    }
  };

  // Generar conexiones entre nodos
//   const getConnections = () => {
//     const connections = [];
//     const mdfNodes = nodes.filter(node => node.type === 'MDF');
    
//     mdfNodes.forEach(mdf => {
//       // Conectar MDF a IDF
//       nodes.filter(node => node.type === 'IDF').forEach(idf => {
//         connections.push({
//           from: mdf,
//           to: idf,
//           color: '#3498db'
//         });
//       });
      
//       // Conectar MDF a pedestales
//       nodes.filter(node => node.type === 'pedestal').forEach(pedestal => {
//         connections.push({
//           from: mdf,
//           to: pedestal,
//           color: '#2ecc71'
//         });
//       });
//     });
    
//     // Conectar IDF a unidades
//     nodes.filter(node => node.type === 'IDF').forEach(idf => {
//       nodes.filter(node => node.type === 'unit').forEach(unit => {
//         connections.push({
//           from: idf,
//           to: unit,
//           color: '#f39c12'
//         });
//       });
//     });
    
//     // Conectar pedestales a unidades
//     nodes.filter(node => node.type === 'pedestal').forEach(pedestal => {
//       nodes.filter(node => node.type === 'unit').forEach(unit => {
//         connections.push({
//           from: pedestal,
//           to: unit,
//           color: '#9b59b6'
//         });
//       });
//     });
    
//     return connections;
//   };
// Generar conexiones lógicas entre nodos basadas en proximidad y tipo
// const getConnections = () => {
//   const connections = [];
  
//   // Primero, encontrar el MDF principal (si existe)
//   const mdfNodes = nodes.filter(node => node.type === 'MDF');
  
//   // Conectar MDF a IDFs más cercanos
//   mdfNodes.forEach(mdf => {
//     const idfNodes = nodes.filter(node => node.type === 'IDF');
    
//     // Encontrar el IDF más cercano a este MDF
//     if (idfNodes.length > 0) {
//       const closestIdf = idfNodes.reduce((closest, current) => {
//         const closestDist = calculateDistance(mdf, closest);
//         const currentDist = calculateDistance(mdf, current);
//         return currentDist < closestDist ? current : closest;
//       }, idfNodes[0]);
      
//       connections.push({
//         from: mdf,
//         to: closestIdf,
//         color: '#3498db'
//       });
//     }
//   });
  
//   // Conectar IDFs a unidades más cercanas
//   nodes.filter(node => node.type === 'IDF').forEach(idf => {
//     const unitNodes = nodes.filter(node => node.type === 'unit');
    
//     // Conectar a unidades cercanas (máximo 8 por IDF)
//     const nearbyUnits = unitNodes
//       .map(unit => ({
//         unit,
//         distance: calculateDistance(idf, unit)
//       }))
//       .sort((a, b) => a.distance - b.distance)
//       .slice(0, 8);
    
//     nearbyUnits.forEach(({ unit }) => {
//       connections.push({
//         from: idf,
//         to: unit,
//         color: '#f39c12'
//       });
//     });
//   });
  
//   // Conectar pedestales a unidades más cercanas
//   nodes.filter(node => node.type === 'pedestal').forEach(pedestal => {
//     const unitNodes = nodes.filter(node => node.type === 'unit');
    
//     // Encontrar la unidad más cercana a este pedestal
//     if (unitNodes.length > 0) {
//       const closestUnit = unitNodes.reduce((closest, current) => {
//         const closestDist = calculateDistance(pedestal, closest);
//         const currentDist = calculateDistance(pedestal, current);
//         return currentDist < closestDist ? current : closest;
//       }, unitNodes[0]);
      
//       connections.push({
//         from: pedestal,
//         to: closestUnit,
//         color: '#9b59b6'
//       });
//     }
//   });
  
//   return connections;
// };
const getConnections = () => {
  const connections = [];
  
  // Agrupar nodos por tipo
  const mdfNodes = nodes.filter(node => node.type === 'MDF');
  const idfNodes = nodes.filter(node => node.type === 'IDF');
  const pedestalNodes = nodes.filter(node => node.type === 'pedestal');
  const unitNodes = nodes.filter(node => node.type === 'unit');
  
  // Conectar MDF -> IDF (solo el más cercano)
  mdfNodes.forEach(mdf => {
    if (idfNodes.length > 0) {
      const closestIdf = findClosestNode(mdf, idfNodes);
      if (closestIdf) {
        connections.push({
          from: mdf,
          to: closestIdf,
          color: '#3498db',
          type: 'MDF-IDF'
        });
      }
    }
  });
  
  // Conectar IDF -> Unidades (hasta 12 por IDF)
  idfNodes.forEach(idf => {
    const nearbyUnits = findClosestNodes(idf, unitNodes, 12);
    nearbyUnits.forEach(unit => {
      connections.push({
        from: idf,
        to: unit,
        color: '#f39c12',
        type: 'IDF-Unit'
      });
    });
  });
  
  // Conectar Pedestales -> Unidades (1:1)
  pedestalNodes.forEach(pedestal => {
    const closestUnit = findClosestNode(pedestal, unitNodes);
    if (closestUnit) {
      connections.push({
        from: pedestal,
        to: closestUnit,
        color: '#9b59b6',
        type: 'Pedestal-Unit'
      });
    }
  });
  
  return connections;
};

const findClosestNode = (sourceNode, targetNodes) => {
  if (targetNodes.length === 0) return null;
  
  return targetNodes.reduce((closest, current) => {
    const closestDist = calculateDistance(sourceNode, closest);
    const currentDist = calculateDistance(sourceNode, current);
    return currentDist < closestDist ? current : closest;
  }, targetNodes[0]);
};

// Función auxiliar para encontrar los n nodos más cercanos
const findClosestNodes = (sourceNode, targetNodes, limit = 5) => {
  if (targetNodes.length === 0) return [];
  
  return targetNodes
    .map(node => ({
      node,
      distance: calculateDistance(sourceNode, node)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(item => item.node);
};

// Función auxiliar para calcular distancia entre dos puntos
const calculateDistance = (point1, point2) => {
  const lat1 = point1.latitude;
  const lon1 = point1.longitude;
  const lat2 = point2.latitude;
  const lon2 = point2.longitude;
  
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

  // Renderizar marcadores con clave única
//   const renderMarkers = () => {
//     return nodes.map((node) => (
//       <Marker
//         key={`marker-${node.id}`}
//         coordinate={{
//           latitude: node.latitude,
//           longitude: node.longitude
//         }}
//         onPress={() => selectNode(node)}
//         pinColor={getNodeColor(node.type)}
//       >
//         <View style={styles.markerContainer}>
//           <View style={[styles.marker, { backgroundColor: getNodeColor(node.type) }]}>
//             <Ionicons name={getNodeIcon(node.type)} size={16} color="#ffffff" />
//           </View>
//           <Text style={styles.markerText}>{node.name}</Text>
//         </View>
//       </Marker>
//     ));
//   };
// Renderizar marcadores con clave única
const renderMarkers = () => {
  return nodes.map((node, index) => (
    <Marker
      key={`marker-${node.id || `temp-${index}-${node.latitude}-${node.longitude}`}`}
      coordinate={{
        latitude: node.latitude,
        longitude: node.longitude
      }}
      onPress={() => selectNode(node)}
      pinColor={getNodeColor(node.type)}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.marker, { backgroundColor: getNodeColor(node.type) }]}>
          <Ionicons name={getNodeIcon(node.type)} size={16} color="#ffffff" />
        </View>
        <Text style={styles.markerText}>{node.name}</Text>
      </View>
    </Marker>
  ));
};

const normalizeData = (data) => {
  console.log('Normalizando datos:', data);
  
  if (!data) {
    console.log('Datos nulos o undefined');
    return [];
  }
  
  if (Array.isArray(data)) {
    console.log('Datos ya son array');
    return data.filter(item => item && typeof item === 'object');
  }
  
  if (typeof data === 'string') {
    try {
      console.log('Intentando parsear string JSON');
      const parsed = JSON.parse(data);
      return normalizeData(parsed);
    } catch (e) {
      console.log('Error parseando string:', e);
      return [];
    }
  }
  
  if (typeof data === 'object') {
    console.log('Convirtiendo objeto a array');
    // Si es un objeto con la estructura {id: {data}, id2: {data}}
    const values = Object.values(data);
    
    // Verificar si los valores son objetos válidos
    const validValues = values.filter(item => 
      item && typeof item === 'object' && item.type !== undefined
    );
    
    if (validValues.length > 0) {
      console.log('Objeto convertido a array con éxito');
      return validValues;
    }
    
    // Si el objeto tiene propiedades type, count, etc. directamente
    if (data.type !== undefined) {
      console.log('Objeto individual convertido a array');
      return [data];
    }
  }
  
  console.log('Formato no reconocido, devolviendo array vacío');
  return [];
};

  // Renderizar conexiones entre nodos
//   const renderConnections = () => {
//     return getConnections().map((connection, index) => (
//       <Polyline
//         key={`connection-${index}`}
//         coordinates={[
//           {
//             latitude: connection.from.latitude,
//             longitude: connection.from.longitude
//           },
//           {
//             latitude: connection.to.latitude,
//             longitude: connection.to.longitude
//           }
//         ]}
//         strokeColor={connection.color}
//         strokeWidth={2}
//         lineDashPattern={[5, 5]}
//       />
//     ));
//   };
// Renderizar conexiones entre nodos con claves únicas
const renderConnections = () => {
  return getConnections().map((connection, index) => {
    // Crear una clave única basada en los IDs de los nodos
    const fromId = connection.from.id || `temp-${connection.from.latitude}-${connection.from.longitude}`;
    const toId = connection.to.id || `temp-${connection.to.latitude}-${connection.to.longitude}`;
    
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
        strokeWidth={2}
        lineDashPattern={[5, 5]}
      />
    );
  });
};

// return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#2c3e50" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Mapa de Red</Text>
//         <View style={styles.headerButtons}>
//           <TouchableOpacity onPress={loadData} style={styles.headerButton}>
//             <Ionicons name="refresh" size={24} color="#3498db" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={saveNetworkMap} style={styles.headerButton}>
//             <Ionicons name="save" size={24} color="#27ae60" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Cambiar el layout para dar más espacio al mapa */}
//     <View style={styles.content}>
//   {/* Panel de herramientas compacto */}
//   <View style={styles.toolbar}>
//     <Text style={styles.toolbarTitle}>Nodos</Text>
    
//     <TouchableOpacity 
//       style={[styles.toolButton, selectedNodeType === 'MDF' && styles.toolButtonSelected]}
//       onPress={() => selectNodeType('MDF')}
//     >
//       <Ionicons name="server" size={20} color="#e74c3c" />
//       <Text style={styles.toolText}>MDF</Text>
//     </TouchableOpacity>

    // <TouchableOpacity 
    //   style={[styles.toolButton, selectedNodeType === 'pedestal' && styles.toolButtonSelected]}
    //   onPress={() => selectNodeType('pedestal')}
    // >
    //   <Ionicons name="cube" size={20} color="#3498db" />
    //   <Text style={styles.toolText}>Pedestal</Text>
    // </TouchableOpacity>

    // <TouchableOpacity 
    //   style={[styles.toolButton, selectedNodeType === 'IDF' && styles.toolButtonSelected]}
    //   onPress={() => selectNodeType('IDF')}
    // >
    //   <Ionicons name="hardware-chip" size={20} color="#2ecc71" />
    //   <Text style={styles.toolText}>IDF</Text>
    // </TouchableOpacity>

    // <TouchableOpacity 
    //   style={[styles.toolButton, selectedNodeType === 'unit' && styles.toolButtonSelected]}
    //   onPress={() => selectNodeType('unit')}
    // >
    //   <Ionicons name="home" size={20} color="#f39c12" />
    //   <Text style={styles.toolText}>Unit</Text>
    // </TouchableOpacity>

//     {isAddingMode && (
//       <TouchableOpacity 
//         style={[styles.toolButton, styles.cancelButton]}
//         onPress={() => {
//           setIsAddingMode(false);
//           setSelectedNodeType(null);
//         }}
//       >
//         <Ionicons name="close" size={20} color="#e74c3c" />
//         <Text style={styles.toolText}>Cancelar</Text>
//       </TouchableOpacity>
//     )}
//   </View>

//   {/* Mapa con más espacio */}
//   <View style={styles.mapContainer}>
//     <MapView
//       style={styles.map}
//       region={region}
//       onRegionChangeComplete={setRegion}
//       onPress={handleMapPress}
//     >
//       {renderMarkers()}
//       {renderConnections()}
//     </MapView>

//     {isAddingMode && (
//       <View style={styles.helpTextContainer}>
//         <Text style={styles.helpText}>
//           Toque en el mapa para colocar un nodo {selectedNodeType}
//         </Text>
//       </View>
//     )}
//   </View>
//    </View>

//       {/* Modal para detalles del nodo */}
//       <Modal
//      visible={showNodeModal}
//      animationType="slide"
//      transparent={true}
//      onRequestClose={() => setShowNodeModal(false)}
//      >
//   <View style={styles.modalContainer}>
//     <View style={styles.modalContent}>
//       <ScrollView>
//         <Text style={styles.modalTitle}>
//           {selectedNode?.id ? 'Editar Nodo' : 'Agregar Nodo'} - {selectedNode?.type}
//         </Text>

        // <Text style={styles.inputLabel}>Nombre del Nodo</Text>
        // <TextInput
        //   style={styles.input}
        //   value={nodeForm.name}
        //   onChangeText={(text) => setNodeForm({...nodeForm, name: text})}
        //   placeholder="Ingrese el nombre del nodo"
        // />

        // <Text style={styles.inputLabel}>Propietario</Text>
        // <TextInput
        //   style={styles.input}
        //   value={nodeForm.owner}
        //   onChangeText={(text) => setNodeForm({...nodeForm, owner: text})}
        //   placeholder="Ingrese el nombre del propietario"
        // />

        // <Text style={styles.inputLabel}>Dirección</Text>
        // <TextInput
        //   style={styles.input}
        //   value={nodeForm.address}
        //   onChangeText={(text) => setNodeForm({...nodeForm, address: text})}
        //   placeholder="Ingrese la dirección"
        //   multiline
        // />

//         {(selectedNode?.type === 'MDF' || selectedNode?.type === 'unit') && (
//           <>
//             <Text style={styles.sectionTitle}>Equipos de Conectividad</Text>
//             {devices.length === 0 ? (
//               <Text style={styles.emptyText}>No hay dispositivos configurados</Text>
//             ) : (
//               devices.map(device => (
//                 <TouchableOpacity
//                   key={`device-${device.type}-${device.ports}`}
//                   style={[
//                     styles.itemSelector,
//                     nodeForm.selectedDevices.some(d => 
//                       `${d.type}-${d.ports}` === `${device.type}-${device.ports}`
//                     ) && styles.itemSelected
//                   ]}
//                   onPress={() => toggleDeviceSelection(device)}
//                 >
//                   <Text style={styles.itemText}>
//                     {device.count}x {device.type} ({device.ports} puertos)
//                   </Text>
//                 </TouchableOpacity>
//               ))
//             )}

        //     <Text style={styles.sectionTitle}>Tipo de Fibra</Text>
        //     {fibers.length === 0 ? (
        //       <Text style={styles.emptyText}>No hay fibras configuradas</Text>
        //     ) : (
        //       fibers.map(fiber => (
        //         <TouchableOpacity
        //           key={`fiber-${fiber.type}`}
        //           style={[
        //             styles.itemSelector,
        //             nodeForm.selectedFiber?.type === fiber.type && styles.itemSelected
        //           ]}
        //           onPress={() => setNodeForm({...nodeForm, selectedFiber: fiber})}
        //         >
        //           <Text style={styles.itemText}>
        //             {fiber.count}x fibra {fiber.type}
        //           </Text>
        //         </TouchableOpacity>
        //       ))
        //     )}
        //   </>
//         )}

//         <View style={styles.modalButtons}>
//           <TouchableOpacity
//             style={[styles.modalButton, styles.cancelButton]}
//             onPress={() => setShowNodeModal(false)}
//           >
//             <Text style={styles.modalButtonText}>Cancelar</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modalButton, styles.saveButton]}
//             onPress={selectedNode?.id ? updateNode : addNode}
//           >
//             <Text style={styles.modalButtonText}>
//               {selectedNode?.id ? 'Actualizar' : 'Agregar'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   </View>
//   </Modal>
//     </View>
//   );
// };
 return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Red</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={loadData} style={styles.headerButton}>
            <Ionicons name="refresh" size={24} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveNetworkMap} style={styles.headerButton}>
            <Ionicons name="save" size={24} color="#27ae60" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cambiar el layout para dar más espacio al mapa */}
      <View style={styles.content}>
        {/* Panel de herramientas compacto */}
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Nodos</Text>
          
          <TouchableOpacity 
            style={[styles.toolButton, selectedNodeType === 'MDF' && styles.toolButtonSelected]}
            onPress={() => selectNodeType('MDF')}
          >
            <Ionicons name="server" size={20} color="#e74c3c" />
            <Text style={styles.toolText}>MDF</Text>
          </TouchableOpacity>
          <TouchableOpacity 
      style={[styles.toolButton, selectedNodeType === 'pedestal' && styles.toolButtonSelected]}
      onPress={() => selectNodeType('pedestal')}
    >
      <Ionicons name="cube" size={20} color="#3498db" />
      <Text style={styles.toolText}>Pedestal</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={[styles.toolButton, selectedNodeType === 'IDF' && styles.toolButtonSelected]}
      onPress={() => selectNodeType('IDF')}
    >
      <Ionicons name="hardware-chip" size={20} color="#2ecc71" />
      <Text style={styles.toolText}>IDF</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={[styles.toolButton, selectedNodeType === 'unit' && styles.toolButtonSelected]}
      onPress={() => selectNodeType('unit')}
    >
      <Ionicons name="home" size={20} color="#f39c12" />
      <Text style={styles.toolText}>Unit</Text>
    </TouchableOpacity>

          {/* Resto de botones de herramientas... */}
        </View>

        {/* Mapa con más espacio */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
          >
            {renderMarkers()}
            {renderConnections()}
          </MapView>

          {isAddingMode && (
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpText}>
                Toque en el mapa para colocar un nodo {selectedNodeType}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Modal para detalles del nodo */}
      <Modal
        visible={showNodeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNodeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {selectedNode?.id ? 'Editar Nodo' : 'Agregar Nodo'} - {selectedNode?.type}
              </Text>

              {/* Campos del formulario... */}
              <Text style={styles.inputLabel}>Nombre del Nodo</Text>
        <TextInput
          style={styles.input}
          value={nodeForm.name}
          onChangeText={(text) => setNodeForm({...nodeForm, name: text})}
          placeholder="Ingrese el nombre del nodo"
        />

        <Text style={styles.inputLabel}>Propietario</Text>
        <TextInput
          style={styles.input}
          value={nodeForm.owner}
          onChangeText={(text) => setNodeForm({...nodeForm, owner: text})}
          placeholder="Ingrese el nombre del propietario"
        />

        <Text style={styles.inputLabel}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={nodeForm.address}
          onChangeText={(text) => setNodeForm({...nodeForm, address: text})}
          placeholder="Ingrese la dirección"
          multiline
        />

              {(selectedNode?.type === 'MDF' || selectedNode?.type === 'unit') && (
                <>
                  <Text style={styles.sectionTitle}>Equipos de Conectividad</Text>
                  {devices.length === 0 ? (
                    <Text style={styles.emptyText}>No hay dispositivos configurados</Text>
                  ) : (
                    devices.map(device => {
                      const isAssigned = isDeviceAlreadyAssigned(device);
                      const isAvailable = isDeviceAvailable(device);
                      const isSelected = nodeForm.selectedDevices.some(d => 
                        `${d.type}-${d.ports}` === `${device.type}-${device.ports}`
                      );

                      return (
                        <TouchableOpacity
                          key={`device-${device.type}-${device.ports}`}
                          style={[
                            styles.itemSelector,
                            isSelected && styles.itemSelected,
                            !isAvailable && styles.itemDisabled
                          ]}
                          onPress={() => isAvailable && toggleDeviceSelection(device)}
                          disabled={!isAvailable}
                        >
                          <View style={styles.deviceItemContainer}>
                            <Text style={[
                              styles.itemText,
                              !isAvailable && styles.itemTextDisabled
                            ]}>
                              {device.count}x {device.type} ({device.ports} puertos)
                            </Text>
                            {isAssigned && !isSelected && (
                              <Text style={styles.assignedText}>(Asignado en otro nodo)</Text>
                            )}
                            {!isAvailable && (
                              <Text style={styles.unavailableText}>(No disponible)</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}

                  {/* Selección de fibra... */}
                  <Text style={styles.sectionTitle}>Tipo de Fibra</Text>
            {fibers.length === 0 ? (
              <Text style={styles.emptyText}>No hay fibras configuradas</Text>
            ) : (
              fibers.map(fiber => (
                <TouchableOpacity
                  key={`fiber-${fiber.type}`}
                  style={[
                    styles.itemSelector,
                    nodeForm.selectedFiber?.type === fiber.type && styles.itemSelected
                  ]}
                  onPress={() => setNodeForm({...nodeForm, selectedFiber: fiber})}
                >
                  <Text style={styles.itemText}>
                    {fiber.count}x fibra {fiber.type}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          
                </>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowNodeModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={selectedNode?.id ? updateNode : addNode}
                >
                  <Text style={styles.modalButtonText}>
                    {selectedNode?.id ? 'Actualizar' : 'Agregar'}
                  </Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#f8f9fa',
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  toolbar: {
    width: 80, // Más estrecho
    backgroundColor: '#ffffff',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#ecf0f1',
    justifyContent: 'flex-start',
  },
  toolbarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  toolButton: {
    alignItems: 'center',
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ecf0f1',
    minHeight: 60,
    justifyContent: 'center',
  },
  toolButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#3498db',
  },
  cancelButton: {
    backgroundColor: '#ffebee',
    borderColor: '#e74c3c',
  },
  toolText: {
    marginTop: 4,
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: '500',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    marginTop: 4,
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  helpTextContainer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  helpText: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 12,
  },
  itemSelector: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  itemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#3498db',
  },
  itemText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  deviceItemContainer: {
    flex: 1,
  },
  itemDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  itemTextDisabled: {
    color: '#999',
  },
  assignedText: {
    fontSize: 12,
    color: '#e74c3c',
    fontStyle: 'italic',
    marginTop: 4,
  },
  unavailableText: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default NetworkMap;