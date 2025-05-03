import React, { useState, useEffect } from 'react';
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
  Falsy,
  GestureResponderEvent,
  RecursiveArray,
  RegisteredStyle
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
// Note: You would need to install these packages:
// npm install react-native-svg
// npm install react-native-vector-icons
import Icon from 'react-native-vector-icons/Feather';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

const { width } = Dimensions.get('window');

export default function EventApp() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSection, setActiveSection] = useState('events'); // 'events', 'services', 'artists'
  
  // Animation for blob rotation
  const rotationValue = new Animated.Value(0);
  
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
  
  const categories = [
    'All', 'Mariage', 'Conference', 'Photographie', 'Kids', 'DJ'
  ];
  
  const events = [
    {
      id: 1,
      name: 'Event Name',
      description: 'Description',
      category: 'Mariage'
    },
    {
      id: 2,
      name: 'Event Name',
      description: 'Description',
      category: 'Conference'
    }
  ];

  const services = [
    {
      id: 1,
      title: 'Title',
      available: 'Available/or not',
      location: 'Location',
      reviews: 'Reviews',
      orders: 'Amount of orders',
      price: 'Price'
    },
    {
      id: 2,
      title: 'Title',
      available: 'Available/or not',
      location: 'Location',
      reviews: 'Reviews',
      orders: 'Amount of orders',
      price: 'Price'
    }
  ];

  const artists = [
    {
      id: 1,
      name: 'Prestataire Name',
      description: 'Description'
    },
    {
      id: 2,
      name: 'Prestataire Name',
      description: 'Description'
    }
  ];

  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(event => event.category === activeCategory);
  
  // Custom blob shape SVG path
  const blobPath = "M55.5,27.5Q55,55,27.5,55Q0,55,0,27.5Q0,0,27.5,0Q55,0,55,27.5Z";
  
// Render blob component
const renderBlob = (
  position: string | boolean | ViewStyle | RegisteredStyle<ViewStyle> | RecursiveArray<ViewStyle | Falsy | RegisteredStyle<ViewStyle>> | readonly (ViewStyle | Falsy | RegisteredStyle<ViewStyle>)[] | null | undefined,
  rotationOffset: number,
  onPress: ((event: GestureResponderEvent) => void) | undefined
) => {
  return (
    <TouchableOpacity
      style={[styles.blobContainer, position]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ rotate: spin }], height: "100%", width: "100%" }}>
        <Svg width="100%" height="100%" viewBox="0 0 55 55">
          <Path d={blobPath} fill="#FFC0CB" stroke="#FF69B4" strokeWidth="1" />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
};


  // Render event card
  const renderEventCard = (event: { id: any; name: any; description: any; category?: string; }) => {
    return (
      <View key={event.id} style={styles.eventCard}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
        <View style={styles.eventImagePlaceholder}>
          <Text style={styles.placeholderText}>(Event Image)</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Buy Ticket</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render service card
  const renderServiceCard = (service: { id: any; title: any; available: any; location: any; reviews: any; orders: any; price: any; }) => {
    return (
      <View key={service.id} style={styles.serviceCard}>
        <View style={styles.serviceImageContainer}>
          <Text style={styles.placeholderText}>Service picture</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{service.price}</Text>
        </View>
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.serviceInfo}>{service.available}</Text>
          <Text style={styles.serviceInfo}>{service.location}</Text>
          <Text style={styles.serviceInfo}>{service.reviews}</Text>
          <Text style={styles.serviceInfo}>{service.orders}</Text>
        </View>
      </View>
    );
  };

  // Render artist card
  const renderArtistCard = (artist: { id: any; name: any; description: any; }) => {
    return (
      <View key={artist.id} style={styles.eventCard}>
        <Text style={styles.eventTitle}>{artist.name}</Text>
        <Text style={styles.eventDescription}>{artist.description}</Text>
        <View style={styles.eventImagePlaceholder}>
          <Text style={styles.placeholderText}>(Store Image)</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Book your Event</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hello, "Client Name"</Text>
        <Icon name="bell" size={24} color="#FFF" />
      </View>
      
      {/* Blob Navigation */}
      <View style={styles.blobSection}>
        {/* Top Blob */}
        {renderBlob(
          { top: 10, alignSelf: 'center' },
          0,
          () => setActiveSection('events')
        )}
        
        {/* Left Blob */}
        {renderBlob(
          { top: '50%', left: 10, marginTop: -40 },
          90,
          () => setActiveSection('services')
        )}
        
        {/* Right Blob */}
        {renderBlob(
          { top: '50%', right: 10, marginTop: -40 },
          180,
          () => setActiveSection('artists')
        )}
        
        {/* Bottom Blob */}
        {renderBlob(
          { bottom: 10, alignSelf: 'center' },
          270,
          () => setActiveSection('events')
        )}
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="What do you need ?"
          placeholderTextColor="#888"
        />
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
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
                    key={category}
                    style={[
                      styles.categoryButton,
                      activeCategory === category && styles.categoryButtonActive
                    ]}
                    onPress={() => setActiveCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        activeCategory === category && styles.categoryButtonTextActive
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Events List */}
            <View style={styles.eventsSection}>
              <Text style={styles.sectionTitle}>Events you would like</Text>
              {filteredEvents.map(event => renderEventCard(event))}
            </View>
          </ScrollView>
        )}
        
        {/* Services Section */}
        {activeSection === 'services' && (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Services</Text>
              <Text style={styles.seeAllText}>See all</Text>
            </View>
            
            <View style={styles.servicesGrid}>
              {services.map(service => renderServiceCard(service))}
            </View>
            
            <View style={[styles.sectionHeader, { marginTop: 20 }]}>
              <Text style={styles.sectionTitle}>Featured Artists</Text>
              <Text style={styles.seeAllText}>See all</Text>
            </View>
            
            {artists.map(artist => renderArtistCard(artist))}
          </ScrollView>
        )}
        
        {/* Artists Section */}
        {activeSection === 'artists' && (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Featured Artists</Text>
            {artists.map(artist => renderArtistCard(artist))}
          </ScrollView>
        )}
      </View>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0c2c66',
    paddingVertical: 30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  blobSection: {
    backgroundColor: '#0c2c66',
    height: 310,
    position: 'relative',
  },
  blobContainer: {
    width: 100,
    height: 120,
    position: 'absolute',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingRight: 40,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    position: 'absolute',
    right: 35,
    top: 12,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ff8f0', // double-check this color, might be missing a digit
    marginTop: 16,
  },
  
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c2c66',
    marginBottom: 8,
  },
  categoriesScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryButton: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#4f46e5',
  },
  categoryButtonText: {
    color: '#4f46e5',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  eventsSection: {
    marginBottom: 80,
  },
  eventCard: {
    backgroundColor: '#0c2c66',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    color: '#d1d5db',
    fontSize: 14,
    marginTop: 4,
  },
  eventImagePlaceholder: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  buyButton: {
    backgroundColor: '#4ade80',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buyButtonText: {
    color: '#0c2c66',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#4f46e5',
    fontSize: 14,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 40) / 2,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  serviceImageContainer: {
    backgroundColor: '#fff',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  priceContainer: {
    backgroundColor: '#d1d5db',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  priceText: {
    color: '#4b5563',
    fontSize: 14,
  },
  serviceDetails: {
    backgroundColor: '#0c2c66',
    padding: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  serviceTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceInfo: {
    color: '#d1d5db',
    fontSize: 12,
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#9ca3af',
  },
});