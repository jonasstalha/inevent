import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from '../../../src/components/artist/ArtistStore';
import * as ImagePicker from 'expo-image-picker';

const ProfileEditPage = () => {
  const router = useRouter();
  const { settings, updateSettings } = useArtistStore();
  const [profile, setProfile] = useState(settings.profile);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        // Here you would typically upload the image to your server
        // For now, we'll just update the local state
        setProfile({
          ...profile,
          profileImage: result.assets[0].uri,
        });
        setIsUploading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    // Update profile in the store
    updateSettings({
      ...settings,
      profile,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: profile.profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          {isUploading && (
            <View style={styles.uploadingOverlay}>
              <Ionicons name="cloud-upload" size={32} color="#fff" />
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.changePhotoButton}
          onPress={pickImage}
          disabled={isUploading}
        >
          <Text style={styles.changePhotoText}>
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={profile.phone}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={profile.location}
            onChangeText={(text) => setProfile({ ...profile, location: text })}
            placeholder="Enter your location"
          />
        </View>
      </View>
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#6a0dad',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    padding: 8,
    opacity: 1,
  },
  changePhotoButtonDisabled: {
    opacity: 0.5,
  },
  changePhotoText: {
    color: '#6a0dad',
    fontSize: 16,
  },
  form: {
    padding: 16,
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default ProfileEditPage; 