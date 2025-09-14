// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   Modal,
//   Switch,
//   Share
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import * as QRCode from 'react-native-qrcode-svg';

// const CreateProject = ({ navigation }) => {
//   const [projectData, setProjectData] = useState({
//     propertyName: 'OAK GATE CONDO PH3',
//     propertyAddress: '601-615 NW 29th AVE',
//     city: 'GAINESVILLE',
//     county: 'Alachua',
//     state: 'FL',
//     propertyType: 'Rental',
//     totalLivingUnits: '128',
//     totalOffices: '0',
//     totalCommercialUnits: '0',
//     buildType: 'MDU',
//     jobType: 'Residential',
//     buildingType: 'Garden Style'
//   });

//   const [modalVisible, setModalVisible] = useState(false);
//   const [nodesModalVisible, setNodesModalVisible] = useState(false);
//   const [connectionModalVisible, setConnectionModalVisible] = useState(false);
//   const [qrModalVisible, setQrModalVisible] = useState(false);

//   const [nodes, setNodes] = useState([
//     { id: 1, type: 'Switch', selected: false, ports: 24, connectedTo: [] },
//     { id: 2, type: 'Router', selected: false, ports: 8, connectedTo: [] },
//     { id: 3, type: 'Access Point', selected: false, ports: 4, connectedTo: [] },
//     { id: 4, type: 'Fiber Distribution', selected: false, ports: 48, connectedTo: [] },
//     { id: 5, type: 'OLT', selected: false, ports: 16, connectedTo: [] },
//     { id: 6, type: 'ONT', selected: false, ports: 1, connectedTo: [] }
//   ]);

//   const [connections, setConnections] = useState([]);

//   const calculateTotalUnits = () => {
//     const living = parseInt(projectData.totalLivingUnits) || 0;
//     const offices = parseInt(projectData.totalOffices) || 0;
//     const commercial = parseInt(projectData.totalCommercialUnits) || 0;
//     return living + offices + commercial;
//   };

//   const handleInputChange = (field, value) => {
//     setProjectData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const toggleNodeSelection = (nodeId) => {
//     setNodes(prevNodes => 
//       prevNodes.map(node => 
//         node.id === nodeId 
//           ? { ...node, selected: !node.selected } 
//           : node
//       )
//     );
//   };

//   const handleAddConnection = (fromNode, toNode) => {
//     const newConnection = {
//       id: Date.now(),
//       from: fromNode,
//       to: toNode,
//       type: 'Fiber'
//     };
//     setConnections(prev => [...prev, newConnection]);
//   };

//   const generateProjectQR = () => {
//     const projectSummary = {
//       ...projectData,
//       totalUnits: calculateTotalUnits(),
//       selectedNodes: nodes.filter(node => node.selected).map(node => node.type),
//       connections: connections.length
//     };
//     return JSON.stringify(projectSummary);
//   };

//   const shareProject = async () => {
//     try {
//       const result = await Share.share({
//         message: `FTTH Project: ${projectData.propertyName}\nAddress: ${projectData.propertyAddress}\nTotal Units: ${calculateTotalUnits()}`,
//         title: 'FTTH Project Details'
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Failed to share project');
//     }
//   };

//   const saveProject = () => {
//     Alert.alert('Success', 'Project saved successfully!');
//     navigation.goBack();
//   };

//   const selectedNodes = nodes.filter(node => node.selected);

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
//         <Text style={styles.headerTitle}>Create New Project</Text>
//         <TouchableOpacity onPress={saveProject}>
//           <Ionicons name="save-outline" size={24} color="#3498db" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView 
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Property Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Property Information</Text>
          
//           <View style={styles.formCard}>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Property Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={projectData.propertyName}
//                 onChangeText={(text) => handleInputChange('propertyName', text)}
//                 placeholder="Enter property name"
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Property Address</Text>
//               <TextInput
//                 style={styles.input}
//                 value={projectData.propertyAddress}
//                 onChangeText={(text) => handleInputChange('propertyAddress', text)}
//                 placeholder="Enter address"
//               />
//             </View>

//             <View style={styles.row}>
//               <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
//                 <Text style={styles.label}>City</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={projectData.city}
//                   onChangeText={(text) => handleInputChange('city', text)}
//                   placeholder="City"
//                 />
//               </View>

//               <View style={[styles.inputGroup, { flex: 1 }]}>
//                 <Text style={styles.label}>County</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={projectData.county}
//                   onChangeText={(text) => handleInputChange('county', text)}
//                   placeholder="County"
//                 />
//               </View>
//             </View>

//             <View style={styles.row}>
//               <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
//                 <Text style={styles.label}>State</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={projectData.state}
//                   onChangeText={(text) => handleInputChange('state', text)}
//                   placeholder="State"
//                   maxLength={2}
//                 />
//               </View>

//               <View style={[styles.inputGroup, { flex: 1 }]}>
//                 <Text style={styles.label}>Property Type</Text>
//                 <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={projectData.propertyType}
//                     onValueChange={(value) => handleInputChange('propertyType', value)}
//                     style={styles.picker}
//                   >
//                     <Picker.Item label="Rental" value="Rental" />
//                     <Picker.Item label="Condo" value="Condo" />
//                     <Picker.Item label="Commercial" value="Commercial" />
//                   </Picker>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Unit Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Unit Information</Text>
          
//           <View style={styles.formCard}>
//             <View style={styles.row}>
//               <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
//                 <Text style={styles.label}>Living Units</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={projectData.totalLivingUnits}
//                   onChangeText={(text) => handleInputChange('totalLivingUnits', text)}
//                   placeholder="0"
//                   keyboardType="numeric"
//                 />
//               </View>

//               <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
//                 <Text style={styles.label}>Offices/Amenities</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={projectData.totalOffices}
//                   onChangeText={(text) => handleInputChange('totalOffices', text)}
//                   placeholder="0"
//                   keyboardType="numeric"
//                 />
//               </View>

//               <View style={[styles.inputGroup, { flex: 1 }]}>
//                 <Text style={styles.label}>Commercial Units</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={projectData.totalCommercialUnits}
//                   onChangeText={(text) => handleInputChange('totalCommercialUnits', text)}
//                   placeholder="0"
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>

//             <View style={styles.totalUnits}>
//               <Text style={styles.totalLabel}>Total Units:</Text>
//               <Text style={styles.totalValue}>{calculateTotalUnits()}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Project Type */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Project Type</Text>
          
//           <View style={styles.formCard}>
//             <View style={styles.row}>
//               <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
//                 <Text style={styles.label}>Build Type</Text>
//                 <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={projectData.buildType}
//                     onValueChange={(value) => handleInputChange('buildType', value)}
//                     style={styles.picker}
//                   >
//                     <Picker.Item label="MDU" value="MDU" />
//                     <Picker.Item label="SDU" value="SDU" />
//                     <Picker.Item label="Commercial" value="Commercial" />
//                   </Picker>
//                 </View>
//               </View>

//               <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
//                 <Text style={styles.label}>Job Type</Text>
//                 <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={projectData.jobType}
//                     onValueChange={(value) => handleInputChange('jobType', value)}
//                     style={styles.picker}
//                   >
//                     <Picker.Item label="Residential" value="Residential" />
//                     <Picker.Item label="Commercial" value="Commercial" />
//                     <Picker.Item label="Mixed Use" value="Mixed Use" />
//                   </Picker>
//                 </View>
//               </View>

//               <View style={[styles.inputGroup, { flex: 1 }]}>
//                 <Text style={styles.label}>Building Type</Text>
//                 <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={projectData.buildingType}
//                     onValueChange={(value) => handleInputChange('buildingType', value)}
//                     style={styles.picker}
//                   >
//                     <Picker.Item label="Garden Style" value="Garden Style" />
//                     <Picker.Item label="High Rise" value="High Rise" />
//                     <Picker.Item label="Campus" value="Campus" />
//                   </Picker>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Nodes and Media */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Network Infrastructure</Text>
          
//           <View style={styles.formCard}>
//             <TouchableOpacity 
//               style={styles.nodesButton}
//               onPress={() => setNodesModalVisible(true)}
//             >
//               <Ionicons name="hardware-chip-outline" size={24} color="#3498db" />
//               <Text style={styles.nodesButtonText}>Select Nodes & Media</Text>
//               <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
//             </TouchableOpacity>

//             {selectedNodes.length > 0 && (
//               <View style={styles.selectedNodes}>
//                 <Text style={styles.selectedNodesTitle}>Selected Nodes:</Text>
//                 {selectedNodes.map(node => (
//                   <Text key={node.id} style={styles.nodeItem}>
//                     • {node.type} ({node.ports} ports)
//                   </Text>
//                 ))}
//               </View>
//             )}

//             {selectedNodes.length > 1 && (
//               <TouchableOpacity 
//                 style={styles.connectionButton}
//                 onPress={() => setConnectionModalVisible(true)}
//               >
//                 <Ionicons name="git-network-outline" size={20} color="#ffffff" />
//                 <Text style={styles.connectionButtonText}>Configure Connections</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Actions */}
//         <View style={styles.section}>
//           <View style={styles.actionsCard}>
//             <TouchableOpacity 
//               style={styles.generateQRButton}
//               onPress={() => setQrModalVisible(true)}
//             >
//               <Ionicons name="qr-code-outline" size={24} color="#ffffff" />
//               <Text style={styles.generateQRButtonText}>Generate QR Code</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.shareButton}
//               onPress={shareProject}
//             >
//               <Ionicons name="share-social-outline" size={24} color="#3498db" />
//               <Text style={styles.shareButtonText}>Share Project</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Nodes Selection Modal */}
//       <Modal
//         visible={nodesModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setNodesModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Nodes & Media</Text>
//               <TouchableOpacity onPress={() => setNodesModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#2c3e50" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalScroll}>
//               {nodes.map(node => (
//                 <View key={node.id} style={styles.nodeOption}>
//                   <View style={styles.nodeInfo}>
//                     <Ionicons name="hardware-chip-outline" size={24} color="#3498db" />
//                     <View style={styles.nodeDetails}>
//                       <Text style={styles.nodeName}>{node.type}</Text>
//                       <Text style={styles.nodePorts}>{node.ports} ports available</Text>
//                     </View>
//                   </View>
//                   <Switch
//                     value={node.selected}
//                     onValueChange={() => toggleNodeSelection(node.id)}
//                     trackColor={{ false: '#bdc3c7', true: '#3498db' }}
//                   />
//                 </View>
//               ))}
//             </ScrollView>

//             <TouchableOpacity 
//               style={styles.modalDoneButton}
//               onPress={() => setNodesModalVisible(false)}
//             >
//               <Text style={styles.modalDoneButtonText}>Done</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* QR Code Modal */}
//       <Modal
//         visible={qrModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setQrModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Project QR Code</Text>
//               <TouchableOpacity onPress={() => setQrModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#2c3e50" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.qrContainer}>
//               <QRCode
//                 value={generateProjectQR()}
//                 size={200}
//                 color="#2c3e50"
//                 backgroundColor="#ffffff"
//               />
//             </View>

//             <Text style={styles.qrDescription}>
//               Scan this QR code to access project details
//             </Text>

//             <TouchableOpacity 
//               style={styles.modalDoneButton}
//               onPress={() => setQrModalVisible(false)}
//             >
//               <Text style={styles.modalDoneButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#f8f9fa',
  // },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   backgroundColor: '#ffffff',
  //   padding: 16,
  //   paddingTop: 50,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ecf0f1',
  // },
  // backButton: {
  //   padding: 4,
  // },
  // headerTitle: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   color: '#2c3e50',
  // },
  // scrollView: {
  //   flex: 1,
  // },
  // scrollContent: {
  //   padding: 16,
  //   paddingBottom: 30,
  // },
  // section: {
  //   marginBottom: 24,
  // },
  // sectionTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#2c3e50',
  //   marginBottom: 12,
  //   marginLeft: 4,
  //   textTransform: 'uppercase',
  //   letterSpacing: 0.5,
  // },
  // formCard: {
  //   backgroundColor: '#ffffff',
  //   borderRadius: 12,
  //   padding: 16,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 1,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   elevation: 2,
  // },
  // inputGroup: {
  //   marginBottom: 16,
  // },
  // label: {
  //   fontSize: 14,
  //   fontWeight: '500',
  //   color: '#2c3e50',
  //   marginBottom: 8,
  // },
  // input: {
  //   borderWidth: 1,
  //   borderColor: '#ecf0f1',
  //   borderRadius: 8,
  //   padding: 12,
  //   fontSize: 16,
  //   backgroundColor: '#f8f9fa',
  // },
  // row: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // pickerContainer: {
  //   borderWidth: 1,
  //   borderColor: '#ecf0f1',
  //   borderRadius: 8,
  //   backgroundColor: '#f8f9fa',
  //   overflow: 'hidden',
  // },
  // picker: {
  //   height: 50,
  // },
  // totalUnits: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: 12,
  //   backgroundColor: '#3498db10',
  //   borderRadius: 8,
  //   marginTop: 8,
  // },
  // totalLabel: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#2c3e50',
  // },
  // totalValue: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#3498db',
  // },
  // nodesButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 16,
  //   backgroundColor: '#f8f9fa',
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#ecf0f1',
  // },
  // nodesButtonText: {
  //   fontSize: 16,
  //   fontWeight: '500',
  //   color: '#2c3e50',
  //   marginLeft: 12,
  //   flex: 1,
  // },
  // selectedNodes: {
  //   marginTop: 16,
  //   padding: 12,
  //   backgroundColor: '#f8f9fa',
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#ecf0f1',
  // },
  // selectedNodesTitle: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   color: '#2c3e50',
  //   marginBottom: 8,
  // },
  // nodeItem: {
  //   fontSize: 12,
  //   color: '#7f8c8d',
  //   marginBottom: 4,
  // },
  // connectionButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#2ecc71',
  //   padding: 12,
  //   borderRadius: 8,
  //   marginTop: 12,
  // },
  // connectionButtonText: {
  //   color: '#ffffff',
  //   fontWeight: '600',
  //   marginLeft: 8,
  // },
  // actionsCard: {
  //   backgroundColor: '#ffffff',
  //   borderRadius: 12,
  //   padding: 16,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 1,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   elevation: 2,
  //   gap: 12,
  // },
  // generateQRButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#3498db',
  //   padding: 16,
  //   borderRadius: 8,
  // },
  // generateQRButtonText: {
  //   color: '#ffffff',
  //   fontWeight: '600',
  //   marginLeft: 8,
  // },
  // shareButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#ffffff',
  //   padding: 16,
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#3498db',
  // },
  // shareButtonText: {
  //   color: '#3498db',
  //   fontWeight: '600',
  //   marginLeft: 8,
  // },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  // },
  // modalContent: {
  //   backgroundColor: '#ffffff',
  //   borderRadius: 16,
  //   padding: 24,
  //   width: '90%',
  //   maxHeight: '80%',
  // },
  // modalHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   marginBottom: 20,
  // },
  // modalTitle: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   color: '#2c3e50',
  // },
  // modalScroll: {
  //   maxHeight: 400,
  // },
  // nodeOption: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   padding: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ecf0f1',
  // },
  // nodeInfo: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   flex: 1,
  // },
  // nodeDetails: {
  //   marginLeft: 12,
  //   flex: 1,
  // },
  // nodeName: {
  //   fontSize: 16,
  //   fontWeight: '500',
  //   color: '#2c3e50',
  // },
  // nodePorts: {
  //   fontSize: 12,
  //   color: '#7f8c8d',
  // },
  // modalDoneButton: {
  //   backgroundColor: '#3498db',
  //   padding: 16,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   marginTop: 20,
  // },
  // modalDoneButtonText: {
  //   color: '#ffffff',
  //   fontWeight: '600',
  //   fontSize: 16,
  // },
  // qrContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   padding: 20,
  //   backgroundColor: '#ffffff',
  //   borderRadius: 12,
  //   marginVertical: 20,
  // },
  // qrDescription: {
  //   textAlign: 'center',
  //   color: '#7f8c8d',
  //   marginBottom: 20,
  // },
// });

// export default CreateProject;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as QRCode from 'react-native-qrcode-svg';
import { ProjectService, UnitsService, ProjectTypeService, NodeService } from '../../service/storage';

const CreateProject = ({ navigation }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    state: '',
    description: '',
    status: 'active'
  });

  const [unitsInfo, setUnitsInfo] = useState({
    living_unit: '0',
    office_amenities: '0',
    commercial_unit: '0'
  });

  const [projectType, setProjectType] = useState({
    build_type: 'MDU',
    job_type: 'Residential',
    building_type: 'Garden Style'
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [nodesModalVisible, setNodesModalVisible] = useState(false);
  const [connectionModalVisible, setConnectionModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nodes, setNodes] = useState([
    { id: 1, type: 'MDF', selected: false, ports: 24, connectedTo: [] },
    { id: 2, type: 'pedestal', selected: false, ports: 8, connectedTo: [] },
    { id: 3, type: 'IDF', selected: false, ports: 4, connectedTo: [] },
    { id: 4, type: 'unit', selected: false, ports: 1, connectedTo: [] },
    { id: 5, type: 'splitter', selected: false, ports: 16, connectedTo: [] },
    { id: 6, type: 'closure', selected: false, ports: 12, connectedTo: [] }
  ]);

  const [connections, setConnections] = useState([]);

  const calculateTotalUnits = () => {
  const living = parseInt(unitsInfo.living_unit || '0');
  const offices = parseInt(unitsInfo.office_amenities || '0');
  const commercial = parseInt(unitsInfo.commercial_unit || '0');
  return living + offices + commercial;
};

  const handleInputChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUnitsChange = (field, value) => {
    setUnitsInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (field, value) => {
    setProjectType(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleNodeSelection = (nodeId) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, selected: !node.selected } 
          : node
      )
    );
  };

  const handleAddConnection = (fromNode, toNode) => {
    const newConnection = {
      id: Date.now(),
      from: fromNode,
      to: toNode,
      type: 'Fiber'
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const generateProjectQR = () => {
    const projectSummary = {
      ...projectData,
      ...unitsInfo,
      ...projectType,
      totalUnits: calculateTotalUnits(),
      selectedNodes: nodes.filter(node => node.selected).map(node => node.type),
      connections: connections.length
    };
    return JSON.stringify(projectSummary);
  };

  const shareProject = async () => {
    try {
      const result = await Share.share({
        message: `FTTH Project: ${projectData.name}\nAddress: ${projectData.address}\nTotal Units: ${calculateTotalUnits()}`,
        title: 'FTTH Project Details'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share project');
    }
  };

  const saveProject = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      // Validar datos requeridos
      if (!projectData.name || !projectData.address) {
        Alert.alert('Error', 'Property name and address are required');
        setSaving(false);
        return;
      }

      // 1. Insertar el proyecto principal
      const projectResult = await insertData('projects', projectData);
      const projectId = projectResult.insertId;

      // 2. Insertar información de unidades
      await insertData('units_info', {
        project_id: projectId,
        ...unitsInfo
      });

      // 3. Insertar tipo de proyecto
      await insertData('type_project', {
        ...projectType
      });

      // 4. Insertar nodos seleccionados
      const selectedNodes = nodes.filter(node => node.selected);
      for (const node of selectedNodes) {
        await graphOperations.createNode({
          project_id: projectId,
          name: `${node.type}_${node.id}`,
          type: node.type,
          port_count: node.ports,
          description: `Automatically created node for project ${projectData.name}`
        });
      }

      // 5. Si hay conexiones, insertarlas
      if (connections.length > 0) {
        // Nota: Esto requiere que primero tengas los IDs de los nodos insertados
        // En una implementación real, necesitarías obtener los IDs de los nodos recién creados
        console.log('Connections would be saved here with proper node IDs');
      }

      Alert.alert('Success', 'Project saved successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ProjectDetail', { projectId })
        }
      ]);

    } catch (error) {
      console.log('Error saving project:', error);
      Alert.alert('Error', 'Failed to save project: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

const saveProjectAndCreateGraph = async () => {
  if (saving) return;
  
  setSaving(true);
  try {
    // Validaciones
    if (!projectData.name?.trim() || !projectData.address?.trim()) {
      Alert.alert('Error', 'Property name and address are required');
      setSaving(false);
      return;
    }

    console.log('💾 Starting save process...');

    // 1. Crear proyecto principal
    const project = await ProjectService.createProject({
      name: projectData.name.trim(),
      address: projectData.address.trim(),
      city: projectData.city || '',
      country: projectData.country || 'USA',
      state: projectData.state || '',
      description: projectData.description || ''
    });

    const projectId = project.id;
    console.log('📋 Project saved with ID:', projectId);

    // 2. Guardar información de unidades
    await UnitsService.saveUnitsInfo(projectId, {
      living_unit: unitsInfo.living_unit || '0',
      office_amenities: unitsInfo.office_amenities || '0',
      commercial_unit: unitsInfo.commercial_unit || '0'
    });

    // 3. Guardar tipo de proyecto
    await ProjectTypeService.saveProjectType(projectId, {
      build_type: projectType.build_type || 'MDU',
      job_type: projectType.job_type || 'Residential',
      building_type: projectType.building_type || 'Garden Style'
    });

    // 4. Crear MDF principal
    const mdfNode = await NodeService.createNode({
      project_id: projectId,
      name: 'MDF_Principal',
      type: 'MDF',
      description: 'Main Distribution Frame'
    });

    console.log('🏗️ MDF created with ID:', mdfNode.id);

    // 5. Crear unidades basadas en el total
    const totalUnits = calculateTotalUnits();
    if (totalUnits > 0) {
      console.log('🔢 Creating', totalUnits, 'units...');
      
      for (let i = 1; i <= totalUnits; i++) {
        await NodeService.createNode({
          project_id: projectId,
          name: `Unit_${i}`,
          type: 'unit',
          description: `Living unit ${i}`,
          parent_node_id: mdfNode.id
        });
      }
    }

    Alert.alert('✅ Success', 'Project created successfully!', [
      {
        text: 'Configure Network',
        onPress: () => navigation.navigate('ConnectivityDevices', { projectId })
      },
      {
        text: 'View Project',
        onPress: () => navigation.navigate('ProjectDetail', { projectId })
      }
    ]);

  } catch (error) {
    console.log('❌ Error saving project:', error);
    Alert.alert('❌ Error', 'Failed to save project. Please try again.');
  } finally {
    setSaving(false);
  }
};

  const selectedNodes = nodes.filter(node => node.selected);

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
        <Text style={styles.headerTitle}>Create New Project</Text>
        <TouchableOpacity onPress={saveProjectAndCreateGraph} disabled={saving}>
          <Ionicons 
            name="save-outline" 
            size={24} 
            color={saving ? '#bdc3c7' : '#3498db'} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Property Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Name *</Text>
              <TextInput
                style={styles.input}
                value={projectData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter property name"
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Address *</Text>
              <TextInput
                style={styles.input}
                value={projectData.address}
                onChangeText={(text) => handleInputChange('address', text)}
                placeholder="Enter address"
                editable={!saving}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={projectData.city}
                  onChangeText={(text) => handleInputChange('city', text)}
                  placeholder="City"
                  editable={!saving}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={projectData.state}
                  onChangeText={(text) => handleInputChange('state', text)}
                  placeholder="State"
                  maxLength={2}
                  editable={!saving}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                value={projectData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Project description"
                multiline={true}
                editable={!saving}
              />
            </View>
          </View>
        </View>

        {/* Unit Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unit Information</Text>
          
          <View style={styles.formCard}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Living Units</Text>
                <TextInput
                  style={styles.input}
                  value={unitsInfo.living_unit}
                  onChangeText={(text) => handleUnitsChange('living_unit', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!saving}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Offices/Amenities</Text>
                <TextInput
                  style={styles.input}
                  value={unitsInfo.office_amenities}
                  onChangeText={(text) => handleUnitsChange('office_amenities', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!saving}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Commercial Units</Text>
                <TextInput
                  style={styles.input}
                  value={unitsInfo.commercial_unit}
                  onChangeText={(text) => handleUnitsChange('commercial_unit', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!saving}
                />
              </View>
            </View>

            <View style={styles.totalUnits}>
              <Text style={styles.totalLabel}>Total Units:</Text>
              <Text style={styles.totalValue}>{calculateTotalUnits()}</Text>
            </View>
          </View>
        </View>

        {/* Project Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Type</Text>
          
          <View style={styles.formCard}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Build Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={projectType.build_type}
                    onValueChange={(value) => handleTypeChange('build_type', value)}
                    style={styles.picker}
                    enabled={!saving}
                  >
                    <Picker.Item label="MDU" value="MDU" />
                    <Picker.Item label="SDU" value="SDU" />
                    <Picker.Item label="Commercial" value="Commercial" />
                  </Picker>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Job Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={projectType.job_type}
                    onValueChange={(value) => handleTypeChange('job_type', value)}
                    style={styles.picker}
                    enabled={!saving}
                  >
                    <Picker.Item label="Residential" value="Residential" />
                    <Picker.Item label="Commercial" value="Commercial" />
                    <Picker.Item label="Mixed Use" value="Mixed Use" />
                  </Picker>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Building Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={projectType.building_type}
                    onValueChange={(value) => handleTypeChange('building_type', value)}
                    style={styles.picker}
                    enabled={!saving}
                  >
                    <Picker.Item label="Garden Style" value="Garden Style" />
                    <Picker.Item label="High Rise" value="High Rise" />
                    <Picker.Item label="Campus" value="Campus" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <View style={styles.actionsCard}>
            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={saveProjectAndCreateGraph}
              disabled={saving}
            >
              <Ionicons 
                name="save-outline" 
                size={24} 
                color="#ffffff" 
              />
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Continue saving'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.generateQRButton, saving && styles.buttonDisabled]}
              onPress={() => setQrModalVisible(true)}
              disabled={saving}
            >
              <Ionicons name="qr-code-outline" size={24} color="#ffffff" />
              <Text style={styles.generateQRButtonText}>Generate QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.shareButton, saving && styles.buttonDisabled]}
              onPress={shareProject}
              disabled={saving}
            >
              <Ionicons name="share-social-outline" size={24} color="#3498db" />
              <Text style={styles.shareButtonText}>Share Project</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={qrModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Project QR Code</Text>
              <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            <View style={styles.qrContainer}>
              <QRCode
                value={generateProjectQR()}
                size={200}
                color="#2c3e50"
                backgroundColor="#ffffff"
              />
            </View>

            <Text style={styles.qrDescription}>
              Scan this QR code to access project details
            </Text>

            <TouchableOpacity 
              style={styles.modalDoneButton}
              onPress={() => setQrModalVisible(false)}
            >
              <Text style={styles.modalDoneButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Añadir estos nuevos estilos
const styles = StyleSheet.create({
  // ... (mantener todos los estilos existentes)
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  totalUnits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#3498db10',
    borderRadius: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  nodesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  nodesButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginLeft: 12,
    flex: 1,
  },
  selectedNodes: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  selectedNodesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  nodeItem: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  connectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  connectionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  generateQRButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
  },
  generateQRButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  shareButtonText: {
    color: '#3498db',
    fontWeight: '600',
    marginLeft: 8,
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalScroll: {
    maxHeight: 400,
  },
  nodeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  nodeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nodeDetails: {
    marginLeft: 12,
    flex: 1,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  nodePorts: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  modalDoneButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  modalDoneButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 20,
  },
  qrDescription: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default CreateProject;