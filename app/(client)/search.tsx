import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search as SearchIcon, Filter, X } from 'lucide-react-native';

import { useApp } from '@/src/context/AppContext';
import { Theme } from '@/src/constants/theme';
import { Artist, Gig } from '@/src/models/types';
import { ArtistCard } from '@/src/components/artist/ArtistCard';
import { GigCard } from '@/src/components/artist/GigCard';
import { CategorySelector } from '@/src/components/client/CategorySelector';

export default function SearchScreen() {
  const { artists, gigs } = useApp();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('gigs'); // 'gigs' or 'artists'
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);

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
    router.push(`/(client)/artist/${artistId}`);
  };

  const handleGigPress = (gigId: string) => {
    router.push(`/(client)/gig/${gigId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={Theme.colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for artists, services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={Theme.colors.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <CategorySelector onSelectCategory={handleCategorySelect} />
      
      <View style={styles.tabsContainer}>
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
      </View>
      
      {activeTab === 'gigs' ? (
        filteredGigs.length > 0 ? (
          <FlatList
            data={filteredGigs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.gigCardContainer}>
                <GigCard gig={item} onPress={handleGigPress} />
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services found matching your criteria</Text>
          </View>
        )
      ) : (
        filteredArtists.length > 0 ? (
          <FlatList
            data={filteredArtists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.artistCardContainer}>
                <ArtistCard artist={item} onPress={handleArtistPress} />
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No artists found matching your criteria</Text>
          </View>
        )
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
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.md,
    height: 50,
    marginRight: Theme.spacing.sm,
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
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    backgroundColor: Theme.colors.card,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.primary,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
  },
  activeTabText: {
    color: Theme.colors.primary,
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
  emptyText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
  },
});