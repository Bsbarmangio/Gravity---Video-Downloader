/**
 * Custom hook for device information
 */
import { useState, useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';
import Constants from 'expo-constants';

export function useDeviceInfo() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return {
    platform: Platform.OS,
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    version: Platform.Version,
    appVersion: Constants.expoConfig?.version || '1.0.0',
    width: dimensions.width,
    height: dimensions.height,
    isSmallScreen: dimensions.width < 375,
    isTablet: dimensions.width >= 768,
  };
}
