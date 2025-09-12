// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   ScrollView,
//   Alert,
//   Modal,
//   TextInput
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import * as Location from 'expo-location';

// const ViewOnMap = ({ navigation, route }) => {
//   const mapRef = useRef(null);
//   const [region, setRegion] = useState({
//     latitude: 29.6516,
//     longitude: -82.3248,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredNodes, setFilteredNodes] = useState([]);
//   const [userLocation, setUserLocation] = useState(null);

//   // Datos de ejemplo - nodos del proyecto de fibra óptica
//   const projectNodes = [
//     {
//       id: 1,
//       name: 'Central Office',
//       type: 'CO',
//       latitude: 29.6516,
//       longitude: -82.3248,
//       status: 'active',
//       connections: [2, 3],
//       description: 'Main central office with core switches',
//       capacity: '10Gbps'
//     },
//     {
//       id: 2,
//       name: 'FDT-001',
//       type: 'FDT',
//       latitude: 29.6550,
//       longitude: -82.3200,
//       status: 'active',
//       connections: [1, 4, 5],
//       description: 'Fiber Distribution Terminal - Zone 1',
//       capacity: '2.5Gbps'
//     },
//     {
//       id: 3,
//       name: 'FDT-002',
//       type: 'FDT',
//       latitude: 29.6480,
//       longitude: -82.3280,
//       status: 'maintenance',
//       connections: [1, 6],
//       description: 'Fiber Distribution Terminal - Zone 2',
//       capacity: '2.5Gbps'
//     },
//     {
//       id: 4,
//       name: 'ONT-045',
//       type: 'ONT',
//       latitude: 29.6565,
//       longitude: -82.3180,
//       status: 'active',
//       connections: [2],
//       description: 'Optical Network Terminal - Building A',
//       capacity: '1Gbps'
//     },
//     {
//       id: 5,
//       name: 'ONT-078',
//       type: 'ONT',
//       latitude: 29.6535,
//       longitude: -82.3220,
//       status: 'inactive',
//       connections: [2],
//       description: 'Optical Network Terminal - Building B',
//       capacity: '1Gbps'
//     },
//     {
//       id: 6,
//       name: 'ONT-112',
//       type: 'ONT',
//       latitude: 29.6460,
//       longitude: -82.3300,
//       status: 'active',
//       connections: [3],
//       description: 'Optical Network Terminal - Building C',
//       capacity: '1Gbps'
//     },
//     {
//       id: 7,
//       name: 'Splitter-01',
//       type: 'SPLITTER',
//       latitude: 29.6500,
//       longitude: -82.3250,
//       status: 'active',
//       connections: [2, 3],
//       description: 'Optical Splitter - Main junction',
//       capacity: '5Gbps'
//     }
//   ];

//   useEffect(() => {
//     setFilteredNodes(projectNodes);
//     getLocation();
//   }, []);

//   useEffect(() => {
//     if (searchQuery) {
//       const filtered = projectNodes.filter(node =>
//         node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         node.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         node.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredNodes(filtered);
//     } else {
//       setFilteredNodes(projectNodes);
//     }
//   }, [searchQuery]);

//   const getLocation = async () => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.log('Permission to access location was denied');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     } catch (error) {
//       console.log('Error getting location:', error);
//     }
//   };

//   const zoomIn = () => {
//     mapRef.current.animateCamera({
//       center: region,
//       zoom: 1,
//     });
//   };

//   const zoomOut = () => {
//     mapRef.current.animateCamera({
//       center: region,
//       zoom: -1,
//     });
//   };

//   const focusOnNode = (node) => {
//     mapRef.current.animateCamera({
//       center: {
//         latitude: node.latitude,
//         longitude: node.longitude,
//       },
//       zoom: 15,
//     });
//     setSelectedNode(node);
//     setModalVisible(true);
//   };

//   const focusOnUserLocation = () => {
//     if (userLocation) {
//       mapRef.current.animateCamera({
//         center: userLocation,
//         zoom: 15,
//       });
//     } else {
//       Alert.alert('Location', 'User location not available');
//     }
//   };

//   const getNodeConnections = () => {
//     const connections = [];
//     projectNodes.forEach(node => {
//       node.connections.forEach(connectionId => {
//         const targetNode = projectNodes.find(n => n.id === connectionId);
//         if (targetNode) {
//           connections.push({
//             from: { latitude: node.latitude, longitude: node.longitude },
//             to: { latitude: targetNode.latitude, longitude: targetNode.longitude },
//             status: node.status
//           });
//         }
//       });
//     });
//     return connections;
//   };

//   const getNodeIcon = (type) => {
//     switch (type) {
//       case 'CO': return 'business';
//       case 'FDT': return 'hardware-chip';
//       case 'ONT': return 'home';
//       case 'SPLITTER': return 'git-merge';
//       default: return 'location';
//     }
//   };

//   const getNodeColor = (status) => {
//     switch (status) {
//       case 'active': return '#2ecc71';
//       case 'maintenance': return '#f39c12';
//       case 'inactive': return '#e74c3c';
//       default: return '#95a5a6';
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#2c3e50" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Network Map</Text>
//         <TouchableOpacity onPress={getLocation}>
//           <Ionicons name="navigate" size={24} color="#3498db" />
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search nodes..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#95a5a6"
//         />
//         {searchQuery ? (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Ionicons name="close-circle" size={20} color="#7f8c8d" />
//           </TouchableOpacity>
//         ) : null}
//       </View>

//       {/* Map View */}
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         region={region}
//         onRegionChangeComplete={setRegion}
//         showsUserLocation={true}
//         showsMyLocationButton={false}
//       >
//         {/* User Location */}
//         {userLocation && (
//           <Marker
//             coordinate={userLocation}
//             title="Your Location"
//             description="Current position"
//           >
//             <View style={styles.userMarker}>
//               <Ionicons name="person" size={16} color="#ffffff" />
//             </View>
//           </Marker>
//         )}

//         {/* Project Nodes */}
//         {filteredNodes.map((node) => (
//           <Marker
//             key={node.id}
//             coordinate={{ latitude: node.latitude, longitude: node.longitude }}
//             title={node.name}
//             description={node.type}
//             onPress={() => focusOnNode(node)}
//           >
//             <View style={[styles.marker, { backgroundColor: getNodeColor(node.status) }]}>
//               <Ionicons name={getNodeIcon(node.type)} size={16} color="#ffffff" />
//             </View>
//           </Marker>
//         ))}

//         {/* Connections */}
//         {getNodeConnections().map((connection, index) => (
//           <Polyline
//             key={index}
//             coordinates={[connection.from, connection.to]}
//             strokeColor={getNodeColor(connection.status)}
//             strokeWidth={2}
//             lineDashPattern={connection.status === 'inactive' ? [5, 5] : []}
//           />
//         ))}
//       </MapView>

//       {/* Controls */}
//       <View style={styles.controls}>
//         <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
//           <Ionicons name="add" size={24} color="#2c3e50" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
//           <Ionicons name="remove" size={24} color="#2c3e50" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.controlButton} onPress={focusOnUserLocation}>
//           <Ionicons name="navigate" size={24} color="#2c3e50" />
//         </TouchableOpacity>
//       </View>

//       {/* Node Details Modal */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {selectedNode && (
//               <>
//                 <View style={styles.modalHeader}>
//                   <View style={[styles.statusIndicator, { backgroundColor: getNodeColor(selectedNode.status) }]} />
//                   <Text style={styles.modalTitle}>{selectedNode.name}</Text>
//                   <TouchableOpacity onPress={() => setModalVisible(false)}>
//                     <Ionicons name="close" size={24} color="#2c3e50" />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.modalBody}>
//                   <View style={styles.detailRow}>
//                     <Ionicons name={getNodeIcon(selectedNode.type)} size={20} color="#3498db" />
//                     <Text style={styles.detailLabel}>Type:</Text>
//                     <Text style={styles.detailValue}>{selectedNode.type}</Text>
//                   </View>

//                   <View style={styles.detailRow}>
//                     <Ionicons name="speedometer" size={20} color="#3498db" />
//                     <Text style={styles.detailLabel}>Capacity:</Text>
//                     <Text style={styles.detailValue}>{selectedNode.capacity}</Text>
//                   </View>

//                   <View style={styles.detailRow}>
//                     <Ionicons name="information-circle" size={20} color="#3498db" />
//                     <Text style={styles.detailLabel}>Status:</Text>
//                     <Text style={[styles.detailValue, { color: getNodeColor(selectedNode.status) }]}>
//                       {selectedNode.status.toUpperCase()}
//                     </Text>
//                   </View>

//                   <Text style={styles.description}>{selectedNode.description}</Text>

//                   <Text style={styles.connectionsTitle}>Connected to:</Text>
//                   <ScrollView style={styles.connectionsList}>
//                     {selectedNode.connections.map(connId => {
//                       const connectedNode = projectNodes.find(n => n.id === connId);
//                       return connectedNode ? (
//                         <TouchableOpacity
//                           key={connId}
//                           style={styles.connectionItem}
//                           onPress={() => {
//                             setModalVisible(false);
//                             focusOnNode(connectedNode);
//                           }}
//                         >
//                           <Ionicons name={getNodeIcon(connectedNode.type)} size={16} color="#3498db" />
//                           <Text style={styles.connectionName}>{connectedNode.name}</Text>
//                           <Ionicons name="arrow-forward" size={16} color="#7f8c8d" />
//                         </TouchableOpacity>
//                       ) : null;
//                     })}
//                   </ScrollView>
//                 </View>

//                 <TouchableOpacity 
//                   style={styles.viewDetailsButton}
//                   onPress={() => {
//                     setModalVisible(false);
//                     Alert.alert('Node Details', 'Would open detailed node view');
//                   }}
//                 >
//                   <Text style={styles.viewDetailsButtonText}>View Full Details</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Legend */}
//       <View style={styles.legend}>
//         <Text style={styles.legendTitle}>Legend</Text>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: '#2ecc71' }]} />
//           <Text style={styles.legendText}>Active</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
//           <Text style={styles.legendText}>Maintenance</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
//           <Text style={styles.legendText}>Inactive</Text>
//         </View>
//       </View>
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
//     padding: 16,
//     paddingTop: 50,
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
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1a1a1a',
//     margin: 16,
//     marginTop: 8,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#333333',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#ffffff',
//     fontSize: 16,
//   },
//   map: {
//     flex: 1,
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height - 200,
//   },
//   controls: {
//     position: 'absolute',
//     right: 16,
//     bottom: 120,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 8,
//     padding: 8,
//   },
//   controlButton: {
//     padding: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   marker: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: '#ffffff',
//   },
//   userMarker: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#3498db',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   modalContent: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 16,
//     padding: 24,
//     width: '90%',
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   statusIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   modalTitle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#ffffff',
//   },
//   modalBody: {
//     marginBottom: 20,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#bdc3c7',
//     marginLeft: 8,
//     marginRight: 4,
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   description: {
//     fontSize: 14,
//     color: '#ecf0f1',
//     marginTop: 16,
//     marginBottom: 16,
//     lineHeight: 20,
//   },
//   connectionsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#ffffff',
//     marginBottom: 8,
//   },
//   connectionsList: {
//     maxHeight: 120,
//   },
//   connectionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#2c3e50',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   connectionName: {
//     flex: 1,
//     fontSize: 14,
//     color: '#ffffff',
//     marginLeft: 8,
//   },
//   viewDetailsButton: {
//     backgroundColor: '#3498db',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   viewDetailsButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   legend: {
//     position: 'absolute',
//     left: 16,
//     bottom: 16,
//     backgroundColor: 'rgba(26, 26, 26, 0.9)',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#333333',
//   },
//   legendTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#ffffff',
//     marginBottom: 8,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   legendColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#ecf0f1',
//   },
// });

// export default ViewOnMap;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const ViewOnMap = ({ navigation, route }) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 29.6516,
    longitude: -82.3248,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Datos de ejemplo - nodos del proyecto de fibra óptica
  const projectNodes = [
    {
      id: 1,
      name: 'Central Office',
      type: 'CO',
      latitude: 29.6516,
      longitude: -82.3248,
      status: 'active',
      connections: [2, 3],
      description: 'Main central office with core switches',
      capacity: '10Gbps'
    },
    {
      id: 2,
      name: 'FDT-001',
      type: 'FDT',
      latitude: 29.6550,
      longitude: -82.3200,
      status: 'active',
      connections: [1, 4, 5],
      description: 'Fiber Distribution Terminal - Zone 1',
      capacity: '2.5Gbps'
    },
    {
      id: 3,
      name: 'FDT-002',
      type: 'FDT',
      latitude: 29.6480,
      longitude: -82.3280,
      status: 'maintenance',
      connections: [1, 6],
      description: 'Fiber Distribution Terminal - Zone 2',
      capacity: '2.5Gbps'
    },
    {
      id: 4,
      name: 'ONT-045',
      type: 'ONT',
      latitude: 29.6565,
      longitude: -82.3180,
      status: 'active',
      connections: [2],
      description: 'Optical Network Terminal - Building A',
      capacity: '1Gbps'
    },
    {
      id: 5,
      name: 'ONT-078',
      type: 'ONT',
      latitude: 29.6535,
      longitude: -82.3220,
      status: 'inactive',
      connections: [2],
      description: 'Optical Network Terminal - Building B',
      capacity: '1Gbps'
    },
    {
      id: 6,
      name: 'ONT-112',
      type: 'ONT',
      latitude: 29.6460,
      longitude: -82.3300,
      status: 'active',
      connections: [3],
      description: 'Optical Network Terminal - Building C',
      capacity: '1Gbps'
    },
    {
      id: 7,
      name: 'Splitter-01',
      type: 'SPLITTER',
      latitude: 29.6500,
      longitude: -82.3250,
      status: 'active',
      connections: [2, 3],
      description: 'Optical Splitter - Main junction',
      capacity: '5Gbps'
    }
  ];

  useEffect(() => {
    setFilteredNodes(projectNodes);
    getLocation();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = projectNodes.filter(node =>
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNodes(filtered);
    } else {
      setFilteredNodes(projectNodes);
    }
  }, [searchQuery]);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const zoomIn = () => {
    mapRef.current.animateCamera({
      center: region,
      zoom: 1,
    });
  };

  const zoomOut = () => {
    mapRef.current.animateCamera({
      center: region,
      zoom: -1,
    });
  };

  const focusOnNode = (node) => {
    mapRef.current.animateCamera({
      center: {
        latitude: node.latitude,
        longitude: node.longitude,
      },
      zoom: 15,
    });
    setSelectedNode(node);
    setModalVisible(true);
  };

  const focusOnUserLocation = () => {
    if (userLocation) {
      mapRef.current.animateCamera({
        center: userLocation,
        zoom: 15,
      });
    } else {
      Alert.alert('Location', 'User location not available');
    }
  };

  const getNodeConnections = () => {
    const connections = [];
    projectNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = projectNodes.find(n => n.id === connectionId);
        if (targetNode) {
          connections.push({
            from: { latitude: node.latitude, longitude: node.longitude },
            to: { latitude: targetNode.latitude, longitude: targetNode.longitude },
            status: node.status
          });
        }
      });
    });
    return connections;
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'CO': return 'business';
      case 'FDT': return 'hardware-chip';
      case 'ONT': return 'home';
      case 'SPLITTER': return 'git-merge';
      default: return 'location';
    }
  };

  const getNodeColor = (status) => {
    switch (status) {
      case 'active': return '#2ecc71';
      case 'maintenance': return '#f39c12';
      case 'inactive': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

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
        <Text style={styles.headerTitle}>Network Map</Text>
        <TouchableOpacity onPress={getLocation}>
          <Ionicons name="navigate" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search nodes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#7f8c8d"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* User Location */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            description="Current position"
          >
            <View style={styles.userMarker}>
              <Ionicons name="person" size={16} color="#ffffff" />
            </View>
          </Marker>
        )}

        {/* Project Nodes */}
        {filteredNodes.map((node) => (
          <Marker
            key={node.id}
            coordinate={{ latitude: node.latitude, longitude: node.longitude }}
            title={node.name}
            description={node.type}
            onPress={() => focusOnNode(node)}
          >
            <View style={[styles.marker, { backgroundColor: getNodeColor(node.status) }]}>
              <Ionicons name={getNodeIcon(node.type)} size={16} color="#ffffff" />
            </View>
          </Marker>
        ))}

        {/* Connections */}
        {getNodeConnections().map((connection, index) => (
          <Polyline
            key={index}
            coordinates={[connection.from, connection.to]}
            strokeColor={getNodeColor(connection.status)}
            strokeWidth={3}
            lineDashPattern={connection.status === 'inactive' ? [5, 5] : []}
          />
        ))}
      </MapView>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
          <Ionicons name="add" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
          <Ionicons name="remove" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={focusOnUserLocation}>
          <Ionicons name="navigate" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Node Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedNode && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.statusIndicator, { backgroundColor: getNodeColor(selectedNode.status) }]} />
                  <Text style={styles.modalTitle}>{selectedNode.name}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#2c3e50" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Ionicons name={getNodeIcon(selectedNode.type)} size={20} color="#3498db" />
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>{selectedNode.type}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="speedometer" size={20} color="#3498db" />
                    <Text style={styles.detailLabel}>Capacity:</Text>
                    <Text style={styles.detailValue}>{selectedNode.capacity}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="information-circle" size={20} color="#3498db" />
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, { color: getNodeColor(selectedNode.status) }]}>
                      {selectedNode.status.toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.description}>{selectedNode.description}</Text>

                  <Text style={styles.connectionsTitle}>Connected to:</Text>
                  <ScrollView style={styles.connectionsList}>
                    {selectedNode.connections.map(connId => {
                      const connectedNode = projectNodes.find(n => n.id === connId);
                      return connectedNode ? (
                        <TouchableOpacity
                          key={connId}
                          style={styles.connectionItem}
                          onPress={() => {
                            setModalVisible(false);
                            focusOnNode(connectedNode);
                          }}
                        >
                          <Ionicons name={getNodeIcon(connectedNode.type)} size={16} color="#3498db" />
                          <Text style={styles.connectionName}>{connectedNode.name}</Text>
                          <Ionicons name="arrow-forward" size={16} color="#7f8c8d" />
                        </TouchableOpacity>
                      ) : null;
                    })}
                  </ScrollView>
                </View>

                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => {
                    setModalVisible(false);
                    Alert.alert('Node Details', 'Would open detailed node view');
                  }}
                >
                  <Text style={styles.viewDetailsButtonText}>View Full Details</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2ecc71' }]} />
          <Text style={styles.legendText}>Active</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
          <Text style={styles.legendText}>Maintenance</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.legendText}>Inactive</Text>
        </View>
      </View>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dce4ec',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
    color: '#7f8c8d',
  },
  searchInput: {
    flex: 1,
    color: '#2c3e50',
    fontSize: 16,
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 200,
  },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  controlButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  userMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalBody: {
    marginBottom: 20,
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
    fontSize: 15,
    color: '#7f8c8d',
    marginLeft: 10,
    marginRight: 6,
    fontWeight: '500',
    minWidth: 70,
  },
  detailValue: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '600',
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: '#34495e',
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 22,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  connectionsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  connectionsList: {
    maxHeight: 150,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  connectionName: {
    flex: 1,
    fontSize: 15,
    color: '#2c3e50',
    marginLeft: 12,
    fontWeight: '500',
  },
  viewDetailsButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  viewDetailsButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  legend: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  legendText: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '500',
  },
});

export default ViewOnMap;