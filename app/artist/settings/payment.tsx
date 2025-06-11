import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArtistStore } from '../../../src/components/artist/ArtistStore';

const PaymentMethodsPage = () => {
  const router = useRouter();
  const { settings, addPaymentMethod, removePaymentMethod } = useArtistStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: '',
    lastFour: '',
  });

  const handleAddPayment = () => {
    if (newPayment.type && newPayment.lastFour) {
      addPaymentMethod(newPayment);
      setNewPayment({ type: '', lastFour: '' });
      setShowAddModal(false);
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleDeletePayment = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => removePaymentMethod(id), style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#6a0dad" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        {settings.paymentMethods.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={48} color="#666" />
            <Text style={styles.emptyStateText}>No payment methods added</Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addFirstButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </View>
        ) : (
          settings.paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Ionicons name="card" size={24} color="#6a0dad" />
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentType}>{method.type}</Text>
                  <Text style={styles.paymentNumber}>•••• {method.lastFour}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeletePayment(method.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Type</Text>
              <TextInput
                style={styles.input}
                value={newPayment.type}
                onChangeText={(text) => setNewPayment({ ...newPayment, type: text })}
                placeholder="Visa, Mastercard, etc."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last 4 Digits</Text>
              <TextInput
                style={styles.input}
                value={newPayment.lastFour}
                onChangeText={(text) => setNewPayment({ ...newPayment, lastFour: text })}
                placeholder="1234"
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  sectionCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#6a0dad',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    marginLeft: 16,
  },
  paymentType: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  paymentNumber: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6a0dad',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentMethodsPage; 