// // import React, { useState, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Alert,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// //   TouchableWithoutFeedback,
// //   Keyboard,
// //   TextInput,
// //   Image
// // } from 'react-native';
// // import { Button } from 'native-base';
// // import { useForm, Controller } from 'react-hook-form';
// // import { yupResolver } from '@hookform/resolvers/yup';
// // import * as yup from 'yup';
// // import { Ionicons } from '@expo/vector-icons';

// // const loginSchema = yup.object({
// //   username: yup.string().required('User is required'),
// //   password: yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
// // });

// // const LoginScreen = ({ navigation }) => {
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const passwordRef = useRef(null);

// //   const { control, handleSubmit, formState: { errors } } = useForm({
// //     resolver: yupResolver(loginSchema),
// //     defaultValues: {
// //       username: '',
// //       password: ''
// //     }
// //   });

// //   const handleLogin = async (data) => {
// //     setIsLoading(true);
// //     try {
// //       await new Promise(resolve => setTimeout(resolve, 1500));
// //       navigation.replace('Dashboard');
// //     } catch (error) {
// //       Alert.alert('Error', 'Credenciales incorrectas');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const focusPassword = () => {
// //     if (passwordRef.current) {
// //       passwordRef.current.focus();
// //     }
// //   };

// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
// //       <KeyboardAvoidingView 
// //         style={styles.container}
// //         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //         keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
// //       >
// //         <ScrollView 
// //           contentContainerStyle={styles.scrollContainer}
// //           keyboardShouldPersistTaps="handled"
// //           showsVerticalScrollIndicator={false}
// //         >
// //           {/* Header minimalista */}
// //           <View style={styles.header}>
// //             {/* <Ionicons name="wifi" size={50} color="#3498db" /> */}
// //             <View style={styles.logoContainer}>
// //     <Image 
// //       source={require('../../assets/images/logo3.png')}
// //       style={styles.logo}
// //       resizeMode="contain"
// //     />
// //     {/* <Ionicons name="wifi" size={30} color="#3498db" style={styles.wifiIcon} /> */}
// //   </View>
            
// //             {/* <Text style={styles.title}>Optical fiber</Text> */}
// //             <Text style={styles.subtitle}>Access to the system</Text>
// //           </View>

// //           {/* Formulario simplificado */}
// //           <View style={styles.formContainer}>
// //             {/* Campo Usuario */}
// //             <View style={styles.inputContainer}>
// //               <View style={styles.inputWrapper}>
// //                 <Ionicons name="person-outline" size={20} color="#7f8c8d" style={styles.icon} />
// //                 <Controller
// //                   control={control}
// //                   name="username"
// //                   render={({ field: { onChange, onBlur, value } }) => (
// //                     <TextInput
// //                       placeholder="User"
// //                       placeholderTextColor="#95a5a6"
// //                       value={value}
// //                       onChangeText={onChange}
// //                       onBlur={onBlur}
// //                       style={styles.input}
// //                       autoCapitalize="none"
// //                       autoCorrect={false}
// //                       returnKeyType="next"
// //                       onSubmitEditing={focusPassword}
// //                       autoFocus={true}
// //                     />
// //                   )}
// //                 />
// //               </View>
// //               {errors.username && (
// //                 <Text style={styles.errorText}>{errors.username.message}</Text>
// //               )}
// //             </View>

// //             {/* Campo Contraseña */}
// //             <View style={styles.inputContainer}>
// //               <View style={styles.inputWrapper}>
// //                 <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.icon} />
// //                 <Controller
// //                   control={control}
// //                   name="password"
// //                   render={({ field: { onChange, onBlur, value } }) => (
// //                     <TextInput
// //                       ref={passwordRef}
// //                       placeholder="Password"
// //                       placeholderTextColor="#95a5a6"
// //                       value={value}
// //                       onChangeText={onChange}
// //                       onBlur={onBlur}
// //                       style={styles.input}
// //                       secureTextEntry={!showPassword}
// //                       autoCapitalize="none"
// //                       autoCorrect={false}
// //                       returnKeyType="done"
// //                       onSubmitEditing={handleSubmit(handleLogin)}
// //                     />
// //                   )}
// //                 />
// //                 <TouchableOpacity 
// //                   onPress={() => setShowPassword(!showPassword)}
// //                   style={styles.eyeIcon}
// //                 >
// //                   <Ionicons 
// //                     name={showPassword ? "eye-outline" : "eye-off-outline"} 
// //                     size={20} 
// //                     color="#7f8c8d"
// //                   />
// //                 </TouchableOpacity>
// //               </View>
// //               {errors.password && (
// //                 <Text style={styles.errorText}>{errors.password.message}</Text>
// //               )}
// //             </View>

// //             {/* Botón de Login */}
// //             <Button
// //               onPress={handleSubmit(handleLogin)}
// //               isLoading={isLoading}
// //               isLoadingText="Logging in..."
// //               style={styles.loginButton}
// //               _text={{ fontWeight: '600', fontSize: 16 }}
// //             >
// //               Login
// //             </Button>

// //             {/* Link olvidé contraseña */}
// //             <TouchableOpacity style={styles.forgotPassword}>
// //               <Text style={styles.forgotPasswordText}>¿Forgot your password?</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Footer minimalista */}
// //           <View style={styles.footer}>
// //             <Text style={styles.footerText}>v1.0 • FTTH Manager</Text>
// //           </View>
// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </TouchableWithoutFeedback>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //   },
// //   scrollContainer: {
// //     flexGrow: 1,
// //     justifyContent: 'center',
// //     padding: 20,
// //   },
// //   header: {
// //     alignItems: 'center',
// //     marginBottom: 50,
// //     paddingTop: 20,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: '300',
// //     color: '#2c3e50',
// //     marginTop: 10,
// //     letterSpacing: 1,
// //   },
// //   subtitle: {
// //     fontSize: 14,
// //     color: '#7f8c8d',
// //     marginTop: 5,
// //     fontWeight: '300',
// //   },
// //   formContainer: {
// //     backgroundColor: '#f8f9fa',
// //     padding: 25,
// //     borderRadius: 12,
// //     shadowColor: '#000',
// //     shadowOffset: {
// //       width: 0,
// //       height: 1,
// //     },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 3,
// //     elevation: 2,
// //   },
// //   inputContainer: {
// //     marginBottom: 20,
// //   },
// //   inputWrapper: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#ffffff',
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //     paddingHorizontal: 12,
// //     height: 50,
// //   },
// //   icon: {
// //     marginRight: 10,
// //   },
// //   input: {
// //     flex: 1,
// //     fontSize: 16,
// //     color: '#2c3e50',
// //     paddingVertical: 12,
// //   },
// //   eyeIcon: {
// //     padding: 5,
// //   },
// //   errorText: {
// //     color: '#e74c3c',
// //     fontSize: 12,
// //     marginTop: 5,
// //     marginLeft: 5,
// //     fontWeight: '500',
// //   },
// //   loginButton: {
// //     backgroundColor: '#3498db',
// //     borderRadius: 8,
// //     height: 50,
// //     marginTop: 10,
// //     shadowColor: '#000',
// //     shadowOffset: {
// //       width: 0,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3,
// //     elevation: 3,
// //   },
// //   forgotPassword: {
// //     alignSelf: 'center',
// //     marginTop: 20,
// //   },
// //   forgotPasswordText: {
// //     color: '#3498db',
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   footer: {
// //     marginTop: 30,
// //     alignItems: 'center',
// //   },
// //   footerText: {
// //     color: '#bdc3c7',
// //     fontSize: 12,
// //     fontWeight: '300',
// //   },
// //   logoContainer: {
// //   flexDirection: 'row',
// //   alignItems: 'center',
// //   marginBottom: 10,
// // },
// // logo: {
// //   width: "120%",
// //   height: 80,
// //   marginRight: 10,
// // },
// // wifiIcon: {
// //   marginLeft: 10,
// // }
// // });

// // export default LoginScreen;

// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   TextInput,
//   Image
// } from 'react-native';
// import { Button } from 'native-base';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { Ionicons } from '@expo/vector-icons';
// import { useTranslation } from '../hooks/useTranslation';
// import { useApp } from '../../components/context/AppContext';

// // Esquema de validación con mensajes traducidos
// const createLoginSchema = (t) => yup.object({
//   username: yup.string().required(t('userRequired')),
//   password: yup.string().required(t('passwordRequired')).min(6, t('minCharacters')),
// });

// const LoginScreen = ({ navigation }) => {
//   const { t } = useTranslation();
//   const { isDarkMode } = useApp();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const passwordRef = useRef(null);

//   const loginSchema = createLoginSchema(t);

//   const { control, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(loginSchema),
//     defaultValues: {
//       username: '',
//       password: ''
//     }
//   });

//   const handleLogin = async (data) => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       navigation.replace('Dashboard');
//     } catch (error) {
//       Alert.alert(t('error'), t('incorrectCredentials'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const focusPassword = () => {
//     if (passwordRef.current) {
//       passwordRef.current.focus();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView 
//         style={[styles.container, isDarkMode && styles.darkContainer]}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
//       >
//         <ScrollView 
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header minimalista */}
//           <View style={styles.header}>
//             <View style={styles.logoContainer}>
//               <Image 
//                 source={require('../../assets/images/logo3.png')}
//                 style={styles.logo}
//                 resizeMode="contain"
//               />
//             </View>
//             <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
//               {t('accessToSystem')}
//             </Text>
//           </View>

//           {/* Formulario simplificado */}
//           <View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
//             {/* Campo Usuario */}
//             <View style={styles.inputContainer}>
//               <View style={[styles.inputWrapper, isDarkMode && styles.darkInputWrapper]}>
//                 <Ionicons name="person-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} style={styles.icon} />
//                 <Controller
//                   control={control}
//                   name="username"
//                   render={({ field: { onChange, onBlur, value } }) => (
//                     <TextInput
//                       placeholder={t('user')}
//                       placeholderTextColor={isDarkMode ? "#666" : "#95a5a6"}
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       style={[styles.input, isDarkMode && styles.darkInput]}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       returnKeyType="next"
//                       onSubmitEditing={focusPassword}
//                       autoFocus={true}
//                     />
//                   )}
//                 />
//               </View>
//               {errors.username && (
//                 <Text style={styles.errorText}>{errors.username.message}</Text>
//               )}
//             </View>

//             {/* Campo Contraseña */}
//             <View style={styles.inputContainer}>
//               <View style={[styles.inputWrapper, isDarkMode && styles.darkInputWrapper]}>
//                 <Ionicons name="lock-closed-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} style={styles.icon} />
//                 <Controller
//                   control={control}
//                   name="password"
//                   render={({ field: { onChange, onBlur, value } }) => (
//                     <TextInput
//                       ref={passwordRef}
//                       placeholder={t('password')}
//                       placeholderTextColor={isDarkMode ? "#666" : "#95a5a6"}
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       style={[styles.input, isDarkMode && styles.darkInput]}
//                       secureTextEntry={!showPassword}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       returnKeyType="done"
//                       onSubmitEditing={handleSubmit(handleLogin)}
//                     />
//                   )}
//                 />
//                 <TouchableOpacity 
//                   onPress={() => setShowPassword(!showPassword)}
//                   style={styles.eyeIcon}
//                 >
//                   <Ionicons 
//                     name={showPassword ? "eye-outline" : "eye-off-outline"} 
//                     size={20} 
//                     color={isDarkMode ? "#888" : "#7f8c8d"}
//                   />
//                 </TouchableOpacity>
//               </View>
//               {errors.password && (
//                 <Text style={styles.errorText}>{errors.password.message}</Text>
//               )}
//             </View>

//             {/* Botón de Login */}
//             <Button
//               onPress={handleSubmit(handleLogin)}
//               isLoading={isLoading}
//               isLoadingText={t('loggingIn')}
//               style={styles.loginButton}
//               _text={{ fontWeight: '600', fontSize: 16 }}
//             >
//               {t('login')}
//             </Button>

//             {/* Link olvidé contraseña */}
//             <TouchableOpacity style={styles.forgotPassword}>
//               <Text style={[styles.forgotPasswordText, isDarkMode && styles.darkLinkText]}>
//                 {t('forgotPassword')}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Footer minimalista */}
//           <View style={styles.footer}>
//             <Text style={[styles.footerText, isDarkMode && styles.darkFooterText]}>
//               v1.0 • {t('ftthManager')}
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   darkContainer: {
//     backgroundColor: '#121212',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 50,
//     paddingTop: 20,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginTop: 5,
//     fontWeight: '300',
//   },
//   darkText: {
//     color: '#cccccc',
//   },
//   formContainer: {
//     backgroundColor: '#f8f9fa',
//     padding: 25,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   darkFormContainer: {
//     backgroundColor: '#1e1e1e',
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     paddingHorizontal: 12,
//     height: 50,
//   },
//   darkInputWrapper: {
//     backgroundColor: '#2a2a2a',
//     borderColor: '#444',
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#2c3e50',
//     paddingVertical: 12,
//   },
//   darkInput: {
//     color: '#ffffff',
//   },
//   eyeIcon: {
//     padding: 5,
//   },
//   errorText: {
//     color: '#e74c3c',
//     fontSize: 12,
//     marginTop: 5,
//     marginLeft: 5,
//     fontWeight: '500',
//   },
//   loginButton: {
//     backgroundColor: '#3498db',
//     borderRadius: 8,
//     height: 50,
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   forgotPassword: {
//     alignSelf: 'center',
//     marginTop: 20,
//   },
//   forgotPasswordText: {
//     color: '#3498db',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   darkLinkText: {
//     color: '#4da6ff',
//   },
//   footer: {
//     marginTop: 30,
//     alignItems: 'center',
//   },
//   footerText: {
//     color: '#bdc3c7',
//     fontSize: 12,
//     fontWeight: '300',
//   },
//   darkFooterText: {
//     color: '#666',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   logo: {
//     width: "120%",
//     height: 80,
//     marginRight: 10,
//   },
// });

// export default LoginScreen;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Image
} from 'react-native';
import { Button } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../../components/context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Esquema de validación con mensajes traducidos
const createLoginSchema = (t) => yup.object({
  username: yup.string().required(t('userRequired')),
  password: yup.string().required(t('passwordRequired')).min(6, t('minCharacters')),
});

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode, isAuthenticated, isLoading, setIsLoading, login } = useApp();
  // const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  const loginSchema = createLoginSchema(t);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const handleLogin = async (data) => {
    // setIsLoading(true);
    try {

      await login(data.username, data.password);
      
    } catch (error) {
      console.error('Error en login:', error);
      // Alert.alert(t('error'), t('loginError'));
    }
  };

  const focusPassword = () => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={[styles.container, isDarkMode && styles.darkContainer]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header minimalista */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/logo3.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
              {t('accessToSystem')}
            </Text>
          </View>

          {/* Formulario simplificado */}
          <View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
            {/* Campo Usuario */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, isDarkMode && styles.darkInputWrapper]}>
                <Ionicons name="person-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} style={styles.icon} />
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder={t('user')}
                      placeholderTextColor={isDarkMode ? "#666" : "#95a5a6"}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      style={[styles.input, isDarkMode && styles.darkInput]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      onSubmitEditing={focusPassword}
                      autoFocus={true}
                    />
                  )}
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, isDarkMode && styles.darkInputWrapper]}>
                <Ionicons name="lock-closed-outline" size={20} color={isDarkMode ? "#888" : "#7f8c8d"} style={styles.icon} />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={passwordRef}
                      placeholder={t('password')}
                      placeholderTextColor={isDarkMode ? "#666" : "#95a5a6"}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      style={[styles.input, isDarkMode && styles.darkInput]}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(handleLogin)}
                    />
                  )}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={isDarkMode ? "#888" : "#7f8c8d"}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Información de credenciales (solo para desarrollo) */}
            <View style={styles.credentialsInfo}>
              <Text style={[styles.credentialsText, isDarkMode && styles.darkCredentialsText]}>
                Usuario: admin | Contraseña: 123456
              </Text>
            </View>

            {/* Botón de Login */}
            <Button
              onPress={handleSubmit(handleLogin)}
              isLoading={isLoading}
              isLoadingText={t('loggingIn')}
              style={styles.loginButton}
              _text={{ fontWeight: '600', fontSize: 16 }}
            >
              {t('login')}
            </Button>

            {/* Link olvidé contraseña */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, isDarkMode && styles.darkLinkText]}>
                {t('forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer minimalista */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, isDarkMode && styles.darkFooterText]}>
              v1.0 • {t('ftthManager')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    fontWeight: '300',
  },
  darkText: {
    color: '#cccccc',
  },
  formContainer: {
    backgroundColor: '#f8f9fa',
    padding: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  darkFormContainer: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    height: 50,
  },
  darkInputWrapper: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 12,
  },
  darkInput: {
    color: '#ffffff',
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    height: 50,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  darkLinkText: {
    color: '#4da6ff',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#bdc3c7',
    fontSize: 12,
    fontWeight: '300',
  },
  darkFooterText: {
    color: '#666',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: "120%",
    height: 80,
    marginRight: 10,
  },
  credentialsInfo: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  darkCredentialsInfo: {
    backgroundColor: '#2d2d00',
    borderColor: '#555500',
  },
  credentialsText: {
    color: '#856404',
    fontSize: 12,
    textAlign: 'center',
  },
  darkCredentialsText: {
    color: '#ffd700',
  },
});

export default LoginScreen;