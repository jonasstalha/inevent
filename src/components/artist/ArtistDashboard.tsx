import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useArtistStore } from './ArtistStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const ArtistMobileApp = () => {
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

  const marketplaceCategories = categories.map(cat => cat.name);

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    basePrice: '',
    category: '',
    offers: [],
    images: []
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    ticketTypes: [{ name: 'Normal', price: '', quantity: '' }],
    flyer: null
  });

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const addService = () => {
    if (credits < 5) {
      alert('Insufficient credits! You need 5 credits to publish a service.');
      return;
    }
    if (!selectedCategory || !newService.title || !newService.description || !newService.basePrice) return;
    const categoryObj = categories.find(c => c.name === selectedCategory.name);
    addGig({
      title: newService.title,
      description: newService.description,
      categoryId: categoryObj ? categoryObj.id : '',
      tickets: [],
    });
    setCredits(credits - 5);
    setNewService({
      title: '',
      description: '',
      basePrice: '',
      category: '',
      offers: [],
      images: []
    });
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
      categoryId: categories[0]?.id || '',
      tickets: newEvent.ticketTypes.map((t, i) => ({
        id: `${Date.now()}-${i}`,
        name: t.name,
        price: Number(t.price),
        quantity: Number(t.quantity)
      })),
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
            onPress={() => router.push('/artist/settings/profile')}
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
        <TouchableOpacity 
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)} 
          style={[styles.input, styles.categorySelector]}
        >
          <Text style={selectedCategory ? styles.categoryText : styles.placeholderText}>
            {selectedCategory?.name || 'Select Category'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        {showCategoryDropdown && (
          <View style={styles.dropdown}>
            {marketplaceCategories.map(cat => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => {
                  setSelectedCategory({ type: 'marketplace', name: cat });
                  setShowCategoryDropdown(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TextInput 
          placeholder="Base Price" 
          value={newService.basePrice}
          onChangeText={text => setNewService({ ...newService, basePrice: text })}
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />
        <TextInput 
          placeholder="Service Description" 
          value={newService.description}
          onChangeText={text => setNewService({ ...newService, description: text })}
          style={[styles.input, styles.textArea]}
          multiline
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={addService} style={styles.addServiceButton}>
          <Text style={styles.addServiceText}>➕ Add Service</Text>
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

  // Calendar/Tickets Page Component
  const CalendarPage = () => (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Upcoming Events */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>15</Text>
              <Text style={styles.eventMonth}>JUN</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>Summer Music Festival</Text>
              <Text style={styles.eventLocation}>📍 Central Park, New York</Text>
              <Text style={styles.eventTime}>🕒 7:00 PM - 11:00 PM</Text>
            </View>
          </View>
          <View style={styles.eventStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>150</Text>
              <Text style={styles.statLabel}>Tickets Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$3,750</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Capacity</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Ticket Management */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ticket Management</Text>
        <View style={styles.ticketTypeCard}>
          <View style={styles.ticketTypeHeader}>
            <Text style={styles.ticketTypeTitle}>VIP Pass</Text>
            <Text style={styles.ticketTypePrice}>$50</Text>
          </View>
          <View style={styles.ticketTypeStats}>
            <View style={styles.ticketStat}>
              <Text style={styles.ticketStatValue}>45/100</Text>
              <Text style={styles.ticketStatLabel}>Sold</Text>
            </View>
            <View style={styles.ticketStat}>
              <Text style={styles.ticketStatValue}>$2,250</Text>
              <Text style={styles.ticketStatLabel}>Revenue</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editTicketButton}>
            <Ionicons name="pencil" size={20} color="#6a0dad" />
            <Text style={styles.editTicketText}>Edit Ticket</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create New Event */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Create New Event</Text>
        <TextInput 
          placeholder="Event Title"
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput 
          placeholder="Event Description"
          style={[styles.input, styles.textArea]}
          multiline
          placeholderTextColor="#666"
        />
        <TextInput 
          placeholder="Date (DD/MM/YYYY)"
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput 
          placeholder="Time"
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.createEventButton}>
          <Text style={styles.createEventText}>Create Event</Text>
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
});

export default ArtistMobileApp;
