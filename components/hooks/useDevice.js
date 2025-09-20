import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Dimensions } from 'react-native';

export const useDevice = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');

  const isSmall = width < 360;          // teléfonos muy pequeños
  const isTablet = width >= 600;        // tablets
  const isIOS = Platform.OS === 'ios';
  const hasNotch = isIOS && insets.top > 24; // iPhone ≥ X
  const hasHomeIndicator = isIOS && insets.bottom > 0;

  return {
    insets,
    isSmall,
    isTablet,
    isIOS,
    hasNotch,
    hasHomeIndicator,
    topInset: insets.top,
    bottomInset: insets.bottom,
  };
};