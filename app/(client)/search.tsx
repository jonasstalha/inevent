import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, Animated, FlatListProps, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { debounce } from 'lodash';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Store as SearchIcon, Filter, X, ArrowLeft, Calendar, DollarSign, Sliders } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  rating: gig.rating,
});

export default function MarketplaceScreen() {
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
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const scrollY = useRef(new Animated.Value(0)).current;
  const [savedArtists, setSavedArtists] = useState<string[]>([]);

  const debouncedSetSearchQuery = useCallback(
    debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  useEffect(() => {
    // Initialize from URL params
    if (params.query) {
      setSearchInput(params.query as string);
      setSearchQuery(params.query as string);
    }

    if (params.category) {
      setSelectedCategory(params.category as string);
    }
  }, [params]);

  useEffect(() => {
    // Load saved artists from storage
    const loadSavedArtists = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedArtists');
        if (saved) {
          setSavedArtists(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved artists:', error);
      }
    };
    loadSavedArtists();
  }, []);

  const applyFilters = (gigs: Gig[]) => {
    return gigs.filter(gig => {
      // Category filter
      if (selectedCategory !== 'All' && gig.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Price range filter
      if (priceRange.min && gig.basePrice < Number(priceRange.min)) {
        return false;
      }
      if (priceRange.max && gig.basePrice > Number(priceRange.max)) {
        return false;
      }

      // Date range filter
      if (dateRange.start && new Date(gig.createdAt) < new Date(dateRange.start)) {
        return false;
      }
      if (dateRange.end && new Date(gig.createdAt) > new Date(dateRange.end)) {
        return false;
      }

      return true;
    });
  };

  useEffect(() => {
    setIsLoading(true);
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

      // Apply additional filters
      gigResults = applyFilters(gigResults);

      setFilteredGigs(gigResults);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategory, priceRange, dateRange, artists, gigs]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    router.setParams({
      query: searchInput,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
    });
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setDateRange({ start: '', end: '' });
    router.setParams({
      query: undefined,
    });
  };

  const handleArtistPress = (artistId: string) => {
    router.push(`/(client)/(hidden)/artist/${artistId}`);
  };

  const handleGigPress = (gigId: string) => {
    router.push(`/(client)/(hidden)/gig/${gigId}`);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleSaveArtist = async (artistId: string) => {
    try {
      const newSavedArtists = savedArtists.includes(artistId)
        ? savedArtists.filter(id => id !== artistId)
        : [...savedArtists, artistId];
      
      setSavedArtists(newSavedArtists);
      await AsyncStorage.setItem('savedArtists', JSON.stringify(newSavedArtists));
    } catch (error) {
      console.error('Error saving artist:', error);
    }
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Advanced Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color={Theme.colors.textDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Price Range</Text>
            <View style={styles.priceInputs}>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Theme.colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Min"
                  value={priceRange.min}
                  onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.rangeSeparator}>to</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={Theme.colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Max"
                  value={priceRange.max}
                  onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Date Range</Text>
            <View style={styles.dateInputs}>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Theme.colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Start Date"
                  value={dateRange.start}
                  onChangeText={(text) => setDateRange(prev => ({ ...prev, start: text }))}
                />
              </View>
              <Text style={styles.rangeSeparator}>to</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Theme.colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="End Date"
                  value={dateRange.end}
                  onChangeText={(text) => setDateRange(prev => ({ ...prev, end: text }))}
                />
              </View>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.clearSearchButton]} 
              onPress={clearSearch}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.applyButton]} 
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
            value={searchInput}
            onChangeText={setSearchInput}
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
          onPress={() => setShowFilters(true)}
        >
          <Sliders size={20} color={Theme.colors.primary} />
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
                    onBuy={handleGigPress}
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
                  <ArtistCard 
                    artist={item} 
                    onSave={handleSaveArtist}
                    isSaved={savedArtists.includes(item.id)}
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
                <Text style={styles.emptyTitle}>No Artists Found</Text>
                <Text style={styles.emptyText}>
                  We couldn't find any artists matching your search criteria. Try adjusting your filters or search term.
                </Text>
              </Animatable.View>
            </View>
          )}
        </Animatable.View>
      )}

      {renderFilterModal()}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Theme.spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  modalTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
  },
  filterSection: {
    marginBottom: Theme.spacing.lg,
  },
  filterTitle: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.sm,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    height: 45,
  },
  input: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
  },
  rangeSeparator: {
    marginHorizontal: Theme.spacing.sm,
    color: Theme.colors.textLight,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  clearSearchButton: {
    backgroundColor: Theme.colors.card,
    marginRight: Theme.spacing.sm,
  },
  applyButton: {
    backgroundColor: Theme.colors.primary,
    marginLeft: Theme.spacing.sm,
  },
  clearButtonText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
  },
  applyButtonText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background,
  },
});