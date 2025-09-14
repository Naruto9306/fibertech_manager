// services/storage/FileService.js
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FILES_KEY = 'project_files';

export const FileService = {
  // Guardar archivo adjunto
  async saveProjectFile(projectId, file) {
    try {
      // Leer el contenido del archivo
      const fileContent = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileData = {
        id: Date.now().toString(),
        projectId,
        name: file.name,
        type: file.type,
        size: file.size,
        content: fileContent,
        uploaded: new Date().toISOString(),
      };

      // Guardar en AsyncStorage
      const existingFiles = await this.getProjectFiles(projectId);
      const updatedFiles = [...existingFiles, fileData];
      
      await AsyncStorage.setItem(
        `${FILES_KEY}_${projectId}`,
        JSON.stringify(updatedFiles)
      );

      return fileData;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  },

  // Obtener archivos de un proyecto
  async getProjectFiles(projectId) {
    try {
      const filesJson = await AsyncStorage.getItem(`${FILES_KEY}_${projectId}`);
      return filesJson ? JSON.parse(filesJson) : [];
    } catch (error) {
      console.error('Error getting files:', error);
      return [];
    }
  },

  // Eliminar archivo
  async deleteFile(projectId, fileId) {
    try {
      const files = await this.getProjectFiles(projectId);
      const updatedFiles = files.filter(file => file.id !== fileId);
      
      await AsyncStorage.setItem(
        `${FILES_KEY}_${projectId}`,
        JSON.stringify(updatedFiles)
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  },

  // Descargar archivo
  async downloadFile(file, fileName = null) {
    try {
      const fileUri = FileSystem.documentDirectory + (fileName || file.name);
      
      await FileSystem.writeAsStringAsync(fileUri, file.content, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return fileUri;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },
};