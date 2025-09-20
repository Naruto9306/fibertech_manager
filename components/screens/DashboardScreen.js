// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useTranslation } from '../hooks/useTranslation';
// import { useApp } from '../../components/context/AppContext';
// import { useDevice } from '../hooks/useDevice';
// import { ProjectService, UnitsService, ProjectTypeService, NodeService, FileService } from '../../service/storage';

// const DashboardScreen = ({ navigation, device, theme }) => {
//   const { t } = useTranslation();
//   const { isDarkMode } = useApp(); // Si quieres usar el tema oscuro también
//   const { insets, isSmall, isTablet, topInset, bottomInset } = useDevice();
//   const [existingProjects, setExistingProjects] = useState([]);
  

//   const loadExistingProjects = async () => {
//     try {
//       const projects = await ProjectService.getProjects();
//       setExistingProjects(projects);
      
//     } catch (error) {
//       console.log('Error loading projects:', error);
//     }
//   };

//   useEffect(() => {
//     loadExistingProjects();
    
//   }, []);

//   const menuOptions = [
//     {
//       id: 1,
//       title: t('createProject'),
//       icon: 'document-text-outline',
//       color: '#3498db',
//       onPress: () => navigation.navigate('CreateProject')
//     },
//     {
//       id: 2,
//       title: t('scanQR'),
//       icon: 'qr-code-outline',
//       color: '#2ecc71',
//       onPress: () => navigation.navigate('ScanQr')
//     },
//     {
//       id: 3,
//       title: t('createMaintenance'),
//       icon: 'construct-outline',
//       color: '#e67e22',
//       onPress: () => navigation.navigate('CreateMaintenance')
//     },
//     {
//       id: 4,
//       title: t('viewOnMap'),
//       icon: 'map-outline',
//       color: '#e74c3c',
//       onPress: () => navigation.navigate('ViewOnMap')
//     },
//     {
//       id: 5,
//       title: t('tools'),
//       icon: 'hammer-outline',
//       color: '#9b59b6',
//       onPress: () => navigation.navigate('Tools')
//     },
//     {
//       id: 6,
//       title: t('userProfile'),
//       icon: 'person-outline',
//       color: '#1abc9c',
//       onPress: () => navigation.navigate('UserProfile')
//     },
//     {
//       id: 7,
//       title: t('settings'),
//       icon: 'settings-outline',
//       color: '#95a5a6',
//       onPress: () => navigation.navigate('Settings')
//     },
//     {
//       id: 8,
//       title: t('logout'),
//       icon: 'log-out-outline',
//       color: '#7f8c8d',
//       onPress: () => {

//         navigation.replace('Login')
//       }
//     }
//   ];

//   return (
//     <View style={[styles.container, isDarkMode && styles.darkContainer]}>
//       {/* Header */}
//       <View style={[styles.header, isDarkMode && styles.darkContainer, { paddingTop: topInset - 10}]}>
//         <View style={styles.logoContainer}>
//           <Image 
//             source={require('../../assets/images/logo2.png')}
//             style={[
//       styles.logo,
//       isSmall && { width: '60%', height: 60 },
//       isTablet && { width: '40%', height: 100 }
//     ]}
//             resizeMode="contain"
//           />
//         </View>
//         {/* <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
//           {t('fiberOpticManagementSystem')}
//         </Text> */}
//       </View>

//       {/* Main Content */}
//         <ScrollView 
//           style={styles.scrollView}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={[
//       styles.scrollContent,
//       {
//         paddingTop: topInset,
//         paddingBottom: bottomInset,
//         backgroundColor: theme.colors.background,
//       },
//     ]}
//         >
//         <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
//           {t('mainMenu')}
//         </Text>
        
//         <View style={styles.gridContainer}>
//           {menuOptions.map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               style={[styles.menuCard, { borderLeftColor: item.color }, isDarkMode && styles.darkCard]}
//               onPress={item.onPress}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.iconContainer, isDarkMode && styles.darkIconContainer]}>
//                 <Ionicons name={item.icon} size={24} color={item.color} />
//               </View>
//               <Text style={[styles.menuTitle, isDarkMode && styles.darkText]}>
//                 {item.title}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Quick Stats */}
//         <View style={styles.statsContainer}>
//           <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
//             {t('quickStats')}
//           </Text>
//           <View style={styles.statsGrid}>
//             <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
//               <Ionicons name="document-outline" size={24} color="#3498db" />
//               <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>{existingProjects.length}</Text>
//               <Text style={styles.statLabel}>{t('activeProjects')}</Text>
//             </View>
//             <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
//               <Ionicons name="checkmark-circle-outline" size={24} color="#2ecc71" />
//               <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>{existingProjects.length}</Text>
//               <Text style={styles.statLabel}>{t('completed')}</Text>
//             </View>
//             <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
//               <Ionicons name="alert-circle-outline" size={24} color="#e67e22" />
//               <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>0</Text>
//               <Text style={styles.statLabel}>{t('pending')}</Text>
//             </View>
//             <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
//               <Ionicons name="people-outline" size={24} color="#9b59b6" />
//               <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>5</Text>
//               <Text style={styles.statLabel}>{t('teamMembers')}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Footer */}
//       <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
//         <Text style={[styles.footerText, isDarkMode && styles.darkFooterText]}>
//           v1.0 • {t('connected')}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   darkContainer: {
//     backgroundColor: '#121212',
//   },
//   header: {
//     backgroundColor: '#ffffff',
//     padding: 1,
//     paddingTop: 5,
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ecf0f1',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   darkHeader: {
//     backgroundColor: '#1e1e1e',
//     borderBottomColor: '#333',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginTop: 5,
//     fontWeight: '300',
//   },
//   darkText: {
//     color: '#ffffff',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginBottom: 16,
//     marginLeft: 4,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 24,
//   },
//   menuCard: {
//     width: '48%',
//     backgroundColor: '#ffffff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   darkCard: {
//     backgroundColor: '#1e1e1e',
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   darkIconContainer: {
//     backgroundColor: '#2a2a2a',
//   },
//   menuTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#2c3e50',
//     marginTop: 4,
//   },
//   statsContainer: {
//     marginTop: 8,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     width: '48%',
//     backgroundColor: '#ffffff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginVertical: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#7f8c8d',
//     textAlign: 'center',
//   },
//   footer: {
//     backgroundColor: '#ffffff',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#ecf0f1',
//     alignItems: 'center',
//   },
//   darkFooter: {
//     backgroundColor: '#1e1e1e',
//     borderTopColor: '#333',
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#bdc3c7',
//     fontWeight: '300',
//   },
//   darkFooterText: {
//     color: '#888',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // marginBottom: 1,
//   },
//   logo: {
//     width: "80%",
//     height: 80,
//     top: 10
//     // marginRight: 10,
//   },
// });

// export default DashboardScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../../components/context/AppContext';
import { useDevice } from '../../components/context/DeviceContext';
import { ProjectService, UnitsService, ProjectTypeService, NodeService, FileService } from '../../service/storage';

const DashboardScreen = ({ navigation, theme }) => {
  const { t } = useTranslation();
  const { isDarkMode, logout } = useApp(); // ← Ahora tenemos la función logout del contexto
  const { insets, isSmall, isTablet, topInset, bottomInset } = useDevice();
  const [existingProjects, setExistingProjects] = useState([]);

  const loadExistingProjects = async () => {
    try {
      const projects = await ProjectService.getProjects();
      setExistingProjects(projects);
    } catch (error) {
      console.log('Error loading projects:', error);
    }
  };

  useEffect(() => {
    loadExistingProjects();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      t('confirmLogout'),
      t('confirmLogoutMessage'),
      [
        {
          text: t('cancel'),
          style: "cancel"
        },
        {
          text: t('logout1'),
          onPress: async () => {
            try {
              await logout(); // ← Usamos la función logout del contexto
              // navigation.replace('Login'); // ← Ya no es necesario porque logout maneja la navegación
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert(t('error'), t('logoutError'));
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const menuOptions = [
    {
      id: 1,
      title: t('createProject'),
      icon: 'document-text-outline',
      color: '#3498db',
      onPress: () => navigation.navigate('CreateProject')
    },
    {
      id: 2,
      title: t('scanQR'),
      icon: 'qr-code-outline',
      color: '#2ecc71',
      onPress: () => navigation.navigate('ScanQr')
    },
    {
      id: 3,
      title: t('createMaintenance'),
      icon: 'construct-outline',
      color: '#e67e22',
      onPress: () => navigation.navigate('CreateMaintenance')
    },
    {
      id: 4,
      title: t('viewOnMap'),
      icon: 'map-outline',
      color: '#e74c3c',
      onPress: () => navigation.navigate('ViewOnMap')
    },
    {
      id: 5,
      title: t('tools'),
      icon: 'hammer-outline',
      color: '#9b59b6',
      onPress: () => navigation.navigate('Tools')
    },
    {
      id: 6,
      title: t('userProfile'),
      icon: 'person-outline',
      color: '#1abc9c',
      onPress: () => navigation.navigate('UserProfile')
    },
    {
      id: 7,
      title: t('settings'),
      icon: 'settings-outline',
      color: '#95a5a6',
      onPress: () => navigation.navigate('Settings')
    },
    {
      id: 8,
      title: t('logout1'),
      icon: 'log-out-outline',
      color: '#7f8c8d',
      onPress: handleLogout // ← Ahora usa la nueva función handleLogout
    }
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkContainer, { paddingTop: topInset - 20}]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo2.png')}
            style={[
              styles.logo,
              isSmall && { width: '60%', height: 60 },
              isTablet && { width: '40%', height: 100 }
            ]}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topInset,
            paddingBottom: bottomInset,
            backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
          },
        ]}
      >
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
          {t('mainMenu')}
        </Text>
        
        <View style={styles.gridContainer}>
          {menuOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuCard, { borderLeftColor: item.color }, isDarkMode && styles.darkCard]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isDarkMode && styles.darkIconContainer]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={[styles.menuTitle, isDarkMode && styles.darkText]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {t('quickStats')}
          </Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="document-outline" size={24} color="#3498db" />
              <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>{existingProjects.length}</Text>
              <Text style={styles.statLabel}>{t('activeProjects')}</Text>
            </View>
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#2ecc71" />
              <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>{existingProjects.length}</Text>
              <Text style={styles.statLabel}>{t('completed')}</Text>
            </View>
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="alert-circle-outline" size={24} color="#e67e22" />
              <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>0</Text>
              <Text style={styles.statLabel}>{t('pending')}</Text>
            </View>
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="people-outline" size={24} color="#9b59b6" />
              <Text style={[styles.statNumber, isDarkMode && styles.darkText]}>5</Text>
              <Text style={styles.statLabel}>{t('teamMembers')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
        <Text style={[styles.footerText, isDarkMode && styles.darkFooterText]}>
          v1.0 • {t('connected')}
        </Text>
      </View>
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
    backgroundColor: '#ffffff',
    // padding: 1,
    // paddingTop: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  darkHeader: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    fontWeight: '300',
  },
  darkText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    marginLeft: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  darkIconContainer: {
    backgroundColor: '#2a2a2a',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginTop: 4,
  },
  statsContainer: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    alignItems: 'center',
  },
  darkFooter: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#333',
  },
  footerText: {
    fontSize: 12,
    color: '#bdc3c7',
    fontWeight: '300',
  },
  darkFooterText: {
    color: '#888',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: "80%",
    height: 80,
    top: 10
  },
});

export default DashboardScreen;