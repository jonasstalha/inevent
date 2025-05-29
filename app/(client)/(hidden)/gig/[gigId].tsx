import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GigDetail() {
  const { gigId } = useLocalSearchParams();
  
  // Sample gig data - in real app, fetch based on gigId
  const gigData = {
    id: gigId || '1',
    title: 'Professional Logo Design',
    provider: 'Sarah Design Studio',
    rating: 4.9,
    reviews: 127,
    bannerImage: 'https://via.placeholder.com/400x200/4A90E2/FFFFFF?text=Logo+Design+Service',
    price: 50,
    originalPrice: 80,
    description: 'Get a professional, unique logo design that represents your brand perfectly. I will create modern, memorable logos with unlimited revisions until you\'re 100% satisfied.',
    features: [
      'Unlimited revisions',
      '3 initial concepts',
      'High-resolution files',
      'Commercial license',
      '24-hour delivery option'
    ],
    deliveryTime: '3-7 days',
    category: 'Design & Creative'
  };

  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [customRequirements, setCustomRequirements] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const packages = {
    basic: { name: 'Basic', price: 50, delivery: '7 days', revisions: 3 },
    standard: { name: 'Standard', price: 100, delivery: '5 days', revisions: 5 },
    premium: { name: 'Premium', price: 150, delivery: '3 days', revisions: 'Unlimited' }
  };

  const calculateTotal = () => {
    let total = packages[selectedPackage].price * quantity;
    if (urgentDelivery) total += 20;
    return total;
  };

  const handleOrderRequest = () => {
    const orderDetails = {
      gigId: gigData.id,
      package: selectedPackage,
      quantity,
      customRequirements,
      deliveryLocation,
      urgentDelivery,
      total: calculateTotal()
    };
    
    Alert.alert(
      'Order Request Sent!',
      `Your request for ${gigData.title} has been sent to ${gigData.provider}. They will contact you soon with a custom quote.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Banner Image */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: gigData.bannerImage }} style={styles.bannerImage} />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>37% OFF</Text>
        </View>
      </View>

      {/* Header Info */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{gigData.title}</Text>
        <Text style={styles.provider}>by {gigData.provider}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {gigData.rating}</Text>
          <Text style={styles.reviews}>({gigData.reviews} reviews)</Text>
          <Text style={styles.category}> • {gigData.category}</Text>
        </View>
      </View>

      {/* Pricing Section */}
      <View style={styles.pricingContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>${gigData.price}</Text>
          <Text style={styles.originalPrice}>${gigData.originalPrice}</Text>
        </View>
        <Text style={styles.deliveryTime}>⏱️ Delivery: {gigData.deliveryTime}</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{gigData.description}</Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's Included</Text>
        {gigData.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Package Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Package</Text>
        <View style={styles.packageContainer}>
          {Object.entries(packages).map(([key, pkg]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.packageOption,
                selectedPackage === key && styles.selectedPackage
              ]}
              onPress={() => setSelectedPackage(key)}
            >
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packagePrice}>${pkg.price}</Text>
              <Text style={styles.packageDetails}>
                {pkg.delivery} • {pkg.revisions} revisions
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Customization Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customize Your Order</Text>
        
        {/* Quantity */}
        <View style={styles.customizeRow}>
          <Text style={styles.customizeLabel}>Quantity:</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Requirements */}
        <View style={styles.customizeRow}>
          <Text style={styles.customizeLabel}>Special Requirements:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your specific needs, preferences, style requirements..."
            value={customRequirements}
            onChangeText={setCustomRequirements}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Delivery Location */}
        <View style={styles.customizeRow}>
          <Text style={styles.customizeLabel}>Delivery Method:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email, cloud storage, physical address..."
            value={deliveryLocation}
            onChangeText={setDeliveryLocation}
          />
        </View>

        {/* Urgent Delivery */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setUrgentDelivery(!urgentDelivery)}
        >
          <View style={[styles.checkbox, urgentDelivery && styles.checkedBox]}>
            {urgentDelivery && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.checkboxContent}>
            <Text style={styles.checkboxLabel}>Urgent Delivery (+$20)</Text>
            <Text style={styles.checkboxSubtext}>Get your order 2x faster</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {packages[selectedPackage].name} Package x {quantity}
          </Text>
          <Text style={styles.summaryPrice}>
            ${packages[selectedPackage].price * quantity}
          </Text>
        </View>
        {urgentDelivery && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Urgent Delivery</Text>
            <Text style={styles.summaryPrice}>$20</Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${calculateTotal()}</Text>
        </View>
      </View>

      {/* Order Button */}
      <View style={styles.orderButtonContainer}>
        <TouchableOpacity style={styles.orderButton} onPress={handleOrderRequest}>
          <Text style={styles.orderButtonText}>Request Custom Quote</Text>
        </TouchableOpacity>
        <Text style={styles.orderNote}>
          The seller will contact you with a personalized offer
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  provider: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  category: {
    fontSize: 14,
    color: '#4A90E2',
  },
  pricingContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  packageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packageOption: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedPackage: {
    borderColor: '#4A90E2',
    backgroundColor: '#f0f7ff',
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  packageDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  customizeRow: {
    marginBottom: 20,
  },
  customizeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f8f9fa',
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    borderColor: '#4A90E2',
    backgroundColor: '#4A90E2',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  checkboxSubtext: {
    fontSize: 14,
    color: '#666',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 10,
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  orderButtonContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  orderButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});