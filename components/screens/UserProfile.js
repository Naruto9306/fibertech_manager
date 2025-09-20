import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../../components/context/AppContext';

const UserProfile = ({ navigation, device, theme }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useApp();
  
  const [userData, setUserData] = useState({
    name: 'Peter P Doe',
    email: 'peter.doe@fibraoptica.com',
    phone: '+1 (555) 123-4567',
    position: 'FTTH Technician',
    company: 'FiberTech Solutions',
    employeeId: 'FTECH-2024-008',
    joinDate: '2024-01-15',
    status: 'Active',
    projectsCompleted: 24,
    currentProjects: 3,
    rating: 4.8
  });

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('logout'),
          onPress: () => navigation.replace('Login'),
          style: 'destructive'
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(t('editProfile'), t('editProfileComingSoon'));
  };

  const handleChangePassword = () => {
    Alert.alert(t('changePassword'), t('changePasswordComingSoon'));
  };

  const handleHelpSupport = () => {
    Alert.alert(t('helpSupport'), t('helpSupportComingSoon'));
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(t('privacyPolicy'), t('privacyPolicyComingSoon'));
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader, { paddingTop: device.topInset + 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ffffff" : "#2c3e50"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>{t('userProfile')}</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <View style={[styles.profileSection, isDarkMode && styles.darkCard]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://media.istockphoto.com/id/1479759169/es/foto/ciencia-de-datos-y-tecnolog%C3%ADa-de-big-data-computaci%C3%B3n-de-cient%C3%ADficos-de-datos-analizando-y.webp?s=2048x2048&w=is&k=20&c=UBdb8KhnG1coLtUfIdSXHQF0FE7sUncrSxlQ3WEZoJg=' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, isDarkMode && styles.darkText]}>{userData.name}</Text>
          <Text style={styles.userPosition}>{userData.position}</Text>
          <Text style={[styles.userCompany, isDarkMode && styles.darkSubtext]}>{userData.company}</Text>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>{userData.projectsCompleted}</Text>
              <Text style={styles.statLabel}>{t('completed')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>{userData.currentProjects}</Text>
              <Text style={styles.statLabel}>{t('active')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>{userData.rating}</Text>
              <Text style={styles.statLabel}>{t('rating')}</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('personalInformation')}</Text>
          <View style={[styles.infoCard, isDarkMode && styles.darkCard]}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('email')}</Text>
                <Text style={[styles.infoValue, isDarkMode && styles.darkText]}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('phone')}</Text>
                <Text style={[styles.infoValue, isDarkMode && styles.darkText]}>{userData.phone}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="id-card-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('employeeId')}</Text>
                <Text style={[styles.infoValue, isDarkMode && styles.darkText]}>{userData.employeeId}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('joinDate')}</Text>
                <Text style={[styles.infoValue, isDarkMode && styles.darkText]}>{userData.joinDate}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('status')}</Text>
                <Text style={[styles.infoValue, { color: '#2ecc71' }]}>
                  {userData.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('actions')}</Text>
          <View style={[styles.actionsCard, isDarkMode && styles.darkCard]}>
            <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
              <Ionicons name="key-outline" size={22} color="#e67e22" />
              <Text style={[styles.actionText, isDarkMode && styles.darkText]}>{t('changePassword')}</Text>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#bdc3c7"} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleHelpSupport}>
              <Ionicons name="help-circle-outline" size={22} color="#3498db" />
              <Text style={[styles.actionText, isDarkMode && styles.darkText]}>{t('helpSupport')}</Text>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#bdc3c7"} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handlePrivacyPolicy}>
              <Ionicons name="document-text-outline" size={22} color="#7f8c8d" />
              <Text style={[styles.actionText, isDarkMode && styles.darkText]}>{t('privacyPolicy')}</Text>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#bdc3c7"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, isDarkMode && styles.darkCard]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDarkMode && styles.darkFooterText]}>
            FTTH Manager v1.0
          </Text>
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
  darkContainer: {
    backgroundColor: '#121212',
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
  darkHeader: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubtext: {
    color: '#cccccc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ecf0f1',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userPosition: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    marginLeft: 4,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  actionsCard: {
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  actionText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#bdc3c7',
    fontWeight: '300',
  },
  darkFooterText: {
    color: '#666',
  },
});

export default UserProfile;