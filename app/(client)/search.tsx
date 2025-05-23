import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, Animated, FlatListProps } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { debounce } from 'lodash';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search as SearchIcon, Filter, X, ArrowLeft } from 'lucide-react-native';

import { useApp } from '@/src/context/AppContext';
import { Theme } from '@/src/constants/theme';
import { Artist, Gig } from '@/src/models/types';
import { ArtistCard } from '@/src/components/artist/ArtistCard';
import { GigCard } from '@/src/components/artist/GigCard';
import { CategorySelector } from '@/src/components/client/CategorySelector';

const AnimatedFlatList = Animated.createAnimatedComponent<any>(FlatList);

// Transform Gig data to match GigCard props
const transformGigData = (gig: Gig) => ({
  id: gig.id,
  title: gig.title,
  description: gig.description,
  price: `$${gig.basePrice}`,
  image: gig.images[0] || 'https://via.placeholder.com/300',
});

export default function SearchScreen() {
  const { artists, gigs } = useApp();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('gigs');
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const debouncedSetSearchQuery = useCallback(
    debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  useEffect(() => {
    // Initialize from URL params
    if (params.query) {
      setSearchQuery(params.query as string);
    }

    if (params.category) {
      setSelectedCategory(params.category as string);
    }
  }, [params]);

  useEffect(() => {
    setIsLoading(true); // Start loading
    const timeout = setTimeout(() => {
      // Filter artists
      let artistResults = [...artists];

      if (searchQuery) {
        artistResults = artistResults.filter(artist =>
          artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artist.bio.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategory !== 'All') {
        artistResults = artistResults.filter(artist =>
          artist.categories.some(category =>
            category.toLowerCase() === selectedCategory.toLowerCase()
          )
        );
      }

      setFilteredArtists(artistResults);

      // Filter gigs
      let gigResults = [...gigs];

      if (searchQuery) {
        gigResults = gigResults.filter(gig =>
          gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gig.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategory !== 'All') {
        gigResults = gigResults.filter(gig =>
          gig.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      setFilteredGigs(gigResults);
      setIsLoading(false); // End loading
    }, 500); // Simulate delay

    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategory, artists, gigs]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = () => {
    // Update URL for sharing/history purposes
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('query', searchQuery);
    if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);

    router.setParams({
      query: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    router.setParams({
      query: undefined,
    });
  };

  const handleArtistPress = (artistId: string) => {
    const router = useRouter();
    router.push(`/(client)/(hidden)/artist/${artistId}`);
  };

  const handleGigPress = (gigId: string) => {
    const router = useRouter();
    router.push(`/(client)/(hidden)/gig/${gigId}`);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate a refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
 

      <Animatable.View
        animation="slideInDown"
        duration={500}
        style={styles.searchContainer}
      >
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={Theme.colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for artists, services..."
            placeholderTextColor={Theme.colors.textLight}
            value={searchQuery}
            onChangeText={(text) => {
              debouncedSetSearchQuery(text);
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={clearSearch}
              style={styles.clearButton}
            >
              <Animatable.View animation="fadeIn" duration={200}>
                <X size={18} color={Theme.colors.textLight} />
              </Animatable.View>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {/* Add filter functionality */ }}
        >
          <Filter size={20} color={Theme.colors.primary} />
        </TouchableOpacity>
      </Animatable.View>

      <CategorySelector onSelectCategory={handleCategorySelect} selectedCategory={selectedCategory} />

      <Animatable.View
        animation="fadeIn"
        duration={300}
        style={styles.tabsContainer}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'gigs' && styles.activeTab]}
          onPress={() => setActiveTab('gigs')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'gigs' && styles.activeTabText
            ]}
          >
            Services ({filteredGigs.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'artists' && styles.activeTab]}
          onPress={() => setActiveTab('artists')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'artists' && styles.activeTabText
            ]}
          >
            Artists ({filteredArtists.length})
          </Text>
        </TouchableOpacity>
      </Animatable.View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : activeTab === 'gigs' ? (
        <Animatable.View animation="fadeIn" duration={300} style={styles.listContainer}>
          {filteredGigs.length > 0 ? (
            <AnimatedFlatList
              data={filteredGigs}
              keyExtractor={(item: Gig) => item.id}
              renderItem={({ item }: { item: Gig }) => (
                <Animatable.View
                  animation="fadeInUp"
                  duration={300}
                  style={styles.gigCardContainer}
                >
                  <GigCard
                    gig={transformGigData(item)}
                    onPress={handleGigPress}
                    onBuy={() => { }}
                  />
                </Animatable.View>
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={Theme.colors.primary}
                  colors={[Theme.colors.primary]}
                />
              }
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Animatable.View animation="fadeIn" duration={300}>
                <Text style={styles.emptyTitle}>No Services Found</Text>
                <Text style={styles.emptyText}>
                  We couldn't find any services matching your search criteria. Try adjusting your filters or search term.
                </Text>
              </Animatable.View>
            </View>
          )}
        </Animatable.View>
      ) : (
        <Animatable.View animation="fadeIn" duration={300} style={styles.listContainer}>
          {filteredArtists.length > 0 ? (
            <AnimatedFlatList
              data={filteredArtists}
              keyExtractor={(item: Artist) => item.id}
              renderItem={({ item }: { item: Artist }) => (
                <Animatable.View
                  animation="fadeInUp"
                  duration={300}
                  style={styles.artistCardContainer}
                >
                  <ArtistCard artist={item} onPress={handleArtistPress} onHire={() => { }} />
                </Animatable.View>
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={Theme.colors.primary}
                  colors={[Theme.colors.primary]}
                />
              }
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Animatable.View animation="fadeIn" duration={300}>
                <Text style={styles.emptyTitle}>No Artists Found</Text>
                <Text style={styles.emptyText}>
                  We couldn't find any artists matching your search criteria. Try adjusting your filters or search term.
                </Text>
              </Animatable.View>
            </View>
          )}
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    zIndex: 1,
  },
  backButton: {
    padding: Theme.spacing.sm,
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    height: 45,
    marginRight: Theme.spacing.sm,
    shadowColor: Theme.colors.textDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
  },
  clearButton: {
    padding: Theme.spacing.xs,
  },
  filterButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    shadowColor: Theme.colors.textDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    paddingHorizontal: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Theme.colors.primary,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
  },
  activeTabText: {
    color: Theme.colors.primary,
    fontFamily: Theme.typography.fontFamily.bold,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl * 2,
  },
  gigCardContainer: {
    marginBottom: Theme.spacing.md,
  },
  artistCardContainer: {
    marginBottom: Theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.md,
  },
});