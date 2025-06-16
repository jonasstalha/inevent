import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useArtistStore } from './ArtistStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

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
    flyer: null,
    images: [] as string[],
    location: '',
    coordinates: { latitude: 0, longitude: 0 },
    contactPhone: '',
    contactEmail: '',
    couponCode: '',
    discountPercentage: '',
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
      flyer: null,
      images: [],
      location: '',
      coordinates: { latitude: 0, longitude: 0 },
      contactPhone: '',
      contactEmail: '',
      couponCode: '',
      discountPercentage: '',
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
  const HomePage = () => {
    // Mock data for services
    const [mockGigs, setMockGigs] = useState([
      {
        id: '1',
        title: 'Wedding Photography Package',
        description: 'Professional wedding photography with 8 hours coverage, 500+ edited photos, and online gallery',
        date: '2024-04-15',
        ticketTypes: [
          { name: 'Basic Package', price: '1200', quantity: '10' },
          { name: 'Premium Package', price: '2000', quantity: '5' }
        ],
        location: 'Grand Hotel, New York',
        contactPhone: '+1 234 567 8900',
        contactEmail: 'contact@example.com'
      },
      {
        id: '2',
        title: 'Corporate Event DJ Service',
        description: 'Professional DJ service for corporate events, including sound system and lighting',
        date: '2024-05-20',
        ticketTypes: [
          { name: '4 Hours Package', price: '800', quantity: '15' },
          { name: '6 Hours Package', price: '1200', quantity: '10' }
        ],
        location: 'Business Center, Los Angeles',
        contactPhone: '+1 234 567 8901',
        contactEmail: 'dj@example.com'
      },
      {
        id: '3',
        title: 'Birthday Party Photography',
        description: '3 hours of event coverage, 200+ edited photos, and same-day highlights',
        date: '2024-06-10',
        ticketTypes: [
          { name: 'Standard Package', price: '500', quantity: '20' }
        ],
        location: 'Community Center, Chicago',
        contactPhone: '+1 234 567 8902',
        contactEmail: 'birthday@example.com'
      }
    ]);

    // Mock data for tickets
    const [mockTickets, setMockTickets] = useState([
      {
        id: '1',
        name: 'Summer Music Festival VIP',
        price: '150',
        quantity: '100',
        sold: '45',
        date: '2024-07-15',
        location: 'Central Park, New York'
      },
      {
        id: '2',
        name: 'Food & Wine Expo Pass',
        price: '75',
        quantity: '200',
        sold: '120',
        date: '2024-08-20',
        location: 'Convention Center, Chicago'
      },
      {
        id: '3',
        name: 'Tech Conference Early Bird',
        price: '299',
        quantity: '50',
        sold: '30',
        date: '2024-09-05',
        location: 'Tech Hub, San Francisco'
      }
    ]);

    const handleDeleteService = (id: string) => {
      Alert.alert(
        'Delete Service',
        'Are you sure you want to delete this service?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setMockGigs(mockGigs.filter(gig => gig.id !== id));
            }
          }
        ]
      );
    };

    const handleDeleteTicket = (id: string) => {
      Alert.alert(
        'Delete Ticket',
        'Are you sure you want to delete this ticket?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setMockTickets(mockTickets.filter(ticket => ticket.id !== id));
            }
          }
        ]
      );
    };

    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Profile Section */}
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
              onPress={() => router.push('/artist/settings/profile')}
            >
              <Text style={styles.viewProfileText}>👁️ View Public Profile</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Account & Billing Section */}
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

        {/* Services Container */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>My Services</Text>
          {mockGigs.map((gig, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{gig.title}</Text>
                <Text style={styles.serviceDescription}>{gig.description}</Text>
                <View style={styles.serviceDetails}>
                  <Text style={styles.servicePrice}>{gig.ticketTypes[0].price} MAD</Text>
                  <Text style={styles.serviceDate}>{gig.date}</Text>
                </View>
              </View>
              <View style={styles.serviceActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="pencil" size={20} color="#6a0dad" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteService(gig.id)}
                >
                  <Ionicons name="trash" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity 
            style={styles.addTicketButton}
            onPress={() => setActiveTab('calendar')}
          >
            <Ionicons name="add-circle" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.addTicketText}>Add Service <Text style={{color:'#ff4444', fontWeight:'bold'}}>(-5 credits)</Text></Text>
          </TouchableOpacity>
        </View>

        {/* Tickets Container */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>My Tickets</Text>
          {mockTickets.map((ticket, index) => (
            <View key={index} style={styles.ticketItem}>
              <Text style={styles.ticketTitle}>{ticket.name}</Text>
              <Text style={styles.ticketPrice}>{ticket.price} MAD</Text>
              <Text style={styles.ticketQuantity}>Quantity: {ticket.quantity}</Text>
              <View style={styles.ticketActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="pencil" size={20} color="#6a0dad" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteTicket(ticket.id)}
                >
                  <Ionicons name="trash" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={() => setActiveTab('ticket')} style={styles.addTicketButton}>
            <Text style={styles.addTicketText}>➕ Add Ticket <Text style={{color:'#ff4444', fontWeight:'bold'}}>(-10 credits)</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // Calendar Page Component
  const CalendarPage = () => (
    <ScrollView style={[styles.container, { paddingTop: 0 }]}>
      {/* Page Header */}
      <View style={[styles.pageHeader, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={['#6a0dad', '#4a148c']}
          style={styles.pageHeaderGradient}
        >
          <Text style={styles.pageTitle}>Create New Service</Text>
          <Text style={styles.pageSubtitle}>Fill in the details below to create your service</Text>
        </LinearGradient>
      </View>

      {/* Create New Service Form */}
      <View style={styles.sectionCard}>
        {/* Service Images */}
        <Text style={styles.formSubtitle}>Service Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
          {newEvent.images?.map((img, idx) => (
            <View key={img} style={styles.imageContainer}>
              <Image source={{ uri: img }} style={styles.eventImage} />
              <TouchableOpacity 
                onPress={() => {
                  const updatedImages = newEvent.images?.filter((_, i) => i !== idx);
                  setNewEvent({...newEvent, images: updatedImages});
                }} 
                style={styles.removeImageButton}
              >
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity 
            onPress={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.7,
              });
              if (!result.canceled && result.assets) {
                const newImages = result.assets.map(asset => asset.uri);
                setNewEvent({
                  ...newEvent,
                  images: [...(newEvent.images || []), ...newImages]
                });
              }
            }} 
            style={styles.addImageButton}
          >
            <Ionicons name="add" size={32} color="#6a0dad" />
            <Text style={styles.addImageText}>Add Images</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Basic Information */}
        <View style={styles.formSection}>
          <Text style={styles.formSubtitle}>Basic Information</Text>
          <TextInput 
            placeholder="Service Title"
            style={styles.input}
            placeholderTextColor="#666"
            value={newEvent.title}
            onChangeText={(text) => setNewEvent({...newEvent, title: text})}
          />
          <TextInput 
            placeholder="Service Description"
            style={[styles.input, styles.textArea]}
            multiline
            placeholderTextColor="#666"
            value={newEvent.description}
            onChangeText={(text) => setNewEvent({...newEvent, description: text})}
          />
        </View>

        {/* Location */}
        <View style={styles.formSection}>
          <Text style={styles.formSubtitle}>Location</Text>
          <TextInput
            placeholder="Service Location"
            style={styles.input}
            placeholderTextColor="#666"
            value={newEvent.location}
            onChangeText={(text) => setNewEvent({...newEvent, location: text})}
          />
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={async () => {
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required to pick a location.');
                return;
              }
              let location = await Location.getCurrentPositionAsync({});
              setNewEvent({
                ...newEvent,
                coordinates: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude
                }
              });
            }}
          >
            <Ionicons name="location" size={20} color="#6a0dad" />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>

        {/* Date and Time */}
        <View style={styles.formSection}>
          <Text style={styles.formSubtitle}>Date and Time</Text>
          <View style={styles.dateTimeContainer}>
            <TextInput 
              placeholder="Date (DD/MM/YYYY)"
              style={[styles.input, { flex: 1 }]}
              placeholderTextColor="#666"
              value={newEvent.date}
              onChangeText={(text) => setNewEvent({...newEvent, date: text})}
            />
            <TextInput 
              placeholder="Time"
              style={[styles.input, { flex: 1 }]}
              placeholderTextColor="#666"
              value={newEvent.time}
              onChangeText={(text) => setNewEvent({...newEvent, time: text})}
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.formSection}>
          <Text style={styles.formSubtitle}>Contact Information</Text>
          <TextInput
            placeholder="Contact Phone"
            style={styles.input}
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={newEvent.contactPhone}
            onChangeText={(text) => setNewEvent({...newEvent, contactPhone: text})}
          />
          <TextInput
            placeholder="Contact Email"
            style={styles.input}
            placeholderTextColor="#666"
            keyboardType="email-address"
            value={newEvent.contactEmail}
            onChangeText={(text) => setNewEvent({...newEvent, contactEmail: text})}
          />
        </View>

        {/* Service Options */}
        <View style={styles.formSection}>
          <Text style={styles.formSubtitle}>Service Options</Text>
          {newEvent.ticketTypes.map((option, index) => (
            <View key={index} style={styles.ticketTypeContainer}>
              <TextInput
                placeholder="Option Name"
                value={option.name}
                onChangeText={(text) => {
                  const updatedTypes = [...newEvent.ticketTypes];
                  updatedTypes[index].name = text;
                  setNewEvent({...newEvent, ticketTypes: updatedTypes});
                }}
                style={styles.input}
                placeholderTextColor="#666"
              />
              <TextInput
                placeholder="Price"
                value={option.price}
                onChangeText={(text) => {
                  const updatedTypes = [...newEvent.ticketTypes];
                  updatedTypes[index].price = text.replace(/[^0-9]/g, '');
                  setNewEvent({...newEvent, ticketTypes: updatedTypes});
                }}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
              <TextInput
                placeholder="Quantity"
                value={option.quantity}
                onChangeText={(text) => {
                  const updatedTypes = [...newEvent.ticketTypes];
                  updatedTypes[index].quantity = text.replace(/[^0-9]/g, '');
                  setNewEvent({...newEvent, ticketTypes: updatedTypes});
                }}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
              {newEvent.ticketTypes.length > 1 && (
                <TouchableOpacity 
                  onPress={() => {
                    const updatedTypes = newEvent.ticketTypes.filter((_, i) => i !== index);
                    setNewEvent({...newEvent, ticketTypes: updatedTypes});
                  }}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash" size={20} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            onPress={addTicketType}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={20} color="#6a0dad" style={styles.buttonIcon} />
            <Text style={styles.addButtonText}>Add Service Option</Text>
          </TouchableOpacity>
        </View>

        {/* Coupon Code */}
        <View style={styles.formSection}>
          <Text style={styles.formSubtitle}>Coupon Code</Text>
          <View style={styles.couponContainer}>
            <TextInput
              placeholder="Coupon Code"
              style={[styles.input, { flex: 1 }]}
              placeholderTextColor="#666"
              value={newEvent.couponCode || ''}
              onChangeText={(text) => setNewEvent({...newEvent, couponCode: text})}
            />
            <TextInput
              placeholder="Discount %"
              style={[styles.input, { width: 100 }]}
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={newEvent.discountPercentage || ''}
              onChangeText={(text) => setNewEvent({...newEvent, discountPercentage: text.replace(/[^0-9]/g, '')})}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.createEventButton} onPress={addEvent}>
          <LinearGradient
            colors={['#6a0dad', '#4a148c']}
            style={styles.createEventGradient}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.createEventText}>Create Service <Text style={{color:'#ff4444', fontWeight:'bold'}}>(-5 credits)</Text></Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Analytics Page Component
  const AnalyticsPage = () => (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Overview Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="ticket" size={24} color="#6a0dad" />
          </View>
          <Text style={styles.statNumber}>1,234</Text>
          <Text style={styles.statLabel}>Total Tickets Sold</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="cash" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.statNumber}>$12,345</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="people" size={24} color="#2196F3" />
          </View>
          <Text style={styles.statNumber}>567</Text>
          <Text style={styles.statLabel}>Active Customers</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="star" size={24} color="#FFC107" />
          </View>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
      </View>

      {/* Revenue Chart */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Revenue Overview</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { height: '60%' }]} />
            <Text style={styles.chartLabel}>Jan</Text>
          </View>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { height: '80%' }]} />
            <Text style={styles.chartLabel}>Feb</Text>
          </View>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { height: '40%' }]} />
            <Text style={styles.chartLabel}>Mar</Text>
          </View>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { height: '90%' }]} />
            <Text style={styles.chartLabel}>Apr</Text>
          </View>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { height: '70%' }]} />
            <Text style={styles.chartLabel}>May</Text>
          </View>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { height: '85%' }]} />
            <Text style={styles.chartLabel}>Jun</Text>
          </View>
        </View>
      </View>

      {/* Popular Events */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <View style={styles.popularEventCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3' }}
            style={styles.popularEventImage}
          />
          <View style={styles.popularEventInfo}>
            <Text style={styles.popularEventTitle}>Summer Music Festival</Text>
            <Text style={styles.popularEventStats}>1,200 tickets sold • $24,000 revenue</Text>
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
        // Dynamically import the Ticket page
        const TicketPage = require('./Ticket').default;
        return <TicketPage />;
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
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addTicketButton: {
    backgroundColor: '#6a0dad',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  addTicketText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
    fontSize: 16,
  },
  ticketItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ticketPrice: {
    fontSize: 16,
    color: '#6a0dad',
    fontWeight: '600',
    marginBottom: 4,
  },
  ticketQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  formSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  ticketTypeContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  addButton: {
    backgroundColor: '#f0f0f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#6a0dad',
    fontWeight: '600',
  },
  couponContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  imageScrollView: {
    marginBottom: 16,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  eventImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6a0dad',
    borderStyle: 'dashed',
  },
  addImageText: {
    color: '#6a0dad',
    marginTop: 4,
    fontSize: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationButtonText: {
    color: '#6a0dad',
    marginLeft: 8,
    fontWeight: '500',
  },
  pageHeader: {
    marginBottom: 16,
  },
  pageHeaderGradient: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  progressDotActive: {
    backgroundColor: '#6a0dad',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  formSection: {
    marginBottom: 24,
  },
  createEventGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  createEventText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a0dad',
  },
  serviceDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default ArtistMobileApp;
