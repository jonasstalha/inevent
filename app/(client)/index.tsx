import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { dummyTickets } from './tickets';

const { width, height } = Dimensions.get('window');

interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
  location: string;
  image: string;
  price: string;
}

interface Service {
  id: number;
  title: string;
  available: string;
  location: string;
  reviews: string;
  orders: string;
  price: string;
  image: string;
}

interface Artist {
  id: number;
  name: string;
  description: string;
  specialty: string;
  rating: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface NavigationItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colors: [string, string];
  onPress: () => void;
  badge?: boolean;
}

interface FeaturedService {
  id: number;
  title: string;
  icon: string;
}

const cardGradients: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3']
];

const categories = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'wedding', name: 'Wedding', icon: 'heart' },
  { id: 'conference', name: 'Conference', icon: 'briefcase' },
  { id: 'photography', name: 'Photography', icon: 'camera' },
  { id: 'kids', name: 'Kids', icon: 'smile' },
  { id: 'music', name: 'DJ', icon: 'music' }
];

const dummyEvents = [
  {
    id: 1,
    name: 'Summer Wedding Expo',
    description: 'Discover the latest wedding trends and connect with top vendors',
    category: 'Wedding',
    date: 'May 25, 2025',
    location: 'Grand Hall',
    image: 'https://via.placeholder.com/300',
    price: '$45'
  },
  {
    id: 2,
    name: 'Tech Conference 2025',
    description: 'The biggest tech event of the year with industry leaders',
    category: 'Conference',
    date: 'May 30, 2025',
    location: 'Convention Center',
    image: 'https://via.placeholder.com/300',
    price: '$120'
  },
  {
    id: 3,
    name: 'Portrait Photography Masterclass',
    description: 'Learn from the best photographers in the industry',
    category: 'Photography',
    date: 'June 5, 2025',
    location: 'Art Studio',
    image: 'https://via.placeholder.com/300',
    price: '$85'
  }
];

export default function EventApp() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSection, setActiveSection] = useState('events');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState<'features' | 'services' | 'events' | 'artists' | 'tickets'>('features');
  const [searchQuery, setSearchQuery] = useState('');
  const [events] = useState(dummyEvents);
  const [services] = useState([
    {
      id: 1,
      title: 'Premium Catering',
      available: 'Available',
      location: 'City Center',
      reviews: '4.9 (120 reviews)',
      orders: '240 orders',
      price: '$1,200',
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 2,
      title: 'Luxury Venue',
      available: 'Limited',
      location: 'Riverside',
      reviews: '4.8 (95 reviews)',
      orders: '180 orders',
      price: '$3,500',
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
    }
  ]);

  const artists = [
    {
      id: 1,
      name: 'Alex Morgan',
      description: 'Professional wedding & event photographer with 8+ years experience',
      specialty: 'Photography',
      rating: 4.8,
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 2,
      name: 'DJ Maximus',
      description: 'Top-rated DJ specializing in weddings and corporate events',
      specialty: 'Music',
      rating: 4.9,
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 3,
      name: 'Creative Caterers',
      description: 'Award-winning catering service with gourmet cuisine',
      specialty: 'Catering',
      rating: 4.7,
      image: 'https://via.placeholder.com/300'
    }
  ];

  // Animated values
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const [animatedValues] = useState(() => ({
    scale: new Animated.Value(1),
    press: new Animated.Value(1),
    navigation: new Animated.Value(0),
    cards: Array(5).fill(0).map(() => new Animated.Value(0)),
    wiggle: new Animated.Value(0),
    pulse: new Animated.Value(1),
  }));

  // Navigation items with proper hooks
  const navigationItems = useMemo(() => [
    {
      id: 'features',
      title: 'Features',
      subtitle: 'Explore all',
      icon: 'grid',
      colors: ['#4f46e5', '#818cf8'] as [string, string],
      onPress: () => handleShowPopup('features'),
      badge: true,
    },
    {
      id: 'events',
      title: 'Events',
      subtitle: 'Discover amazing',
      icon: 'calendar',
      colors: ['#d946ef', '#f472b6'] as [string, string],
      onPress: () => handleSectionChange('events'),
    },
    {
      id: 'artists',
      title: 'Artists',
      subtitle: 'Meet creators',
      icon: 'users',
      colors: ['#0ea5e9', '#38bdf8'] as [string, string],
      onPress: () => handleShowPopup('artists'),
    },
    {
      id: 'tickets',
      title: 'Tickets',
      subtitle: 'Book now',
      icon: 'ticket',
      colors: ['#f59e0b', '#fbbf24'] as [string, string],
      onPress: () => handleShowPopup('tickets'),
    },
  ], []);

  const handleShowPopup = (content: 'features' | 'services' | 'events' | 'artists' | 'tickets') => {
    setPopupContent(content);
    setPopupVisible(true);
  };

  const handleSectionChange = (sectionName: string) => {
    setActiveSection(sectionName);
  };

  // Animation setup
  useEffect(() => {
    const cardAnimations = animatedValues.cards.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        delay: index * 100,
        damping: 15,
        mass: 0.8,
        stiffness: 100,
      })
    );

    Animated.parallel([
      Animated.spring(animatedValues.navigation, {
        toValue: 1,
        useNativeDriver: true,
        damping: 12,
        mass: 0.9,
        stiffness: 100,
      }),
      Animated.spring(headerAnimation, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        mass: 0.8,
        stiffness: 100,
      }),
      ...cardAnimations,
    ]).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.pulse, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Enhanced animation values
  // const headerAnimation = useRef(new Animated.Value(0)).current;  // Initialize animated values first
  // const [animatedValues] = useState(() => {
  //   const defaultValues = {
  //     scale: new Animated.Value(1),
  //     press: new Animated.Value(1),
  //     navigation: new Animated.Value(0),
  //     wiggle: new Animated.Value(0),
  //     pulse: new Animated.Value(1),
  //   };

  //   // Add card animations later after navigation items are defined
  //   return {
  //     ...defaultValues,
  //     cards: Array(5).fill(0).map(() => new Animated.Value(0)),
  //   };
  // });

  // Enhanced animations on mount
  // useEffect(() => {
  //   const cardAnimations = animatedValues.cards.map((anim, index) =>
  //     Animated.spring(anim, {
  //       toValue: 1,
  //       useNativeDriver: true,
  //       delay: index * 100,
  //       damping: 15,
  //       mass: 0.8,
  //       stiffness: 100,
  //     })
  //   );

  //   Animated.parallel([
  //     Animated.spring(animatedValues.navigation, {
  //       toValue: 1,
  //       useNativeDriver: true,
  //       damping: 12,
  //       mass: 0.9,
  //       stiffness: 100,
  //     }),
  //     Animated.spring(headerAnimation, {
  //       toValue: 1,
  //       useNativeDriver: true,
  //       damping: 15,
  //       mass: 0.8,
  //       stiffness: 100,
  //     }),
  //     ...cardAnimations,
  //   ]).start();

  //   // Pulse animation for badges
  //   const pulseAnimation = Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(animatedValues.pulse, {
  //         toValue: 1.2,
  //         duration: 1000,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(animatedValues.pulse, {
  //         toValue: 1,
  //         duration: 1000,
  //         useNativeDriver: true,
  //       }),
  //     ])
  //   );
  //   pulseAnimation.start();

  //   return () => pulseAnimation.stop();
  // }, []);
  // Enhanced navigation item renderer with better animations
  const renderNavItem = (item: NavigationItem, index: number) => {
    const cardAnim = animatedValues.cards[index];

    const scale = cardAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    const opacity = cardAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const translateY = cardAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0],
    });

    const handlePress = () => {
      // Enhanced press animation with haptic feedback
      Animated.sequence([
        Animated.timing(animatedValues.press, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(animatedValues.press, {
          toValue: 1,
          useNativeDriver: true,
          damping: 8,
          mass: 0.5,
        }),
      ]).start();

      item.onPress();
    };

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.navItem,
          {
            transform: [{ scale }, { translateY }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItemContent}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          {/* Enhanced gradient background */}
          <View style={[styles.navItemGradient, {
            backgroundColor: item.colors[0],
          }]}>
            {/* Glassmorphism overlay */}
            <View style={styles.glassmorphismOverlay} />

            {/* Main icon */}
            <View style={styles.navIconContainer}>
              <Icon name={item.icon} size={28} color="#fff" />
            </View>

            {/* Enhanced badge with pulse animation */}
            {item.badge && (
              <Animated.View
                style={[
                  styles.enhancedBadge,
                  { transform: [{ scale: animatedValues.pulse }] }
                ]}
              >
                <Text style={styles.badgeText}>New</Text>
                <View style={styles.badgePulse} />
              </Animated.View>
            )}

            {/* Floating particles effect */}
            <View style={styles.particleContainer}>
              <View style={[styles.particle, styles.particle1]} />
              <View style={[styles.particle, styles.particle2]} />
              <View style={[styles.particle, styles.particle3]} />
            </View>
          </View>

          {/* Enhanced text section */}
          <View style={styles.navTextContainer}>
            <Text style={styles.navItemLabel}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.navItemSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Enhanced event card renderer
  const renderEventCard = (event: Event, index: number) => {
    const gradientIndex = index % cardGradients.length;

    return (
      <TouchableOpacity
        key={event.id}
        style={styles.enhancedEventCard}
        onPress={() => { }}
        activeOpacity={0.95}
      >
        <View style={styles.eventCardHeader}>
          <View style={[styles.eventImageContainer, { backgroundColor: cardGradients[gradientIndex][0] }]}>
            <Icon name="calendar" size={24} color="#ffffff" style={styles.eventIcon} />
            <View style={styles.eventCardOverlay} />
          </View>
          <View style={styles.eventDateBadge}>
            <Text style={styles.eventDateText}>{event.date.split(',')[0]}</Text>
            <Text style={styles.eventMonthText}>{event.date.split(',')[1]}</Text>
          </View>
        </View>

        <View style={styles.enhancedEventContent}>
          <View style={styles.eventTitleSection}>
            <Text style={styles.enhancedEventTitle}>{event.name}</Text>
            <View style={styles.eventCategoryBadge}>
              <Text style={styles.eventCategoryText}>{event.category}</Text>
            </View>
          </View>

          <Text style={styles.enhancedEventDescription}>{event.description}</Text>

          <View style={styles.enhancedEventFooter}>
            <View style={styles.eventLocationContainer}>
              <View style={styles.locationIconContainer}>
                <Icon name="map-pin" size={14} color="#6b7280" />
              </View>
              <Text style={styles.eventLocationText}>{event.location}</Text>
            </View>
            <View style={styles.eventPriceContainer}>
              <Text style={styles.eventPriceLabel}>From</Text>
              <Text style={styles.enhancedEventPrice}>{event.price}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.enhancedBuyButton}>
            <Text style={styles.buyButtonText}>Book Now</Text>
            <Icon name="arrow-right" size={16} color="#fff" style={styles.buyButtonIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Enhanced service card renderer
  const renderServiceCard = (service: Service, index: number) => {
    const gradientIndex = index % cardGradients.length;

    return (
      <TouchableOpacity
        key={service.id}
        style={styles.enhancedServiceCard}
        onPress={() => { }}
        activeOpacity={0.95}
      >
        <View style={styles.serviceCardHeader}>
          <View style={[styles.serviceImageContainer, { backgroundColor: cardGradients[gradientIndex][0] }]}>
            <Icon name="package" size={20} color="#ffffff" />
            <View style={styles.serviceCardOverlay} />
          </View>
          <View style={styles.servicePriceBadge}>
            <Text style={styles.servicePriceText}>{service.price}</Text>
          </View>
          <View style={styles.serviceAvailabilityBadge}>
            <View style={[styles.availabilityDot, {
              backgroundColor: service.available === 'Available' ? '#10b981' : '#f59e0b'
            }]} />
            <Text style={styles.availabilityText}>{service.available}</Text>
          </View>
        </View>

        <View style={styles.enhancedServiceDetails}>
          <Text style={styles.enhancedServiceTitle}>{service.title}</Text>

          <View style={styles.serviceMetrics}>
            <View style={styles.serviceMetric}>
              <Icon name="map-pin" size={12} color="#6b7280" />
              <Text style={styles.serviceMetricText}>{service.location}</Text>
            </View>
            <View style={styles.serviceMetric}>
              <Icon name="star" size={12} color="#f59e0b" />
              <Text style={styles.serviceMetricText}>{service.reviews}</Text>
            </View>
            <View style={styles.serviceMetric}>
              <Icon name="shopping-bag" size={12} color="#6b7280" />
              <Text style={styles.serviceMetricText}>{service.orders}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Enhanced artist card renderer
  const renderArtistCard = (artist: Artist, index: number) => {
    const gradientIndex = index % cardGradients.length;

    return (
      <TouchableOpacity
        key={artist.id}
        style={styles.enhancedArtistCard}
        onPress={() => { }}
        activeOpacity={0.95}
      >
        <View style={styles.artistCardHeader}>
          <View style={[styles.artistImageContainer, { backgroundColor: cardGradients[gradientIndex][0] }]}>
            <Icon name="user" size={24} color="#ffffff" />
            <View style={styles.artistCardOverlay} />
          </View>
          <View style={styles.artistRatingBadge}>
            <Icon name="star" size={12} color="#f59e0b" />
            <Text style={styles.artistRatingText}>{artist.rating}</Text>
          </View>
        </View>

        <View style={styles.enhancedArtistContent}>
          <View style={styles.artistTitleSection}>
            <Text style={styles.enhancedArtistName}>{artist.name}</Text>
            <View style={styles.artistSpecialtyBadge}>
              <Text style={styles.artistSpecialtyText}>{artist.specialty}</Text>
            </View>
          </View>

          <Text style={styles.enhancedArtistDescription}>{artist.description}</Text>

          <TouchableOpacity style={styles.enhancedContactButton}>
            <Icon name="message-circle" size={16} color="#fff" style={styles.contactButtonIcon} />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Enhanced popup content renderer
  const renderPopupContent = () => {
    switch (popupContent) {
      case 'features':
        return (
          <View style={styles.enhancedPopupContent}>
            <View style={styles.popupTitleContainer}>
              <Text style={styles.enhancedPopupTitle}>Discover Features</Text>
              <Text style={styles.popupSubtitle}>Everything you need for perfect events</Text>
            </View>
            <View style={styles.enhancedFeaturesGrid}>
              {featuredServices.map((item, index) => (
                <TouchableOpacity key={item.id} style={styles.enhancedFeatureItem}>
                  <View style={[styles.enhancedFeatureIcon, {
                    backgroundColor: cardGradients[index % cardGradients.length][0],
                  }]}>
                    <Icon name={item.icon} size={24} color="#fff" />
                  </View>
                  <Text style={styles.enhancedFeatureTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'services':
        return (
          <View style={styles.enhancedPopupContent}>
            <View style={styles.popupTitleContainer}>
              <Text style={styles.enhancedPopupTitle}>Premium Services</Text>
              <Text style={styles.popupSubtitle}>Professional services for your events</Text>
            </View>
            <FlatList
              data={services}
              renderItem={({ item, index }) => renderServiceCard(item, index)}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.enhancedPopupList}
            />
          </View>
        );
      case 'tickets':
        return (
          <View style={styles.enhancedPopupContent}>
            <View style={styles.popupTitleContainer}>
              <Text style={styles.enhancedPopupTitle}>Event Tickets</Text>
              <Text style={styles.popupSubtitle}>Book your spot at amazing events</Text>
            </View>
            <FlatList
              data={events}
              renderItem={({ item, index }) => renderEventCard(item, index)}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.enhancedPopupList}
            />
          </View>
        );
      case 'artists':
        return (
          <View style={styles.enhancedPopupContent}>
            <View style={styles.popupTitleContainer}>
              <Text style={styles.enhancedPopupTitle}>Featured Artists</Text>
              <Text style={styles.popupSubtitle}>Connect with talented professionals</Text>
            </View>
            <FlatList
              data={artists}
              renderItem={({ item, index }) => renderArtistCard(item, index)}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.enhancedPopupList}
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

  // UI helper functions
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getGreeting = () => {
    return `Good ${getTimeOfDay()}${user?.name ? `, ${user.name.split(' ')[0]}` : ''}!`;
  };

  // Enhanced navigation data
  // const navigationItems: NavigationItem[] = [
  //   {
  //     id: 'features',
  //     title: 'Features',
  //     subtitle: 'Explore all',
  //     icon: 'grid',
  //     colors: ['#4f46e5', '#818cf8'],
  //     onPress: () => showPopup('features'),
  //     badge: true,
  //   },
  //   {
  //     id: 'services',
  //     title: 'Services',
  //     subtitle: 'Premium quality',
  //     icon: 'package',
  //     colors: ['#059669', '#10b981'],
  //     onPress: () => showPopup('services'),
  //   },
  //   {
  //     id: 'events',
  //     title: 'Events',
  //     subtitle: 'Discover amazing',
  //     icon: 'calendar',
  //     colors: ['#d946ef', '#f472b6'],
  //     onPress: () => handleSectionChange('events'),
  //   },
  //   {
  //     id: 'artists',
  //     title: 'Artists',
  //     subtitle: 'Meet creators',
  //     icon: 'users',
  //     colors: ['#0ea5e9', '#38bdf8'],
  //     onPress: () => showPopup('artists'),
  //   },
  //   {
  //     id: 'tickets',
  //     title: 'Tickets',
  //     subtitle: 'Book now',
  //     icon: 'ticket',
  //     colors: ['#f59e0b', '#fbbf24'],
  //     onPress: () => showPopup('tickets'),
  //   },
  // ];

  const categories: Category[] = [
    { id: 'mariage', name: 'Mariage', icon: 'heart' },
    { id: 'anniversaire', name: 'Anniversaire', icon: 'gift' },
    { id: 'traiteur', name: 'Traiteur', icon: 'restaurant' },
    { id: 'musique', name: 'Musique', icon: 'music' },
    { id: 'neggafa', name: 'Neggafa', icon: 'user' },
    { id: 'conference', name: 'Conference', icon: 'briefcase' },
    { id: 'evenement', name: "Evenement d'entreprise", icon: 'users' },
    { id: 'kermesse', name: 'Kermesse', icon: 'smile' },
    { id: 'henna', name: 'Henna', icon: 'leaf' },
    { id: 'photographie', name: 'Photographie', icon: 'camera' },
    { id: 'animation', name: 'Animation', icon: 'film' },
    { id: 'decoration', name: 'Decoration', icon: 'award' },
    { id: 'buffet', name: 'Buffet', icon: 'coffee' },
  ];

  const featuredServices: FeaturedService[] = [
    { id: 1, title: 'Catering', icon: 'coffee' },
    { id: 2, title: 'Venues', icon: 'home' },
    { id: 3, title: 'Photography', icon: 'camera' },
    { id: 4, title: 'Music', icon: 'music' },
    { id: 5, title: 'Decoration', icon: 'award' },
    { id: 6, title: 'Planning', icon: 'calendar' }
  ];

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter(event => event.category === activeCategory); return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1, paddingBottom: 20 }}>
          {/* Enhanced Header Section */}
          <Animated.View style={[styles.enhancedHeader, {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }]}>


            {/* Enhanced Search Bar */}
            <View style={styles.enhancedSearchContainer}>
              <View style={styles.searchInputContainer}>
                <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                  style={styles.enhancedSearchInput}
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
            </View>
          </Animated.View>

          <View style={styles.mainContent}>
            <View style={styles.enhancedNavigationSection}>
              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>240+</Text>
                  <Text style={styles.statLabel}>Events</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50+</Text>
                  <Text style={styles.statLabel}>Artists</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>120+</Text>
                  <Text style={styles.statLabel}>Services</Text>
                </View>
              </View>

              {/* Enhanced Navigation Grid */}
              <View style={styles.enhancedNavGrid}>
                {navigationItems.map((item, index) => renderNavItem(item, index))}
              </View>

              {/* Content Container */}
              <View style={styles.contentContainer}>
                {/* Events Section */}
                {activeSection === 'events' && (
                  <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Enhanced Trending Events */}
                    <View style={styles.enhancedTrendingSection}>
                      <View style={styles.enhancedSectionHeader}>
                        <View>
                          <Text style={styles.enhancedSectionTitle}>Trending Now</Text>
                          <Text style={styles.sectionSubtitle}>Popular events this week</Text>
                        </View>
                        <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/(client)/tickets')}>
                          <Text style={styles.seeAllText}>See all</Text>
                          <Icon name="arrow-right" size={14} color="#4f46e5" />
                        </TouchableOpacity>
                      </View>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.trendingScroll}
                      >
                        {dummyTickets.slice(0, 8).map((ticket, index) => (
                          <TouchableOpacity
                            key={ticket.id}
                            style={styles.enhancedTrendingCard}
                            activeOpacity={0.9}
                            onPress={() => router.push({ pathname: '/(client)/(hidden)/ticket/[ticket]', params: { ticket: ticket.id.toString() } })}
                          >
                            <View style={[
                              styles.trendingImageContainer,
                              { backgroundColor: cardGradients[index % cardGradients.length][0] }
                            ]}>
                              <Icon name="calendar" size={24} color="#ffffff" />
                              <View style={styles.trendingCardOverlay} />
                            </View>
                            <View style={styles.enhancedTrendingContent}>
                              <Text style={styles.enhancedTrendingTitle}>{ticket.title}</Text>
                              <View style={styles.trendingInfo}>
                                <Icon name="map-pin" size={12} color="#6b7280" />
                                <Text style={styles.trendingInfoText}>{ticket.venue}, {ticket.city}</Text>
                              </View>
                              <View style={styles.enhancedTrendingPrice}>
                                <Text style={styles.trendingPriceText}>{ticket.price} MAD</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Enhanced Categories - moved below Trending Now */}
                    <View style={styles.enhancedCategoriesSection}>
                      <Text style={styles.enhancedSectionTitle}>Categories</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                        {categories.map(category => (
                          <TouchableOpacity
                            key={category.id}
                            style={[
                              styles.enhancedCategoryButton,
                              activeCategory === category.name && styles.enhancedCategoryButtonActive
                            ]}
                            onPress={() => setActiveCategory(category.name)}
                          >
                            <View style={styles.categoryIconContainer}>
                              <Icon
                                name={category.icon}
                                size={16}
                                color={activeCategory === category.name ? '#ffffff' : '#4f46e5'}
                              />
                            </View>
                            <Text
                              style={[
                                styles.enhancedCategoryButtonText,
                                activeCategory === category.name && styles.enhancedCategoryButtonTextActive
                              ]}
                            >
                              {category.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Enhanced Events List */}
                    <View style={styles.enhancedEventsSection}>
                      <View style={styles.enhancedSectionHeader}>
                        <View>
                          <Text style={styles.enhancedSectionTitle}>Top Services</Text>
                          <Text style={styles.sectionSubtitle}>Don't miss out on these amazing services</Text>
                        </View>
                        <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push({ pathname: '/(client)/search' })}>
                          <Text style={styles.seeAllText}>See all</Text>
                          <Icon name="arrow-right" size={14} color="#4f46e5" />
                        </TouchableOpacity>
                      </View>
                      {services.slice(0, 8).map((service, index) => renderServiceCard(service, index))}
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </View>

          {/* Enhanced Popup Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isPopupVisible}
            onRequestClose={() => setPopupVisible(false)}
          >
            <View style={styles.enhancedModalOverlay}>
              <View style={styles.enhancedModalContent}>
                <View style={styles.enhancedModalHeader}>
                  <View style={styles.modalHandleBar} />
                  <TouchableOpacity
                    style={styles.enhancedModalCloseButton}
                    onPress={() => setPopupVisible(false)}
                  >
                    <Icon name="x" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                {renderPopupContent()}          </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Enhanced Header Styles
  enhancedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeftSection: {
    flex: 1,
    position: 'relative',
  },
  enhancedHeaderWelcome: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  enhancedHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerAccent: {
    width: 40,
    height: 4,
    backgroundColor: '#4f46e5',
    borderRadius: 2,
    marginTop: 8,
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  enhancedNotificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  enhancedAvatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Enhanced Search Styles
  enhancedSearchContainer: {
    position: 'relative',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  enhancedSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
  },

  // Enhanced Main Content
  mainContent: {
    flex: 1,
    marginTop: 150,
  },
  enhancedNavigationSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  // Quick Stats
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4f46e5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },

  // Enhanced Navigation Grid
  enhancedNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navItem: {
    width: '48%',
    aspectRatio: 1.2,
    marginBottom: 16,
  },
  navItemContent: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  navItemGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  glassmorphismOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  navIconContainer: {
    marginBottom: 8,
    zIndex: 2,
  },
  navTextContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  navItemLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
  },
  navItemSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Enhanced Badge
  enhancedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 3,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  badgePulse: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: '#ef4444',
    borderRadius: 14,
    opacity: 0.3,
  },

  // Particle Effects
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  particle1: {
    top: '20%',
    left: '15%',
  },
  particle2: {
    top: '70%',
    right: '20%',
  },
  particle3: {
    bottom: '30%',
    left: '70%',
  },

  // Content Container
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Enhanced Categories
  enhancedCategoriesSection: {
    marginBottom: 24,
  },
  enhancedSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  enhancedCategoryButton: {
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.1)',
  },
  enhancedCategoryButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryIconContainer: {
    marginRight: 8,
  },
  enhancedCategoryButtonText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
  enhancedCategoryButtonTextActive: {
    color: '#ffffff',
  },

  // Enhanced Section Headers
  enhancedSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 4,
  },
  seeAllText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },

  // Enhanced Trending Section
  enhancedTrendingSection: {
    marginBottom: 32,
  },
  trendingScroll: {
    paddingBottom: 8,
  },
  enhancedTrendingCard: {
    width: 180,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  trendingImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  trendingCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  enhancedTrendingContent: {
    padding: 16,
  },
  enhancedTrendingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 20,
  },
  trendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingInfoText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500',
  },
  enhancedTrendingPrice: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trendingPriceText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '700',
  },

  // Enhanced Events Section
  enhancedEventsSection: {
    marginBottom: 100,
  },

  // Enhanced Event Cards
  enhancedEventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  eventCardHeader: {
    position: 'relative',
  },
  eventImageContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  eventCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  eventIcon: {
    opacity: 0.9,
    zIndex: 2,
  },
  eventDateBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventDateText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4f46e5',
    lineHeight: 16,
  },
  eventMonthText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  enhancedEventContent: {
    padding: 20,
  },
  eventTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  enhancedEventTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
    lineHeight: 26,
  },
  eventCategoryBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  eventCategoryText: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '600',
  },
  enhancedEventDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  enhancedEventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  eventLocationText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  eventPriceContainer: {
    alignItems: 'flex-end',
  },
  eventPriceLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  enhancedEventPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4f46e5',
  },
  enhancedBuyButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  buyButtonIcon: {
    opacity: 0.9,
  },

  // Enhanced Service Cards
  enhancedServiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  serviceCardHeader: {
    position: 'relative',
  },
  serviceImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  serviceCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  servicePriceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  servicePriceText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '800',
  },
  serviceAvailabilityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  enhancedServiceDetails: {
    padding: 16,
  },
  enhancedServiceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  serviceMetrics: {
    gap: 8,
  },
  serviceMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceMetricText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Enhanced Artist Cards
  enhancedArtistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  artistCardHeader: {
    position: 'relative',
  },
  artistImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  artistCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  artistRatingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  artistRatingText: {
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 4,
    fontWeight: '700',
  },
  enhancedArtistContent: {
    padding: 16,
  },
  artistTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  enhancedArtistName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  artistSpecialtyBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  artistSpecialtyText: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '600',
  },
  enhancedArtistDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  enhancedContactButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  contactButtonIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Enhanced Modal Styles
  enhancedModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  enhancedModalContent: {
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: height * 0.85,
  },
  enhancedModalHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  modalHandleBar: {
    width: 48,
    height: 5,
    backgroundColor: '#cbd5e1',
    borderRadius: 3,
  },
  enhancedModalCloseButton: {
    position: 'absolute',
    right: 0,
    top: 12,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Enhanced Popup Content
  enhancedPopupContent: {
    paddingTop: 12,
  },
  popupTitleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  enhancedPopupTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  popupSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  enhancedPopupList: {
    paddingBottom: 40,
  },

  // Enhanced Features Grid
  enhancedFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  enhancedFeatureItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 24,
  },
  enhancedFeatureIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  enhancedFeatureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
});
