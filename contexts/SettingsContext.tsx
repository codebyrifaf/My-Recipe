import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
  defaultServings: number;
  measurements: 'Metric' | 'Imperial';
  darkTheme: boolean;
  notifications: boolean;
  setDefaultServings: (servings: number) => void;
  setMeasurements: (measurements: 'Metric' | 'Imperial') => void;
  setDarkTheme: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  convertMeasurement: (value: string, unit: string) => string;
  scaleIngredients: (ingredients: any[], fromServings: number, toServings?: number) => any[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = '@recipe_app_settings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [defaultServings, setDefaultServingsState] = useState(4);
  const [measurements, setMeasurementsState] = useState<'Metric' | 'Imperial'>('Metric');
  const [darkTheme, setDarkThemeState] = useState(false);
  const [notifications, setNotificationsState] = useState(true);

  // Load settings from storage on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDefaultServingsState(settings.defaultServings || 4);
        setMeasurementsState(settings.measurements || 'Metric');
        setDarkThemeState(settings.darkTheme || false);
        setNotificationsState(settings.notifications ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const setDefaultServings = (servings: number) => {
    setDefaultServingsState(servings);
    saveSettings({ defaultServings: servings, measurements, darkTheme, notifications });
  };

  const setMeasurements = (measurementSystem: 'Metric' | 'Imperial') => {
    setMeasurementsState(measurementSystem);
    saveSettings({ defaultServings, measurements: measurementSystem, darkTheme, notifications });
  };

  const setDarkTheme = (enabled: boolean) => {
    setDarkThemeState(enabled);
    saveSettings({ defaultServings, measurements, darkTheme: enabled, notifications });
  };

  const setNotifications = (enabled: boolean) => {
    setNotificationsState(enabled);
    saveSettings({ defaultServings, measurements, darkTheme, notifications: enabled });
  };

  // Convert measurements between metric and imperial
  const convertMeasurement = (value: string, unit: string): string => {
    if (measurements === 'Imperial') {
      // Convert metric to imperial
      const numMatch = value.match(/(\d+(?:\.\d+)?)/);
      if (!numMatch) return value;
      
      const num = parseFloat(numMatch[1]);
      const lowerUnit = unit.toLowerCase();
      
      if (lowerUnit.includes('ml') || lowerUnit.includes('milliliter')) {
        const cups = num / 240; // 1 cup ≈ 240ml
        if (cups >= 1) {
          return `${cups.toFixed(1)} cup${cups > 1 ? 's' : ''}`;
        } else {
          const tbsp = num / 15; // 1 tbsp ≈ 15ml
          return `${tbsp.toFixed(1)} tbsp`;
        }
      } else if (lowerUnit.includes('liter') || lowerUnit.includes('l')) {
        const cups = (num * 1000) / 240;
        return `${cups.toFixed(1)} cup${cups > 1 ? 's' : ''}`;
      } else if (lowerUnit.includes('gram') || lowerUnit.includes('g')) {
        const oz = num / 28.35; // 1 oz ≈ 28.35g
        if (oz >= 1) {
          return `${oz.toFixed(1)} oz`;
        } else {
          return value; // Keep small gram measurements
        }
      } else if (lowerUnit.includes('kg') || lowerUnit.includes('kilogram')) {
        const lbs = num * 2.20462; // 1 kg ≈ 2.20462 lbs
        return `${lbs.toFixed(1)} lb${lbs > 1 ? 's' : ''}`;
      }
    }
    return value; // Return original if no conversion needed or already in preferred system
  };

  // Scale ingredients based on servings
  const scaleIngredients = (ingredients: any[], fromServings: number, toServings?: number): any[] => {
    const targetServings = toServings || defaultServings;
    if (fromServings === targetServings) return ingredients;
    
    const scaleFactor = targetServings / fromServings;
    
    return ingredients.map(ingredient => {
      const amountMatch = ingredient.amount.match(/(\d+(?:\.\d+)?)/);
      if (amountMatch) {
        const originalAmount = parseFloat(amountMatch[1]);
        const scaledAmount = originalAmount * scaleFactor;
        const newAmount = ingredient.amount.replace(amountMatch[1], scaledAmount.toFixed(1));
        
        return {
          ...ingredient,
          amount: convertMeasurement(newAmount, newAmount)
        };
      }
      return ingredient;
    });
  };

  const value: SettingsContextType = {
    defaultServings,
    measurements,
    darkTheme,
    notifications,
    setDefaultServings,
    setMeasurements,
    setDarkTheme,
    setNotifications,
    convertMeasurement,
    scaleIngredients,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
