import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated';
const ticket1 = require('../../assets/images/first.jpeg');
const ticket2 = require('../../assets/images/fourth.jpeg');
const ticket3 = require('../../assets/images/secend.jpg');
const ticket4 = require('../../assets/images/third.jpg');


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Define the Ticket type for strong typing
interface Ticket {
  id: number;
  title: string;
  city: string;
  venue: string;
  price: number;
  date: string;
  time: string;
  image: any;
  popular: boolean;
  availableTickets: number;
  rating: number;
}

// Enhanced dummy data with more details
const dummyTickets: Ticket[] = [
  {
    id: 1,
    title: 'DJ Party Casablanca',
    city: 'Casablanca',
    venue: 'Ocean Club',
    price: 150,
    date: '2025-06-01',
    time: '22:00',
    image: ticket1, // Correctly referenced static asset
    popular: true,
    availableTickets: 45,
    rating: 4.7,
  },
  {
    id: 2,
    title: 'Art Expo Marrakech',
    city: 'Marrakech',
    venue: 'Bahia Palace',
    price: 80,
    date: '2025-06-15',
    time: '10:00',
    image: ticket2, // Correctly referenced static asset
    popular: false,
    availableTickets: 120,
    rating: 4.2,
  },
  {
    id: 3,
    title: 'Jazz Night Rabat',
    city: 'Rabat',
    venue: 'Jazz Club',
    price: 100,
    date: '2025-07-05',
    time: '20:00',
    image: ticket3, // Correctly referenced static asset
    popular: true,
    availableTickets: 30,
    rating: 4.8,
  },
  {
    id: 4,
    title: 'Food & Wine Festival',
    city: 'Agadir',
    venue: 'Beach Resort',
    price: 200,
    date: '2025-08-12',
    time: '12:00',
    image: ticket4, // Correctly referenced static asset
    popular: false,
    availableTickets: 80,
    rating: 4.5,
  },
];

const categories = [
  { id: 'musique', name: 'Musique', icon: 'musical-notes' },
  { id: 'theatre', name: 'Theatre', icon: 'film' },
  { id: 'comedie', name: 'Comedie', icon: 'happy' },
  { id: 'sport', name: 'Sport', icon: 'basketball' },
  { id: 'concert', name: 'Concert', icon: 'mic' },
  { id: 'festival', name: 'Festival', icon: 'star' },
  { id: 'formation', name: 'Formation', icon: 'school' },
  { id: 'famille', name: 'Famille & Loisirs', icon: 'people' },
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const TicketsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollY = useSharedValue(0);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    // Simulate API fetch delay
    setTimeout(() => {
      setTickets(dummyTickets);
      setLoading(false);
    }, 800);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTickets().finally(() => setRefreshing(false));
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredTickets = () => {
    if (selectedCategory === 'all') return filteredTickets;
    // In a real app, you would filter by actual categories
    // This is just a simulation
    const categoryMap: Record<string, string[]> = {
      musique: ['Musique', 'DJ', 'Concert'],
      theatre: ['Theatre'],
      comedie: ['Comedie'],
      sport: ['Sport'],
      concert: ['Concert'],
      festival: ['Festival'],
      formation: ['Formation'],
      famille: ['Famille', 'Loisirs'],
    };
    
    return filteredTickets.filter(ticket => {
      const keywords = categoryMap[selectedCategory] || [];
      return keywords.some(keyword => ticket.title.includes(keyword));
    });
  };

  // Popular ticket card for horizontal scrolling
  const renderPopularTicketCard: import('react-native').ListRenderItem<Ticket> = ({ item, index }) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).springify()}
      style={styles.popularTicketCard}
    >
      <Image source={item.image} style={styles.popularTicketImage} />
      <View style={styles.popularTicketOverlay}>
        <BlurView intensity={70} style={styles.blurContainer}>
          <View style={styles.popularTicketContent}>
            <View>
              <Text style={styles.popularTicketTitle}>{item.title}</Text>
              <View style={styles.ticketMeta}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#FFFFFF" />
                <Text style={styles.metaText}>{item.city}</Text>
              </View>
              <View style={styles.ticketMeta}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={styles.metaText}>{formatDate(item.date)} | {item.time}</Text>
              </View>
            </View>
            <View style={styles.ticketBottom}>
              <Text style={styles.popularTicketPrice}>{item.price} MAD</Text>
              <TouchableOpacity 
                style={styles.viewDetailsButton}
                onPress={() => router.push({ pathname: '/(client)/(hidden)/ticket/[ticket]', params: { ticket: item.id.toString() } })}
              >
                <Text style={styles.viewDetailsText}>View</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </Animated.View>
  );

  // Regular ticket card for vertical list
  const renderTicketCard: import('react-native').ListRenderItem<Ticket> = ({ item, index }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.ticketCard}
    >
      <Image source={item.image} style={styles.ticketImage} />
      <View style={styles.ticketDetails}>
        <View style={styles.ticketContent}>
          <View style={styles.titleRow}>
            <Text style={styles.ticketTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.ticketMeta}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#6C63FF" />
              <Text style={styles.ticketLocation}>{item.venue}, {item.city}</Text>
            </View>
            
            <View style={styles.ticketMeta}>
              <Ionicons name="calendar-outline" size={16} color="#6C63FF" />
              <Text style={styles.ticketDate}>{formatDate(item.date)}</Text>
            </View>
          </View>
          
          <View style={styles.ticketFooter}>
            <Text style={styles.ticketPrice}>{item.price} MAD</Text>
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityText}>
                {item.availableTickets < 50 ? `Only ${item.availableTickets} left` : 'Available'}
              </Text>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => router.push({ pathname: '/(client)/(hidden)/ticket/[ticket]', params: { ticket: item.id.toString() } })}
              >
                <Text style={styles.buyButtonText}>Buy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderCategoryItem = ({ item }: { item: { id: string; name: string; icon: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={18}
        color={selectedCategory === item.id ? '#FFFFFF' : '#6C63FF'}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextSelected,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading amazing events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />
        }
      >
        <View style={styles.header}>
          <View>

          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6C63FF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, artists, venues..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <Text style={styles.sectionTitle}>
          <Ionicons name="flame" size={20} color="#FF4757" /> Popular Events
        </Text>
        
        <AnimatedFlatList
          data={tickets.filter((ticket) => ticket.popular)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPopularTicketCard}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth * 0.85 + 15}
          decelerationRate="fast"
          contentContainerStyle={styles.popularTicketsList}
        />

        <View style={styles.upcomingHeader}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="calendar" size={20} color="#6C63FF" /> Upcoming Events
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {getFilteredTickets().length > 0 ? (
          <FlatList
            data={getFilteredTickets()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTicketCard}
            scrollEnabled={false}
            contentContainerStyle={styles.ticketsList}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Feather name="search" size={60} color="#E0E0E0" />
            <Text style={styles.noResultsText}>No events found</Text>
            <Text style={styles.noResultsSubtext}>Try different search keywords</Text>
          </View>
        )}
      </Animated.ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollViewContent: {
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  profileButton: {
    height: 45,
    width: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryItemSelected: {
    backgroundColor: '#6C63FF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C63FF',
    marginLeft: 6,
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  popularTicketsList: {
    paddingHorizontal: 20,
  },
  popularTicketCard: {
    width: screenWidth * 0.85,
    height: 200,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  popularTicketImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  popularTicketOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-end',
  },
  popularTicketContent: {
    justifyContent: 'space-between',
    flex: 1,
  },
  popularTicketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  ticketBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  popularTicketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginRight: 5,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 5,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '500',
  },
  ticketsList: {
    paddingHorizontal: 20,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  ticketImage: {
    width: '100%',
    height: 150,
  },
  ticketContent: {
    padding: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginLeft: 2,
  },
  infoRow: {
    marginBottom: 12,
  },
  ticketLocation: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 5,
  },
  ticketDate: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 5,
  },
  ticketDetails: {
    flex: 1,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 10,
  },
  buyButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 10,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 5,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  activeTabText: {
    color: '#6C63FF',
    fontWeight: '500',
  },
});

export { dummyTickets };
export default TicketsScreen;