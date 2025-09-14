// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
//   Image,
//   Platform,
//   ActivityIndicator
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { Audio } from 'expo-av';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const CreateMaintenance = ({ navigation, route }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     technician: '',
//     maintenanceType: 'preventive',
//     priority: 'medium',
//     status: 'completed',
//     location: '',
//     equipment: '',
//     notes: ''
//   });

//   const [beforeMedia, setBeforeMedia] = useState([]);
//   const [afterMedia, setAfterMedia] = useState([]);
//   const [audioRecordings, setAudioRecordings] = useState([]);
//   const [recording, setRecording] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [currentMediaType, setCurrentMediaType] = useState('before');
//   const [isLoading, setIsLoading] = useState(false);

//   const [permission, requestPermission] = useCameraPermissions();
//   const audioRecorder = useRef(null);

//   const maintenanceTypes = [
//     { value: 'preventive', label: 'Preventive Maintenance' },
//     { value: 'corrective', label: 'Corrective Maintenance' },
//     { value: 'emergency', label: 'Emergency Repair' },
//     { value: 'inspection', label: 'Inspection' }
//   ];

//   const priorityLevels = [
//     { value: 'low', label: 'Low', color: '#2ecc71' },
//     { value: 'medium', label: 'Medium', color: '#f39c12' },
//     { value: 'high', label: 'High', color: '#e74c3c' }
//   ];

//   const statusOptions = [
//     { value: 'scheduled', label: 'Scheduled' },
//     { value: 'in-progress', label: 'In Progress' },
//     { value: 'completed', label: 'Completed' },
//     { value: 'cancelled', label: 'Cancelled' }
//   ];

//   const requestMediaPermissions = async () => {
//     if (Platform.OS !== 'web') {
//       const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
//       const { status: audioStatus } = await Audio.requestPermissionsAsync();
      
//       if (cameraStatus !== 'granted' || audioStatus !== 'granted') {
//         Alert.alert('Sorry, we need these permissions to make this work!');
//         return false;
//       }
//     }
//     return true;
//   };

//   const takePicture = async (type) => {
//     const hasPermission = await requestMediaPermissions();
//     if (!hasPermission) return;

//     try {
//       let result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         const imageWithWatermark = {
//           uri: result.assets[0].uri,
//           timestamp: new Date().toISOString(),
//           type: 'image',
//           watermark: `FibraOpticaApp - ${new Date().toLocaleString()}`
//         };

//         if (type === 'before') {
//           setBeforeMedia(prev => [...prev, imageWithWatermark]);
//         } else {
//           setAfterMedia(prev => [...prev, imageWithWatermark]);
//         }
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to take picture');
//     }
//   };

//   const pickImage = async (type) => {
//     const hasPermission = await requestMediaPermissions();
//     if (!hasPermission) return;

//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         const media = {
//           uri: result.assets[0].uri,
//           timestamp: new Date().toISOString(),
//           type: result.assets[0].type,
//           watermark: `FibraOpticaApp - ${new Date().toLocaleString()}`
//         };

//         if (type === 'before') {
//           setBeforeMedia(prev => [...prev, media]);
//         } else {
//           setAfterMedia(prev => [...prev, media]);
//         }
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to pick image');
//     }
//   };

//   const startRecording = async () => {
//     try {
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );

//       setRecording(recording);
//       setIsRecording(true);
//       await recording.startAsync();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to start recording');
//     }
//   };

//   const stopRecording = async () => {
//     setIsRecording(false);
//     setRecording(null);

//     await recording.stopAndUnloadAsync();
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: false,
//     });

//     const uri = recording.getURI();
//     const newRecording = {
//       uri,
//       timestamp: new Date().toISOString(),
//       duration: recording.getDurationMillis(),
//       watermark: `FibraOpticaApp - ${new Date().toLocaleString()}`
//     };

//     setAudioRecordings(prev => [...prev, newRecording]);
//   };

//   const removeMedia = (index, type) => {
//     if (type === 'before') {
//       setBeforeMedia(prev => prev.filter((_, i) => i !== index));
//     } else if (type === 'after') {
//       setAfterMedia(prev => prev.filter((_, i) => i !== index));
//     } else if (type === 'audio') {
//       setAudioRecordings(prev => prev.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.title || !formData.description) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Simular envío de datos
//       const maintenanceRecord = {
//         ...formData,
//         date: date.toISOString(),
//         beforeMedia,
//         afterMedia,
//         audioRecordings,
//         createdAt: new Date().toISOString(),
//         id: Date.now().toString()
//       };

//       console.log('Maintenance record:', maintenanceRecord);

//       // Simular delay de red
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       Alert.alert(
//         'Success',
//         'Maintenance record created successfully!',
//         [
//           {
//             text: 'OK',
//             onPress: () => navigation.goBack()
//           }
//         ]
//       );
//     } catch (error) {
//       Alert.alert('Error', 'Failed to create maintenance record');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderMediaItem = (item, index, type) => (
//     <View key={index} style={styles.mediaItem}>
//       {item.type === 'image' || item.type === undefined ? (
//         <Image source={{ uri: item.uri }} style={styles.mediaImage} />
//       ) : (
//         <View style={styles.videoPlaceholder}>
//           <Ionicons name="videocam" size={32} color="#3498db" />
//           <Text style={styles.videoText}>Video</Text>
//         </View>
//       )}
//       <Text style={styles.watermarkText}>{item.watermark}</Text>
//       <TouchableOpacity
//         style={styles.removeMediaButton}
//         onPress={() => removeMedia(index, type)}
//       >
//         <Ionicons name="close-circle" size={24} color="#e74c3c" />
//       </TouchableOpacity>
//     </View>
//   );

//   const renderAudioItem = (item, index) => (
//     <View key={index} style={styles.audioItem}>
//       <Ionicons name="mic" size={24} color="#3498db" />
//       <View style={styles.audioInfo}>
//         <Text style={styles.audioDuration}>
//           Duration: {Math.round(item.duration / 1000)}s
//         </Text>
//         <Text style={styles.watermarkText}>{item.watermark}</Text>
//       </View>
//       <TouchableOpacity
//         style={styles.removeMediaButton}
//         onPress={() => removeMedia(index, 'audio')}
//       >
//         <Ionicons name="close-circle" size={24} color="#e74c3c" />
//       </TouchableOpacity>
//     </View>
//   );

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3498db" />
//         <Text style={styles.loadingText}>Creating maintenance record...</Text>
//       </View>
//     );
//   }

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
//         <Text style={styles.headerTitle}>Create Maintenance</Text>
//         <TouchableOpacity onPress={handleSubmit}>
//           <Ionicons name="checkmark" size={24} color="#3498db" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content}>
//         {/* Basic Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Basic Information</Text>
          
//           <TextInput
//             style={styles.input}
//             placeholder="Maintenance Title *"
//             placeholderTextColor="#95a5a6"
//             value={formData.title}
//             onChangeText={(text) => setFormData({...formData, title: text})}
//           />

//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Description *"
//             placeholderTextColor="#95a5a6"
//             multiline
//             numberOfLines={4}
//             value={formData.description}
//             onChangeText={(text) => setFormData({...formData, description: text})}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Technician Name"
//             placeholderTextColor="#95a5a6"
//             value={formData.technician}
//             onChangeText={(text) => setFormData({...formData, technician: text})}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Location"
//             placeholderTextColor="#95a5a6"
//             value={formData.location}
//             onChangeText={(text) => setFormData({...formData, location: text})}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Equipment"
//             placeholderTextColor="#95a5a6"
//             value={formData.equipment}
//             onChangeText={(text) => setFormData({...formData, equipment: text})}
//           />

//           <TouchableOpacity 
//             style={styles.dateButton}
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Ionicons name="calendar" size={20} color="#3498db" />
//             <Text style={styles.dateButtonText}>
//               Date: {date.toLocaleDateString()}
//             </Text>
//           </TouchableOpacity>

//           {showDatePicker && (
//             <DateTimePicker
//               value={date}
//               mode="date"
//               display="default"
//               onChange={(event, selectedDate) => {
//                 setShowDatePicker(false);
//                 if (selectedDate) {
//                   setDate(selectedDate);
//                 }
//               }}
//             />
//           )}
//         </View>

//         {/* Maintenance Details */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Maintenance Details</Text>
          
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerLabel}>Maintenance Type</Text>
//             <View style={styles.pickerOptions}>
//               {maintenanceTypes.map((type) => (
//                 <TouchableOpacity
//                   key={type.value}
//                   style={[
//                     styles.pickerOption,
//                     formData.maintenanceType === type.value && styles.pickerOptionSelected
//                   ]}
//                   onPress={() => setFormData({...formData, maintenanceType: type.value})}
//                 >
//                   <Text style={[
//                     styles.pickerOptionText,
//                     formData.maintenanceType === type.value && styles.pickerOptionTextSelected
//                   ]}>
//                     {type.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerLabel}>Priority</Text>
//             <View style={styles.pickerOptions}>
//               {priorityLevels.map((priority) => (
//                 <TouchableOpacity
//                   key={priority.value}
//                   style={[
//                     styles.priorityOption,
//                     formData.priority === priority.value && { backgroundColor: priority.color }
//                   ]}
//                   onPress={() => setFormData({...formData, priority: priority.value})}
//                 >
//                   <Text style={styles.priorityOptionText}>
//                     {priority.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerLabel}>Status</Text>
//             <View style={styles.pickerOptions}>
//               {statusOptions.map((status) => (
//                 <TouchableOpacity
//                   key={status.value}
//                   style={[
//                     styles.pickerOption,
//                     formData.status === status.value && styles.pickerOptionSelected
//                   ]}
//                   onPress={() => setFormData({...formData, status: status.value})}
//                 >
//                   <Text style={[
//                     styles.pickerOptionText,
//                     formData.status === status.value && styles.pickerOptionTextSelected
//                   ]}>
//                     {status.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         </View>

//         {/* Before Media */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Before Maintenance</Text>
//           <View style={styles.mediaButtons}>
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => takePicture('before')}
//             >
//               <Ionicons name="camera" size={20} color="#ffffff" />
//               <Text style={styles.mediaButtonText}>Take Photo</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => pickImage('before')}
//             >
//               <Ionicons name="image" size={20} color="#ffffff" />
//               <Text style={styles.mediaButtonText}>Choose from Library</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView horizontal style={styles.mediaList}>
//             {beforeMedia.map((item, index) => renderMediaItem(item, index, 'before'))}
//           </ScrollView>
//         </View>

//         {/* After Media */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>After Maintenance</Text>
//           <View style={styles.mediaButtons}>
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => takePicture('after')}
//             >
//               <Ionicons name="camera" size={20} color="#ffffff" />
//               <Text style={styles.mediaButtonText}>Take Photo</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => pickImage('after')}
//             >
//               <Ionicons name="image" size={20} color="#ffffff" />
//               <Text style={styles.mediaButtonText}>Choose from Library</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView horizontal style={styles.mediaList}>
//             {afterMedia.map((item, index) => renderMediaItem(item, index, 'after'))}
//           </ScrollView>
//         </View>

//         {/* Audio Notes */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Audio Notes</Text>
//           <TouchableOpacity 
//             style={[styles.mediaButton, isRecording && styles.recordingButton]}
//             onPress={isRecording ? stopRecording : startRecording}
//           >
//             <Ionicons 
//               name={isRecording ? "stop" : "mic"} 
//               size={20} 
//               color="#ffffff" 
//             />
//             <Text style={styles.mediaButtonText}>
//               {isRecording ? 'Stop Recording' : 'Start Recording'}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.audioList}>
//             {audioRecordings.map((item, index) => renderAudioItem(item, index))}
//           </View>
//         </View>

//         {/* Additional Notes */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Additional Notes</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Any additional notes or observations..."
//             placeholderTextColor="#95a5a6"
//             multiline
//             numberOfLines={3}
//             value={formData.notes}
//             onChangeText={(text) => setFormData({...formData, notes: text})}
//           />
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitButtonText}>Create Maintenance Record</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#000000',
//     padding: 16,
//     paddingTop: 50,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333333',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#ffffff',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   section: {
//     marginBottom: 24,
//     backgroundColor: '#1a1a1a',
//     padding: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#333333',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#ffffff',
//     marginBottom: 16,
//   },
//   input: {
//     backgroundColor: '#2c3e50',
//     color: '#ffffff',
//     padding: 12,
//     borderRadius: 6,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#34495e',
//   },
//   textArea: {
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   dateButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2c3e50',
//     padding: 12,
//     borderRadius: 6,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#34495e',
//   },
//   dateButtonText: {
//     color: '#ffffff',
//     marginLeft: 8,
//   },
//   pickerContainer: {
//     marginBottom: 16,
//   },
//   pickerLabel: {
//     color: '#bdc3c7',
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   pickerOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   pickerOption: {
//     padding: 12,
//     borderRadius: 6,
//     backgroundColor: '#2c3e50',
//     borderWidth: 1,
//     borderColor: '#34495e',
//   },
//   pickerOptionSelected: {
//     backgroundColor: '#3498db',
//     borderColor: '#2980b9',
//   },
//   pickerOptionText: {
//     color: '#ffffff',
//   },
//   pickerOptionTextSelected: {
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   priorityOption: {
//     padding: 12,
//     borderRadius: 6,
//     minWidth: 80,
//     alignItems: 'center',
//   },
//   priorityOptionText: {
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   mediaButtons: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   mediaButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3498db',
//     padding: 12,
//     borderRadius: 6,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   recordingButton: {
//     backgroundColor: '#e74c3c',
//   },
//   mediaButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   mediaList: {
//     marginBottom: 8,
//   },
//   mediaItem: {
//     marginRight: 12,
//     position: 'relative',
//   },
//   mediaImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: '#2c3e50',
//   },
//   videoPlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: '#2c3e50',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoText: {
//     color: '#3498db',
//     marginTop: 4,
//   },
//   watermarkText: {
//     fontSize: 10,
//     color: '#7f8c8d',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   removeMediaButton: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//   },
//   audioItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2c3e50',
//     padding: 12,
//     borderRadius: 6,
//     marginBottom: 8,
//   },
//   audioInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   audioDuration: {
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   audioList: {
//     marginTop: 8,
//   },
//   submitButton: {
//     backgroundColor: '#27ae60',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   submitButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000000',
//   },
//   loadingText: {
//     color: '#ffffff',
//     marginTop: 16,
//   },
// });

// export default CreateMaintenance;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateMaintenance = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technician: '',
    maintenanceType: 'preventive',
    priority: 'medium',
    status: 'completed',
    location: '',
    equipment: '',
    notes: ''
  });

  const [beforeMedia, setBeforeMedia] = useState([]);
  const [afterMedia, setAfterMedia] = useState([]);
  const [audioRecordings, setAudioRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentMediaType, setCurrentMediaType] = useState('before');
  const [isLoading, setIsLoading] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const audioRecorder = useRef(null);

  const maintenanceTypes = [
    { value: 'preventive', label: 'Preventive Maintenance' },
    { value: 'corrective', label: 'Corrective Maintenance' },
    { value: 'emergency', label: 'Emergency Repair' },
    { value: 'inspection', label: 'Inspection' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: '#2ecc71' },
    { value: 'medium', label: 'Medium', color: '#f39c12' },
    { value: 'high', label: 'High', color: '#e74c3c' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const requestMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      
      if (cameraStatus !== 'granted' || audioStatus !== 'granted') {
        Alert.alert('Sorry, we need these permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  const takePicture = async (type) => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageWithWatermark = {
          uri: result.assets[0].uri,
          timestamp: new Date().toISOString(),
          type: 'image',
          watermark: `FibraOpticaApp - ${new Date().toLocaleString()}`
        };

        if (type === 'before') {
          setBeforeMedia(prev => [...prev, imageWithWatermark]);
        } else {
          setAfterMedia(prev => [...prev, imageWithWatermark]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const pickImage = async (type) => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const media = {
          uri: result.assets[0].uri,
          timestamp: new Date().toISOString(),
          type: result.assets[0].type,
          watermark: `FibraOpticaApp - ${new Date().toLocaleString()}`
        };

        if (type === 'before') {
          setBeforeMedia(prev => [...prev, media]);
        } else {
          setAfterMedia(prev => [...prev, media]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      await recording.startAsync();
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setRecording(null);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    const newRecording = {
      uri,
      timestamp: new Date().toISOString(),
      duration: recording.getDurationMillis(),
      watermark: `FibraOpticaApp - ${new Date().toLocaleString()}`
    };

    setAudioRecordings(prev => [...prev, newRecording]);
  };

  const removeMedia = (index, type) => {
    if (type === 'before') {
      setBeforeMedia(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'after') {
      setAfterMedia(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'audio') {
      setAudioRecordings(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Simular envío de datos
      const maintenanceRecord = {
        ...formData,
        date: date.toISOString(),
        beforeMedia,
        afterMedia,
        audioRecordings,
        createdAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      console.log('Maintenance record:', maintenanceRecord);

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        'Maintenance record created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create maintenance record');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMediaItem = (item, index, type) => (
    <View key={index} style={styles.mediaItem}>
      {item.type === 'image' || item.type === undefined ? (
        <Image source={{ uri: item.uri }} style={styles.mediaImage} />
      ) : (
        <View style={styles.videoPlaceholder}>
          <Ionicons name="videocam" size={32} color="#3498db" />
          <Text style={styles.videoText}>Video</Text>
        </View>
      )}
      <Text style={styles.watermarkText}>{item.watermark}</Text>
      <TouchableOpacity
        style={styles.removeMediaButton}
        onPress={() => removeMedia(index, type)}
      >
        <Ionicons name="close-circle" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  const renderAudioItem = (item, index) => (
    <View key={index} style={styles.audioItem}>
      <Ionicons name="mic" size={24} color="#3498db" />
      <View style={styles.audioInfo}>
        <Text style={styles.audioDuration}>
          Duration: {Math.round(item.duration / 1000)}s
        </Text>
        <Text style={styles.watermarkText}>{item.watermark}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeMediaButton}
        onPress={() => removeMedia(index, 'audio')}
      >
        <Ionicons name="close-circle" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Creating maintenance record...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Create Maintenance</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Ionicons name="checkmark" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Maintenance Title *"
            placeholderTextColor="#7f8c8d"
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description *"
            placeholderTextColor="#7f8c8d"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
          />

          <TextInput
            style={styles.input}
            placeholder="Technician Name"
            placeholderTextColor="#7f8c8d"
            value={formData.technician}
            onChangeText={(text) => setFormData({...formData, technician: text})}
          />

          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#7f8c8d"
            value={formData.location}
            onChangeText={(text) => setFormData({...formData, location: text})}
          />

          <TextInput
            style={styles.input}
            placeholder="Equipment"
            placeholderTextColor="#7f8c8d"
            value={formData.equipment}
            onChangeText={(text) => setFormData({...formData, equipment: text})}
          />

          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#3498db" />
            <Text style={styles.dateButtonText}>
              Date: {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Maintenance Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maintenance Details</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Maintenance Type</Text>
            <View style={styles.pickerOptions}>
              {maintenanceTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.pickerOption,
                    formData.maintenanceType === type.value && styles.pickerOptionSelected
                  ]}
                  onPress={() => setFormData({...formData, maintenanceType: type.value})}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.maintenanceType === type.value && styles.pickerOptionTextSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Priority</Text>
            <View style={styles.pickerOptions}>
              {priorityLevels.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityOption,
                    formData.priority === priority.value && { backgroundColor: priority.color }
                  ]}
                  onPress={() => setFormData({...formData, priority: priority.value})}
                >
                  <Text style={styles.priorityOptionText}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Status</Text>
            <View style={styles.pickerOptions}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.pickerOption,
                    formData.status === status.value && styles.pickerOptionSelected
                  ]}
                  onPress={() => setFormData({...formData, status: status.value})}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.status === status.value && styles.pickerOptionTextSelected
                  ]}>
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Before Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before Maintenance</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => takePicture('before')}
            >
              <Ionicons name="camera" size={20} color="#ffffff" />
              <Text style={styles.mediaButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => pickImage('before')}
            >
              <Ionicons name="image" size={20} color="#ffffff" />
              <Text style={styles.mediaButtonText}>Choose from Library</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal style={styles.mediaList}>
            {beforeMedia.map((item, index) => renderMediaItem(item, index, 'before'))}
          </ScrollView>
        </View>

        {/* After Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>After Maintenance</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => takePicture('after')}
            >
              <Ionicons name="camera" size={20} color="#ffffff" />
              <Text style={styles.mediaButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => pickImage('after')}
            >
              <Ionicons name="image" size={20} color="#ffffff" />
              <Text style={styles.mediaButtonText}>Choose from Library</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal style={styles.mediaList}>
            {afterMedia.map((item, index) => renderMediaItem(item, index, 'after'))}
          </ScrollView>
        </View>

        {/* Audio Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio Notes</Text>
          <TouchableOpacity 
            style={[styles.mediaButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons 
              name={isRecording ? "stop" : "mic"} 
              size={20} 
              color="#ffffff" 
            />
            <Text style={styles.mediaButtonText}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>

          <View style={styles.audioList}>
            {audioRecordings.map((item, index) => renderAudioItem(item, index))}
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any additional notes or observations..."
            placeholderTextColor="#7f8c8d"
            multiline
            numberOfLines={3}
            value={formData.notes}
            onChangeText={(text) => setFormData({...formData, notes: text})}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Maintenance Record</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dce4ec',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dce4ec',
  },
  dateButtonText: {
    color: '#2c3e50',
    marginLeft: 8,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  pickerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#dce4ec',
  },
  pickerOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  pickerOptionText: {
    color: '#2c3e50',
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  priorityOption: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  priorityOptionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: '#e74c3c',
  },
  mediaButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  mediaList: {
    marginBottom: 8,
  },
  mediaItem: {
    marginRight: 12,
    position: 'relative',
  },
  mediaImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  videoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: '#3498db',
    marginTop: 4,
    fontSize: 12,
  },
  watermarkText: {
    fontSize: 10,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dce4ec',
  },
  audioInfo: {
    flex: 1,
    marginLeft: 12,
  },
  audioDuration: {
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: 14,
  },
  audioList: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    color: '#2c3e50',
    marginTop: 16,
    fontSize: 16,
  },
});

export default CreateMaintenance;