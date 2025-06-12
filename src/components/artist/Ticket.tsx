// src/components/artist/Ticket.tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from './ArtistStore';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

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

  // --- IMAGE PICKER ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
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
      // Create a default gig if none exists
      const defaultGig = {
        title: 'General',
        description: 'General tickets',
        categoryId: '',
        tickets: [],
      };
      addGig(defaultGig);
      // After adding, get the new gigId (simulate as last in array)
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
    Alert.alert('Success', 'Ticket added to market!');
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

  // --- DUMMY ORDERS ---
  const ordersPlaced = [
    {
      id: 'order1',
      event: 'Jazz Night',
      type: 'Normal',
      price: 120,
      flyer: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      location: 'Jazz Club, Rabat',
      contact: '+212 600-123456',
      date: '05/07/2025',
      time: '20:00 - 23:00',
      status: 'Confirmed',
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🎟️ Ticket Market</Text>
        {/* --- ADD TICKET FORM --- */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add New Ticket</Text>
          {/* Name */}
          <View style={styles.formRow}>
            <Ionicons name="ticket" size={20} color="#6a0dad" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ticket Name"
              value={form.name}
              onChangeText={v => handleChange('name', v)}
              maxLength={40}
            />
          </View>
          {/* Price */}
          <View style={styles.formRow}>
            <Ionicons name="cash" size={20} color="#6a0dad" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Price (MAD)"
              value={form.price}
              onChangeText={v => handleChange('price', v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          {/* Quantity */}
          <View style={styles.formRow}>
            <Ionicons name="layers" size={20} color="#6a0dad" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={form.quantity}
              onChangeText={v => handleChange('quantity', v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
          {/* Date */}
          <View style={styles.formRow}>
            <Ionicons name="calendar" size={20} color="#6a0dad" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Date (e.g. 2025-07-05)"
              value={form.date}
              onChangeText={v => handleChange('date', v)}
              maxLength={12}
            />
          </View>
          {/* Time */}
          <View style={styles.formRow}>
            <Ionicons name="time" size={20} color="#6a0dad" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Time (e.g. 20:00 - 23:00)"
              value={form.time}
              onChangeText={v => handleChange('time', v)}
              maxLength={20}
            />
          </View>
          {/* Flyer Picker */}
          <TouchableOpacity style={styles.formRow} onPress={pickImage}>
            <Ionicons name="image" size={20} color="#6a0dad" style={styles.icon} />
            <Text style={styles.label}>Flyer</Text>
            {form.flyer ? (
              <Image source={{ uri: form.flyer }} style={styles.flyerPreview} />
            ) : (
              <Text style={styles.pickerText}>Pick an image</Text>
            )}
          </TouchableOpacity>
          {/* Location Picker */}
          <TouchableOpacity style={styles.formRow} onPress={pickLocation}>
            <Ionicons name="location" size={20} color="#6a0dad" style={styles.icon} />
            <Text style={styles.label}>Location</Text>
            <Text style={styles.pickerText}>{form.location ? form.location : 'Pick on map'}</Text>
            {loadingLocation && <ActivityIndicator size="small" color="#6a0dad" />}
          </TouchableOpacity>
          {/* Contact */}
          <View style={styles.formRow}>
            <Ionicons name="call" size={20} color="#6a0dad" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contact (phone/email)"
              value={form.contact}
              onChangeText={v => handleChange('contact', v)}
              keyboardType="default"
              maxLength={40}
            />
          </View>
          {/* Description Field */}
          <View style={styles.formRow}>
            <Ionicons name="document-text" size={20} color="#6a0dad" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              value={form.description}
              onChangeText={v => handleChange('description', v)}
              keyboardType="default"
              maxLength={120}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Add Ticket'}</Text>
          </TouchableOpacity>
        </View>
        {/* Location Modal */}
        <Modal visible={locationModalVisible} animationType="slide">
          <View style={{ flex: 1 }}>
            {mapRegion && (
              <MapView
                style={{ flex: 1 }}
                region={mapRegion}
                onPress={handleMapPress}
              >
                {pickedLocation && <Marker coordinate={pickedLocation} />}
              </MapView>
            )}
            <TouchableOpacity style={styles.confirmLocationBtn} onPress={confirmLocation}>
              <Text style={styles.confirmLocationText}>Confirm Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelLocationBtn} onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.cancelLocationText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* --- TICKETS CREATED --- */}
        <Text style={styles.sectionTitle}>Tickets Created</Text>
        {createdTickets.length === 0 && (
          <Text style={styles.emptyText}>No tickets created yet. Add one above!</Text>
        )}
        {createdTickets.map(ticket => (
          <View key={ticket.id} style={styles.ticketCard}>
            <Image source={{ uri: ticket.flyer }} style={styles.flyer} />
            <View style={styles.ticketInfo}>
              <Text style={styles.event}>{ticket.name}</Text>
              <Text style={styles.type}>Price: {ticket.price} MAD</Text>
              <Text style={styles.dateTime}>Quantity: {ticket.quantity}</Text>
              {ticket.date ? <Text style={styles.dateTime}>Date: {ticket.date}</Text> : null}
              {ticket.time ? <Text style={styles.dateTime}>Time: {ticket.time}</Text> : null}
              <Text style={styles.location}>Location: {ticket.location}</Text>
              <Text style={styles.contact}>Contact: {ticket.contact}</Text>
              {ticket.description ? <Text style={styles.description}>Description: {ticket.description}</Text> : null}
            </View>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    marginTop: 40,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#6a0dad',
    marginBottom: 16,
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 8,
  },
  pickerBox: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  gigChip: {
    backgroundColor: '#f0f0f5',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  gigChipText: {
    fontSize: 14,
    color: '#6a0dad',
  },
  gigChipActive: {
    backgroundColor: '#6a0dad',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  flyerPreview: {
    width: 100,
    height: 100,
    borderRadius: 4,
    marginLeft: 8,
  },
  submitBtn: {
    backgroundColor: '#6a0dad',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 8,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  flyer: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 16,
  },
  ticketInfo: {
    flex: 1,
  },
  event: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#6a0dad',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  confirmLocationBtn: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#6a0dad',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmLocationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelLocationBtn: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#ddd',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelLocationText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
