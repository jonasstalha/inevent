import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from '../../../src/components/artist/ArtistStore';

const NotificationsPage = () => {
  const router = useRouter();
  const { settings, toggleNotifications, updateNotificationSettings } = useArtistStore();

  const handleBack = () => {
    router.back();
  };

  const toggleNotificationType = (type: string) => {
    updateNotificationSettings({
      ...settings.notificationSettings,
      [type]: !settings.notificationSettings[type],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6a0dad" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>General Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable All Notifications</Text>
              <Text style={styles.settingDescription}>Receive all types of notifications</Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#6a0dad' }}
              thumbColor={settings.notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Event Updates</Text>
              <Text style={styles.settingDescription}>Get notified about event changes</Text>
            </View>
            <Switch
              value={settings.notificationSettings.eventUpdates}
              onValueChange={() => toggleNotificationType('eventUpdates')}
              trackColor={{ false: '#767577', true: '#6a0dad' }}
              thumbColor={settings.notificationSettings.eventUpdates ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Booking Requests</Text>
              <Text style={styles.settingDescription}>Get notified about new booking requests</Text>
            </View>
            <Switch
              value={settings.notificationSettings.bookingRequests}
              onValueChange={() => toggleNotificationType('bookingRequests')}
              trackColor={{ false: '#767577', true: '#6a0dad' }}
              thumbColor={settings.notificationSettings.bookingRequests ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Messages</Text>
              <Text style={styles.settingDescription}>Get notified about new messages</Text>
            </View>
            <Switch
              value={settings.notificationSettings.messages}
              onValueChange={() => toggleNotificationType('messages')}
              trackColor={{ false: '#767577', true: '#6a0dad' }}
              thumbColor={settings.notificationSettings.messages ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Payment Updates</Text>
              <Text style={styles.settingDescription}>Get notified about payment status</Text>
            </View>
            <Switch
              value={settings.notificationSettings.paymentUpdates}
              onValueChange={() => toggleNotificationType('paymentUpdates')}
              trackColor={{ false: '#767577', true: '#6a0dad' }}
              thumbColor={settings.notificationSettings.paymentUpdates ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
});

export default NotificationsPage;