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
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { useDevice } from '../context/DeviceContext';

const CreateProject = ({ navigation, route, theme }) => {
  const { topInset, isTablet, bottomInset, stylesFull } = useDevice();
  const { projectId } = route.params || {};
  const isEditMode = !!projectId;

  const { t } = useTranslation();
  const { isDarkMode } = useApp();

  // Colores dinámicos basados en el tema
  const colors = {
    background: isDarkMode ? '#121212' : '#f5f7fa',
    cardBackground: isDarkMode ? '#1e1e1e' : 'white',
    text: isDarkMode ? '#ffffff' : '#2c3e50',
    secondaryText: isDarkMode ? '#b0b0b0' : '#7f8c8d',
    border: isDarkMode ? '#333333' : '#e1e8ed',
    inputBackground: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    placeholder: isDarkMode ? '#888888' : '#a0a0a0',
    primary: '#3498db',
    success: '#2ecc71',
    warning: '#f39c12',
    danger: '#e74c3c',
    purple: '#9b59b6'
  };

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

    } catch (error) {
      console.log('Error loading project data:', error);
      Alert.alert(t('error'), t('failedToLoadProject'));
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
        Alert.alert(t('success'), t('fileAttachedSuccess'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('failedToAttachFile') + error.message);
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
        message: `${t('ftthProject')}: ${projectData.name}\n${t('address')}: ${projectData.address}\n${t('totalUnits')}: ${calculateTotalUnits()}\n\n${t('scanQRForDetails')}`,
        title: t('ftthProjectDetails')
      });
    } catch (error) {
      Alert.alert(t('error'), t('failedToShare'));
    }
  };

  const saveProjectAndCreateGraph = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      if (!projectData.name?.trim() || !projectData.address?.trim()) {
        Alert.alert(t('error'), t('nameAndAddressRequired'));
        setSaving(false);
        return;
      }

      console.log('💾 Starting save process...');

      let targetProjectId = projectId; // Para modo edición

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

        targetProjectId = project.id; // Actualizar para modo creación
        console.log('📋 Project saved with ID:', targetProjectId);

        await UnitsService.saveUnitsInfo(targetProjectId, {
          living_unit: unitsInfo.living_unit || '0',
          office_amenities: unitsInfo.office_amenities || '0',
          commercial_unit: unitsInfo.commercial_unit || '0'
        });

        await ProjectTypeService.saveProjectType(targetProjectId, {
          build_type: projectType.build_type || 'MDU',
          job_type: projectType.job_type || 'Residential',
          building_type: projectType.building_type || 'Garden Style'
        });

        if (attachedFiles.length > 0) {
          for (const file of attachedFiles) {
            await FileService.saveProjectFile(targetProjectId, file);
          }
        }

        const mdfNode = await NodeService.createNode({
          project_id: targetProjectId,
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
              project_id: targetProjectId,
              name: `Unit_${i}`,
              type: 'unit',
              description: `Living unit ${i}`,
              parent_node_id: mdfNode.id
            });
          }
        }
      }

      navigation.navigate('ConnectivityDevices', { 
            projectId: targetProjectId 
          })

      // Alert.alert('✅ ' + t('success'), t(isEditMode ? 'projectUpdated' : 'projectCreated'), [
      //   {
      //     text: t('configureNetwork'),
      //     onPress: () => navigation.navigate('ConnectivityDevices', { 
      //       projectId: targetProjectId 
      //     })
      //   },
      //   {
      //     text: t('viewProject'),
      //     onPress: () => navigation.navigate('ProjectDetail', { 
      //       projectId: targetProjectId 
      //     })
      //   }
      // ]);

    } catch (error) {
      console.log('❌ Error saving project:', error);
      Alert.alert('❌ ' + t('error'), t(isEditMode ? 'failedToUpdate' : 'failedToSave'));
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
      paddingHorizontal: 20,
      paddingVertical: 15,
      top: 10,
      backgroundColor: colors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      zIndex: 10,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
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
      color: colors.text,
      marginBottom: 15,
      paddingLeft: 5,
    },
    formCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 14,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 14,
      fontSize: 16,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    totalUnits: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 15,
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.inputBackground,
      overflow: 'hidden',
    },
    attachButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 10,
      padding: 14,
      backgroundColor: isDarkMode ? 'rgba(52, 152, 219, 0.2)' : 'rgba(52, 152, 219, 0.1)',
      gap: 8,
    },
    attachButtonText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 16,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      marginBottom: 10,
    },
    fileName: {
      fontSize: 15,
      color: colors.text,
      fontWeight: '500',
    },
    fileSize: {
      fontSize: 13,
      color: colors.secondaryText,
      marginTop: 2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      padding: 25,
      borderRadius: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
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
      borderColor: colors.border,
    },
    qrDescription: {
      fontSize: 15,
      color: colors.secondaryText,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 22,
    },
    projectItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 15,
    },
    projectName: {
      fontSize: 16,
      // fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    projectAddress: {
      fontSize: 14,
      color: colors.secondaryText,
    },
    noProjectsText: {
      textAlign: 'center',
      fontSize: 16,
      color: colors.secondaryText,
      padding: 30,
    },
  });

  // Combinar estilos estáticos con dinámicos
  const combinedStyles = {
    ...styles,
    ...dynamicStyles
  };

  return (
    <View style={[stylesFull.screen, { paddingBottom: bottomInset }]}>
      {/* Header */}
      <View style={[combinedStyles.header, { paddingTop: topInset - 10}]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={combinedStyles.headerTitle}>
          {isEditMode ? t('editProject') : t('createProject')}
        </Text>
        <View style={styles.headerActions}>
          {isEditMode && (
            <TouchableOpacity 
              onPress={clearForm}
              style={styles.clearButton}
              disabled={saving}
            >
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={() => setProjectSelectorVisible(true)}
            style={styles.selectProjectButton}
            disabled={saving}
          >
            <Ionicons name="folder-open" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveProjectAndCreateGraph} disabled={saving}>
            <Ionicons 
              name="save-outline" 
              size={24} 
              color={saving ? colors.secondaryText : colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={combinedStyles.scrollContent}
      >
        {/* Property Information */}
        <View style={combinedStyles.section}>
          <Text style={combinedStyles.sectionTitle}>{t('propertyInformation')}</Text>
          
          <View style={combinedStyles.formCard}>
            <View style={{ flex: isTablet ? 1 : undefined }}>
              <Text style={[combinedStyles.label, { color: colors.text }]}>{t('propertyName')} *</Text>
              <TextInput
                style={combinedStyles.input}
                value={projectData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder={t('propertyName')}
                editable={!saving}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={combinedStyles.label}>{t('propertyAddress')} *</Text>
              <TextInput
                style={combinedStyles.input}
                value={projectData.address}
                onChangeText={(text) => handleInputChange('address', text)}
                placeholder={t('enterAddress')}
                editable={!saving}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={combinedStyles.label}>{t('city')}</Text>
                <TextInput
                  style={combinedStyles.input}
                  value={projectData.city}
                  onChangeText={(text) => handleInputChange('city', text)}
                  placeholder={t('city')}
                  editable={!saving}
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={combinedStyles.label}>{t('state')}</Text>
                <TextInput
                  style={combinedStyles.input}
                  value={projectData.state}
                  onChangeText={(text) => handleInputChange('state', text)}
                  placeholder={t('state')}
                  maxLength={2}
                  editable={!saving}
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={combinedStyles.label}>{t('description')}</Text>
              <TextInput
                style={[combinedStyles.input, styles.textArea]}
                value={projectData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder={t('projectDescription')}
                multiline={true}
                editable={!saving}
                placeholderTextColor={colors.placeholder}
              />
            </View>
          </View>
        </View>

        {/* Unit Information */}
        <View style={combinedStyles.section}>
          <Text style={combinedStyles.sectionTitle}>{t('unitInformation')}</Text>
          
          <View style={combinedStyles.formCard}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={combinedStyles.label}>{t('livingUnits')}</Text>
                <TextInput
                  style={combinedStyles.input}
                  value={unitsInfo.living_unit}
                  onChangeText={(text) => handleUnitsChange('living_unit', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!saving}
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={combinedStyles.label}>{t('officesAmenities')}</Text>
                <TextInput
                  style={combinedStyles.input}
                  value={unitsInfo.office_amenities}
                  onChangeText={(text) => handleUnitsChange('office_amenities', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!saving}
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={combinedStyles.label}>{t('commercialUnits')}</Text>
                <TextInput
                  style={combinedStyles.input}
                  value={unitsInfo.commercial_unit}
                  onChangeText={(text) => handleUnitsChange('commercial_unit', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  editable={!saving}
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={combinedStyles.totalUnits}>
              <Text style={combinedStyles.totalLabel}>{t('totalUnits')}:</Text>
              <Text style={combinedStyles.totalValue}>{calculateTotalUnits()}</Text>
            </View>
          </View>
        </View>

        {/* Project Type */}
        <View style={combinedStyles.section}>
          <Text style={combinedStyles.sectionTitle}>{t('projectType')}</Text>
          
          <View style={combinedStyles.formCard}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={combinedStyles.label}>{t('buildType')}</Text>
                <View style={[combinedStyles.pickerContainer, Platform.OS === 'ios' && styles.pickerContainerIOS]}>
                  <Picker
                    selectedValue={projectType.build_type}
                    onValueChange={(value) => handleTypeChange('build_type', value)}
                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                    enabled={!saving}
                    dropdownIconColor={colors.primary}
                  >
                    <Picker.Item label="MDU" value="MDU" />
                    <Picker.Item label="SDU" value="SDU" />
                    <Picker.Item label="Commercial" value="Commercial" />
                  </Picker>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={combinedStyles.label}>{t('jobType')}</Text>
                <View style={[combinedStyles.pickerContainer, Platform.OS === 'ios' && styles.pickerContainerIOS]}>
                  <Picker
                    selectedValue={projectType.job_type}
                    onValueChange={(value) => handleTypeChange('job_type', value)}
                    style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                    enabled={!saving}
                    dropdownIconColor={colors.primary}
                  >
                    <Picker.Item label={t('residential')} value="Residential" />
                    <Picker.Item label={t('commercial')} value="Commercial" />
                    <Picker.Item label={t('mixedUse')} value="Mixed Use" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={combinedStyles.label}>{t('buildingType')}</Text>
              <View style={[combinedStyles.pickerContainer, Platform.OS === 'ios' && styles.pickerContainerIOS]}>
                <Picker
                  selectedValue={projectType.building_type}
                  onValueChange={(value) => handleTypeChange('building_type', value)}
                  style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
                  enabled={!saving}
                  dropdownIconColor={colors.primary}
                >
                  <Picker.Item label={t('gardenStyle')} value="Garden Style" />
                  <Picker.Item label={t('midRise')} value="Mid Rise" />
                  <Picker.Item label={t('highRise')} value="High Rise" />
                  <Picker.Item label={t('townhome')} value="Townhome" />
                  <Picker.Item label={t('singleFamily')} value="Single Family" />
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Attachments */}
        <View style={combinedStyles.section}>
          <Text style={combinedStyles.sectionTitle}>{t('attachments')}</Text>
          
          <View style={combinedStyles.formCard}>
            <TouchableOpacity 
              style={[combinedStyles.attachButton, saving && styles.buttonDisabled]}
              onPress={attachFile}
              disabled={saving}
            >
              <Ionicons name="attach" size={20} color={colors.primary} />
              <Text style={combinedStyles.attachButtonText}>{t('attachFile')}</Text>
            </TouchableOpacity>

            {attachedFiles.length > 0 && (
              <View style={styles.attachmentsList}>
                {attachedFiles.map((file, index) => (
                  <View key={index} style={combinedStyles.fileItem}>
                    <View style={styles.fileInfo}>
                      <Ionicons name="document-text" size={20} color={colors.secondaryText} />
                      <View style={styles.fileDetails}>
                        <Text style={combinedStyles.fileName} numberOfLines={1}>{file.name}</Text>
                        <Text style={combinedStyles.fileSize}>{formatFileSize(file.size)}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => removeFile(index)}
                      disabled={saving}
                    >
                      <Ionicons name="close-circle" size={20} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={combinedStyles.section}>
          <View style={styles.actionButtons}>
            {/* <TouchableOpacity 
              style={[styles.actionButton, styles.qrButton, saving && styles.buttonDisabled]}
              onPress={() => setQrModalVisible(true)}
              disabled={saving}
            >
              <Ionicons name="qr-code" size={20} color="white" />
              <Text style={styles.actionButtonText}>{t('generateQR')}</Text>
            </TouchableOpacity> */}

            <TouchableOpacity 
              style={[styles.actionButton, styles.shareButton, saving && styles.buttonDisabled]}
              onPress={shareProject}
              disabled={saving}
            >
              <Ionicons name="share-social" size={20} color="white" />
              <Text style={styles.actionButtonText}>{t('share')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={saveProjectAndCreateGraph}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.actionButtonText}>{t('saving')}...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="save" size={20} color="white" />
                  <Text style={styles.actionButtonText}>{t('next')}</Text>
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
        <View style={combinedStyles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={combinedStyles.modalContent}>
              <Text style={combinedStyles.modalTitle}>{t('projectQRCode')}</Text>
              
              <View style={combinedStyles.qrContainer}>
                <QRCode
                  value={generateProjectQR()}
                  size={200}
                  color={colors.text}
                  backgroundColor="white"
                />
              </View>
              
              <Text style={combinedStyles.qrDescription}>
                {t('scanQRDescription')}
              </Text>
              
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setQrModalVisible(false)}
              >
                <Text style={styles.closeModalText}>{t('close')}</Text>
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
        <View style={combinedStyles.modalOverlay}>
          <View style={[styles.modalContainer, styles.selectorModal]}>
            <View style={combinedStyles.modalContent}>
              <Text style={combinedStyles.modalTitle}>{t('selectProjectToEdit')}</Text>
              
              <ScrollView style={styles.projectList}>
                {existingProjects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={combinedStyles.projectItem}
                    onPress={() => selectProjectToEdit(project)}
                  >
                    <Ionicons name="business" size={24} color={colors.primary} />
                    <View style={styles.projectInfo}>
                      <Text style={combinedStyles.projectName}>{project.name}</Text>
                      <Text style={combinedStyles.projectAddress}>{project.address}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
                  </TouchableOpacity>
                ))}
                
                {existingProjects.length === 0 && (
                  <Text style={combinedStyles.noProjectsText}>{t('noProjectsFound')}</Text>
                )}
              </ScrollView>
              
              <TouchableOpacity
                style={[styles.closeModalButton, styles.cancelButton]}
                onPress={() => setProjectSelectorVisible(false)}
              >
                <Text style={styles.closeModalText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos base (sin colores específicos para mantener la estructura)
const styles = StyleSheet.create({
  backButton: {
    padding: 5,
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
  inputGroup: {
    marginBottom: 18,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainerIOS: {
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  pickerIOS: {
  },
  attachmentsList: {
    marginTop: 15,
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
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectorModal: {
    maxHeight: '80%',
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
  projectInfo: {
    flex: 1,
  },
});

export default CreateProject;