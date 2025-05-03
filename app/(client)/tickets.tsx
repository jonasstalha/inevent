// app/(client)/tickets.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

const categories = ['Concerts', 'Festivals', 'Theatre', 'Conferences'];

const dummyTickets = [
  {
    id: 1,
    title: 'DJ Party Casablanca',
    city: 'Casablanca',
    price: 150,
    date: '2025-06-01',
    image: 'https://source.unsplash.com/1024x768/?party,dj',
  },
  {
    id: 2,
    title: 'Art Expo Marrakech',
    city: 'Marrakech',
    price: 80,
    date: '2025-06-15',
    image: 'https://source.unsplash.com/1024x768/?art,expo',
  },
  {
    id: 3,
    title: 'Theatre Casablanca',
    city: 'Casablanca',
    price: 120,
    date: '2025-07-10',
    image: 'https://source.unsplash.com/1024x768/?theatre',
  },
];

const TicketsScreen = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);
  const [wallet, setWallet] = useState(200);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setTickets(dummyTickets);
    setLoading(false);
  };

  const purchaseTicket = (ticket: any) => {
    if (wallet >= ticket.price) {
      setWallet((prev) => prev - ticket.price);
      Alert.alert('Purchase successful', `You bought a ticket for ${ticket.title}`);
    } else {
      Alert.alert('Insufficient balance', 'Would you like to pay online?', [
        { text: 'Cancel' },
        {
          text: 'Pay with youCan Pay',
          onPress: () => {
            navigation.navigate('PaymentWebview', {
              amount: ticket.price,
              ticketId: ticket.id,
            });
          },
        },
      ]);
    }
  };

  const renderTicketCard = ({ item }: { item: any }) => (
    <View style={styles.ticketCard}>
      <Image source={{ uri: item.image }} style={styles.ticketImage} />
      <View style={styles.ticketDetails}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text style={styles.ticketSubText}>📍 {item.city}</Text>
        <Text style={styles.ticketSubText}>📅 {item.date}</Text>
        <Text style={styles.ticketPrice}>{item.price} MAD</Text>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => purchaseTicket(item)}
        >
          <Text style={styles.buyButtonText}>Buy Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>🎫 My Tickets</Text>

      <View style={styles.categoryContainer}>
        {categories.map((cat, idx) => (
          <TouchableOpacity key={idx} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTicketCard}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default TicketsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF9',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    paddingHorizontal: 20,
    color: '#1A1A1A',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: '#DDE3F0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  ticketCard: {
    width: 350,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    backgroundColor: '#102A61',
    marginHorizontal: 5,
  },
  ticketImage: {
    width: '100%',
    height: 200,
  },
  ticketDetails: {
    padding: 16,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ticketSubText: {
    fontSize: 14,
    color: '#DCE2F0',
    marginBottom: 2,
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#90EE90',
    marginTop: 10,
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: '#00E0A1',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
