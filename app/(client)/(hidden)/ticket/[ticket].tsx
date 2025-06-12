import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Use the same images as in tickets.tsx
const ticketImages = [
  require('../../../../assets/images/first.jpeg'),
  require('../../../../assets/images/fourth.jpeg'),
  require('../../../../assets/images/secend.jpg'),
  require('../../../../assets/images/third.jpg'),
];

// Use the same dummyTickets as in tickets.tsx
const dummyTickets = [
  {
    id: 1,
    title: 'DJ Party Casablanca',
    city: 'Casablanca',
    venue: 'Ocean Club',
    price: 150,
    date: '2025-06-01',
    time: '22:00',
    image: ticketImages[0],
    popular: true,
    availableTickets: 45,
    rating: 4.7,
    description: 'Join the hottest DJ party in Casablanca at Ocean Club! Enjoy a night of music, dance, and fun.'
  },
  {
    id: 2,
    title: 'Art Expo Marrakech',
    city: 'Marrakech',
    venue: 'Bahia Palace',
    price: 80,
    date: '2025-06-15',
    time: '10:00',
    image: ticketImages[1],
    popular: false,
    availableTickets: 120,
    rating: 4.2,
    description: 'Experience the best of Moroccan art at the Art Expo in the beautiful Bahia Palace.'
  },
  {
    id: 3,
    title: 'Jazz Night Rabat',
    city: 'Rabat',
    venue: 'Jazz Club',
    price: 100,
    date: '2025-07-05',
    time: '20:00',
    image: ticketImages[2],
    popular: true,
    availableTickets: 30,
    rating: 4.8,
    description: 'A magical night of jazz music with top artists from around the world.'
  },
  {
    id: 4,
    title: 'Food & Wine Festival',
    city: 'Agadir',
    venue: 'Beach Resort',
    price: 200,
    date: '2025-08-12',
    time: '12:00',
    image: ticketImages[3],
    popular: false,
    availableTickets: 80,
    rating: 4.5,
    description: 'Taste the best food and wine Morocco has to offer at this exclusive beachside festival.'
  },
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export default function TicketDetailScreen() {
  const { ticket } = useLocalSearchParams();
  const router = useRouter();
  const ticketId = Number(ticket);
  const ticketData = dummyTickets.find((t) => t.id === ticketId);

  if (!ticketData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Ticket not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={ticketData.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{ticketData.title}</Text>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="map-marker" size={18} color="#6C63FF" />
          <Text style={styles.metaText}>{ticketData.venue}, {ticketData.city}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={18} color="#6C63FF" />
          <Text style={styles.metaText}>{formatDate(ticketData.date)} | {ticketData.time}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.metaText}>{ticketData.rating} / 5</Text>
        </View>
        <Text style={styles.description}>{ticketData.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{ticketData.price} MAD</Text>
          <Text style={styles.availability}>{ticketData.availableTickets < 50 ? `Only ${ticketData.availableTickets} left` : 'Available'}</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Buy Ticket</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  image: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 15,
    color: '#64748B',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginVertical: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  availability: {
    fontSize: 14,
    color: '#FF4757',
  },
  buyButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  notFound: {
    fontSize: 20,
    color: '#FF4757',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 