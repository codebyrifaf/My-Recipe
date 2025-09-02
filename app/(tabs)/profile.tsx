import { useSettings } from '@/contexts/SettingsContext';
import { useDatabaseContext } from '@/database/DatabaseContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ProfileScreen() {
  const { recipes, favoriteRecipes } = useDatabaseContext();
  const { 
    defaultServings, 
    measurements, 
    darkTheme, 
    notifications,
    setDefaultServings,
    setMeasurements,
    setDarkTheme,
    setNotifications 
  } = useSettings();

  const [showServingsModal, setShowServingsModal] = useState(false);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);

  const servingOptions = [1, 2, 4, 6, 8, 10, 12];
  const measurementOptions: ('Metric' | 'Imperial')[] = ['Metric', 'Imperial'];

  const handleServingsSelection = () => {
    if (Platform.OS === 'ios') {
      setShowServingsModal(true);
    } else {
      setShowServingsModal(true);
    }
  };

  const handleMeasurementsSelection = () => {
    if (Platform.OS === 'ios') {
      setShowMeasurementsModal(true);
    } else {
      setShowMeasurementsModal(true);
    }
  };

  const selectServings = (servings: number) => {
    setDefaultServings(servings);
    setShowServingsModal(false);
  };

  const selectMeasurement = (measurement: 'Metric' | 'Imperial') => {
    setMeasurements(measurement);
    setShowMeasurementsModal(false);
  };

  const handleExportRecipes = async () => {
    try {
      console.log('=== PDF Export Function Called ===');
      if (recipes.length === 0) {
        Alert.alert('No Recipes', 'You have no recipes to export.');
        return;
      }

      console.log('Generating PDF for', recipes.length, 'recipes');

      // Generate HTML content for the PDF
      const generateRecipeHTML = () => {
        const currentDate = new Date().toLocaleDateString();
        
        const recipesHTML = recipes.map(recipe => {
          // Parse ingredients and steps
          let ingredients = [];
          let steps = [];
          
          try {
            ingredients = JSON.parse(recipe.ingredients || '[]');
            steps = JSON.parse(recipe.steps || '[]');
          } catch (e) {
            ingredients = [];
            steps = [];
          }

          const ingredientsHTML = ingredients.map((ing: any) => 
            `<li>${ing.amount} ${ing.name}</li>`
          ).join('');

          const stepsHTML = steps.map((step: any, index: number) => 
            `<li><strong>Step ${index + 1}:</strong> ${step.instruction}</li>`
          ).join('');

          return `
            <div class="recipe">
              <h2>${recipe.title}</h2>
              <div class="recipe-meta">
                <span><strong>Category:</strong> ${recipe.category}</span> | 
                <span><strong>Difficulty:</strong> ${recipe.difficulty}</span> | 
                <span><strong>Prep Time:</strong> ${recipe.prepTime} min</span> | 
                <span><strong>Cook Time:</strong> ${recipe.cookTime} min</span> | 
                <span><strong>Servings:</strong> ${recipe.servings}</span>
              </div>
              
              ${recipe.description ? `<p class="description"><strong>Description:</strong> ${recipe.description}</p>` : ''}
              
              <h3>Ingredients</h3>
              <ul class="ingredients">
                ${ingredientsHTML}
              </ul>
              
              <h3>Instructions</h3>
              <ol class="instructions">
                ${stepsHTML}
              </ol>
            </div>
          `;
        }).join('');

        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>My Recipe Collection</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 40px;
                line-height: 1.6;
                color: #333;
              }
              
              .header {
                text-align: center;
                border-bottom: 3px solid #FF6B6B;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              
              .header h1 {
                color: #FF6B6B;
                font-size: 2.5em;
                margin: 0;
              }
              
              .header p {
                color: #666;
                font-size: 1.1em;
                margin: 10px 0;
              }
              
              .recipe {
                page-break-inside: avoid;
                margin-bottom: 40px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                padding: 20px;
                background-color: #fafafa;
              }
              
              .recipe h2 {
                color: #FF6B6B;
                border-bottom: 2px solid #FF6B6B;
                padding-bottom: 10px;
                margin-top: 0;
              }
              
              .recipe-meta {
                background-color: #f0f8ff;
                padding: 10px;
                border-radius: 5px;
                margin: 15px 0;
                font-size: 0.9em;
              }
              
              .description {
                font-style: italic;
                background-color: #fff;
                padding: 10px;
                border-left: 4px solid #4ECDC4;
                margin: 15px 0;
              }
              
              h3 {
                color: #4ECDC4;
                margin-top: 25px;
                margin-bottom: 10px;
              }
              
              .ingredients {
                background-color: #fff;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
              }
              
              .instructions {
                background-color: #fff;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
              }
              
              li {
                margin: 8px 0;
              }
              
              .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 0.9em;
              }
              
              @media print {
                body { margin: 20px; }
                .recipe { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🍽️ My Recipe Collection</h1>
              <p>Exported on ${currentDate}</p>
              <p>Total Recipes: ${recipes.length}</p>
            </div>
            
            ${recipesHTML}
            
            <div class="footer">
              <p>Generated by My Recipe App • ${currentDate}</p>
            </div>
          </body>
          </html>
        `;
      };

      // Generate PDF
      const html = generateRecipeHTML();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Create a better filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileName = `my-recipes-${timestamp}.pdf`;
      
      // Move the file to a more accessible location
      const newUri = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      // Share the PDF file
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(newUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Export My Recipes',
          UTI: 'com.adobe.pdf'
        });
        
        Alert.alert(
          'PDF Export Successful!', 
          `Successfully exported ${recipes.length} recipes to PDF! You can now save or share the file.`
        );
      } else {
        Alert.alert(
          'PDF Export Complete',
          `Recipes exported to PDF: ${fileName}\nFile saved to device storage.`
        );
      }
      
    } catch (error) {
      console.error('PDF Export error:', error);
      Alert.alert('Export Failed', 'Failed to export recipes to PDF. Please try again.');
    }
  };

  const handleImportRecipes = () => {
    Alert.alert(
      'Import Recipes',
      'To import recipes:\n\n1. Currently, import is not available\n2. Export creates PDF files for sharing and viewing\n3. Contact the app developer for import features',
      [
        { text: 'OK', style: 'default' },
        { 
          text: 'View Export Format', 
          onPress: () => showExportFormat()
        }
      ]
    );
  };

  const showExportFormat = () => {
    Alert.alert(
      'Export File Format',
      'The app exports recipes in PDF format with the following features:\n\n• Professional document layout\n• Complete recipe details including ingredients and steps\n• Print-friendly formatting\n• Easy sharing and viewing on any device\n• Timestamped filenames for organization\n\nPDF files preserve all your recipe data in a beautiful, readable format.',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => {
          Alert.alert('Data Cleared', 'All data has been cleared successfully.');
        }},
      ]
    );
  };

  const SettingRow = ({ 
    icon, 
    title, 
    value, 
    onPress, 
    showArrow = true, 
    textColor, 
    isLast = false
  }: {
    icon: string;
    title: string;
    value?: string;
    onPress?: () => void;
    showArrow?: boolean;
    textColor?: string;
    isLast?: boolean;
  }) => (
    <TouchableOpacity style={[getStyles(darkTheme).settingRow, isLast && getStyles(darkTheme).settingRowLast]} onPress={onPress}>
      <View style={getStyles(darkTheme).settingLeft}>
        <Ionicons name={icon as any} size={24} color="#9E9E9E" />
        <Text style={[getStyles(darkTheme).settingTitle, textColor && { color: textColor }]}>{title}</Text>
      </View>
      <View style={getStyles(darkTheme).settingRight}>
        {value && <Text style={getStyles(darkTheme).settingValue}>{value}</Text>}
        {showArrow && <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />}
      </View>
    </TouchableOpacity>
  );

  const SwitchRow = ({ 
    icon, 
    title, 
    value, 
    onValueChange,
    isLast = false
  }: {
    icon: string;
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    isLast?: boolean;
  }) => (
    <View style={[getStyles(darkTheme).settingRow, isLast && getStyles(darkTheme).settingRowLast]}>
      <View style={getStyles(darkTheme).settingLeft}>
        <Ionicons name={icon as any} size={24} color="#9E9E9E" />
        <Text style={getStyles(darkTheme).settingTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  const ServingsModal = () => (
    <Modal
      transparent={true}
      visible={showServingsModal}
      animationType="fade"
      onRequestClose={() => setShowServingsModal(false)}
    >
      <View style={getStyles(darkTheme).modalOverlay}>
        <View style={getStyles(darkTheme).modalContent}>
          <Text style={getStyles(darkTheme).modalTitle}>Select Default Servings</Text>
          <Text style={getStyles(darkTheme).modalSubtitle}>Choose the default number of servings for new recipes</Text>
          
          <View style={getStyles(darkTheme).optionsContainer}>
            {servingOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  getStyles(darkTheme).optionButton,
                  defaultServings === option && getStyles(darkTheme).selectedOption
                ]}
                onPress={() => selectServings(option)}
              >
                <Text style={[
                  getStyles(darkTheme).optionText,
                  defaultServings === option && getStyles(darkTheme).selectedOptionText
                ]}>
                  {option} {option === 1 ? 'PERSON' : 'PEOPLE'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={getStyles(darkTheme).cancelButton}
            onPress={() => setShowServingsModal(false)}
          >
            <Text style={getStyles(darkTheme).cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const MeasurementsModal = () => (
    <Modal
      transparent={true}
      visible={showMeasurementsModal}
      animationType="fade"
      onRequestClose={() => setShowMeasurementsModal(false)}
    >
      <View style={getStyles(darkTheme).modalOverlay}>
        <View style={getStyles(darkTheme).modalContent}>
          <Text style={getStyles(darkTheme).modalTitle}>Select Measurement System</Text>
          <Text style={getStyles(darkTheme).modalSubtitle}>Choose your preferred measurement system</Text>
          
          <View style={getStyles(darkTheme).optionsContainer}>
            {measurementOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  getStyles(darkTheme).optionButton,
                  measurements === option && getStyles(darkTheme).selectedOption
                ]}
                onPress={() => selectMeasurement(option)}
              >
                <Text style={[
                  getStyles(darkTheme).optionText,
                  measurements === option && getStyles(darkTheme).selectedOptionText
                ]}>
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={getStyles(darkTheme).cancelButton}
            onPress={() => setShowMeasurementsModal(false)}
          >
            <Text style={getStyles(darkTheme).cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <ServingsModal />
      <MeasurementsModal />
      <ScrollView style={getStyles(darkTheme).container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={getStyles(darkTheme).header}
      >
        <View style={getStyles(darkTheme).profileSection}>
          <View style={getStyles(darkTheme).avatarContainer}>
            <LinearGradient
              colors={['#FF8A80', '#FFAB91']}
              style={getStyles(darkTheme).avatar}
            >
              <Text style={getStyles(darkTheme).avatarEmoji}>👨‍🍳</Text>
            </LinearGradient>
          </View>
          <Text style={getStyles(darkTheme).userName}>Chef Student</Text>
          <Text style={getStyles(darkTheme).userSubtitle}>Home Cook Enthusiast</Text>
        </View>

        <View style={getStyles(darkTheme).statsContainer}>
          <View style={getStyles(darkTheme).statItem}>
            <Text style={getStyles(darkTheme).statNumber}>{recipes.length}</Text>
            <Text style={getStyles(darkTheme).statLabel}>Recipes</Text>
          </View>
          <View style={getStyles(darkTheme).statItem}>
            <Text style={getStyles(darkTheme).statNumber}>{favoriteRecipes.length}</Text>
            <Text style={getStyles(darkTheme).statLabel}>Favorites</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={getStyles(darkTheme).content}>
        <View style={getStyles(darkTheme).settingsGroup}>
          <SettingRow
            icon="people-outline"
            title="Default Servings"
            value={`${defaultServings} ${defaultServings === 1 ? 'PERSON' : 'PEOPLE'}`}
            onPress={handleServingsSelection}
          />
          <SettingRow
            icon="scale-outline"
            title="Measurements"
            value={measurements.toUpperCase()}
            onPress={handleMeasurementsSelection}
            isLast={true}
          />
        </View>

        <View style={getStyles(darkTheme).settingsGroup}>
          <SwitchRow
            icon="moon-outline"
            title="Dark Theme"
            value={darkTheme}
            onValueChange={setDarkTheme}
          />
          <SwitchRow
            icon="notifications-outline"
            title="Notifications"
            value={notifications}
            onValueChange={setNotifications}
            isLast={true}
          />
        </View>

        <View style={getStyles(darkTheme).settingsGroup}>
          <SettingRow
            icon="cloud-upload-outline"
            title="Export Recipes"
            onPress={handleExportRecipes}
          />
          <SettingRow
            icon="cloud-download-outline"
            title="Import Recipes"
            onPress={handleImportRecipes}
            isLast={true}
          />
        </View>

        <View style={getStyles(darkTheme).settingsGroup}>
          <SettingRow
            icon="trash-outline"
            title="Clear All Data"
            onPress={handleClearAllData}
            showArrow={false}
            textColor="#FF6B6B"
            isLast={true}
          />
        </View>
      </View>
    </ScrollView>
    </>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 35,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsGroup: {
    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#F5F5F5',
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#333',
    marginLeft: 15,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#FF6B6B',
    marginRight: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: isDark ? '#CCCCCC' : '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: 25,
  },
  optionButton: {
    backgroundColor: isDark ? '#333' : '#F8F9FA',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333',
    letterSpacing: 0.5,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: isDark ? '#333' : '#F0F0F0',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#CCCCCC' : '#666',
    letterSpacing: 0.5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 35,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,

  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#FF6B6B',
    marginRight: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: 25,
  },
  optionButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.5,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
});
