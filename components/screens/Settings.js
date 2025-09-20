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
import { useApp } from '../context/AppContext'; // Ajusta la ruta
import { useDevice } from '../context/DeviceContext';

const Settings = ({ navigation, device,  }) => {
  const { language, theme, isDarkMode, t, changeLanguage, changeTheme } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [dataSaving, setDataSaving] = useState(false);
  const { topInset } = useDevice();

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const themes = [
    { id: 'light', name: 'Light', icon: 'sunny' },
    { id: 'dark', name: 'Dark', icon: 'moon' },
    { id: 'system', name: 'System', icon: 'phone-portrait' }
  ];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    // Alert.alert(
    //   t('languageChanged'),
    //   t('languageSetTo') + (languageCode === 'es' ? 'Spanish' : 'English'),
    //   [{ text: 'OK' }]
    // );
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  // const handleClearCache = () => {
  //   Alert.alert(
  //     'Clear Cache',
  //     'Are you sure you want to clear all cached data?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel'
  //       },
  //       {
  //         text: 'Clear',
  //         onPress: () => Alert.alert('Cache Cleared', 'All cached data has been removed.'),
  //         style: 'destructive'
  //       }
  //     ]
  //   );
  // };
  const handleClearCache = () => {
    Alert.alert(
      t('clearCache'),
      t('confirmClearCache'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('clear'),
          style: 'destructive',
          onPress: () => Alert.alert(t('cacheCleared'), t('cacheRemoved'))
        }
      ]
    );
  };

  const handleExportData = () => {
    // Alert.alert('Export Data', 'Data export functionality coming soon!');
    Alert.alert(t('exportData'), t('exportDataSoon'));
  };

  const handlePrivacyPolicy = () => {
    // Alert.alert('Privacy Policy', 'Privacy policy documentation coming soon!');
    Alert.alert(t('privacyPolicy'), t('privacyPolicySoon'));
  };

  const handleTermsOfService = () => {
    // Alert.alert('Terms of Service', 'Terms of service documentation coming soon!');
    Alert.alert(t('termsService'), t('termsServiceSoon'));
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader, { paddingTop: topInset }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#ffffff' : '#2c3e50'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>{t('settings')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('language')}</Text>
          
          <View style={[styles.settingCard, isDarkMode && styles.darkCard]}>
            <Text style={[styles.languageTitle, isDarkMode && styles.darkText]}>{t('appLanguage')}</Text>
            <Text style={styles.languageSubtitle}>{t('selectLanguage')}</Text>
            
            <View style={styles.languageOptions}>
              {languages.map((languageItem) => (
                <TouchableOpacity
                  key={languageItem.code}
                  style={[
                    styles.languageOption,
                    language === languageItem.code && styles.languageOptionSelected,
                    isDarkMode && styles.darkLanguageOption
                  ]}
                  onPress={() => handleLanguageChange(languageItem.code)}
                >
                  <Text style={styles.languageFlag}>{languageItem.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    language === languageItem.code && styles.languageNameSelected,
                    isDarkMode && styles.darkText
                  ]}>
                    {languageItem.name}
                  </Text>
                  {language === languageItem.code && (
                    <Ionicons name="checkmark-circle" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('appearance')}</Text>
          
          <View style={[styles.settingCard, isDarkMode && styles.darkCard]}>
            <Text style={[styles.languageTitle, isDarkMode && styles.darkText]}>Theme</Text>
            <Text style={styles.languageSubtitle}>Select app theme</Text>
            
            <View style={styles.languageOptions}>
              {themes.map((themeItem) => (
                <TouchableOpacity
                  key={themeItem.id}
                  style={[
                    styles.languageOption,
                    theme === themeItem.id && styles.languageOptionSelected,
                    isDarkMode && styles.darkLanguageOption
                  ]}
                  onPress={() => handleThemeChange(themeItem.id)}
                >
                  <Ionicons 
                    name={themeItem.icon} 
                    size={20} 
                    color={theme === themeItem.id ? '#3498db' : (isDarkMode ? '#ffffff' : '#2c3e50')} 
                  />
                  <Text style={[
                    styles.languageName,
                    theme === themeItem.id && styles.languageNameSelected,
                    isDarkMode && styles.darkText
                  ]}>
                    {themeItem.name}
                  </Text>
                  {theme === themeItem.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {t('notifications')}
         </Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#3498db20' }]}>
                  <Ionicons name="notifications-outline" size={22} color="#3498db" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, isDarkMode]}>
                    {t('pushNotifications')}
                    </Text>
                  <Text style={[styles.settingDescription, isDarkMode]}>{t('receiveNotifications')}</Text>
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
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {t('privacyLocation')}
            </Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#2ecc7120' }]}>
                  <Ionicons name="navigate-outline" size={22} color="#2ecc71" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, isDarkMode]}>
   {t('locationServices')}</Text>
                  <Text style={[styles.settingDescription, isDarkMode]}>
    {t('useLocationMaps')}</Text>
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
                  <Text style={[styles.settingLabel, isDarkMode]}>
    {t('autoSync')}</Text>
                  <Text style={[styles.settingDescription, isDarkMode]}>
    {t('autoDataSync')}</Text>
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
                  <Text style={[styles.settingLabel, isDarkMode]}>
    {t('dataSaving')}</Text>
                  <Text style={[styles.settingDescription, isDarkMode ]}>
    {t('reduceDataUsage')}</Text>
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
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {t('dataManagement')}
            </Text>
          
          <View style={styles.settingCard}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleClearCache}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#e74c3c20' }]}>
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, isDarkMode]}>
   {t('clearCache')}</Text>
                <Text style={[styles.settingDescription, isDarkMode && styles.darkSubText]}>
    {t('removeTempFiles')}</Text>
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
                <Text style={[styles.settingLabel, isDarkMode ]}>
    {t('exportData')}</Text>
                <Text style={[styles.settingDescription, isDarkMode && styles.darkSubText]}>
    {t('backupData')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {t('legal')}
            </Text>
          
          <View style={styles.settingCard}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handlePrivacyPolicy}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#34495e20' }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#34495e" />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, isDarkMode]}>
    {t('privacyPolicy')}</Text>
                <Text style={[styles.settingDescription, isDarkMode]}>
    {t('handleData')}</Text>
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
                <Text style={[styles.settingLabel, isDarkMode]}>
    {t('termsService')}</Text>
                <Text style={[styles.settingDescription, isDarkMode ]}>
    {t('appUsageTerms')}</Text>
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
              <Text style={[styles.infoText, isDarkMode && styles.darkSubText]}>FTTH Manager v1.2.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="build-outline" size={20} color="#7f8c8d" />
              <Text style={[styles.infoText, isDarkMode && styles.darkSubText]}>
    {t('build')} 2024.03.15</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#7f8c8d" />
              <Text style={[styles.infoText, isDarkMode && styles.darkSubText]}>
    {t('lastUpdated')} March 15, 2024</Text>
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
  darkContainer: {
    backgroundColor: '#121212',
  },
  darkHeader: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  darkText: {
    color: '#ffffff',
  },
  darkLanguageOption: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  darkSubText: {
  color: '#b0b0b0',
},
});

export default Settings;