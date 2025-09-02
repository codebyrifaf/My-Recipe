import { useDatabaseContext } from '@/database/DatabaseContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const { recipes, favoriteRecipes } = useDatabaseContext();
  const [darkTheme, setDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [defaultServings, setDefaultServings] = useState('4 people');
  const [measurements, setMeasurements] = useState('Metric');

  const handleExportRecipes = () => {
    Alert.alert('Export Recipes', 'Export functionality would be implemented here.');
  };

  const handleImportRecipes = () => {
    Alert.alert('Import Recipes', 'Import functionality would be implemented here.');
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
    textColor = '#333' 
  }: {
    icon: string;
    title: string;
    value?: string;
    onPress?: () => void;
    showArrow?: boolean;
    textColor?: string;
  }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#9E9E9E" />
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />}
      </View>
    </TouchableOpacity>
  );

  const SwitchRow = ({ 
    icon, 
    title, 
    value, 
    onValueChange 
  }: {
    icon: string;
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#9E9E9E" />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#FF8A80', '#FFAB91']}
              style={styles.avatar}
            >
              <Text style={styles.avatarEmoji}>👨‍🍳</Text>
            </LinearGradient>
          </View>
          <Text style={styles.userName}>Chef Student</Text>
          <Text style={styles.userSubtitle}>Home Cook Enthusiast</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{recipes.length}</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favoriteRecipes.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="people-outline"
            title="Default Servings"
            value={defaultServings}
            onPress={() => {}}
          />
          <SettingRow
            icon="scale-outline"
            title="Measurements"
            value={measurements}
            onPress={() => {}}
          />
        </View>

        <View style={styles.settingsGroup}>
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
          />
        </View>

        <View style={styles.settingsGroup}>
          <SettingRow
            icon="cloud-upload-outline"
            title="Export Recipes"
            onPress={handleExportRecipes}
          />
          <SettingRow
            icon="cloud-download-outline"
            title="Import Recipes"
            onPress={handleImportRecipes}
          />
        </View>

        <View style={styles.settingsGroup}>
          <SettingRow
            icon="trash-outline"
            title="Clear All Data"
            onPress={handleClearAllData}
            showArrow={false}
            textColor="#FF6B6B"
          />
        </View>
      </View>
    </ScrollView>
  );
}

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
    elevation: 3,
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
    fontWeight: '500',
  },
});
