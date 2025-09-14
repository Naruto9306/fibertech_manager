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
  Share,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { ProjectService, UnitsService, ProjectTypeService, NodeService, FileService } from '../../service/storage';

const CreateProject = ({ navigation, route }) => {
  const { projectId } = route.params || {};
  const isEditMode = !!projectId;

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

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [existingProjects, setExistingProjects] = useState([]);
  const [projectSelectorVisible, setProjectSelectorVisible] = useState(false);

  useEffect(() => {
    loadExistingProjects();
    
    if (isEditMode) {
      loadProjectData();
    }
  }, [projectId]);

  const loadExistingProjects = async () => {
    try {
      const projects = await ProjectService.getProjects();
      setExistingProjects(projects);
    } catch (error) {
      console.log('Error loading projects:', error);
    }
  };

  const loadProjectData = async () => {
    try {
      setSaving(true);
      
      // Cargar datos del proyecto
      const project = await ProjectService.getProjectById(projectId);
      if (project) {
        setProjectData({
          name: project.name || '',
          address: project.address || '',
          city: project.city || '',
          country: project.country || '',
          state: project.state || '',
          description: project.description || '',
          status: project.status || 'active'
        });
      }

      // Cargar información de unidades
      const units = await UnitsService.getUnitsInfo(projectId);
      if (units) {
        setUnitsInfo({
          living_unit: units.living_unit?.toString() || '0',
          office_amenities: units.office_amenities?.toString() || '0',
          commercial_unit: units.commercial_unit?.toString() || '0'
        });
      }

      // Cargar tipo de proyecto
      const projectTypeData = await ProjectTypeService.getProjectType(projectId);
      if (projectTypeData) {
        setProjectType({
          build_type: projectTypeData.build_type || 'MDU',
          job_type: projectTypeData.job_type || 'Residential',
          building_type: projectTypeData.building_type || 'Garden Style'
        });
      }

      // Cargar archivos adjuntos (si existe esta funcionalidad)
      // const files = await FileService.getProjectFiles(projectId);
      // if (files) {
      //   setAttachedFiles(files);
      // }

    } catch (error) {
      console.log('Error loading project data:', error);
      Alert.alert('Error', 'Failed to load project data');
    } finally {
      setSaving(false);
    }
  };

  const selectProjectToEdit = (project) => {
    setProjectSelectorVisible(false);
    navigation.setParams({ projectId: project.id });
  };

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
    // Solo permitir números
    if (/^\d*$/.test(value)) {
      setUnitsInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTypeChange = (field, value) => {
    setProjectType(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const attachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        const fileInfo = {
          name: result.name,
          uri: result.uri,
          size: result.size,
          type: result.mimeType,
          lastModified: result.lastModified
        };
        setAttachedFiles(prev => [...prev, fileInfo]);
        Alert.alert('Success', 'File attached successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to attach file: ' + error.message);
    }
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateProjectQR = () => {
    const projectSummary = {
      project: {
        ...projectData,
        created: new Date().toISOString(),
        status: 'draft'
      },
      units: {
        ...unitsInfo,
        total: calculateTotalUnits()
      },
      type: projectType,
      files: attachedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      metadata: {
        generated: new Date().toISOString(),
        app: 'FTTH Project Manager',
        version: '1.0'
      }
    };
    return JSON.stringify(projectSummary);
  };

  const shareProject = async () => {
    try {
      const result = await Share.share({
        message: `FTTH Project: ${projectData.name}\nAddress: ${projectData.address}\nTotal Units: ${calculateTotalUnits()}\n\nScan the QR code for complete details`,
        title: 'FTTH Project Details'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share project');
    }
  };

  const saveProjectAndCreateGraph = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      if (!projectData.name?.trim() || !projectData.address?.trim()) {
        Alert.alert('Error', 'Property name and address are required');
        setSaving(false);
        return;
      }

      console.log('💾 Starting save process...');

      if (isEditMode) {
        // Modo edición: Actualizar proyecto existente
        await ProjectService.updateProject(projectId, {
          name: projectData.name.trim(),
          address: projectData.address.trim(),
          city: projectData.city || '',
          country: projectData.country || 'USA',
          state: projectData.state || '',
          description: projectData.description || '',
          status: 'active'
        });

        await UnitsService.updateUnitsInfo(projectId, {
          living_unit: unitsInfo.living_unit || '0',
          office_amenities: unitsInfo.office_amenities || '0',
          commercial_unit: unitsInfo.commercial_unit || '0'
        });

        await ProjectTypeService.updateProjectType(projectId, {
          build_type: projectType.build_type || 'MDU',
          job_type: projectType.job_type || 'Residential',
          building_type: projectType.building_type || 'Garden Style'
        });

        console.log('📋 Project updated with ID:', projectId);
      } else {
        // Modo creación: Crear nuevo proyecto
        const project = await ProjectService.createProject({
          name: projectData.name.trim(),
          address: projectData.address.trim(),
          city: projectData.city || '',
          country: projectData.country || 'USA',
          state: projectData.state || '',
          description: projectData.description || '',
          status: 'active'
        });

        const projectId = project.id;
        console.log('📋 Project saved with ID:', projectId);

        await UnitsService.saveUnitsInfo(projectId, {
          living_unit: unitsInfo.living_unit || '0',
          office_amenities: unitsInfo.office_amenities || '0',
          commercial_unit: unitsInfo.commercial_unit || '0'
        });

        await ProjectTypeService.saveProjectType(projectId, {
          build_type: projectType.build_type || 'MDU',
          job_type: projectType.job_type || 'Residential',
          building_type: projectType.building_type || 'Garden Style'
        });

        if (attachedFiles.length > 0) {
          for (const file of attachedFiles) {
            await FileService.saveProjectFile(projectId, file);
          }
        }

        const mdfNode = await NodeService.createNode({
          project_id: projectId,
          name: 'MDF_Principal',
          type: 'MDF',
          description: 'Main Distribution Frame'
        });

        console.log('🏗️ MDF created with ID:', mdfNode.id);

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
      }

      Alert.alert('✅ Success', `Project ${isEditMode ? 'updated' : 'created'} successfully!`, [
        {
          text: 'Configure Network',
          onPress: () => navigation.navigate('ConnectivityDevices', { projectId: isEditMode ? projectId : project.id })
        },
        {
          text: 'View Project',
          onPress: () => navigation.navigate('ProjectDetail', { projectId: isEditMode ? projectId : project.id })
        }
      ]);

    } catch (error) {
      console.log('❌ Error saving project:', error);
      Alert.alert('❌ Error', `Failed to ${isEditMode ? 'update' : 'save'} project. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearForm = () => {
    setProjectData({
      name: '',
      address: '',
      city: '',
      country: '',
      state: '',
      description: '',
      status: 'active'
    });
    setUnitsInfo({
      living_unit: '0',
      office_amenities: '0',
      commercial_unit: '0'
    });
    setProjectType({
      build_type: 'MDU',
      job_type: 'Residential',
      building_type: 'Garden Style'
    });
    setAttachedFiles([]);
    navigation.setParams({ projectId: null });
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
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Project' : 'Create New Project'}
        </Text>
        <View style={styles.headerActions}>
          {isEditMode && (
            <TouchableOpacity 
              onPress={clearForm}
              style={styles.clearButton}
              disabled={saving}
            >
              <Ionicons name="add" size={24} color="#3498db" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={() => setProjectSelectorVisible(true)}
            style={styles.selectProjectButton}
            disabled={saving}
          >
            <Ionicons name="folder-open" size={24} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveProjectAndCreateGraph} disabled={saving}>
            <Ionicons 
              name="save-outline" 
              size={24} 
              color={saving ? '#bdc3c7' : '#3498db'} 
            />
          </TouchableOpacity>
        </View>
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
                placeholderTextColor="#a0a0a0"
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
                placeholderTextColor="#a0a0a0"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={projectData.city}
                  onChangeText={(text) => handleInputChange('city', text)}
                  placeholder="City"
                  editable={!saving}
                  placeholderTextColor="#a0a0a0"
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
                  placeholderTextColor="#a0a0a0"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={projectData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Project description"
                multiline={true}
                editable={!saving}
                placeholderTextColor="#a0a0a0"
              />
            </View>
          </View>
        </View>

        {/* Unit Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unit Information</Text>
          
          <View style={styles.formCard}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Living Units</Text>
                <TextInput
                  style={styles.input}
                  value={unitsInfo.living_unit}
                  onChangeText={(text) => handleUnitsChange('living_unit', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!saving}
                  placeholderTextColor="#a0a0a0"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Offices/Amenities</Text>
                <TextInput
                  style={styles.input}
                  value={unitsInfo.office_amenities}
                  onChangeText={(text) => handleUnitsChange('office_amenities', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!saving}
                  placeholderTextColor="#a0a0a0"
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
                  placeholderTextColor="#a0a0a0"
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
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Build Type</Text>
                <View style={[styles.pickerContainer, Platform.OS === 'ios' && styles.pickerContainerIOS]}>
                  <Picker
                    selectedValue={projectType.build_type}
                    onValueChange={(value) => handleTypeChange('build_type', value)}
                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                    enabled={!saving}
                    dropdownIconColor="#3498db"
                  >
                    <Picker.Item label="MDU" value="MDU" />
                    <Picker.Item label="SDU" value="SDU" />
                    <Picker.Item label="Commercial" value="Commercial" />
                  </Picker>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Job Type</Text>
                <View style={[styles.pickerContainer, Platform.OS === 'ios' && styles.pickerContainerIOS]}>
                  <Picker
                    selectedValue={projectType.job_type}
                    onValueChange={(value) => handleTypeChange('job_type', value)}
                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                    enabled={!saving}
                    dropdownIconColor="#3498db"
                  >
                    <Picker.Item label="Residential" value="Residential" />
                    <Picker.Item label="Commercial" value="Commercial" />
                    <Picker.Item label="Mixed Use" value="Mixed Use" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Building Type</Text>
              <View style={[styles.pickerContainer, Platform.OS === 'ios' && styles.pickerContainerIOS]}>
                <Picker
                  selectedValue={projectType.building_type}
                  onValueChange={(value) => handleTypeChange('building_type', value)}
                  style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                  enabled={!saving}
                  dropdownIconColor="#3498db"
                >
                  <Picker.Item label="Garden Style" value="Garden Style" />
                  <Picker.Item label="Mid Rise" value="Mid Rise" />
                  <Picker.Item label="High Rise" value="High Rise" />
                  <Picker.Item label="Townhome" value="Townhome" />
                  <Picker.Item label="Single Family" value="Single Family" />
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          
          <View style={styles.formCard}>
            <TouchableOpacity 
              style={[styles.attachButton, saving && styles.buttonDisabled]}
              onPress={attachFile}
              disabled={saving}
            >
              <Ionicons name="attach" size={20} color="#3498db" />
              <Text style={styles.attachButtonText}>Attach File</Text>
            </TouchableOpacity>

            {attachedFiles.length > 0 && (
              <View style={styles.attachmentsList}>
                {attachedFiles.map((file, index) => (
                  <View key={index} style={styles.fileItem}>
                    <View style={styles.fileInfo}>
                      <Ionicons name="document-text" size={20} color="#7f8c8d" />
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                        <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => removeFile(index)}
                      disabled={saving}
                    >
                      <Ionicons name="close-circle" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.qrButton, saving && styles.buttonDisabled]}
              onPress={() => setQrModalVisible(true)}
              disabled={saving}
            >
              <Ionicons name="qr-code" size={20} color="white" />
              <Text style={styles.actionButtonText}>Generate QR</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.shareButton, saving && styles.buttonDisabled]}
              onPress={shareProject}
              disabled={saving}
            >
              <Ionicons name="share-social" size={20} color="white" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={saveProjectAndCreateGraph}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="save" size={20} color="white" />
                  <Text style={styles.actionButtonText}>{isEditMode ? 'Update' : 'Save'} Project</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Project QR Code</Text>
              
              <View style={styles.qrContainer}>
                <QRCode
                  value={generateProjectQR()}
                  size={200}
                  color="#2c3e50"
                  backgroundColor="white"
                />
              </View>
              
              <Text style={styles.qrDescription}>
                Scan this QR code to quickly access project details
              </Text>
              
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setQrModalVisible(false)}
              >
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Project Selector Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={projectSelectorVisible}
        onRequestClose={() => setProjectSelectorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.selectorModal]}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Project to Edit</Text>
              
              <ScrollView style={styles.projectList}>
                {existingProjects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.projectItem}
                    onPress={() => selectProjectToEdit(project)}
                  >
                    <Ionicons name="business" size={24} color="#3498db" />
                    <View style={styles.projectInfo}>
                      <Text style={styles.projectName}>{project.name}</Text>
                      <Text style={styles.projectAddress}>{project.address}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
                  </TouchableOpacity>
                ))}
                
                {existingProjects.length === 0 && (
                  <Text style={styles.noProjectsText}>No projects found</Text>
                )}
              </ScrollView>
              
              <TouchableOpacity
                style={[styles.closeModalButton, styles.cancelButton]}
                onPress={() => setProjectSelectorVisible(false)}
              >
                <Text style={styles.closeModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    top: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  clearButton: {
    padding: 5,
  },
  selectProjectButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    paddingLeft: 5,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dce4ec',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalUnits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3498db',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dce4ec',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  pickerContainerIOS: {
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    color: '#2c3e50',
  },
  pickerIOS: {
    color: '#2c3e50',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 10,
    padding: 14,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    gap: 8,
  },
  attachButtonText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 16,
  },
  attachmentsList: {
    marginTop: 15,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 14,
    gap: 8,
  },
  qrButton: {
    backgroundColor: '#9b59b6',
  },
  shareButton: {
    backgroundColor: '#2ecc71',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  saveButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectorModal: {
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  qrDescription: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  closeModalButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    marginTop: 10,
  },
  closeModalText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  projectList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    gap: 15,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  projectAddress: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  noProjectsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
    padding: 30,
  },
});

export default CreateProject;