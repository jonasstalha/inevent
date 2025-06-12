import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from '../../../src/components/artist/ArtistStore';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileEditPage = () => {
  const router = useRouter();
  const { settings, updateSettings } = useArtistStore();
  const [profile, setProfile] = useState(settings.profile);
  const [isUploading, setIsUploading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const pickImage = async () => {
    try {
      // Animate button press
      Animated.sequence([
        Animated.timing(scaleAnim, { duration: 100, toValue: 0.95, useNativeDriver: true }),
        Animated.timing(scaleAnim, { duration: 100, toValue: 1, useNativeDriver: true })
      ]).start();

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photo library to update your profile picture.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => {} }
        ]);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
          setProfile({
            ...profile,
            profileImage: result.assets[0].uri,
          });
          setIsUploading(false);
        }, 1500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!profile.name?.trim()) {
      Alert.alert('Missing Information', 'Please enter your name before saving.');
      return;
    }

    updateSettings({
      ...settings,
      profile,
    });
    
    Alert.alert('Success', 'Your profile has been updated!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const renderInputField = (label, value, onChangeText, options = {}) => {
    const {
      placeholder,
      keyboardType = 'default',
      autoCapitalize = 'sentences',
      multiline = false,
      numberOfLines = 1,
      maxLength,
      icon,
      required = false
    } = options;

    const isFocused = focusedField === label;

    return (
      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          {icon && <Ionicons name={icon} size={16} color="#6a0dad" style={styles.labelIcon} />}
          <Text style={[styles.label, required && styles.requiredLabel]}>
            {label} {required && '*'}
          </Text>
        </View>
        <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
          <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            onFocus={() => setFocusedField(label)}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        {maxLength && (
          <Text style={styles.charCount}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6a0dad" />
      <View style={styles.container}>
        {/* Enhanced Header with Gradient */}
        <LinearGradient
          colors={['#6a0dad', '#8b5cf6']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Enhanced Profile Image Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Animated.View style={[styles.imageWrapper, { transform: [{ scale: scaleAnim }] }]}>
                <Image
                  source={{ uri: profile.profileImage || 'https://via.placeholder.com/150/6a0dad/ffffff?text=Photo' }}
                  style={styles.profileImage}
                />
                {isUploading && (
                  <View style={styles.uploadingOverlay}>
                    <Ionicons name="cloud-upload" size={32} color="#fff" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={pickImage}
                  disabled={isUploading}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            </View>
            <TouchableOpacity
              style={[styles.changePhotoButton, isUploading && styles.changePhotoButtonDisabled]}
              onPress={pickImage}
              disabled={isUploading}
            >
              <Ionicons name="image" size={18} color="#6a0dad" style={styles.changePhotoIcon} />
              <Text style={styles.changePhotoText}>
                {isUploading ? 'Uploading...' : 'Change Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Enhanced Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              {renderInputField('Full Name', profile.name, 
                (text) => setProfile({ ...profile, name: text }), {
                placeholder: 'Enter your full name',
                icon: 'person',
                required: true
              })}

              {renderInputField('Bio', profile.bio, 
                (text) => setProfile({ ...profile, bio: text }), {
                placeholder: 'Tell us about yourself...',
                multiline: true,
                numberOfLines: 4,
                maxLength: 200,
                icon: 'create'
              })}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              {renderInputField('Email', profile.email, 
                (text) => setProfile({ ...profile, email: text }), {
                placeholder: 'your.email@example.com',
                keyboardType: 'email-address',
                autoCapitalize: 'none',
                icon: 'mail'
              })}

              {renderInputField('Phone', profile.phone, 
                (text) => setProfile({ ...profile, phone: text }), {
                placeholder: '+1 (555) 123-4567',
                keyboardType: 'phone-pad',
                maxLength: 15,
                icon: 'call'
              })}
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient
                colors={['#6a0dad', '#8b5cf6']}
                style={styles.saveButtonGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.saveButtonIcon} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 8,
    shadowColor: '#6a0dad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(106, 13, 173, 0.8)',
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#6a0dad',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f3e6ff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e4c6ff',
  },
  changePhotoButtonDisabled: {
    opacity: 0.6,
  },
  changePhotoIcon: {
    marginRight: 8,
  },
  changePhotoText: {
    color: '#6a0dad',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#f3e6ff',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  requiredLabel: {
    color: '#6a0dad',
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
  },
  inputContainerFocused: {
    borderColor: '#6a0dad',
    elevation: 2,
    shadowColor: '#6a0dad',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    fontSize: 16,
    color: '#1f2937',
    padding: 16,
    minHeight: 50,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#6a0dad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  saveButtonIcon: {
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ProfileEditPage;