import React from 'react';
import { useDevice } from '../hooks/useDevice';
import { useApp } from '../context/AppContext'; // tu contexto de tema

export const withResponsive = (Component) => (props) => {
  const device = useDevice();
  const { isDarkMode } = useApp();

  const theme = {
    colors: {
      background: isDarkMode ? '#121212' : '#ffffff',
      card: isDarkMode ? '#1e1e1e' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#2c3e50',
      subText: isDarkMode ? '#b0b0b0' : '#7f8c8d',
      border: isDarkMode ? '#333' : '#e9ecef',
    },
    isDarkMode,
  };

  return <Component {...props} device={device} theme={theme} />;
};