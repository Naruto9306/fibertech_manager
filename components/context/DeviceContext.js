// // contexts/DeviceContext.js
// import React, { createContext, useContext } from 'react';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Platform, Dimensions } from 'react-native';

// const DeviceContext = createContext();

// export const useDevice = () => {
//   const context = useContext(DeviceContext);
//   if (!context) {
//     throw new Error('useDevice must be used within a DeviceProvider');
//   }
//   return context;
// };

// export const DeviceProvider = ({ children }) => {
//   const insets = useSafeAreaInsets();
//   const { width, height } = Dimensions.get('window');

//   const isSmall = width < 360;
//   const isTablet = width >= 600;
//   const isIOS = Platform.OS === 'ios';
//   const hasNotch = isIOS && insets.top > 24;
//   const hasHomeIndicator = isIOS && insets.bottom > 0;

//   const value = {
//     insets,
//     isSmall,
//     isTablet,
//     isIOS,
//     hasNotch,
//     hasHomeIndicator,
//     topInset: insets.top,
//     bottomInset: insets.bottom,
//   };

//   return (
//     <DeviceContext.Provider value={value}>
//       {children}
//     </DeviceContext.Provider>
//   );
// };

// contexts/DeviceContext.js
import React, { createContext, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Dimensions, StyleSheet } from 'react-native';

const DeviceContext = createContext();

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

export const DeviceProvider = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');

  // ----------  LÓGICA  ----------
  const isSmall = width < 360;
  const isTablet = width >= 600;
  const isIOS = Platform.OS === 'ios';
  const hasNotch = isIOS && insets.top > 24;
  const hasHomeIndicator = isIOS && insets.bottom > 0;

  // ----------  ESTILOS REUTILIZABLES  ----------
  const stylesFull = StyleSheet.create({
    // Contenedor que respeta notch + home-indicator
    screen: {
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },

    // Versión sin padding superior (para pantallas que quieran color detrás del notch)
    screenNoTop: {
      flex: 1,
      paddingBottom: insets.bottom,
    },

    // Versión sin padding inferior (para overlays)
    screenNoBottom: {
      flex: 1,
      paddingTop: insets.top,
    },

    // Botón flotante que se eleva por encima de la barra de gestos
    floatingButton: {
      position: 'absolute',
      right: 16,
      bottom: insets.bottom + 16,
      width: isSmall ? 48 : 56,
      height: isSmall ? 48 : 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Header sticky que respeta notch
    header: {
      paddingTop: insets.top + 8,
      paddingHorizontal: 16,
      paddingBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },

    // Footer sticky que respeta home-indicator
    footer: {
      paddingBottom: insets.bottom + 8,
      paddingHorizontal: 16,
      paddingTop: 8,
    },

    // Utilidad para separar del notch en modales
    modalTopSpacer: {
      height: insets.top + 8,
    },

    // Utilidad para separar del home-indicator en modales
    modalBottomSpacer: {
      height: insets.bottom + 8,
    },
  });

  const value = {
    insets,
    isSmall,
    isTablet,
    isIOS,
    hasNotch,
    hasHomeIndicator,
    topInset: insets.top,
    bottomInset: insets.bottom,
    stylesFull, // ← exportamos los estilos para usar directamente
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};