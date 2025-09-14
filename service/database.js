// service/database.js
import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log('🟡 Iniciando base de datos...');
      
      // Abrir la base de datos con la API moderna
      db = SQLite.openDatabaseSync('fiberoptics_network.db');
      
      console.log('✅ Base de datos abierta');
      
      // Crear todas las tablas usando execSync
      try {
        // Ejecutar cada sentencia SQL por separado
        const createTablesSQL = [
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            token TEXT,
            password TEXT NOT NULL,
            telefono TEXT,
            email TEXT NOT NULL UNIQUE,
            status INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted_at DATETIME
          )`,

          `CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT,
            city TEXT,
            country TEXT,
            state TEXT,
            description TEXT,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,

          `CREATE TABLE IF NOT EXISTS type_project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            build_type TEXT,
            job_type TEXT,
            building_type TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
          )`,

          `CREATE TABLE IF NOT EXISTS nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('MDF', 'pedestal', 'IDF', 'unit', 'splitter', 'closure', 'terminal')),
            latitude REAL,
            longitude REAL,
            address TEXT,
            description TEXT,
            port_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            parent_node_id INTEGER,
            level INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id),
            FOREIGN KEY (parent_node_id) REFERENCES nodes (id)
          )`,

          `CREATE TABLE IF NOT EXISTS connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            source_node_id INTEGER NOT NULL,
            target_node_id INTEGER NOT NULL,
            fiber_count INTEGER DEFAULT 1,
            fiber_type TEXT DEFAULT 'SMF',
            distance REAL,
            loss REAL,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id),
            FOREIGN KEY (source_node_id) REFERENCES nodes (id),
            FOREIGN KEY (target_node_id) REFERENCES nodes (id),
            UNIQUE(source_node_id, target_node_id)
          )`,

          `CREATE TABLE IF NOT EXISTS units (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            node_id INTEGER NOT NULL UNIQUE,
            unit_name TEXT NOT NULL,
            customer_name TEXT,
            customer_phone TEXT,
            customer_email TEXT,
            status TEXT DEFAULT 'available',
            subscription_type TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id),
            FOREIGN KEY (node_id) REFERENCES nodes (id)
          )`,

          `CREATE TABLE IF NOT EXISTS units_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            living_unit TEXT,
            office_amenities TEXT,
            commercial_unit TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
          )`,

          `CREATE TABLE IF NOT EXISTS settings_app (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            language TEXT DEFAULT 'es',
            mode TEXT DEFAULT 'light',
            current_project_id INTEGER,
            sync_enabled INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (current_project_id) REFERENCES projects (id)
          )`,

          `INSERT OR IGNORE INTO settings_app (language, mode) VALUES ('es', 'light')`
        ];

        // Ejecutar cada sentencia SQL por separado
        createTablesSQL.forEach(sql => {
          db.execSync(sql);
        });
        
        console.log('🎉 Todas las tablas del modelo de grafo creadas correctamente');
        resolve(db);
        
      } catch (sqlError) {
        console.log('❌ Error en SQL:', sqlError);
        reject(sqlError);
      }
      
    } catch (error) {
      console.log('❌ Error crítico al abrir base de datos:', error);
      reject(error);
    }
  });
};

// Función para ejecutar queries con la API moderna - CORREGIDA
export const executeSql = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      // La API moderna espera un array de objetos { sql, args }
      const results = db.execSync([{ sql, args: params }]);
      resolve(results[0]); // Devuelve el primer resultado
    } catch (error) {
      console.log('❌ Error en executeSql:', error);
      reject(error);
    }
  });
};

// Funciones CRUD básicas - ACTUALIZADAS
export const insertData = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  
  try {
    const result = await executeSql(sql, values);
    return result;
  } catch (error) {
    console.log('Error en insertData:', error);
    throw error;
  }
};

export const selectData = async (table, where = '', params = []) => {
  const whereClause = where ? `WHERE ${where}` : '';
  const sql = `SELECT * FROM ${table} ${whereClause}`;
  
  try {
    const result = await executeSql(sql, params);
    return result;
  } catch (error) {
    console.log('Error en selectData:', error);
    throw error;
  }
};

export const updateData = async (table, data, where, whereParams) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
  
  try {
    const result = await executeSql(sql, [...values, ...whereParams]);
    return result;
  } catch (error) {
    console.log('Error en updateData:', error);
    throw error;
  }
};

export const deleteData = async (table, where, whereParams) => {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  
  try {
    const result = await executeSql(sql, whereParams);
    return result;
  } catch (error) {
    console.log('Error en deleteData:', error);
    throw error;
  }
};

// Helper para procesar resultados - ACTUALIZADO
export const processResult = (result) => {
  if (!result) return { rows: [] };
  
  return {
    rows: {
      length: result.rows ? result.rows.length : 0,
      _array: result.rows || [],
      item: (index) => result.rows ? result.rows[index] : null
    },
    insertId: result.insertId || 0,
    rowsAffected: result.rowsAffected || 0
  };
};

// OPERACIONES ESPECÍFICAS DEL MODELO DE GRAFO - ACTUALIZADAS
export const graphOperations = {
  // Crear un nuevo nodo en el grafo
  createNode: async (nodeData) => {
    const { project_id, name, type, latitude, longitude, address, description, parent_node_id } = nodeData;
    
    // Calcular el nivel basado en el nodo padre
    let level = 0;
    if (parent_node_id) {
      try {
        const parentResult = await executeSql(
          'SELECT level FROM nodes WHERE id = ?',
          [parent_node_id]
        );
        if (parentResult.rows && parentResult.rows.length > 0) {
          level = parentResult.rows[0].level + 1;
        }
      } catch (error) {
        console.log('Error calculando nivel:', error);
      }
    }

    return insertData('nodes', {
      project_id,
      name,
      type,
      latitude: latitude || null,
      longitude: longitude || null,
      address: address || null,
      description: description || null,
      parent_node_id: parent_node_id || null,
      level,
      status: 'active'
    });
  },

  // Crear una conexión entre nodos
  createConnection: async (connectionData) => {
    const { project_id, source_node_id, target_node_id, fiber_count, fiber_type, distance, loss } = connectionData;
    
    return insertData('connections', {
      project_id,
      source_node_id,
      target_node_id,
      fiber_count: fiber_count || 1,
      fiber_type: fiber_type || 'SMF',
      distance: distance || 0,
      loss: loss || 0,
      status: 'active'
    });
  },

  // Obtener el árbol completo de un proyecto
  getProjectTree: async (projectId) => {
    try {
      const nodesResult = await executeSql(
        `SELECT * FROM nodes WHERE project_id = ? ORDER BY level, name`,
        [projectId]
      );

      const connectionsResult = await executeSql(
        `SELECT * FROM connections WHERE project_id = ?`,
        [projectId]
      );

      return { 
        nodes: nodesResult.rows || [], 
        connections: connectionsResult.rows || [] 
      };
    } catch (error) {
      console.log('Error obteniendo árbol del proyecto:', error);
      return { nodes: [], connections: [] };
    }
  },

  // Obtener nodos por tipo
  getNodesByType: async (projectId, nodeType) => {
    try {
      const result = await executeSql(
        `SELECT * FROM nodes WHERE project_id = ? AND type = ? AND status = 'active'`,
        [projectId, nodeType]
      );
      return result.rows || [];
    } catch (error) {
      console.log('Error obteniendo nodos por tipo:', error);
      return [];
    }
  },

  // Obtener el MDF raíz de un proyecto
  getRootMDF: async (projectId) => {
    try {
      const result = await executeSql(
        `SELECT * FROM nodes WHERE project_id = ? AND type = 'MDF' AND parent_node_id IS NULL`,
        [projectId]
      );
      return result.rows || [];
    } catch (error) {
      console.log('Error obteniendo MDF raíz:', error);
      return [];
    }
  },

  // Obtener todas las conexiones de un nodo
  getNodeConnections: async (nodeId) => {
    try {
      const result = await executeSql(
        `SELECT c.*, 
         sn.name as source_name, tn.name as target_name
         FROM connections c
         JOIN nodes sn ON c.source_node_id = sn.id
         JOIN nodes tn ON c.target_node_id = tn.id
         WHERE c.source_node_id = ? OR c.target_node_id = ?`,
        [nodeId, nodeId]
      );
      return result.rows || [];
    } catch (error) {
      console.log('Error obteniendo conexiones del nodo:', error);
      return [];
    }
  }
};

// Función para verificar el estado de la base de datos
export const checkDatabaseStatus = async () => {
  try {
    const result = await executeSql("SELECT name FROM sqlite_master WHERE type='table'");
    const tables = result.rows ? result.rows.map(r => r.name) : [];
    console.log('Tablas en la base de datos:', tables);
    return tables.length > 0;
  } catch (error) {
    console.log('Error verificando base de datos:', error);
    return false;
  }
};

export const getDatabase = () => db;

export default db;