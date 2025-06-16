import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useApp } from '@/src/context/AppContext';
import { Theme } from '@/src/constants/theme';

export default function ClientHome() {
  const router = useRouter();
  const { theme } = useApp();
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/auth" />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Theme.colors.text }]}>Welcome</Text>
      </View>
      <View style={styles.content}>
        <Text style={{ color: Theme.colors.text }}>Welcome to your dashboard</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  header: {
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});
