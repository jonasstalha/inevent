import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, User, Bell, Shield, HelpCircle } from 'lucide-react-native';
import { Theme } from '@/src/constants/theme';
import { useApp } from '@/src/context/AppContext';
import { ArtistCard } from '@/src/components/artist/ArtistCard';

export default function SettingsScreen() {
  const router = useRouter();
  const { artists } = useApp();
  const [savedArtists, setSavedArtists] = useState<string[]>([]);

  useEffect(() => {
    // Load saved artists from storage
    const loadSavedArtists = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedArtists');
        if (saved) {
          setSavedArtists(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved artists:', error);
      }
    };
    loadSavedArtists();
  }, []);

  const handleSaveArtist = async (artistId: string) => {
    try {
      const newSavedArtists = savedArtists.includes(artistId)
        ? savedArtists.filter(id => id !== artistId)
        : [...savedArtists, artistId];
      
      setSavedArtists(newSavedArtists);
      await AsyncStorage.setItem('savedArtists', JSON.stringify(newSavedArtists));
    } catch (error) {
      console.error('Error saving artist:', error);
    }
  };

  const renderSettingItem = (icon: React.ReactNode, title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Theme.colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderSettingItem(
            <User size={20} color={Theme.colors.primary} />,
            'Profile Settings',
            () => router.push('/(client)/(hidden)/profile')
          )}
          {renderSettingItem(
            <Bell size={20} color={Theme.colors.primary} />,
            'Notifications',
            () => router.push('/(client)/(hidden)/notifications')
          )}
        </View>

        {/* Saved Artists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Artists</Text>
          {savedArtists.length > 0 ? (
            artists
              .filter(artist => savedArtists.includes(artist.id))
              .map(artist => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onSave={handleSaveArtist}
                  isSaved={true}
                />
              ))
          ) : (
            <View style={styles.emptyState}>
              <Heart size={40} color={Theme.colors.textLight} />
              <Text style={styles.emptyStateText}>No saved artists yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Save your favorite artists to easily find them later
              </Text>
            </View>
          )}
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>
          {renderSettingItem(
            <Shield size={20} color={Theme.colors.primary} />,
            'Privacy & Security',
            () => router.push('/(client)/(hidden)/privacy')
          )}
          {renderSettingItem(
            <HelpCircle size={20} color={Theme.colors.primary} />,
            'Help & Support',
            () => router.push('/(client)/(hidden)/support')
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  backButton: {
    padding: Theme.spacing.sm,
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  settingTitle: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
  },
  emptyState: {
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  emptyStateText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
    marginTop: Theme.spacing.md,
  },
  emptyStateSubtext: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
}); 