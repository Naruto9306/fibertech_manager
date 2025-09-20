import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext'; 
import { useTranslation } from '../hooks/useTranslation';   
import { useDevice } from '../context/DeviceContext'; 

const Tools = ({ navigation, theme }) => {
  const [breakageDetection, setBreakageDetection] = useState(true);
  const [autoDistanceMeasurement, setAutoDistanceMeasurement] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const { topInset, bottomInset, stylesFull } = useDevice();

  const { t } = useTranslation();
const { isDarkMode } = useApp();

const colors = {
  background : isDarkMode ? '#121212' : '#f8f9fa',
  card       : isDarkMode ? '#1e1e1e' : '#ffffff',
  text       : isDarkMode ? '#ffffff' : '#2c3e50',
  subText    : isDarkMode ? '#b0b0b0' : '#7f8c8d',
  border     : isDarkMode ? '#333'    : '#ecf0f1',
};

  const maintenanceHistory = [
    { id: 1, date: '2024-03-15', type: 'Preventive', status: 'Completed', technician: 'John Doe' },
    { id: 2, date: '2024-03-10', type: 'Corrective', status: 'In Progress', technician: 'Jane Smith' },
    { id: 3, date: '2024-03-05', type: 'Emergency', status: 'Completed', technician: 'Mike Johnson' },
    { id: 4, date: '2024-02-28', type: 'Preventive', status: 'Completed', technician: 'John Doe' },
    { id: 5, date: '2024-02-20', type: 'Routine', status: 'Completed', technician: 'Sarah Wilson' }
  ];

  const multimediaFiles = [
    { id: 1, date: '2024-03-15', type: 'photo', name: 'Fiber_Connection_001.jpg', reportId: 'RPT-2024-015' },
    { id: 2, date: '2024-03-14', type: 'video', name: 'Installation_Process.mp4', reportId: 'RPT-2024-014' },
    { id: 3, date: '2024-03-12', type: 'photo', name: 'Cable_Damage_003.jpg', reportId: 'RPT-2024-013' },
    { id: 4, date: '2024-03-10', type: 'document', name: 'Test_Results.pdf', reportId: 'RPT-2024-012' },
    { id: 5, date: '2024-03-08', type: 'photo', name: 'Splice_Point_002.jpg', reportId: 'RPT-2024-011' }
  ];

  const handleBreakageDetection = () => {
    Alert.alert(
      t('fiberBreakageDetection'),
    t('otdrDescription')
    );
  };

  const handleMaintenanceHistory = () => {
    navigation.navigate('MaintenanceHistory', { history: maintenanceHistory });
  };

  const handleMaintenanceJobs = () => {
    navigation.navigate('MaintenanceJobs', { jobs: maintenanceHistory });
  };

  const handleMultimediaView = () => {
    navigation.navigate('MultimediaGallery', { files: multimediaFiles });
  };

  const handleReportDetails = () => {
    navigation.navigate('ReportDetails');
  };

  const handleReportMultimedia = () => {
    navigation.navigate('ReportMultimedia');
  };

  const handleSettingInfo = (title, description) => {
    Alert.alert(title, description);
  };

  return (
    <View style={[stylesFull.screen, { backgroundColor: colors.background }, { paddingBottom: bottomInset }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }, { paddingTop: topInset - 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
    {t('tools')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Fiber Tools Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
    {t('fiberOpticTools')}</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleBreakageDetection}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#e74c3c20' }]}>
                  <Ionicons name="warning-outline" size={22} color="#e74c3c" />
                </View>
                <View style={styles.settingText}>
                 <Text style={[styles.settingLabel, { color: colors.text }]}>
    {t('fiberBreakageDetector')}</Text>
                  <Text style={[styles.settingDescription, { color: colors.subText }]}>
    {t('detectFiberBreaks')}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#3498db20' }]}>
                  <Ionicons name="analytics-outline" size={22} color="#3498db" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
    {t('autoDistanceMeasurement')}</Text>
                  <Text style={[styles.settingDescription, { color: colors.subText }]}>
    {t('autoDistanceCalc')}</Text>
                </View>
              </View>
              <Switch
                value={autoDistanceMeasurement}
                onValueChange={setAutoDistanceMeasurement}
                trackColor={{ false: '#bdc3c7', true: '#3498db' }}
              />
            </View>
          </View>
        </View>

        {/* Maintenance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
    {t('maintenanceManagement')}</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleMaintenanceHistory}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#2ecc7120' }]}>
                  <Ionicons name="time-outline" size={22} color="#2ecc71" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
    {t('maintenanceHistory')}</Text>
                  <Text style={[styles.settingDescription, { color: colors.subText }]}>
    {t('viewMaintenanceRecords')}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleMaintenanceJobs}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#e67e2220' }]}>
                  <Ionicons name="construct-outline" size={22} color="#e67e22" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
    {t('maintenanceJobs')}</Text>
                  <Text style={[styles.settingDescription, { color: colors.subText }]}>
    {t('maintenanceByDate')}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Multimedia Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
    {t('multimediaManagement')}</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleMultimediaView}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#9b59b620' }]}>
                  <Ionicons name="images-outline" size={22} color="#9b59b6" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
    {t('multimediaGallery')}</Text>
                  <Text style={[styles.settingDescription, { color: colors.subText }]}>
    {t('mediaByDate')}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleReportMultimedia}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#1abc9c20' }]}>
                  <Ionicons name="document-attach-outline" size={22} color="#1abc9c" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
    {t('reportMultimedia')}</Text>
                  <Text style={[styles.settingDescription, { color: colors.subText }]}>
    {t('mediaForReports')}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reports Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
    {t('reports')}</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleReportDetails}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#34495e20' }]}>
                  <Ionicons name="document-text-outline" size={22} color="#34495e" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
    {t('reportDetails')}</Text>
                  <Text style={[styles.settingDescription, { color: colors.subText }]}>
    {t('detailedMaintenanceReports')}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Settings */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Settings</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#3498db20' }]}>
                  <Ionicons name="notifications-outline" size={22} color="#3498db" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Notifications</Text>
                  <Text style={styles.settingDescription}>Receive app notifications</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#bdc3c7', true: '#3498db' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#2ecc7120' }]}>
                  <Ionicons name="navigate-outline" size={22} color="#2ecc71" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>GPS Tracking</Text>
                  <Text style={styles.settingDescription}>Enable location services</Text>
                </View>
              </View>
              <Switch
                value={gpsTracking}
                onValueChange={setGpsTracking}
                trackColor={{ false: '#bdc3c7', true: '#2ecc71' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#9b59b620' }]}>
                  <Ionicons name="cloud-upload-outline" size={22} color="#9b59b6" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Cloud Sync</Text>
                  <Text style={styles.settingDescription}>Automatic data synchronization</Text>
                </View>
              </View>
              <Switch
                value={cloudSync}
                onValueChange={setCloudSync}
                trackColor={{ false: '#bdc3c7', true: '#9b59b6' }}
              />
            </View>
          </View>
        </View> */}

        {/* App Info */}
        <View style={styles.section}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.infoItem}>
              <Ionicons name="hardware-chip-outline" size={20} color="#7f8c8d" />
              <Text style={[styles.infoText, { color: colors.subText }]}>FTTH Manager v1.2.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="build-outline" size={20} color="#7f8c8d" />
              <Text style={[styles.infoText, { color: colors.subText }]}>{t('fiberToolsPackage')} v2.1</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#7f8c8d" />
              <Text style={[styles.infoText, { color: colors.subText }]}>{t('securityLevel')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  headerRight: {
    width: 24,
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
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  infoCard: {
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 12,
  },
});

export default Tools;