import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Colors } from '@/src/constants/colors';

export default function ClientHome() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/auth" />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>Welcome</Text>
      </View>
      <View style={styles.content}>
        <Text style={{ color: Colors.text }}>Welcome to your dashboard</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
});
