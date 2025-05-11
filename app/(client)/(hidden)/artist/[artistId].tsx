import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ArtistDetail() {
  const { artistId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artist Details</Text>
      <Text>Artist ID: {artistId}</Text>
      {/* Add more artist details here */}
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