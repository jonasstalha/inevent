// src/components/artist/Ticket.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  Modal, 
  ActivityIndicator,
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from './ArtistStore';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Ticket() {
  const { gigs, addTicketToGig, addGig } = useArtistStore();

  // --- FORM STATE ---
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',
    date: '',
    time: '',
    flyer: '',
    location: '',
    contact: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null);
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'tickets'>('create');

  // --- IMAGE PICKER ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setForm({ ...form, flyer: result.assets[0].uri });
    }
  };

  // --- LOCATION PICKER ---
  const pickLocation = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to pick a location.');
      setLoadingLocation(false);
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setPickedLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    setLocationModalVisible(true);
    setLoadingLocation(false);
  };

  const handleMapPress = (e: MapPressEvent) => {
    setPickedLocation(e.nativeEvent.coordinate);
  };

  const confirmLocation = () => {
    if (pickedLocation) {
      setForm({ ...form, location: `${pickedLocation.latitude},${pickedLocation.longitude}` });
      setLocationModalVisible(false);
    }
  };

  // --- FORM HANDLERS ---
  const handleChange = (field: keyof typeof form, value: any) => {
    setForm({ ...form, [field]: value });
    setError('');
  };

  const handleSubmit = () => {
    // Validation: only require name, price, quantity, date, time
    if (!form.name || !form.price || !form.quantity || !form.date || !form.time) {
      setError('Please fill all required fields.');
      return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError('Price must be a positive number.');
      return;
    }
    if (isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }
    setSubmitting(true);
    
    // Add ticket to the first gig (or create a default gig if none exists)
    let gigId = gigs[0]?.id;
    if (!gigId) {
      const defaultGig = {
        title: 'General',
        description: 'General tickets',
        categoryId: '',
        tickets: [],
      };
      addGig(defaultGig);
      gigId = (gigs.length > 0 ? gigs[gigs.length - 1].id : '1');
    }
    
    addTicketToGig(gigId, {
      id: Date.now().toString(),
      name: form.name,
      price: Number(form.price),
      quantity: Number(form.quantity),
      date: form.date,
      time: form.time,
      flyer: form.flyer,
      location: form.location,
      contact: form.contact,
      description: form.description,
    });
    
    setForm({
      name: '',
      price: '',
      quantity: '',
      date: '',
      time: '',
      flyer: '',
      location: '',
      contact: '',
      description: '',
    });
    
    setSubmitting(false);
    setError('');
    setActiveTab('tickets');
    Alert.alert('Success', 'Ticket added successfully!', [
      { text: 'OK', style: 'default' }
    ]);
  };

  // --- TICKETS CREATED ---
  const createdTickets = gigs.flatMap(gig =>
    (gig.tickets || []).map(ticket => ({
      ...ticket,
      event: gig.title,
      flyer: ticket.flyer || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
      location: ticket.location || 'Unknown',
      contact: ticket.contact || '',
      type: ticket.name,
    }))
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Ticket Manager</Text>
          <Text style={styles.headerSubtitle}>Create and manage your event tickets</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'create' && styles.activeTab]}
        onPress={() => setActiveTab('create')}
      >
        <Ionicons 
          name="add-circle" 
          size={20} 
          color={activeTab === 'create' ? '#667eea' : '#8e8e93'} 
        />
        <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
          Create Ticket
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
        onPress={() => setActiveTab('tickets')}
      >
        <Ionicons 
          name="ticket" 
          size={20} 
          color={activeTab === 'tickets' ? '#667eea' : '#8e8e93'} 
        />
        <Text style={[styles.tabText, activeTab === 'tickets' && styles.activeTabText]}>
          My Tickets ({createdTickets.length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCreateTicketForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Create New Ticket</Text>
        
        {/* Ticket Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ticket Name *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="ticket-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter ticket name"
              placeholderTextColor="#a1a1aa"
              value={form.name}
              onChangeText={v => handleChange('name', v)}
              maxLength={40}
            />
          </View>
        </View>

        {/* Price and Quantity Row */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Price (MAD) *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="0"
                placeholderTextColor="#a1a1aa"
                value={form.price}
                onChangeText={v => handleChange('price', v.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>
          
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Quantity *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="layers-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="0"
                placeholderTextColor="#a1a1aa"
                value={form.quantity}
                onChangeText={v => handleChange('quantity', v.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>
        </View>

        {/* Date and Time Row */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Date *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="2025-07-05"
                placeholderTextColor="#a1a1aa"
                value={form.date}
                onChangeText={v => handleChange('date', v)}
                maxLength={12}
              />
            </View>
          </View>
          
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Time *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="20:00 - 23:00"
                placeholderTextColor="#a1a1aa"
                value={form.time}
                onChangeText={v => handleChange('time', v)}
                maxLength={20}
              />
            </View>
          </View>
        </View>

        {/* Flyer Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Event Flyer</Text>
          <TouchableOpacity style={styles.uploadContainer} onPress={pickImage}>
            {form.flyer ? (
              <View style={styles.flyerContainer}>
                <Image source={{ uri: form.flyer }} style={styles.flyerImage} />
                <View style={styles.flyerOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.flyerOverlayText}>Change Image</Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="image-outline" size={32} color="#667eea" />
                <Text style={styles.uploadText}>Upload Event Flyer</Text>
                <Text style={styles.uploadSubtext}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location</Text>
          <TouchableOpacity style={styles.locationContainer} onPress={pickLocation}>
            <View style={styles.locationContent}>
              <Ionicons name="location-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <Text style={[styles.locationText, !form.location && styles.placeholderText]}>
                {form.location ? `Location: ${form.location.substring(0, 30)}...` : 'Select location on map'}
              </Text>
            </View>
            {loadingLocation && <ActivityIndicator size="small" color="#667eea" />}
          </TouchableOpacity>
        </View>

        {/* Contact */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contact Information</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Phone number or email"
              placeholderTextColor="#a1a1aa"
              value={form.contact}
              onChangeText={v => handleChange('contact', v)}
              keyboardType="default"
              maxLength={40}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter ticket description..."
              placeholderTextColor="#a1a1aa"
              value={form.description}
              onChangeText={v => handleChange('description', v)}
              multiline
              numberOfLines={3}
              maxLength={120}
              textAlignVertical="top"
            />
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity 
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit} 
          disabled={submitting}
        >
          <LinearGradient
            colors={submitting ? ['#a1a1aa', '#a1a1aa'] : ['#667eea', '#764ba2']}
            style={styles.submitButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="add-circle" size={20} color="#fff" />
            )}
            <Text style={styles.submitButtonText}>
              {submitting ? 'Creating Ticket...' : 'Create Ticket'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTicketsList = () => (
    <View style={styles.ticketsContainer}>
      {createdTickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="ticket-outline" size={64} color="#d4d4d8" />
          <Text style={styles.emptyTitle}>No tickets created yet</Text>
          <Text style={styles.emptySubtitle}>Create your first ticket to get started</Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => setActiveTab('create')}
          >
            <Text style={styles.emptyButtonText}>Create Ticket</Text>
          </TouchableOpacity>
        </View>
      ) : (
        createdTickets.map((ticket, index) => (
          <View key={ticket.id} style={styles.ticketCard}>
            <View style={styles.ticketImageContainer}>
              <Image source={{ uri: ticket.flyer }} style={styles.ticketImage} />
              <View style={styles.ticketBadge}>
                <Text style={styles.ticketBadgeText}>{ticket.quantity} left</Text>
              </View>
            </View>
            
            <View style={styles.ticketContent}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketName}>{ticket.name}</Text>
                <Text style={styles.ticketPrice}>{ticket.price} MAD</Text>
              </View>
              
              <View style={styles.ticketDetails}>
                {ticket.date && (
                  <View style={styles.ticketDetail}>
                    <Ionicons name="calendar" size={14} color="#667eea" />
                    <Text style={styles.ticketDetailText}>{ticket.date}</Text>
                  </View>
                )}
                
                {ticket.time && (
                  <View style={styles.ticketDetail}>
                    <Ionicons name="time" size={14} color="#667eea" />
                    <Text style={styles.ticketDetailText}>{ticket.time}</Text>
                  </View>
                )}
                
                {ticket.location && (
                  <View style={styles.ticketDetail}>
                    <Ionicons name="location" size={14} color="#667eea" />
                    <Text style={styles.ticketDetailText} numberOfLines={1}>
                      {ticket.location.length > 20 ? `${ticket.location.substring(0, 20)}...` : ticket.location}
                    </Text>
                  </View>
                )}
                
                {ticket.contact && (
                  <View style={styles.ticketDetail}>
                    <Ionicons name="call" size={14} color="#667eea" />
                    <Text style={styles.ticketDetailText}>{ticket.contact}</Text>
                  </View>
                )}
              </View>
              
              {ticket.description && (
                <Text style={styles.ticketDescription} numberOfLines={2}>
                  {ticket.description}
                </Text>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {renderHeader()}
        {renderTabBar()}
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'create' ? renderCreateTicketForm() : renderTicketsList()}
        </ScrollView>

        {/* Location Modal */}
        <Modal visible={locationModalVisible} animationType="slide" statusBarTranslucent>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {mapRegion && (
              <MapView
                style={styles.map}
                region={mapRegion}
                onPress={handleMapPress}
              >
                {pickedLocation && <Marker coordinate={pickedLocation} />}
              </MapView>
            )}
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLocationModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.confirmButton} onPress={confirmLocation}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.confirmButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.confirmButtonText}>Confirm Location</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 180,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#f1f5f9',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8e8e93',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    padding: 16,
    paddingTop: 24,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  uploadContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  flyerContainer: {
    position: 'relative',
  },
  flyerImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  flyerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  flyerOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#1e293b',
  },
  placeholderText: {
    color: '#a1a1aa',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  ticketsContainer: {
    padding: 16,
    paddingTop: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  ticketImageContainer: {
    position: 'relative',
  },
  ticketImage: {
    width: '100%',
    height: 160,
  },
  ticketBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ticketBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  ticketContent: {
    padding: 16,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  ticketDetails: {
    marginBottom: 12,
  },
  ticketDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketDetailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    flex: 1,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  map: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 12,
  },
  confirmButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});