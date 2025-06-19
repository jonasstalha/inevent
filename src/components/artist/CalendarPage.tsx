import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy data for demonstration
const initialOrders = [
  {
    id: 1,
    type: 'service',
    clientName: 'John Smith',
    service: 'Live Performance',
    date: '2024-07-20',
    time: '8:00 PM',
    price: 1500,
    clientPrice: 1200,
    message: 'Looking for acoustic set for wedding reception',
    status: 'pending',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'ticket',
    clientName: 'Sarah Johnson',
    eventName: 'Summer Music Festival',
    quantity: 5,
    ticketType: 'VIP',
    price: 250,
    clientPrice: 200,
    message: 'Can we get group discount?',
    status: 'pending',
    timestamp: '4 hours ago',
  },
  {
    id: 3,
    type: 'service',
    clientName: 'Mike Wilson',
    service: 'Recording Session',
    date: '2024-07-15',
    time: '2:00 PM',
    price: 800,
    clientPrice: null,
    message: 'Need vocals for my track, studio session preferred',
    status: 'pending',
    timestamp: '1 day ago',
  },
];

const CalendarPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('all');
  const [counterOffer, setCounterOffer] = useState<{ [key: number]: string }>({});

  const handleAcceptOrder = (orderId: number) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'accepted' } : order
    ));
    Alert.alert('Order Accepted', 'Order accepted successfully!');
  };

  const handleDeclineOrder = (orderId: number) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'declined' } : order
    ));
    Alert.alert('Order Declined', 'Order has been declined.');
  };

  const handleCounterOffer = (orderId: number) => {
    const newPrice = counterOffer[orderId];
    if (!newPrice) {
      Alert.alert('Error', 'Please enter a counter offer price');
      return;
    }
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, price: parseFloat(newPrice), status: 'counter_offered' } : order
    ));
    setCounterOffer({ ...counterOffer, [orderId]: '' });
    Alert.alert('Counter Offer Sent', `New price of $${newPrice} has been sent to client`);
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

  return (
    <ScrollView style={styles.container}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
});

export default CalendarPage;
