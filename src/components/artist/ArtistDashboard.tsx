import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useArtistStore } from './ArtistStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {  Alert } from 'react-native';
import CalendarPage from './CalendarPage';

const ArtistMobileApp = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    gigs,
    categories,
    addGig,
    updateGig,
    deleteGig,
    addCategory,
    updateCategory,
    deleteCategory,
    settings,
    toggleDarkMode,
    toggleNotifications,
    updateLanguage,
    addPaymentMethod,
    removePaymentMethod,
    updateSecuritySettings,
  } = useArtistStore();

  const [activeTab, setActiveTab] = useState('home');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ type: string; name: string } | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [credits, setCredits] = useState(50);
  const [walletBalance, setWalletBalance] = useState(1250.00);

  const artistProfile = {
    name: "Creative Arts Studio",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "Professional event services and creative solutions for your special moments",
    rating: 4.8,
    reviewsCount: 124
  };

  // Replace with marketplace categories from client CategorySelector
  const MARKETPLACE_CATEGORIES = [
    'Mariage',
    'Anniversaire',
    'Traiteur',
    'Musique',
    'Neggafa',
    'Conference',
    "Evenement d'entreprise",
    'Kermesse',
    'Henna',
    'Photographie',
    'Animation',
    'Decoration',
    'Buffet',
  ];

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    basePrice: '',
    minQuantity: '1',
    maxQuantity: '10',
    category: '',
    images: [] as string[],
    addOns: [
      { name: '', price: '', type: 'checkbox' },
    ],
    providerName: artistProfile.name,
    providerAvatar: artistProfile.image,
    rating: 0,
    reviewCount: 0,
    isAvailable: true,
    location: '',
    defaultMessage: '',
    tags: '',
  });
  const [serviceImages, setServiceImages] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState([
    { title: '', price: '', description: '' }
  ]);
  const [serviceLocation, setServiceLocation] = useState('');
  const [addOns, setAddOns] = useState([
    { name: '', price: '', type: 'checkbox' },
  ]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [minQuantity, setMinQuantity] = useState('1');
  const [maxQuantity, setMaxQuantity] = useState('10');
  const [defaultMessage, setDefaultMessage] = useState('');
  const [tags, setTags] = useState('');

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    ticketTypes: [{ name: 'Normal', price: '', quantity: '' }],
    flyer: null
  });

  // Image picker for service images
  const pickServiceImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setServiceImages([...serviceImages, ...result.assets.map(a => a.uri)]);
    }
  };
  const removeServiceImage = (uri: string) => {
    setServiceImages(serviceImages.filter(img => img !== uri));
  };

  // Add/remove service options
  const addServiceOption = () => {
    setServiceOptions([...serviceOptions, { title: '', price: '', description: '' }]);
  };
  const removeServiceOption = (idx: number) => {
    setServiceOptions(serviceOptions.filter((_, i) => i !== idx));
  };
  const updateServiceOption = (idx: number, field: 'title' | 'price' | 'description', value: string) => {
    const updated = [...serviceOptions];
    updated[idx][field] = value;
    setServiceOptions(updated);
  };

  // Add/remove add-ons
  const addAddOn = () => {
    setAddOns([...addOns, { name: '', price: '', type: 'checkbox' }]);
  };
  const removeAddOn = (idx: number) => {
    setAddOns(addOns.filter((_, i) => i !== idx));
  };
  const updateAddOn = (idx: number, field: 'name' | 'price' | 'type', value: string) => {
    const updated = [...addOns];
    updated[idx][field] = value;
    setAddOns(updated);
  };

  const addService = () => {
    if (credits < 5) {
      alert('Insufficient credits! You need 5 credits to publish a service.');
      return;
    }
    if (!selectedCategory || !newService.title || !newService.description || !newService.basePrice) return;
    addGig({
      title: newService.title,
      description: newService.description,
      category: selectedCategory.name, // Use category name as string
      basePrice: Number(newService.basePrice),
      images: serviceImages,
      options: serviceOptions.map(opt => ({
        id: Date.now().toString() + Math.random(),
        title: opt.title,
        price: Number(opt.price),
        description: opt.description,
      })),
      location: serviceLocation,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      artistId: '1', // TODO: Replace with actual artistId from context/auth
    });
    setCredits(credits - 5);
    setNewService({
      title: '',
      description: '',
      basePrice: '',
      minQuantity: '1',
      maxQuantity: '10',
      category: '',
      images: [],
      addOns: [{ name: '', price: '', type: 'checkbox' }],
      providerName: artistProfile.name,
      providerAvatar: artistProfile.image,
      rating: 0,
      reviewCount: 0,
      isAvailable: true,
      location: '',
      defaultMessage: '',
      tags: '',
    });
    setServiceImages([]);
    setServiceOptions([{ title: '', price: '', description: '' }]);
    setServiceLocation('');
    setSelectedCategory(null);
  };

  const addEvent = () => {
    if (credits < 10) {
      alert('Insufficient credits! You need 10 credits to publish an event.');
      return;
    }
    if (!newEvent.title || !newEvent.description || !newEvent.date) return;
    addGig({
      title: newEvent.title,
      description: newEvent.description,
      category: categories[0]?.name || '', // Use category name as string
      basePrice: 0,
      images: [],
      options: [],
      location: '',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      artistId: '1', // TODO: Replace with actual artistId from context/auth
    });
    setCredits(credits - 10);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      ticketTypes: [{ name: 'Normal', price: '', quantity: '' }],
      flyer: null
    });
  };

  const addTicketType = () => {
    setNewEvent({
      ...newEvent,
      ticketTypes: [...newEvent.ticketTypes, { name: '', price: '', quantity: '' }]
    });
  };

  const updateTicketType = (index: number, field: 'name' | 'price' | 'quantity', value: string) => {
    const updatedTypes = [...newEvent.ticketTypes];
    updatedTypes[index][field] = value;
    setNewEvent({ ...newEvent, ticketTypes: updatedTypes });
  };

  // Home Page Component
  const HomePage = () => (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Profile Preview */}
      <View style={styles.profileCard}>
        <LinearGradient
          colors={['#6a0dad', '#4a148c']}
          style={styles.profileGradient}
        >
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: artistProfile.image }} 
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{artistProfile.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStar}>⭐</Text>
                <Text style={styles.ratingText}>{artistProfile.rating} ({artistProfile.reviewsCount} reviews)</Text>
              </View>
              <Text style={styles.profileDescription}>{artistProfile.description}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewProfileButton}
            onPress={() => router.push('/artist/public-profile')}
          >
            <Text style={styles.viewProfileText}>👁️ View Public Profile</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Credits and Wallet Balance */}
      <View style={styles.accountCard}>
        <Text style={styles.cardTitle}>My Account</Text>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Available Credits</Text>
            <Text style={styles.balanceValue}>{credits}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceValue}>{walletBalance.toFixed(2)} MAD</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addFundsButton}>
          <Text style={styles.addFundsText}>➕ Add Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Add Service */}
      <View style={styles.serviceCard}>
        <Text style={styles.cardTitle}>Add New Service</Text>
        <TextInput 
          placeholder="Service Title" 
          value={newService.title}
          onChangeText={text => setNewService({ ...newService, title: text })}
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Description"
          value={newService.description}
          onChangeText={text => setNewService({ ...newService, description: text })}
          style={[styles.input, styles.textArea]}
          multiline
          placeholderTextColor="#666"
        />
        {/* Service Images */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {serviceImages.map((img, idx) => (
            <View key={img} style={{ marginRight: 8, position: 'relative' }}>
              <Image source={{ uri: img }} style={{ width: 60, height: 60, borderRadius: 8 }} />
              <TouchableOpacity onPress={() => removeServiceImage(img)} style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#fff', borderRadius: 12, padding: 2 }}>
                <Ionicons name="close" size={16} color="#6a0dad" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={pickServiceImage} style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#f0f0f5', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="add" size={28} color="#6a0dad" />
          </TouchableOpacity>
        </ScrollView>
        <TextInput
          placeholder="Base Price"
          value={newService.basePrice}
          onChangeText={text => setNewService({ ...newService, basePrice: text.replace(/[^0-9]/g, '') })}
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            placeholder="Min Quantity"
            value={minQuantity}
            onChangeText={setMinQuantity}
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
          <TextInput
            placeholder="Max Quantity"
            value={maxQuantity}
            onChangeText={setMaxQuantity}
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
        </View>
        {/* Service Options/Items */}
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Service Items/Options</Text>
        {serviceOptions.map((opt, idx) => (
          <View key={idx} style={{ marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 8 }}>
            <TextInput
              placeholder="Item Title"
              value={opt.title}
              onChangeText={v => updateServiceOption(idx, 'title', v)}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Price"
              value={opt.price}
              onChangeText={v => updateServiceOption(idx, 'price', v.replace(/[^0-9]/g, ''))}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Description"
              value={opt.description}
              onChangeText={v => updateServiceOption(idx, 'description', v)}
              style={styles.input}
              placeholderTextColor="#666"
            />
            {serviceOptions.length > 1 && (
              <TouchableOpacity onPress={() => removeServiceOption(idx)} style={{ alignSelf: 'flex-end', marginTop: -8 }}>
                <Ionicons name="trash" size={18} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={addServiceOption} style={{ marginBottom: 12 }}>
          <Text style={{ color: '#6a0dad', fontWeight: 'bold' }}>+ Add Item/Option</Text>
        </TouchableOpacity>
        {/* Add-ons/Extras */}
        <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 8 }}>Add-ons / Extras</Text>
        {addOns.map((addon, idx) => (
          <View key={idx} style={{ marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 8 }}>
            <TextInput
              placeholder="Add-on Name"
              value={addon.name}
              onChangeText={v => updateAddOn(idx, 'name', v)}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Price"
              value={addon.price}
              onChangeText={v => updateAddOn(idx, 'price', v.replace(/[^0-9]/g, ''))}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ marginRight: 8 }}>Type:</Text>
              <TouchableOpacity onPress={() => updateAddOn(idx, 'type', 'checkbox')} style={{ marginRight: 8 }}>
                <Text style={{ color: addon.type === 'checkbox' ? '#6a0dad' : '#666' }}>Checkbox</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateAddOn(idx, 'type', 'counter')}>
                <Text style={{ color: addon.type === 'counter' ? '#6a0dad' : '#666' }}>Counter</Text>
              </TouchableOpacity>
            </View>
            {addOns.length > 1 && (
              <TouchableOpacity onPress={() => removeAddOn(idx)} style={{ alignSelf: 'flex-end', marginTop: -8 }}>
                <Ionicons name="trash" size={18} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={addAddOn} style={{ marginBottom: 12 }}>
          <Text style={{ color: '#6a0dad', fontWeight: 'bold' }}>+ Add Add-on/Extra</Text>
        </TouchableOpacity>
        {/* Provider Info (auto-filled) */}
        <Text style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>Provider: {artistProfile.name}</Text>
        {/* Category/Tags */}
        <TextInput
          placeholder="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
          style={styles.input}
          placeholderTextColor="#666"
        />
        {/* Is Available in Marketplace */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ marginRight: 8 }}>Available in Marketplace</Text>
          <TouchableOpacity onPress={() => setIsAvailable(v => !v)} style={{ marginRight: 8 }}>
            <Ionicons name={isAvailable ? 'checkbox' : 'square-outline'} size={22} color={isAvailable ? '#6a0dad' : '#666'} />
          </TouchableOpacity>
        </View>
        {/* Location/Store */}
        <TextInput
          placeholder="Store Location (address or city)"
          value={serviceLocation}
          onChangeText={setServiceLocation}
          style={styles.input}
          placeholderTextColor="#666"
        />
        {/* Default Message/Instructions */}
        <TextInput
          placeholder="Default Message/Instructions for Custom Offers (optional)"
          value={defaultMessage}
          onChangeText={setDefaultMessage}
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={addService} style={styles.addServiceButton}>
          <Text style={styles.addServiceText}>➕ Add Service <Text style={{color:'#ff4444', fontWeight:'bold'}}>(-5 credits)</Text></Text>
        </TouchableOpacity>
      </View>

      {/* Services List */}
      {gigs.length > 0 && (
        <View style={styles.servicesCard}>
          <Text style={styles.cardTitle}>My Services</Text>
          {gigs.map((gig, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceTitle}>{gig.title}</Text>
              <Text style={styles.serviceDescription}>{gig.description}</Text>
              <View style={styles.serviceActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="pencil" size={20} color="#6a0dad" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="trash" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      clientName: "John Smith",
      type: "service",
      service: "Live Performance",
      date: "2024-07-20",
      time: "8:00 PM",
      price: 1500,
      clientPrice: 1200,
      message: "Looking for acoustic set for wedding reception",
      status: "pending",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      clientName: "Sarah Johnson",
      type: "ticket",
      eventName: "Summer Music Festival",
      quantity: 5,
      ticketType: "VIP",
      price: 250,
      clientPrice: 200,
      message: "Can we get group discount?",
      status: "pending",
      timestamp: "4 hours ago"
    },
    {
      id: 3,
      clientName: "Mike Wilson",
      type: "service",
      service: "Recording Session",
      date: "2024-07-15",
      time: "2:00 PM",
      price: 800,
      clientPrice: null,
      message: "Need vocals for my track, studio session preferred",
      status: "pending",
      timestamp: "1 day ago"
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, pending, accepted, declined
  const [counterOffer, setCounterOffer] = useState<{ [key: number]: string }>({});

  const handleAcceptOrder = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'accepted' }
        : order
    ));
    Alert.alert("Success", "Order accepted successfully!");
  };

  const handleDeclineOrder = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'declined' }
        : order
    ));
    Alert.alert("Order Declined", "Order has been declined.");
  };

  const handleCounterOffer = (orderId: number) => {
    const newPrice = counterOffer[orderId];
    if (!newPrice) {
      Alert.alert("Error", "Please enter a counter offer price");
      return;
    }
    
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, price: parseFloat(newPrice), status: 'counter_offered' }
        : order
    ));
    setCounterOffer({ ...counterOffer, [orderId]: '' });
    Alert.alert("Counter Offer Sent", `New price of $${newPrice} has been sent to client`);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9500';
      case 'accepted': return '#34c759';
      case 'declined': return '#ff3b30';
      case 'counter_offered': return '#007aff';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'accepted': return 'checkmark-circle';
      case 'declined': return 'close-circle';
      case 'counter_offered': return 'swap-horizontal';
      default: return 'help-circle';
    }
  };

 const CalendarPage = () => (
    <ScrollView style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="mail-unread" size={24} color="#ff9500" />
          <Text style={styles.statValue}>{orders.filter(o => o.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#34c759" />
          <Text style={styles.statValue}>{orders.filter(o => o.status === 'accepted').length}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color="#6a0dad" />
          <Text style={styles.statValue}>
            ${orders.filter(o => o.status === 'accepted').reduce((sum, o) => sum + o.price, 0)}
          </Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'pending', 'accepted', 'declined'].map(status => (
          <TouchableOpacity 
            key={status}
            style={[styles.filterTab, filter === status && styles.activeFilterTab]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.activeFilterText]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <View style={styles.ordersContainer}>
        <Text style={styles.sectionTitle}>
          {filter === 'all' ? 'All Orders' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
        </Text>
        
        {filteredOrders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{order.clientName}</Text>
                <Text style={styles.orderTime}>{order.timestamp}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Ionicons name={getStatusIcon(order.status)} size={16} color="white" />
                <Text style={styles.statusText}>{order.status.replace('_', ' ')}</Text>
              </View>
            </View>

            {/* Order Details */}
            <View style={styles.orderDetails}>
              <View style={styles.orderType}>
                <Ionicons 
                  name={order.type === 'service' ? 'musical-notes' : 'ticket'} 
                  size={20} 
                  color="#6a0dad" 
                />
                <Text style={styles.orderTypeText}>
                  {order.type === 'service' ? order.service : `${order.quantity}x ${order.ticketType} Tickets`}
                </Text>
              </View>
              
              {order.date && (
                <Text style={styles.orderDate}>📅 {order.date} at {order.time}</Text>
              )}
              
              {order.eventName && (
                <Text style={styles.eventName}>🎵 {order.eventName}</Text>
              )}
            </View>

            {/* Price Information */}
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Your Price:</Text>
                <Text style={styles.yourPrice}>${order.price}</Text>
              </View>
              {order.clientPrice && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Client Offer:</Text>
                  <Text style={styles.clientPrice}>${order.clientPrice}</Text>
                </View>
              )}
            </View>

            {/* Client Message */}
            {order.message && (
              <View style={styles.messageContainer}>
                <Text style={styles.messageLabel}>Message:</Text>
                <Text style={styles.messageText}>"{order.message}"</Text>
              </View>
            )}

            {/* Action Buttons */}
            {order.status === 'pending' && (
              <View style={styles.actionContainer}>
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleAcceptOrder(order.id)}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.declineButton}
                  onPress={() => handleDeclineOrder(order.id)}
                >
                  <Ionicons name="close" size={20} color="white" />
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Counter Offer Section */}
            {order.status === 'pending' && order.clientPrice && order.clientPrice < order.price && (
              <View style={styles.counterOfferContainer}>
                <Text style={styles.counterOfferLabel}>Counter Offer:</Text>
                <View style={styles.counterOfferRow}>
                  <TextInput
                    style={styles.counterOfferInput}
                    placeholder="Enter price"
                    keyboardType="numeric"
                    value={counterOffer[order.id] || ''}
                    onChangeText={(text) => setCounterOffer({...counterOffer, [order.id]: text})}
                  />
                  <TouchableOpacity 
                    style={styles.counterOfferButton}
                    onPress={() => handleCounterOffer(order.id)}
                  >
                    <Text style={styles.counterOfferButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="mail-open-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No {filter === 'all' ? '' : filter} orders found</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="add-circle" size={24} color="#6a0dad" />
          <Text style={styles.quickActionText}>Create Service Package</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="ticket" size={24} color="#6a0dad" />
          <Text style={styles.quickActionText}>Add New Event Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="settings" size={24} color="#6a0dad" />
          <Text style={styles.quickActionText}>Pricing Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} // <-- Add this closing brace to end OrderManagementPage function


  // Enhanced Analytics Page Component
  const [analyticsFilter, setAnalyticsFilter] = useState<'all' | 'services' | 'tickets'>('all');
  const [showDetails, setShowDetails] = useState(false);
  const AnalyticsPage = () => (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}> 
      {/* Filter Options */}
      <View style={{flexDirection:'row',justifyContent:'center',marginBottom:18}}>
        {['all','services','tickets'].map(opt => (
          <TouchableOpacity
            key={opt}
            style={{
              backgroundColor: analyticsFilter === opt ? '#6a0dad' : '#fff',
              paddingVertical:10,paddingHorizontal:22,borderRadius:22,marginHorizontal:6,
              borderWidth:1,
              borderColor: analyticsFilter === opt ? '#6a0dad' : '#e0e0e0',
              shadowColor: analyticsFilter === opt ? '#6a0dad' : '#000',
              shadowOpacity: analyticsFilter === opt ? 0.15 : 0.05,
              shadowRadius: 4,
              elevation: analyticsFilter === opt ? 3 : 1,
            }}
            onPress={() => setAnalyticsFilter(opt as any)}
            activeOpacity={0.85}
          >
            <Text style={{color: analyticsFilter === opt ? 'white' : '#6a0dad',fontWeight:'bold',fontSize:15}}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Overview Stats */}
      <View style={[styles.statsGrid, {marginBottom:18}]}> 
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="ticket" size={24} color="#6a0dad" />
          </View>
          <Text style={styles.statNumber}>{analyticsFilter === 'tickets' ? '1,234' : analyticsFilter === 'services' ? '890' : '2,124'}</Text>
          <Text style={styles.statLabel}>Total {analyticsFilter === 'services' ? 'Services' : analyticsFilter === 'tickets' ? 'Tickets' : 'Sales'}</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="cash" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.statNumber}>{analyticsFilter === 'tickets' ? '$12,345' : analyticsFilter === 'services' ? '$8,900' : '$21,245'}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="people" size={24} color="#2196F3" />
          </View>
          <Text style={styles.statNumber}>{analyticsFilter === 'tickets' ? '567' : analyticsFilter === 'services' ? '320' : '887'}</Text>
          <Text style={styles.statLabel}>Active Customers</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="star" size={24} color="#FFC107" />
          </View>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trending-up" size={24} color="#00b894" />
          </View>
          <Text style={styles.statNumber}>8.2%</Text>
          <Text style={styles.statLabel}>Conversion Rate</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="pricetag" size={24} color="#fdcb6e" />
          </View>
          <Text style={styles.statNumber}>{analyticsFilter === 'tickets' ? '$320' : analyticsFilter === 'services' ? '$410' : '$365'}</Text>
          <Text style={styles.statLabel}>Avg. Order Value</Text>
        </View>
      </View>
      <View style={{height:1,backgroundColor:'#eee',marginVertical:10}} />
      {/* Revenue Trend Chart */}
      <View style={[styles.sectionCard, {marginBottom:18, shadowColor:'#6a0dad', shadowOpacity:0.08, shadowRadius:8, elevation:2}]}> 
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <Text style={[styles.sectionTitle, {fontSize:17}]}>Revenue Trend (Last 6 Months)</Text>
          <TouchableOpacity onPress={()=>setShowDetails(v=>!v)}>
            <Text style={{color:'#6a0dad',fontWeight:'bold',fontSize:14}}>{showDetails ? 'Hide Details' : 'Show Details'}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.chartContainer, {paddingVertical:8}]}> 
          {[60, 80, 40, 90, 70, 85].map((h, i) => (
            <View key={i} style={[styles.chartBar, {marginHorizontal:4}]}> 
              <View style={{
                height: `${h}%`,
                backgroundColor: i === 5 ? '#00b894' : '#6a0dad',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                shadowColor: '#6a0dad',
                shadowOpacity: 0.12,
                shadowRadius: 4,
                elevation: 2,
                width: 22,
                alignSelf:'center',
              }} />
              <Text style={[styles.chartLabel, {fontSize:12,marginTop:4}]}>{['Jan','Feb','Mar','Apr','May','Jun'][i]}</Text>
            </View>
          ))}
        </View>
        {showDetails && (
          <View style={{marginTop:12}}>
            <Text style={{color:'#888',fontSize:13,marginBottom:2}}>Highest: $8,500 (Apr) • Lowest: $3,200 (Mar)</Text>
            <Text style={{color:'#888',fontSize:13}}>Growth: +18% since January</Text>
          </View>
        )}
      </View>
      <View style={{height:1,backgroundColor:'#eee',marginVertical:10}} />
      {/* Most Popular Service/Ticket */}
      <View style={[styles.sectionCard, {marginBottom:18, shadowColor:'#6a0dad', shadowOpacity:0.08, shadowRadius:8, elevation:2}]}> 
        <Text style={[styles.sectionTitle, {fontSize:17,marginBottom:8}]}>Most Popular</Text>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:12}}>
          <Ionicons name="musical-notes" size={22} color="#6a0dad" style={{marginRight:8}} />
          <Text style={{fontWeight:'bold',fontSize:15}}>Live Performance</Text>
          <Text style={{marginLeft:8,color:'#888',fontSize:13}}>• 320 sales</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Ionicons name="ticket" size={22} color="#fdcb6e" style={{marginRight:8}} />
          <Text style={{fontWeight:'bold',fontSize:15}}>VIP Ticket</Text>
          <Text style={{marginLeft:8,color:'#888',fontSize:13}}>• 210 sold</Text>
        </View>
      </View>
      <View style={{height:1,backgroundColor:'#eee',marginVertical:10}} />
      {/* Recent Orders/Sales */}
      <View style={[styles.sectionCard, {marginBottom:18, shadowColor:'#6a0dad', shadowOpacity:0.08, shadowRadius:8, elevation:2}]}> 
        <Text style={[styles.sectionTitle, {fontSize:17,marginBottom:8}]}>Recent Orders</Text>
        <View style={{marginBottom:12}}>
          <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
            <Ionicons name="person" size={18} color="#6a0dad" style={{marginRight:6}} />
            <Text style={{fontWeight:'bold',fontSize:14}}>Sarah Johnson</Text>
            <Text style={{marginLeft:8,color:'#888',fontSize:13}}>VIP Ticket • $200</Text>
            <Text style={{marginLeft:8,color:'#34c759',fontSize:13}}>Accepted</Text>
          </View>
          <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
            <Ionicons name="person" size={18} color="#6a0dad" style={{marginRight:6}} />
            <Text style={{fontWeight:'bold',fontSize:14}}>John Smith</Text>
            <Text style={{marginLeft:8,color:'#888',fontSize:13}}>Live Performance • $1500</Text>
            <Text style={{marginLeft:8,color:'#ff9500',fontSize:13}}>Pending</Text>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Ionicons name="person" size={18} color="#6a0dad" style={{marginRight:6}} />
            <Text style={{fontWeight:'bold',fontSize:14}}>Mike Wilson</Text>
            <Text style={{marginLeft:8,color:'#888',fontSize:13}}>Recording Session • $800</Text>
            <Text style={{marginLeft:8,color:'#ff3b30',fontSize:13}}>Declined</Text>
          </View>
        </View>
        <TouchableOpacity style={{alignSelf:'flex-end',padding:8}}>
          <Text style={{color:'#6a0dad',fontWeight:'bold',fontSize:14}}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={{height:1,backgroundColor:'#eee',marginVertical:10}} />
      {/* Popular Events */}
      <View style={[styles.sectionCard, {marginBottom:24, shadowColor:'#6a0dad', shadowOpacity:0.08, shadowRadius:8, elevation:2}]}> 
        <Text style={[styles.sectionTitle, {fontSize:17,marginBottom:8}]}>Popular Events</Text>
        <View style={styles.popularEventCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3' }}
            style={styles.popularEventImage}
          />
          <View style={styles.popularEventInfo}>
            <Text style={[styles.popularEventTitle, {fontSize:15}]}>Summer Music Festival</Text>
            <Text style={[styles.popularEventStats, {fontSize:13}]}>1,200 tickets sold • $24,000 revenue</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  // Settings Page Component
  const SettingsPage = () => {
    const router = useRouter();

    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}> 
        {/* Profile Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Profile Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/artist/settings/profile')}>
            <Ionicons name="person" size={24} color="#6a0dad" />
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Edit Profile</Text>
              <Text style={styles.settingDescription}>Update your profile information</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/artist/settings/notifications')}>
            <Ionicons name="notifications" size={24} color="#6a0dad" />
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>{settings.notificationsEnabled ? 'Notifications are enabled' : 'Notifications are disabled'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        {/* Account Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/artist/settings/payment')}>
            <Ionicons name="card" size={24} color="#6a0dad" />
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Payment Methods</Text>
              <Text style={styles.settingDescription}>{settings.paymentMethods.length} payment methods added</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        {/* App Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/artist/settings/language')}>
            <Ionicons name="language" size={24} color="#6a0dad" />
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>
                {settings.language === 'French' && 'Français'}
                {settings.language === 'Arabic' && 'العربية'}
                {settings.language === 'English' && 'English'}
                {!["French", "Arabic", "English"].includes(settings.language) && 'English'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={toggleDarkMode}>
            <Ionicons name="moon" size={24} color="#6a0dad" />
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>{settings.isDarkMode ? 'On' : 'Off'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => {/* Add logout logic here */}}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'calendar':
        return <CalendarPage />;
      case 'ticket':
        return require('./Ticket').default ? React.createElement(require('./Ticket').default) : null;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#6a0dad" />
      {renderContent()}
      <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}> 
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'home' && styles.activeTab]} 
          onPress={() => setActiveTab('home')}
        >
          <Ionicons name="home" size={24} color={activeTab === 'home' ? '#6a0dad' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'calendar' && styles.activeTab]} 
          onPress={() => setActiveTab('calendar')}
        >
          <Ionicons name="calendar" size={24} color={activeTab === 'calendar' ? '#6a0dad' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'ticket' && styles.activeTab]} 
          onPress={() => setActiveTab('ticket')}
        >
          <Ionicons name="ticket" size={24} color={activeTab === 'ticket' ? '#6a0dad' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'ticket' && styles.activeTabText]}>Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'analytics' && styles.activeTab]} 
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons name="stats-chart" size={24} color={activeTab === 'analytics' ? '#6a0dad' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'settings' && styles.activeTab]} 
          onPress={() => setActiveTab('settings')}
        >
          <Ionicons name="settings" size={24} color={activeTab === 'settings' ? '#6a0dad' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingStar: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#fff',
  },
  profileDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  viewProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  viewProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  accountCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addFundsButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  addFundsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  serviceCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    color: '#333',
  },
  placeholderText: {
    color: '#666',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addServiceButton: {
    backgroundColor: '#6a0dad',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  addServiceText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  servicesCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  serviceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#6a0dad',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabText: {
    color: '#6a0dad',
    fontWeight: 'bold',
  },
  sectionCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  eventDate: {
    backgroundColor: '#6a0dad',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 16,
  },
  eventDay: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventMonth: {
    color: '#fff',
    fontSize: 14,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  ticketTypeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ticketTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketTypePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a0dad',
  },
  ticketTypeStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ticketStat: {
    marginRight: 24,
  },
  ticketStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  editTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#6a0dad',
    borderRadius: 8,
  },
  editTicketText: {
    color: '#6a0dad',
    marginLeft: 8,
    fontWeight: '500',
  },
  createEventButton: {
    backgroundColor: '#6a0dad',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  createEventText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '50%',
    padding: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    paddingTop: 16,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  chartFill: {
    width: 20,
    backgroundColor: '#6a0dad',
    borderRadius: 10,
  },
  chartLabel: {
    marginTop: 8,
    color: '#666',
  },
  popularEventCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  popularEventImage: {
    width: '100%',
    height: 150,
  },
  popularEventInfo: {
    padding: 16,
  },
  popularEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  popularEventStats: {
    fontSize: 14,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: '#6a0dad',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  ordersContainer: {
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  eventName: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  yourPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34c759',
  },
  clientPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9500',
  },
  messageContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  messageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#34c759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  counterOfferContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  counterOfferLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  counterOfferRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterOfferInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
  },
  counterOfferButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  counterOfferButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  quickActions: {
    marginBottom: 20,
  },
  quickActionButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },

});

export default ArtistMobileApp;
