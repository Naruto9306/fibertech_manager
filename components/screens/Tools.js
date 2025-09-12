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

const Tools = ({ navigation }) => {
  const [breakageDetection, setBreakageDetection] = useState(true);
  const [autoDistanceMeasurement, setAutoDistanceMeasurement] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);

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
      'Fiber Breakage Detection',
      'This feature uses OTDR technology to detect fiber breaks and measure distance to fault points.'
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings & Tools</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Fiber Tools Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiber Optic Tools</Text>
          
          <View style={styles.settingCard}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleBreakageDetection}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#e74c3c20' }]}>
                  <Ionicons name="warning-outline" size={22} color="#e74c3c" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Fiber Breakage Detector</Text>
                  <Text style={styles.settingDescription}>Detect fiber breaks with distance measurement</Text>
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
                  <Text style={styles.settingLabel}>Auto Distance Measurement</Text>
                  <Text style={styles.settingDescription}>Automatic distance calculation to fault points</Text>
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
          <Text style={styles.sectionTitle}>Maintenance Management</Text>
          
          <View style={styles.settingCard}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleMaintenanceHistory}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#2ecc7120' }]}>
                  <Ionicons name="time-outline" size={22} color="#2ecc71" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Maintenance History</Text>
                  <Text style={styles.settingDescription}>View complete maintenance records</Text>
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
                  <Text style={styles.settingLabel}>Maintenance Jobs</Text>
                  <Text style={styles.settingDescription}>All maintenance work ordered by date</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Multimedia Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multimedia Management</Text>
          
          <View style={styles.settingCard}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleMultimediaView}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#9b59b620' }]}>
                  <Ionicons name="images-outline" size={22} color="#9b59b6" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Multimedia Gallery</Text>
                  <Text style={styles.settingDescription}>All media files ordered by date</Text>
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
                  <Text style={styles.settingLabel}>Report Multimedia</Text>
                  <Text style={styles.settingDescription}>Media files assigned to specific reports</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reports Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports</Text>
          
          <View style={styles.settingCard}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleReportDetails}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#34495e20' }]}>
                  <Ionicons name="document-text-outline" size={22} color="#34495e" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Report Details</Text>
                  <Text style={styles.settingDescription}>Detailed view of maintenance reports</Text>
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
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="hardware-chip-outline" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>FTTH Manager v1.2.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="build-outline" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>Fiber Tools Package v2.1</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>Security Level: Enterprise</Text>
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