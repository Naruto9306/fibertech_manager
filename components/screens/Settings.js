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

const Settings = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [dataSaving, setDataSaving] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    Alert.alert(
      'Language Changed',
      `App language set to ${languageCode === 'es' ? 'Spanish' : 'English'}`,
      [{ text: 'OK' }]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: () => Alert.alert('Cache Cleared', 'All cached data has been removed.'),
          style: 'destructive'
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export functionality coming soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy documentation coming soon!');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service documentation coming soon!');
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          
          <View style={styles.settingCard}>
            <Text style={styles.languageTitle}>App Language</Text>
            <Text style={styles.languageSubtitle}>Select your preferred language</Text>
            
            <View style={styles.languageOptions}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    selectedLanguage === language.code && styles.languageOptionSelected
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    selectedLanguage === language.code && styles.languageNameSelected
                  ]}>
                    {language.name}
                  </Text>
                  {selectedLanguage === language.code && (
                    <Ionicons name="checkmark-circle" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* App Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#2c3e5020' }]}>
                  <Ionicons name="moon-outline" size={22} color="#2c3e50" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Enable dark theme</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#bdc3c7', true: '#2c3e50' }}
              />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#3498db20' }]}>
                  <Ionicons name="notifications-outline" size={22} color="#3498db" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive app notifications</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#bdc3c7', true: '#3498db' }}
              />
            </View>
          </View>
        </View>

        {/* Privacy & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Location</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#2ecc7120' }]}>
                  <Ionicons name="navigate-outline" size={22} color="#2ecc71" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Location Services</Text>
                  <Text style={styles.settingDescription}>Use your location for maps</Text>
                </View>
              </View>
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                trackColor={{ false: '#bdc3c7', true: '#2ecc71' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#9b59b620' }]}>
                  <Ionicons name="cloud-upload-outline" size={22} color="#9b59b6" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Auto Sync</Text>
                  <Text style={styles.settingDescription}>Automatic data synchronization</Text>
                </View>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: '#bdc3c7', true: '#9b59b6' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#e67e2220' }]}>
                  <Ionicons name="cellular-outline" size={22} color="#e67e22" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Data Saving</Text>
                  <Text style={styles.settingDescription}>Reduce data usage</Text>
                </View>
              </View>
              <Switch
                value={dataSaving}
                onValueChange={setDataSaving}
                trackColor={{ false: '#bdc3c7', true: '#e67e22' }}
              />
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <View style={styles.settingCard}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleClearCache}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#e74c3c20' }]}>
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Clear Cache</Text>
                <Text style={styles.settingDescription}>Remove temporary files</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleExportData}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#3498db20' }]}>
                <Ionicons name="download-outline" size={22} color="#3498db" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Export Data</Text>
                <Text style={styles.settingDescription}>Backup your data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <View style={styles.settingCard}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handlePrivacyPolicy}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#34495e20' }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#34495e" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>How we handle your data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTermsOfService}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#34495e20' }]}>
                <Ionicons name="document-text-outline" size={22} color="#34495e" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Terms of Service</Text>
                <Text style={styles.settingDescription}>App usage terms</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="phone-portrait-outline" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>FTTH Manager v1.2.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="build-outline" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>Build 2024.03.15</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#7f8c8d" />
              <Text style={styles.infoText}>Last updated: March 15, 2024</Text>
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
  languageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  languageSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  languageOptions: {
    gap: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    backgroundColor: '#ffffff',
  },
  languageOptionSelected: {
    borderColor: '#3498db',
    backgroundColor: '#3498db10',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
  },
  languageNameSelected: {
    color: '#3498db',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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

export default Settings;