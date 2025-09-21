import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { NetworkMapService } from '../../service/storage';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { useDevice } from '../context/DeviceContext';

const ViewOnMap = ({ navigation, route, theme }) => {
  const { topInset, isTablet, stylesFull, bottomInset } = useDevice();
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 29.6516,
    longitude: -82.3248,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [savedMaps, setSavedMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMapList, setShowMapList] = useState(true);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);

  const { t } = useTranslation();
  const { isDarkMode } = useApp();

  const colors = {
    background : isDarkMode ? '#121212' : '#ffffff',
    card       : isDarkMode ? '#1e1e1e' : '#ffffff',
    text       : isDarkMode ? '#ffffff' : '#2c3e50',
    subText    : isDarkMode ? '#b0b0b0' : '#7f8c8d',
    border     : isDarkMode ? '#333'    : '#ecf0f1',
    input      : isDarkMode ? '#2a2a2a' : '#ffffff',
  };

  // Cargar mapas guardados
  useEffect(() => {
    loadSavedMaps();
    getLocation();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = savedMaps.filter(map =>
        (map.projectName && map.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (map.projectId && map.projectId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (map.createdAt && map.createdAt.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMaps(filtered);
    } else {
      setFilteredMaps(savedMaps);
    }
  }, [searchQuery, savedMaps]);

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  const validateCoordinates = (lat, lng) => {
    if (lat === null || lng === null || lat === undefined || lng === undefined) {
      return null;
    }

    const latitude = typeof lat === 'string' ? parseFloat(lat) : lat;
    const longitude = typeof lng === 'string' ? parseFloat(lng) : lng;

    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn('Coordenadas inválidas:', lat, lng);
      return null;
    }

    // Validar rango de coordenadas
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      console.warn('Coordenadas fuera de rango:', latitude, longitude);
      return null;
    }

    return { latitude, longitude };
  };

  const loadSavedMaps = async () => {
    try {
      setLoading(true);
      const maps = await NetworkMapService.getAllNetworkMaps();
      setSavedMaps(maps);
      setFilteredMaps(maps);
    } catch (error) {
      console.error('Error loading saved maps:', error);
      Alert.alert(t('error'), t('couldNotLoadMaps'));
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un mapa individual
  const deleteMap = async (map) => {
    Alert.alert(
      t('confirmDelete'),
      t('confirmDeleteMapMessage', { name: getProjectDisplayName(map) }),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await NetworkMapService.deleteNetworkMap(map.id || map.projectId);
              Alert.alert(t('success'), t('mapDeletedSuccessfully'));
              loadSavedMaps(); // Recargar la lista
            } catch (error) {
              console.error('Error deleting map:', error);
              Alert.alert(t('error'), t('couldNotDeleteMap'));
            }
          }
        }
      ]
    );
  };

  // Función para eliminar todos los mapas
  const deleteAllMaps = async () => {
    if (savedMaps.length === 0) {
      Alert.alert(t('info'), t('noMapsToDelete'));
      return;
    }

    Alert.alert(
      t('confirmDeleteAll'),
      t('confirmDeleteAllMapsMessage', { count: savedMaps.length }),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('deleteAll'),
          style: 'destructive',
          onPress: async () => {
            try {
              for (const map of savedMaps) {
                await NetworkMapService.deleteNetworkMap(map.id || map.projectId);
              }
              Alert.alert(t('success'), t('allMapsDeletedSuccessfully'));
              loadSavedMaps(); // Recargar la lista
            } catch (error) {
              console.error('Error deleting all maps:', error);
              Alert.alert(t('error'), t('couldNotDeleteAllMaps'));
            }
          }
        }
      ]
    );
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const selectMap = (map) => {
    // Alert.alert('✅ ' + t('success'), t('viewmap'));
    // Metodo para abrir el mapa en la app de mapas predeterminada
    setSelectedMap(map);
    setShowMapList(false);
    
    // Filtrar nodos con coordenadas válidas
    const validNodes = map.nodes?.filter(node => 
      validateCoordinates(node.latitude, node.longitude)
    ) || [];

    if (validNodes.length > 0 && mapRef.current && isMapReady) {
      const coordinates = validNodes.map(node => ({
        latitude: node.latitude,
        longitude: node.longitude
      }));
      
      const { minLat, maxLat, minLng, maxLng } = calculateBoundingBox(coordinates);
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      const latDelta = (maxLat - minLat) * 1.2;
      const lngDelta = (maxLng - minLng) * 1.2;
      const minDelta = 0.01;
      
      setRegion({
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: Math.max(latDelta, minDelta),
        longitudeDelta: Math.max(lngDelta, minDelta),
      });

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta: Math.max(latDelta, minDelta),
            longitudeDelta: Math.max(lngDelta, minDelta),
          }, 1000);
        }
      }, 100);
    }
  };

  // Función para calcular el bounding box
  const calculateBoundingBox = (coordinates) => {
    if (!coordinates || coordinates.length === 0) {
      return {
        minLat: 0,
        maxLat: 0,
        minLng: 0,
        maxLng: 0
      };
    }

    let minLat = coordinates[0].latitude;
    let maxLat = coordinates[0].latitude;
    let minLng = coordinates[0].longitude;
    let maxLng = coordinates[0].longitude;

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.latitude);
      maxLat = Math.max(maxLat, coord.latitude);
      minLng = Math.min(minLng, coord.longitude);
      maxLng = Math.max(maxLng, coord.longitude);
    });

    return { minLat, maxLat, minLng, maxLng };
  };

  const zoomIn = () => {
    if (mapRef.current && isMapReady) {
      mapRef.current.animateCamera({
        center: region,
        zoom: 1,
      });
    }
  };

  const zoomOut = () => {
    if (mapRef.current && isMapReady) {
      mapRef.current.animateCamera({
        center: region,
        zoom: -1,
      });
    }
  };

  const focusOnNode = (node) => {
    const coords = validateCoordinates(node.latitude, node.longitude);
    if (!coords) {
      Alert.alert(t('error'), t('invalidCoordinatesForNode'));
      return;
    }

    if (mapRef.current && isMapReady) {
      mapRef.current.animateCamera({
        center: coords,
        zoom: 15,
      });
      setSelectedNode(node);
      setModalVisible(true);
    }
  };

  const focusOnUserLocation = () => {
    if (mapRef.current && userLocation && isMapReady) {
      mapRef.current.animateCamera({
        center: userLocation,
        zoom: 15,
      });
    } else {
      Alert.alert(t('location'), t('userLocationNotAvailable'));
    }
  };

  const getNodeConnections = () => {
    if (!selectedMap || !selectedMap.connections) return [];
    
    return selectedMap.connections.filter(connection => {
      const fromCoords = validateCoordinates(connection.from.latitude, connection.from.longitude);
      const toCoords = validateCoordinates(connection.to.latitude, connection.to.longitude);
      return fromCoords && toCoords;
    });
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'MDF': return 'server';
      case 'pedestal': return 'cube';
      case 'unit': return 'home';
      default: return 'help';
    }
  };

  const getNodeColor = (status) => {
    switch (status) {
      case 'active': return '#2ecc71';
      case 'maintenance': return '#f39c12';
      case 'inactive': return '#e74c3c';
      case 'MDF': return '#e74c3c';
      case 'pedestal': return '#3498db';
      case 'unit': return '#f39c12';
      default: return '#3498db';
    }
  };

  const getNodeStatus = (node) => {
    return node.status || 'active';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getProjectDisplayName = (map) => {
    // Mostrar el nombre del proyecto si está disponible, de lo contrario usar el ID
    return map.name || map.projectId || t('unnamedProject');
  };

  const renderMapItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.mapItem}
      onPress={() => selectMap(item)}
    >
      <View style={styles.mapItemHeader}>
        <Ionicons name="map" size={24} color="#3498db" />
        <Text style={[styles.mapItemTitle, { color: colors.text }]}>
          {getProjectDisplayName(item)}
        </Text>
        <TouchableOpacity 
          onPress={() => deleteMap(item)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.mapItemDetails}>
        <View style={styles.mapItemDetail}>
          <Ionicons name="location" size={16} color="#7f8c8d" />
          <Text style={[styles.mapItemText, { color: colors.subText }]}>
            {item.nodes?.length || 0} {t('nodes')}
          </Text>
        </View>
        
        <View style={styles.mapItemDetail}>
          <Ionicons name="git-merge" size={16} color="#7f8c8d" />
          <Text style={[styles.mapItemText, { color: colors.subText }]}>
            {item.connections?.length || 0} {t('connections')}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.mapItemDate, { color: colors.subText }]}>
        {t('created')}: {formatDate(item.createdAt)}
      </Text>
      
      {item.updatedAt && item.updatedAt !== item.createdAt && (
        <Text style={[styles.mapItemDate, { color: colors.subText }]}>
          {t('updated')}: {formatDate(item.updatedAt)}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={[styles.loadingText, { color: colors.subText }]}>
          {t('loadingSavedMaps')}
        </Text>
      </View>
    );
  }

  if (showMapList) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }, { paddingTop: topInset }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('savedNetworkMaps')}
          </Text>
          <TouchableOpacity onPress={deleteAllMaps} style={styles.deleteAllButton}>
              <Ionicons name="trash" size={24} color="#e74c3c" />
            </TouchableOpacity>
          <TouchableOpacity onPress={loadSavedMaps}>
            <Ionicons name="refresh" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            placeholder={t('searchMapsPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.subText}
            style={[styles.searchInput, { backgroundColor: colors.input, color: colors.text }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#7f8c8d" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Map List */}
        {filteredMaps.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={64} color="#bdc3c7" />
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              {t('noSavedMaps')}
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subText }]}>
              {t('createMapsToSeeHere')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMaps}
            renderItem={renderMapItem}
            keyExtractor={(item) => item.id || item.projectId}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[stylesFull.screen, { backgroundColor: colors.background }, { paddingBottom: bottomInset }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 15 } ]}>
        <TouchableOpacity 
          onPress={() => setShowMapList(true)}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {getProjectDisplayName(selectedMap) || t('networkMap')}
        </Text>
        <TouchableOpacity onPress={getLocation}>
          <Ionicons name="navigate" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={[styles.map]}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onMapReady={handleMapReady}
        // onMapError={(error) => console.log('Error del mapa:', error)}
        // onMarkerPress={(e) => {
        //   console.log('Marker pressed:', e.nativeEvent);
        // }}
        mapPadding={{
        top: topInset,
        right: 0,
        bottom: bottomInset,
        left: 0
      }}
      >
        {/* User Location */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title={t('yourLocation')}
            description={t('currentPosition')}
          >
            <View style={styles.userMarker}>
              <Ionicons name="person" size={16} color="#ffffff" />
            </View>
          </Marker>
        )}

        {/* Project Nodes */}
        {selectedMap?.nodes?.map((node, index) => {
          const coords = validateCoordinates(node.latitude, node.longitude);
          if (!coords) return null;

          return (
            <Marker
              key={node.id || `node-${index}`}
              coordinate={coords}
              title={node.name}
              description={node.type}
              onPress={() => focusOnNode(node)}
            >
              <View style={[styles.marker, { backgroundColor: getNodeColor(getNodeStatus(node)) }]}>
                <Ionicons name={getNodeIcon(node.type)} size={16} color="#ffffff" />
              </View>
            </Marker>
          );
        }).filter(Boolean)}

        {/* Connections */}
        {getNodeConnections().map((connection, index) => (
          <Polyline
            key={index}
            coordinates={[
              { latitude: connection.from.latitude, longitude: connection.from.longitude },
              { latitude: connection.to.latitude, longitude: connection.to.longitude }
            ]}
            strokeColor={getNodeColor(connection.status || 'active')}
            strokeWidth={3}
            lineDashPattern={connection.status === 'inactive' ? [5, 5] : []}
          />
        ))}
      </MapView>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
          <Ionicons name="add" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
          <Ionicons name="remove" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={focusOnUserLocation}>
          <Ionicons name="navigate" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Node Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {selectedNode && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.statusIndicator, { backgroundColor: getNodeColor(getNodeStatus(selectedNode)) }]} />
                  <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedNode.name}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#2c3e50" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScrollView}>
                  <View style={styles.modalBody}>
                    <View style={styles.detailRow}>
                      <Ionicons name={getNodeIcon(selectedNode.type)} size={20} color="#3498db" />
                      <Text style={[styles.detailLabel, { color: colors.subText }]}>{t('type')}:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>{selectedNode.type}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="information-circle" size={20} color="#3498db" />
                      <Text style={[styles.detailLabel, { color: colors.subText }]}>{t('status')}:</Text>
                      <Text style={[styles.detailValue, { color: getNodeColor(getNodeStatus(selectedNode)) }]}>
                        {getNodeStatus(selectedNode).toUpperCase()}
                      </Text>
                    </View>

                    {selectedNode.address && (
                      <View style={styles.detailRow}>
                        <Ionicons name="location" size={20} color="#3498db" />
                        <Text style={[styles.detailLabel, { color: colors.subText }]}>{t('address')}:</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>{selectedNode.address}</Text>
                      </View>
                    )}

                    {selectedNode.owner && (
                      <View style={styles.detailRow}>
                        <Ionicons name="person" size={20} color="#3498db" />
                        <Text style={[styles.detailLabel, { color: colors.subText }]}>{t('owner')}:</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>{selectedNode.owner}</Text>
                      </View>
                    )}

                    {selectedNode.description && (
                      <Text style={[styles.description, { color: colors.text, backgroundColor: colors.card, borderLeftColor: colors.border }]}>
                        {selectedNode.description}
                      </Text>
                    )}

                    {/* Show devices if available */}
                    {selectedNode.devices && selectedNode.devices.length > 0 && (
                      <>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('devices')}:</Text>
                        <View style={styles.sectionContainer}>
                          {selectedNode.devices.map((device, index) => (
                            <View key={index} style={styles.itemCard}>
                              <View style={styles.itemHeader}>
                                <Ionicons name="hardware-chip" size={18} color="#3498db" />
                                <Text style={[styles.itemTitle, { color: colors.text }]}>{device.type}</Text>
                              </View>
                              <View style={styles.itemDetails}>
                                <Text style={[styles.itemDetail, { color: colors.subText }]}>{t('ports')}: {device.ports}</Text>
                                <Text style={[styles.itemDetail, { color: colors.subText }]}>{t('quantity')}: {device.quantity}</Text>
                                {device.model && <Text style={[styles.itemDetail, { color: colors.subText }]}>{t('model')}: {device.model}</Text>}
                              </View>
                            </View>
                          ))}
                        </View>
                      </>
                    )}

                    {/* Show fibers if available */}
                    {selectedNode.fibers && selectedNode.fibers.length > 0 && (
                      <>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('fibers')}:</Text>
                        <View style={styles.sectionContainer}>
                          {selectedNode.fibers.map((fiber, index) => (
                            <View key={index} style={styles.itemCard}>
                              <View style={styles.itemHeader}>
                                <Ionicons name="git-merge" size={18} color="#3498db" />
                                <Text style={[styles.itemTitle, { color: colors.text }]}>{fiber.type}</Text>
                              </View>
                              <View style={styles.itemDetails}>
                                <Text style={[styles.itemDetail, { color: colors.subText }]}>{t('quantity')}: {fiber.quantity}</Text>
                                {fiber.coreCount && <Text style={[styles.itemDetail, { color: colors.subText }]}>{t('cores')}: {fiber.coreCount}</Text>}
                                {fiber.length && <Text style={[styles.itemDetail, { color: colors.subText }]}>{t('length')}: {fiber.length}m</Text>}
                              </View>
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>

                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Map Info Panel */}
      <View style={[styles.infoPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.infoPanelTitle, { color: colors.text }]}>
          {getProjectDisplayName(selectedMap)}
        </Text>
        <Text style={[styles.infoPanelText, { color: colors.subText }]}>
          {selectedMap?.nodes?.length || 0} {t('nodes')} • {selectedMap?.connections?.length || 0} {t('connections')}
        </Text>
        <TouchableOpacity 
          style={styles.infoPanelButton}
          onPress={() => setShowMapList(true)}
        >
          <Text style={styles.infoPanelButtonText}>{t('changeMap')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
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
    shadowOffset: { width: 0, height: 2 },
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dce4ec',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
    color: '#7f8c8d',
  },
  searchInput: {
    flex: 1,
    color: '#2c3e50',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  mapItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mapItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 12,
  },
  mapItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mapItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapItemText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 6,
  },
  mapItemDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  controlButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  userMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalBody: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: 15,
    color: '#7f8c8d',
    marginLeft: 10,
    marginRight: 6,
    fontWeight: '500',
    minWidth: 70,
  },
  detailValue: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '600',
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: '#34495e',
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 22,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  connectionsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  connectionsList: {
    maxHeight: 150,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  connectionName: {
    flex: 1,
    fontSize: 15,
    color: '#2c3e50',
    marginLeft: 12,
    fontWeight: '500',
  },
  viewDetailsButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  viewDetailsButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  infoPanel: {
    position: 'absolute',
    left: 16,
    top: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    maxWidth: '70%',
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  infoPanelText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  infoPanelButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  infoPanelButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalScrollView: {
  maxHeight: Dimensions.get('window').height * 0.6,
},
sectionTitle: {
  fontSize: 17,
  fontWeight: '600',
  color: '#2c3e50',
  marginTop: 20,
  marginBottom: 12,
},
sectionContainer: {
  marginBottom: 10,
},
itemCard: {
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  padding: 12,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#e9ecef',
},
itemHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},
itemTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: '#2c3e50',
  marginLeft: 8,
},
itemDetails: {
  flexDirection: 'row',
  flexWrap: 'wrap',
},
itemDetail: {
  fontSize: 13,
  color: '#7f8c8d',
  marginRight: 16,
  marginBottom: 4,
},
closeButton: {
  backgroundColor: '#3498db',
  padding: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},
closeButtonText: {
  color: '#ffffff',
  fontWeight: '600',
  fontSize: 16,
},
headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAllButton: {
    padding: 4,
    marginRight: 12,
  },
  refreshButton: {
    padding: 4,
  },
  mapItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  deleteButton: {
    padding: 4,
  },
});

export default ViewOnMap;