import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Bell } from 'lucide-react-native';

import { useApp } from '@/src/context/AppContext';
import { useAuth } from '@/src/context/AuthContext';
import { Theme } from '@/src/constants/theme';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { ArtistCard } from '@/src/components/artist/ArtistCard';
import { GigCard } from '@/src/components/artist/GigCard';
import { CategorySelector } from '@/src/components/client/CategorySelector';

export default function ClientHomeScreen() {
  const { user } = useAuth();
  const { artists, gigs } = useApp();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const featuredArtists = artists.filter(artist => artist.featured);
  const recentGigs = [...gigs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleSearch = (text: string) => {
    // Navigate to search screen with query
    if (text) {
      router.push(`/client/search?query=${encodeURIComponent(text)}`);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (category === 'All') {
      router.push('/client/search');
    } else {
      router.push(`/client/search?category=${encodeURIComponent(category)}`);
    }
  };

  const handleArtistPress = (artistId: string) => {
    router.push(`/(client)/artist/${artistId}`);
  };

  const handleGigPress = (gigId: string) => {
    router.push(`/(client)/gig/${gigId}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.colors.primary]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Guest'}</Text>
          <Text style={styles.subGreeting}>Find and book amazing artists</Text>
        </View>
        <Button
          title=""
          onPress={() => {}}
          variant="outline"
          style={styles.notificationButton}
          leftIcon={<Bell size={20} color={Theme.colors.textDark} />}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search artists, services, events..."
          containerStyle={styles.searchInput}
          leftIcon={<Search size={20} color={Theme.colors.textLight} />}
          onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <CategorySelector onSelectCategory={handleCategorySelect} />

      {/* Featured Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/7149159/pexels-photo-7149159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Special Events</Text>
          <Text style={styles.bannerSubtitle}>Find the perfect artist for your special occasion</Text>
          <Button 
            title="Explore Now" 
            variant="primary" 
            size="small" 
            onPress={() => router.push('/client/search?category=Special%20Events')}
          />
        </View>
      </View>

      {/* Featured Artists */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Artists</Text>
          <Button 
            title="See All" 
            variant="text" 
            size="small" 
            onPress={() => router.push('/client/search')}
          />
        </View>

        {featuredArtists.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artistsContainer}
          >
            {featuredArtists.map((artist) => (
              <View style={styles.artistCardContainer} key={artist.id}>
                <ArtistCard artist={artist} onPress={handleArtistPress} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No featured artists available</Text>
        )}
      </View>

      {/* Recent Gigs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Services</Text>
          <Button 
            title="See All" 
            variant="text" 
            size="small" 
            onPress={() => router.push('/client/search')}
          />
        </View>

        {recentGigs.length > 0 ? (
          <View style={styles.gigsList}>
            {recentGigs.map((gig) => (
              <View style={styles.gigCardContainer} key={gig.id}>
                <GigCard gig={gig} onPress={handleGigPress} />
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No recent gigs available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  contentContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  greeting: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
  },
  subGreeting: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: Theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  section: {
    marginTop: Theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
  },
  artistsContainer: {
    paddingRight: Theme.spacing.lg,
  },
  artistCardContainer: {
    width: 280,
    marginRight: Theme.spacing.md,
  },
  gigsList: {
    gap: Theme.spacing.md,
  },
  gigCardContainer: {
    width: '100%',
  },
  bannerContainer: {
    height: 160,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  bannerTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.xs,
  },
  bannerSubtitle: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.md,
  },
  emptyText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
    padding: Theme.spacing.lg,
  },
});