import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GigDetail() {
  const { gigId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gig Details</Text>
      <Text>Gig ID: {gigId}</Text>
      {/* Add more gig details here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});