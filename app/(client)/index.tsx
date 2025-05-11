import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Modal,
  Image,
  FlatList,
  PanResponder,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop ,Line} from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
const { width, height } = Dimensions.get('window');

const WHEEL_SIZE = width * 0.8;
const ITEM_SIZE = WHEEL_SIZE * 0.3;
const CENTER_ITEM_SIZE = WHEEL_SIZE * 0.4;
const RADIUS = WHEEL_SIZE * 0.35;


export default function EventApp() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSection, setActiveSection] = useState('events');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('features');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation values
  const rotationValue = new Animated.Value(0);
  const blobScale = new Animated.Value(1);
  const headerAnimation = useRef(new Animated.Value(0)).current;
  
  // Animate header on mount
  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Blob rotation animation
  useEffect(() => {
    const startRotationAnimation = () => {
      Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    };
    
    startRotationAnimation();
  }, []);
  
  const spin = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleBlobPress = (sectionName) => {
    // Animate blob press
    Animated.sequence([
      Animated.timing(blobScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(blobScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    setActiveSection(sectionName);
  };
  
  const showPopup = (content) => {
    setPopupContent(content);
    setPopupVisible(true);
  };
  
  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'wedding', name: 'Wedding', icon: 'heart' },
    { id: 'conference', name: 'Conference', icon: 'briefcase' },
    { id: 'photography', name: 'Photography', icon: 'camera' },
    { id: 'kids', name: 'Kids', icon: 'smile' },
    { id: 'music', name: 'DJ', icon: 'music' }
  ];
  
  const events = [
    {
      id: 1,
      name: 'Summer Wedding Expo',
      description: 'Discover the latest wedding trends',
      category: 'Wedding',
      date: 'May 15, 2025',
      location: 'Grand Hall',
      image: 'https://via.placeholder.com/300',
      price: '$45'
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      description: 'The biggest tech event of the year',
      category: 'Conference',
      date: 'May 20, 2025',
      location: 'Convention Center',
      image: 'https://via.placeholder.com/300',
      price: '$120'
    },
    {
      id: 3,
      name: 'Portrait Photography Masterclass',
      description: 'Learn from the best photographers',
      category: 'Photography',
      date: 'May 12, 2025',
      location: 'Art Studio',
      image: 'https://via.placeholder.com/300',
      price: '$85'
    }
  ];

  const services = [
    {
      id: 1,
      title: 'Premium Catering',
      available: 'Available',
      location: 'City Center',
      reviews: '4.9 (120 reviews)',
      orders: '240 orders',
      price: '$1200',
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 2,
      title: 'Luxury Venue',
      available: 'Limited',
      location: 'Riverside',
      reviews: '4.8 (95 reviews)',
      orders: '180 orders',
      price: '$3500',
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 3,
      title: 'Event Planning',
      available: 'Available',
      location: 'Downtown',
      reviews: '4.7 (85 reviews)',
      orders: '120 orders',
      price: '$900',
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 4,
      title: 'Wedding Decor',
      available: 'Available',
      location: 'Multiple locations',
      reviews: '4.6 (110 reviews)',
      orders: '200 orders',
      price: '$1500',
      image: 'https://via.placeholder.com/300'
    }
  ];

  const artists = [
    {
      id: 1,
      name: 'Alex Morgan',
      description: 'Wedding & Event Photographer',
      specialty: 'Photography',
      rating: 4.8,
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 2,
      name: 'DJ Maximus',
      description: 'Professional DJ for all events',
      specialty: 'Music',
      rating: 4.9,
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 3,
      name: 'Creative Caterers',
      description: 'Gourmet food for any occasion',
      specialty: 'Catering',
      rating: 4.7,
      image: 'https://via.placeholder.com/300'
    }
  ];

  // Custom gradients for cards
  const cardGradients = [
    ['#4f46e5', '#818cf8'],
    ['#0ea5e9', '#38bdf8'],
    ['#059669', '#10b981'],
    ['#d946ef', '#f472b6']
  ];

  const featuredServices = [
    { id: 1, title: 'Catering', icon: 'coffee' },
    { id: 2, title: 'Venues', icon: 'home' },
    { id: 3, title: 'Photography', icon: 'camera' },
    { id: 4, title: 'Music', icon: 'music' },
    { id: 5, title: 'Decoration', icon: 'award' },
    { id: 6, title: 'Planning', icon: 'calendar' }
  ];

  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(event => event.category === activeCategory);
  
  // Custom blob shape SVG path - smoother and more organic
  const blobPath = "M54.5,36.1c-2.8,13.2-16.3,21.4-29.5,18.6S3.6,38.4,6.4,25.2S22.7,3.8,35.9,6.6C49.1,9.4,57.3,22.9,54.5,36.1z";
  
  // Render blob component
  const renderBlob = (position, color, onPress) => {
    return (
      <TouchableOpacity
        style={[styles.blobContainer, position]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Animated.View style={{ 
          transform: [
            { rotate: spin },
            { scale: blobScale }
          ], 
          height: "100%", 
          width: "100%" 
        }}>
          <Svg width="100%" height="100%" viewBox="0 0 60 60">
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0" stopColor={color[0]} />
                <Stop offset="1" stopColor={color[1]} />
              </LinearGradient>
            </Defs>
            <Path d={blobPath} fill="url(#grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </Svg>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Render event card with improved design
  const renderEventCard = (event, index) => {
    const gradientIndex = index % cardGradients.length;
    
    return (
      <TouchableOpacity 
        key={event.id} 
        style={styles.eventCard}
        onPress={() => {}}
        activeOpacity={0.9}
      >
        <View style={styles.eventImageContainer}>
          <View style={[styles.eventBackground, {backgroundColor: cardGradients[gradientIndex][0]}]}>
            <Icon name="calendar" size={24} color="#ffffff" style={styles.eventIcon} />
          </View>
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventDate}>{event.date}</Text>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <View style={styles.eventFooter}>
            <View style={styles.eventLocation}>
              <Icon name="map-pin" size={14} color="#6b7280" />
              <Text style={styles.eventLocationText}>{event.location}</Text>
            </View>
            <Text style={styles.eventPrice}>{event.price}</Text>
          </View>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render service card with improved design
  const renderServiceCard = (service, index) => {
    const gradientIndex = index % cardGradients.length;
    
    return (
      <TouchableOpacity 
        key={service.id} 
        style={styles.serviceCard}
        onPress={() => {}}
        activeOpacity={0.9}
      >
        <View style={styles.serviceImageContainer}>
          <View style={[styles.serviceBackground, {backgroundColor: cardGradients[gradientIndex][0]}]}>
            <Icon name="package" size={20} color="#ffffff" />
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{service.price}</Text>
        </View>
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <View style={styles.serviceInfo}>
            <Icon name="check-circle" size={12} color="#10b981" style={styles.serviceIcon} />
            <Text style={styles.serviceInfoText}>{service.available}</Text>
          </View>
          <View style={styles.serviceInfo}>
            <Icon name="map-pin" size={12} color="#6b7280" style={styles.serviceIcon} />
            <Text style={styles.serviceInfoText}>{service.location}</Text>
          </View>
          <View style={styles.serviceInfo}>
            <Icon name="star" size={12} color="#f59e0b" style={styles.serviceIcon} />
            <Text style={styles.serviceInfoText}>{service.reviews}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render artist card with improved design
  const renderArtistCard = (artist, index) => {
    const gradientIndex = index % cardGradients.length;
    
    return (
      <TouchableOpacity 
        key={artist.id} 
        style={styles.artistCard}
        onPress={() => {}}
        activeOpacity={0.9}
      >
        <View style={styles.artistImageContainer}>
          <View style={[styles.artistBackground, {backgroundColor: cardGradients[gradientIndex][0]}]}>
            <Icon name="user" size={24} color="#ffffff" />
          </View>
        </View>
        <View style={styles.artistContent}>
          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.artistDescription}>{artist.description}</Text>
          <View style={styles.artistFooter}>
            <View style={styles.artistRating}>
              <Icon name="star" size={14} color="#f59e0b" />
              <Text style={styles.artistRatingText}>{artist.rating}</Text>
            </View>
            <Text style={styles.artistSpecialty}>{artist.specialty}</Text>
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render popup content based on selection
  const renderPopupContent = () => {
    switch(popupContent) {
      case 'features':
        return (
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              {featuredServices.map(item => (
                <TouchableOpacity key={item.id} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Icon name={item.icon} size={24} color="#4f46e5" />
                  </View>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'services':
        return (
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Services</Text>
            <FlatList
              data={services}
              renderItem={({item, index}) => renderServiceCard(item, index)}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.popupList}
            />
          </View>
        );
      case 'tickets':
        return (
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Tickets</Text>
            <FlatList
              data={events}
              renderItem={({item, index}) => renderEventCard(item, index)}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.popupList}
            />
          </View>
        );
      case 'artists':
        return (
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Artists</Text>
            <FlatList
              data={artists}
              renderItem={({item, index}) => renderArtistCard(item, index)}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.popupList}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const headerTranslateY = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const headerOpacity = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>

      
      {/* Main Content with Blob Navigation */}
      <View style={styles.mainContent}>
        <View style={styles.blobSection}>
          {/* Center Blob - Main Events */}
          {renderBlob(
            { top: '50%', left: '50%', marginLeft: -50, marginTop: -50 },
            ['#4f46e5', '#818cf8'],
            () => handleBlobPress('events')
          )}
          
          {/* Top Blob - Features */}
          {renderBlob(
            { top: 10, left: '50%', marginLeft: -40 },
            ['#0ea5e9', '#38bdf8'],
            () => showPopup('features')
          )}
          
          {/* Left Blob - Services */}
          {renderBlob(
            { top: '50%', left: 10, marginTop: -40 },
            ['#059669', '#10b981'],
            () => showPopup('services')
          )}
          
          {/* Right Blob - Artists */}
          {renderBlob(
            { top: '50%', right: 10, marginTop: -40 },
            ['#d946ef', '#f472b6'],
            () => showPopup('artists')
          )}
          
          {/* Bottom Blob - Tickets */}
          {renderBlob(
            { bottom: 10, left: '50%', marginLeft: -40 },
            ['#f59e0b', '#fbbf24'],
            () => showPopup('tickets')
          )}
          
          {/* Blob Labels */}
          <View style={[styles.blobLabel, styles.topLabel]}>
            <Text style={styles.blobLabelText}>Features</Text>
          </View>
          <View style={[styles.blobLabel, styles.leftLabel]}>
            <Text style={styles.blobLabelText}>Services</Text>
          </View>
          <View style={[styles.blobLabel, styles.rightLabel]}>
            <Text style={styles.blobLabelText}>Artists</Text>
          </View>
          <View style={[styles.blobLabel, styles.bottomLabel]}>
            <Text style={styles.blobLabelText}>Tickets</Text>
          </View>
          <View style={[styles.blobLabel, styles.centerLabel]}>
            <Text style={styles.blobLabelText}>Events</Text>
          </View>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, services, artists..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Icon name="x" size={16} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Events Section */}
          {activeSection === 'events' && (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Categories */}
              <View style={styles.categoriesSection}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        activeCategory === category.name && styles.categoryButtonActive
                      ]}
                      onPress={() => setActiveCategory(category.name)}
                    >
                      <Icon 
                        name={category.icon} 
                        size={16} 
                        color={activeCategory === category.name ? '#ffffff' : '#4f46e5'} 
                        style={styles.categoryIcon}
                      />
                      <Text
                        style={[
                          styles.categoryButtonText,
                          activeCategory === category.name && styles.categoryButtonTextActive
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Trending Events */}
              <View style={styles.trendingSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Trending</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.trendingScroll}
                >
                  {events.map((event, index) => (
                    <TouchableOpacity 
                      key={event.id} 
                      style={styles.trendingCard}
                      activeOpacity={0.9}
                    >
                      <View style={[
                        styles.trendingImageContainer, 
                        {backgroundColor: cardGradients[index % cardGradients.length][0]}
                      ]}>
                        <Icon name="calendar" size={24} color="#ffffff" />
                      </View>
                      <View style={styles.trendingContent}>
                        <Text style={styles.trendingTitle}>{event.name}</Text>
                        <View style={styles.trendingInfo}>
                          <Icon name="map-pin" size={12} color="#6b7280" />
                          <Text style={styles.trendingInfoText}>{event.location}</Text>
                        </View>
                        <View style={styles.trendingPrice}>
                          <Text style={styles.trendingPriceText}>{event.price}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Events List */}
              <View style={styles.eventsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Upcoming Events</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>
                {filteredEvents.map((event, index) => renderEventCard(event, index))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      
      {/* Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandleBar} />
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setPopupVisible(false)}
              >
                <Icon name="x" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {renderPopupContent()}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerWelcome: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
    marginRight: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  blobSection: {
    height: 300,
    position: 'relative',
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  blobContainer: {
    width: 100,
    height: 100,
    position: 'absolute',
    zIndex: 5,
  },
  blobLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    zIndex: 10,
  },
  blobLabelText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '600',
  },
  topLabel: {
    top: 20,
    left: '50%',
    marginLeft: -30,
  },
  leftLabel: {
    top: '50%',
    left: 20,
    marginTop: -12,
  },
  rightLabel: {
    top: '50%',
    right: 20,
    marginTop: -12,
  },
  bottomLabel: {
    bottom: 20,
    left: '50%',
    marginLeft: -25,
  },
  centerLabel: {
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
    position: 'relative',
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    position: 'absolute',
    left: 35,
    top: 14,
  },
  clearButton: {
    position: 'absolute',
    right: 35,
    top: 14,
    width: 20,
    height: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  categoriesScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryButton: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#4f46e5',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryButtonText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  trendingSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
  trendingScroll: {
    paddingBottom: 8,
  },
  trendingCard: {
    width: 160,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  trendingImageContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingContent: {
    padding: 12,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  trendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  trendingInfoText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  trendingPrice: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  trendingPriceText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '600',
  },
  eventsSection: {
    marginBottom: 80,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  eventImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  eventBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventIcon: {
    opacity: 0.8,
  },
  eventContent: {
    padding: 16,
  },
  eventDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
  },
  buyButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  serviceCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  serviceImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  serviceBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  priceText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '700',
  },
  serviceDetails: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceIcon: {
    marginRight: 6,
  },
  serviceInfoText: {
    fontSize: 14,
    color: '#4b5563',
  },
  artistCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  artistImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  artistBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistContent: {
    padding: 16,
  },
  artistName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  artistDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  artistFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  artistRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistRatingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  artistSpecialty: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 20,
    paddingTop: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#4f46e5',
    paddingTop: 2,
    marginTop: -4,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#9ca3af',
  },
  navTextActive: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemCenterIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#4f46e5',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginTop: -25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  modalHandleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#d1d5db',
    borderRadius: 3,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 0,
    top: 8,
    padding: 5,
  },
  popupContent: {
    paddingTop: 10,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  popupList: {
    paddingBottom: 30,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  featureItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'center',
  },
});