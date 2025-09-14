// service/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys para AsyncStorage
const STORAGE_KEYS = {
  PROJECTS: '@fibraoptica/projects',
  UNITS_INFO: '@fibraoptica/units_info',
  PROJECT_TYPES: '@fibraoptica/project_types',
  NODES: '@fibraoptica/nodes',
  CONNECTIONS: '@fibraoptica/connections',
  DEVICE_CONFIG: '@fibraoptica/device_config',
  FIBER_CONFIG: '@fibraoptica/fiber_config'
};

// Helper functions
export const StorageService = {
  // Guardar datos
  setItem: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('❌ Error saving to storage:', error);
      throw error;
    }
  },

  // Obtener datos
  getItem: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('❌ Error reading from storage:', error);
      return null;
    }
  },

  // Eliminar datos
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('❌ Error removing from storage:', error);
      throw error;
    }
  },

  // Obtener todas las keys
  getAllKeys: async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('❌ Error getting keys:', error);
      return [];
    }
  }
};

// Project operations
export const ProjectService = {
  // Crear nuevo proyecto
  createProject: async (projectData) => {
    try {
      const projects = await ProjectService.getProjects();
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      projects.push(newProject);
      await StorageService.setItem(STORAGE_KEYS.PROJECTS, projects);

      return newProject;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }
  },

  // Obtener todos los proyectos
  getProjects: async () => {
    try {
      const projects = await StorageService.getItem(STORAGE_KEYS.PROJECTS);
      return projects || [];
    } catch (error) {
      console.error('❌ Error getting projects:', error);
      return [];
    }
  },

  // Obtener proyecto por ID
  getProjectById: async (projectId) => {
    try {
      const projects = await ProjectService.getProjects();
      return projects.find(project => project.id === projectId) || null;
    } catch (error) {
      console.error('❌ Error getting project:', error);
      return null;
    }
  },

  // Actualizar proyecto
  updateProject: async (projectId, updates) => {
    try {
      const projects = await ProjectService.getProjects();
      const projectIndex = projects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error('Project not found');
      }

      projects[projectIndex] = {
        ...projects[projectIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await StorageService.setItem(STORAGE_KEYS.PROJECTS, projects);
      return projects[projectIndex];
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }
  }
};

// Device configuration operations
export const DeviceConfigService = {
  // Guardar configuración de dispositivos
//   saveDeviceConfig: async (projectId, devices) => {
//     try {
//       const allConfigs = await StorageService.getItem(STORAGE_KEYS.DEVICE_CONFIG) || {};
//       allConfigs[projectId] = devices;
//       await StorageService.setItem(STORAGE_KEYS.DEVICE_CONFIG, allConfigs);
//       return true;
//     } catch (error) {
//       console.error('❌ Error saving device config:', error);
//       throw error;
//     }
//   },

//   // Obtener configuración de dispositivos
//   getDeviceConfig: async (projectId) => {
//     try {
//       const allConfigs = await StorageService.getItem(STORAGE_KEYS.DEVICE_CONFIG) || {};
//       return allConfigs[projectId] || [];
//     } catch (error) {
//       console.error('❌ Error getting device config:', error);
//       return [];
//     }
//   }
saveDeviceConfig: async (projectId, devices) => {
    try {
      const key = `deviceConfig_${projectId}`;
      // Asegurar que guardamos un array
      const devicesArray = Array.isArray(devices) ? devices : [];
      await AsyncStorage.setItem(key, JSON.stringify(devicesArray));
      return true;
    } catch (error) {
      console.error('Error saving device config:', error);
      return false;
    }
  },

  // Obtener configuración de dispositivos
  getDeviceConfig: async (projectId) => {
    try {
      const key = `deviceConfig_${projectId}`;
      const data = await AsyncStorage.getItem(key);
      
      if (!data) return [];
      
      const parsedData = JSON.parse(data);
      
      // Asegurar que siempre devolvemos un array
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
      
      // Si es un objeto, convertirlo a array
      if (typeof parsedData === 'object') {
        return Object.values(parsedData);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting device config:', error);
      return [];
    }
  }
};

// Fiber configuration operations
export const FiberConfigService = {
  // Guardar configuración de fibras
//   saveFiberConfig: async (projectId, fibers) => {
//     try {
//       const allConfigs = await StorageService.getItem(STORAGE_KEYS.FIBER_CONFIG) || {};
//       allConfigs[projectId] = fibers;
//       await StorageService.setItem(STORAGE_KEYS.FIBER_CONFIG, allConfigs);
//       return true;
//     } catch (error) {
//       console.error('❌ Error saving fiber config:', error);
//       throw error;
//     }
//   },

//   // Obtener configuración de fibras
//   getFiberConfig: async (projectId) => {
//     try {
//       const allConfigs = await StorageService.getItem(STORAGE_KEYS.FIBER_CONFIG) || {};
//       return allConfigs[projectId] || [];
//     } catch (error) {
//       console.error('❌ Error getting fiber config:', error);
//       return [];
//     }
//   }
 // Guardar configuración de fibras
  saveFiberConfig: async (projectId, fibers) => {
    try {
      const key = `fiberConfig_${projectId}`;
      // Asegurar que guardamos un array
      const fibersArray = Array.isArray(fibers) ? fibers : [];
      await AsyncStorage.setItem(key, JSON.stringify(fibersArray));
      return true;
    } catch (error) {
      console.error('Error saving fiber config:', error);
      return false;
    }
  },

  // Obtener configuración de fibras
  getFiberConfig: async (projectId) => {
    try {
      const key = `fiberConfig_${projectId}`;
      const data = await AsyncStorage.getItem(key);
      
      if (!data) return [];
      
      const parsedData = JSON.parse(data);
      
      // Asegurar que siempre devolvemos un array
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
      
      // Si es un objeto, convertirlo a array
      if (typeof parsedData === 'object') {
        return Object.values(parsedData);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting fiber config:', error);
      return [];
    }
  }
};

// Units info operations
export const UnitsService = {
  // Guardar información de unidades
  saveUnitsInfo: async (projectId, unitsInfo) => {
    try {
      const allUnitsInfo = await StorageService.getItem(STORAGE_KEYS.UNITS_INFO) || {};
      allUnitsInfo[projectId] = {
        ...unitsInfo,
        updatedAt: new Date().toISOString()
      };
      
      await StorageService.setItem(STORAGE_KEYS.UNITS_INFO, allUnitsInfo);
      return allUnitsInfo[projectId];
    } catch (error) {
      console.error('❌ Error saving units info:', error);
      throw error;
    }
  },

  // Obtener información de unidades
  getUnitsInfo: async (projectId) => {
    try {
      const allUnitsInfo = await StorageService.getItem(STORAGE_KEYS.UNITS_INFO) || {};
      return allUnitsInfo[projectId] || null;
    } catch (error) {
      console.error('❌ Error getting units info:', error);
      return null;
    }
  }
};

// Project type operations
export const ProjectTypeService = {
  // Guardar tipo de proyecto
  saveProjectType: async (projectId, projectType) => {
    try {
      const allProjectTypes = await StorageService.getItem(STORAGE_KEYS.PROJECT_TYPES) || {};
      allProjectTypes[projectId] = {
        ...projectType,
        updatedAt: new Date().toISOString()
      };
      
      await StorageService.setItem(STORAGE_KEYS.PROJECT_TYPES, allProjectTypes);
      return allProjectTypes[projectId];
    } catch (error) {
      console.error('❌ Error saving project type:', error);
      throw error;
    }
  },

  // Obtener tipo de proyecto
  getProjectType: async (projectId) => {
    try {
      const allProjectTypes = await StorageService.getItem(STORAGE_KEYS.PROJECT_TYPES) || {};
      return allProjectTypes[projectId] || null;
    } catch (error) {
      console.error('❌ Error getting project type:', error);
      return null;
    }
  }
};

// Node operations (Graph)
export const NodeService = {
  // Crear nodo
  createNode: async (nodeData) => {
    try {
      const nodes = await NodeService.getNodes();
      const newNode = {
        id: Date.now().toString(),
        ...nodeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      nodes.push(newNode);
      await StorageService.setItem(STORAGE_KEYS.NODES, nodes);

      return newNode;
    } catch (error) {
      console.error('❌ Error creating node:', error);
      throw error;
    }
  },

  // Obtener todos los nodos
  getNodes: async () => {
    try {
      const nodes = await StorageService.getItem(STORAGE_KEYS.NODES);
      return nodes || [];
    } catch (error) {
      console.error('❌ Error getting nodes:', error);
      return [];
    }
  },

  // Obtener nodos por proyecto
  getNodesByProject: async (projectId) => {
    try {
      const nodes = await NodeService.getNodes();
      return nodes.filter(node => node.project_id === projectId);
    } catch (error) {
      console.error('❌ Error getting nodes by project:', error);
      return [];
    }
  },

  // Obtener nodos por tipo
  getNodesByType: async (projectId, nodeType) => {
    try {
      const nodes = await NodeService.getNodes();
      return nodes.filter(node => 
        node.project_id === projectId && node.type === nodeType
      );
    } catch (error) {
      console.error('❌ Error getting nodes by type:', error);
      return [];
    }
  },

  updateNodeDevice: async (nodeId, device) => {
    try {
      const allNodes = await StorageService.getItem(STORAGE_KEYS.NODES) || [];
      const updatedNodes = allNodes.map(node =>
        node.id === nodeId ? { ...node, device, device_id: device.id } : node
      );
      await StorageService.setItem(STORAGE_KEYS.NODES, updatedNodes);
      return true;
    } catch (error) {
      console.error('Error updating node device:', error);
      throw error;
    }
  },

  updateNodeFiber: async (nodeId, fiber) => {
    try {
      const allNodes = await StorageService.getItem(STORAGE_KEYS.NODES) || [];
      const updatedNodes = allNodes.map(node =>
        node.id === nodeId ? { ...node, fiber, fiber_type: fiber.type } : node
      );
      await StorageService.setItem(STORAGE_KEYS.NODES, updatedNodes);
      return true;
    } catch (error) {
      console.error('Error updating node fiber:', error);
      throw error;
    }
  },

  // Función para actualizar cualquier campo del nodo
  updateNode: async (nodeId, updates) => {
    try {
      const allNodes = await StorageService.getItem(STORAGE_KEYS.NODES) || [];
      const updatedNodes = allNodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      );
      await StorageService.setItem(STORAGE_KEYS.NODES, updatedNodes);
      return true;
    } catch (error) {
      console.error('Error updating node:', error);
      throw error;
    }
  }
};

// Initialize storage
export const initializeStorage = async () => {
  try {
    // Initialize empty arrays for all storage keys
    const keys = Object.values(STORAGE_KEYS);
    
    for (const key of keys) {
      const data = await StorageService.getItem(key);
      if (data === null) {
        if (key === STORAGE_KEYS.UNITS_INFO || key === STORAGE_KEYS.PROJECT_TYPES) {
          await StorageService.setItem(key, {});
        } else {
          await StorageService.setItem(key, []);
        }
      }
    }

    console.log('✅ Storage initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing storage:', error);
    return false;
  }
};

// Export main services
export default {
  StorageService,
  ProjectService,
  UnitsService,
  ProjectTypeService,
  NodeService,
  initializeStorage
};