// NOTE: This is a simplified React Native version of the original component focusing on UI and logic
// This does not include navigation or backend integration

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GigDetailScreen() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [serviceQuantities, setServiceQuantities] = useState({ logoDesign: 1 });
  const [extras, setExtras] = useState({ urgentDelivery: false, extraRevisions: 0, sourceFiles: false });
  const [customMessage, setCustomMessage] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { user: 'Alex', text: 'Great work and fast delivery!', rating: 5 },
    { user: 'Jamie', text: 'Very professional and creative.', rating: 4 }
  ]);
  const [saved, setSaved] = useState(false);

  const gigData = {
    title: 'Professional Logo Design with Unlimited Revisions',
    description: 'Get a unique, professional logo tailored to your brand. Unlimited revisions, fast delivery, and source files included. Perfect for startups, businesses, and personal brands.',
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop'
    ],
    provider: {
      name: 'Sarah Design Studio',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    basePrice: 45,
    rating: 4.8,
    reviewCount: 22
  };

  const services = {
    logoDesign: { name: 'Logo Design', basePrice: 45, min: 1, max: 10 }
  };

  const extraServices = {
    urgentDelivery: { name: '24-hour delivery', price: 25 },
    extraRevisions: { name: 'Extra revision', price: 10 },
    sourceFiles: { name: 'Source files', price: 15 }
  };

  const handleServiceChange = (change: number) => {
    setServiceQuantities((prev) => {
      const newQty = Math.max(services.logoDesign.min, Math.min(services.logoDesign.max, prev.logoDesign + change));
      return { logoDesign: newQty };
    });
  };

  const calculatePrice = () => {
    let total = services.logoDesign.basePrice * serviceQuantities.logoDesign;
    if (extras.urgentDelivery) total += extraServices.urgentDelivery.price;
    if (extras.extraRevisions > 0) total += extras.extraRevisions * extraServices.extraRevisions.price;
    if (extras.sourceFiles) total += extraServices.sourceFiles.price;
    return total;
  };

  const handleSendOffer = () => {
    Alert.alert('Offer Sent', `Offer sent to ${gigData.provider.name}! Total: $${calculatePrice()}`);
    setShowOfferForm(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f8fa' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 0 }}>
        <View style={[styles.card, { marginTop: 12, marginBottom: 24, paddingBottom: 24 }]}> 
          {/* Image Gallery */}
          <View style={{ alignItems: 'center' }}>
            <Image source={{ uri: gigData.images[selectedImage] }} style={styles.mainImage} />
            <View style={styles.galleryRow}>
              {gigData.images.map((img, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedImage(index)}>
                  <Image
                    source={{ uri: img }}
                    style={[
                      styles.thumbnail,
                      selectedImage === index && styles.thumbnailSelected
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Title & Save */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, marginTop: 8 }}>
            <Text style={styles.title}>{gigData.title}</Text>
            <TouchableOpacity onPress={() => setSaved(s => !s)}>
              <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={28} color={saved ? '#2563eb' : '#bbb'} />
            </TouchableOpacity>
          </View>
          {/* Provider & Rating */}
          <View style={[styles.providerRow, { marginBottom: 0, marginTop: 0 }]}> 
            <Image source={{ uri: gigData.provider.avatar }} style={styles.avatar} />
            <Text style={styles.provider}>{gigData.provider.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
              <Ionicons name="star" size={17} color="#fbbf24" />
              <Text style={{ marginLeft: 2, color: '#444', fontWeight: '500', fontSize: 15 }}>{gigData.rating} ({gigData.reviewCount})</Text>
            </View>
          </View>
          {/* Description */}
          <Text style={styles.description}>{gigData.description}</Text>
          {/* General Price */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
            <Ionicons name="pricetag" size={19} color="#2563eb" />
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 6, color: '#2563eb' }}>${gigData.basePrice} base price</Text>
          </View>
          {/* Customise Order Section */}
          <View style={[styles.section, { marginTop: 18, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 8 }]}> 
            <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Customise your order</Text>
            <View style={[styles.counterContainer, { backgroundColor: '#e0e7ef', borderRadius: 8, padding: 8, marginBottom: 8 }]}> 
              <TouchableOpacity onPress={() => handleServiceChange(-1)} disabled={serviceQuantities.logoDesign <= services.logoDesign.min}>
                <Ionicons name="remove-circle-outline" size={30} color={serviceQuantities.logoDesign <= services.logoDesign.min ? '#d1d5db' : '#2563eb'} />
              </TouchableOpacity>
              <Text style={[styles.counter, { fontSize: 20 }]}>{serviceQuantities.logoDesign}</Text>
              <TouchableOpacity onPress={() => handleServiceChange(1)} disabled={serviceQuantities.logoDesign >= services.logoDesign.max}>
                <Ionicons name="add-circle-outline" size={30} color={serviceQuantities.logoDesign >= services.logoDesign.max ? '#d1d5db' : '#2563eb'} />
              </TouchableOpacity>
              <Text style={[styles.priceText, { fontWeight: 'bold', fontSize: 16 }]}>x ${services.logoDesign.basePrice} each</Text>
            </View>
            <Text style={{ color: '#888', fontSize: 13, marginBottom: 8, marginTop: 0 }}>Choose quantity (like food order)</Text>
            <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>Add-ons</Text>
            <TouchableOpacity style={[styles.addonRow, { backgroundColor: extras.urgentDelivery ? '#e0e7ff' : 'transparent', borderRadius: 6, marginBottom: 4 }]} onPress={() => setExtras(prev => ({ ...prev, urgentDelivery: !prev.urgentDelivery }))}>
              <Ionicons name={extras.urgentDelivery ? 'checkbox' : 'square-outline'} size={21} color={extras.urgentDelivery ? '#2563eb' : '#888'} />
              <Text style={styles.addonText}>{extraServices.urgentDelivery.name} (+${extraServices.urgentDelivery.price})</Text>
            </TouchableOpacity>
            <View style={[styles.counterContainer, { backgroundColor: '#e0e7ef', borderRadius: 8, padding: 8, marginTop: 0, marginBottom: 4 }]}> 
              <TouchableOpacity onPress={() => setExtras(prev => ({ ...prev, extraRevisions: Math.max(0, prev.extraRevisions - 1) }))}>
                <Ionicons name="remove-circle-outline" size={21} color={extras.extraRevisions === 0 ? '#d1d5db' : '#2563eb'} />
              </TouchableOpacity>
              <Text style={styles.counter}>{extras.extraRevisions}</Text>
              <TouchableOpacity onPress={() => setExtras(prev => ({ ...prev, extraRevisions: prev.extraRevisions + 1 }))}>
                <Ionicons name="add-circle-outline" size={21} color={'#2563eb'} />
              </TouchableOpacity>
              <Text style={styles.priceText}>+${extraServices.extraRevisions.price} each</Text>
            </View>
            <TouchableOpacity style={[styles.addonRow, { backgroundColor: extras.sourceFiles ? '#e0e7ff' : 'transparent', borderRadius: 6 }]} onPress={() => setExtras(prev => ({ ...prev, sourceFiles: !prev.sourceFiles }))}>
              <Ionicons name={extras.sourceFiles ? 'checkbox' : 'square-outline'} size={21} color={extras.sourceFiles ? '#2563eb' : '#888'} />
              <Text style={styles.addonText}>{extraServices.sourceFiles.name} (+${extraServices.sourceFiles.price})</Text>
            </TouchableOpacity>
          </View>
          {/* Send Offer Section */}
          <View style={[styles.section, { marginTop: 0, marginBottom: 8 }]}> 
            <Text style={styles.sectionTitle}>Send Offer to Provider</Text>
            <TouchableOpacity style={styles.sendOfferBtn} onPress={() => setShowOfferForm(true)}>
              <Ionicons name="mail" size={19} color="white" />
              <Text style={styles.sendOfferBtnText}>Send Custom Offer</Text>
            </TouchableOpacity>
          </View>
          {/* Reviews Section */}
          <View style={[styles.section, { marginTop: 0 }]}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={() => setShowReviewForm(true)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e7ff', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Ionicons name="add-circle" size={22} color="#2563eb" />
                <Text style={{ color: '#2563eb', fontWeight: '500', fontSize: 14, marginLeft: 2 }}>Add Review</Text>
              </TouchableOpacity>
            </View>
            {reviews.length === 0 && <Text style={{ color: '#888', marginTop: 8 }}>No reviews yet.</Text>}
            {reviews.map((r, i) => (
              <View key={i} style={styles.reviewCard}>
                <Text style={{ fontWeight: 'bold', color: '#222' }}>{r.user}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                  {[...Array(r.rating)].map((_, idx) => (
                    <Ionicons key={idx} name="star" size={15} color="#fbbf24" />
                  ))}
                </View>
                <Text style={{ color: '#444' }}>{r.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Sticky Price Bar */}
      <View style={[styles.stickyBar, { borderTopLeftRadius: 16, borderTopRightRadius: 16, shadowOpacity: 0.12 }]}> 
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Text style={styles.stickyTotal}>Total: ${calculatePrice()}</Text>
        </View>
        <TouchableOpacity style={styles.stickyButton} onPress={() => setShowOfferForm(true)}>
          <Text style={styles.stickyButtonText}>Continue (${calculatePrice()})</Text>
        </TouchableOpacity>
      </View>
      {/* Offer Modal */}
      <Modal visible={showOfferForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Custom Offer</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Describe your project..."
              value={customMessage}
              onChangeText={setCustomMessage}
              style={styles.textArea}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowOfferForm(false)} style={styles.modalCancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSendOffer} style={styles.modalSend}>
                <Text style={{ color: 'white' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Review Modal */}
      <Modal visible={showReviewForm} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Review</Text>
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="Write your review..."
              value={reviewText}
              onChangeText={setReviewText}
              style={styles.textArea}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowReviewForm(false)} style={styles.modalCancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setReviews(r => [...r, { user: 'You', text: reviewText, rating: 5 }]);
                  setReviewText('');
                  setShowReviewForm(false);
                }}
                style={styles.modalSend}
                disabled={!reviewText.trim()}
              >
                <Text style={{ color: 'white' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 16, margin: 0, marginTop: 0, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  mainImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 8 },
  galleryRow: { flexDirection: 'row', marginBottom: 8, justifyContent: 'center' },
  thumbnail: { width: 54, height: 54, marginHorizontal: 4, borderRadius: 8, borderWidth: 2, borderColor: 'transparent' },
  thumbnailSelected: { borderColor: '#2563eb', borderWidth: 2 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 4, marginBottom: 2, color: '#222' },
  providerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 2 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  provider: { fontSize: 15, color: '#555', fontWeight: '500' },
  description: { fontSize: 15, color: '#444', marginBottom: 8, marginTop: 2 },
  section: { marginTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#222' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  counter: { marginHorizontal: 12, fontSize: 16, minWidth: 24, textAlign: 'center' },
  priceText: { fontSize: 14, color: '#444', marginLeft: 8 },
  addonRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  addonText: { marginLeft: 8, fontSize: 15, color: '#333' },
  stickyBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderTopWidth: 1, borderColor: '#eee', position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  stickyTotal: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  stickyButton: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 8 },
  stickyButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '88%', backgroundColor: 'white', padding: 20, borderRadius: 14 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 10 },
  textArea: { borderColor: '#ccc', borderWidth: 1, borderRadius: 6, padding: 10, height: 90, fontSize: 15, backgroundColor: '#f8fafc' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  modalCancel: { padding: 10 },
  modalSend: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6 },
  sendOfferBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', padding: 10, borderRadius: 8, marginTop: 8, alignSelf: 'flex-start' },
  sendOfferBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
  reviewCard: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10, marginTop: 8 }
});
