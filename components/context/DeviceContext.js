// contexts/DeviceContext.js
import React, { createContext, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Dimensions } from 'react-native';

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

  const isSmall = width < 360;
  const isTablet = width >= 600;
  const isIOS = Platform.OS === 'ios';
  const hasNotch = isIOS && insets.top > 24;
  const hasHomeIndicator = isIOS && insets.bottom > 0;

  const value = {
    insets,
    isSmall,
    isTablet,
    isIOS,
    hasNotch,
    hasHomeIndicator,
    topInset: insets.top,
    bottomInset: insets.bottom,
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};