import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from '../../../src/components/artist/ArtistStore';

const SettingsPage = () => {
  const router = useRouter();
  const { settings, toggleDarkMode } = useArtistStore();

  const handleEditProfile = () => {
    router.push('/artist/settings/profile');
  };



  const handlePaymentMethods = () => {
    router.push('/artist/settings/payment');
  };

  const handleNotifications = () => {
    router.push('/artist/settings/notifications');
  };

  const handleLanguage = () => {
    router.push('/artist/settings/language');
  };

  const handleDarkMode = () => {
    toggleDarkMode();
  };

  const handleLogout = () => {
    // Clear auth tokens and navigate to login
    router.replace('/auth/login');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Settings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
          <Ionicons name="person" size={24} color="#6a0dad" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Edit Profile</Text>
            <Text style={styles.settingDescription}>Update your profile information</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleNotifications}>
          <Ionicons name="notifications" size={24} color="#6a0dad" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>
              {settings.notificationsEnabled ? 'Notifications are enabled' : 'Notifications are disabled'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Account Settings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handlePaymentMethods}>
          <Ionicons name="card" size={24} color="#6a0dad" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Payment Methods</Text>
            <Text style={styles.settingDescription}>
              {settings.paymentMethods.length} payment methods added
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* App Settings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleLanguage}>
          <Ionicons name="language" size={24} color="#6a0dad" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingDescription}>{settings.language}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleDarkMode}>
          <Ionicons name="moon" size={24} color="#6a0dad" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>{settings.isDarkMode ? 'On' : 'Off'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SettingsPage;