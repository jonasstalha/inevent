import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from '../../../src/components/artist/ArtistStore';

const SecuritySettingsPage = () => {
  const router = useRouter();
  const { settings, updateSecuritySettings } = useArtistStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleToggle2FA = () => {
    updateSecuritySettings({
      twoFactorEnabled: !settings.securitySettings.twoFactorEnabled,
    });
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    // Here you would typically make an API call to change the password
    updateSecuritySettings({
      lastPasswordChange: new Date(),
    });

    setPasswords({ current: '', new: '', confirm: '' });
    setShowPasswordModal(false);
    Alert.alert('Success', 'Password changed successfully');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Security Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
            <Text style={styles.settingDescription}>
              Add an extra layer of security to your account
            </Text>
          </View>
          <Switch
            value={settings.securitySettings.twoFactorEnabled}
            onValueChange={handleToggle2FA}
            trackColor={{ false: '#767577', true: '#6a0dad' }}
            thumbColor={settings.securitySettings.twoFactorEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={() => setShowPasswordModal(true)}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.settingDescription}>
              Last changed: {settings.securitySettings.lastPasswordChange.toLocaleDateString()}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Security Tips</Text>
        <View style={styles.tipItem}>
          <Ionicons name="shield-checkmark" size={24} color="#6a0dad" />
          <Text style={styles.tipText}>
            Use a strong, unique password for your account
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="lock-closed" size={24} color="#6a0dad" />
          <Text style={styles.tipText}>
            Enable two-factor authentication for additional security
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="alert-circle" size={24} color="#6a0dad" />
          <Text style={styles.tipText}>
            Never share your password or 2FA codes with anyone
          </Text>
        </View>
      </View>

      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={passwords.current}
                onChangeText={(text) => setPasswords({ ...passwords, current: text })}
                placeholder="Enter current password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={passwords.new}
                onChangeText={(text) => setPasswords({ ...passwords, new: text })}
                placeholder="Enter new password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={passwords.confirm}
                onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
                placeholder="Confirm new password"
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.changeButton} onPress={handlePasswordChange}>
              <Text style={styles.changeButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  changeButton: {
    backgroundColor: '#6a0dad',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SecuritySettingsPage; 