import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, MapPin, Clock, MessageCircle, ArrowLeft, Heart, Share2 } from 'lucide-react-native';
import { Theme } from '@/src/constants/theme';
import { useApp } from '@/src/context/AppContext';
import { GigCard } from '@/src/components/artist/GigCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ArtistStoreScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { artists, gigs } = useApp();
  const [saved, setSaved] = useState(false);
  
  const artist = artists.find(a => a.id === id);
  const artistGigs = gigs.filter(gig => gig.artistId === id);

  React.useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const savedArtists = await AsyncStorage.getItem('savedArtists');
        if (savedArtists) {
          const savedIds = JSON.parse(savedArtists);
          setSaved(savedIds.includes(id));
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    checkSavedStatus();
  }, [id]);

  if (!artist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artist not found</Text>
      </View>
    );
  }

  const handleGigPress = (gigId: string) => {
    router.push(`/(client)/(hidden)/gig/${gigId}`);
  };

  const handleMessage = () => {
    router.push(`/(client)/(hidden)/chat/${artist.id}`);
  };

  const handleSave = async () => {
    try {
      const savedArtists = await AsyncStorage.getItem('savedArtists');
      let newSavedArtists = savedArtists ? JSON.parse(savedArtists) : [];
      
      if (saved) {
        newSavedArtists = newSavedArtists.filter((id: string) => id !== artist.id);
      } else {
        newSavedArtists.push(artist.id);
      }
      
      await AsyncStorage.setItem('savedArtists', JSON.stringify(newSavedArtists));
      setSaved(!saved);
    } catch (error) {
      console.error('Error saving artist:', error);
    }
  };

  const handleShare = () => {
    // Implement share functionality
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Theme.colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Artist Store</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleSave}
          >
            <Heart 
              size={24} 
              color={saved ? Theme.colors.primary : Theme.colors.textDark}
              fill={saved ? Theme.colors.primary : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleShare}
          >
            <Share2 size={24} color={Theme.colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: artist.profileImage || 'https://via.placeholder.com/150' }} 
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.artistName}>{artist.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={Theme.colors.primary} fill={Theme.colors.primary} />
              <Text style={styles.ratingText}>
                {artist.rating?.toFixed(1) || 'New'} ({artist.reviewCount || 0} reviews)
              </Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={Theme.colors.textLight} />
              <Text style={styles.locationText}>{artist.location}</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{artistGigs.length}</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{artist.completedGigs || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{artist.responseRate || '100%'}</Text>
            <Text style={styles.statLabel}>Response Rate</Text>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{artist.bio}</Text>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          {artistGigs.map(gig => (
            <View key={gig.id} style={styles.gigCard}>
              <GigCard
                gig={{
                  id: gig.id,
                  title: gig.title,
                  description: gig.description,
                  price: `$${gig.basePrice}`,
                  image: gig.images[0] || 'https://via.placeholder.com/300',
                  rating: gig.rating,
                }}
                onPress={handleGigPress}
                onBuy={handleGigPress}
              />
            </View>
          ))}
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {artist.categories.map((category, index) => (
              <View key={index} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={handleMessage}
        >
          <MessageCircle size={20} color={Theme.colors.primary} />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: Theme.spacing.sm,
    marginLeft: Theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: Theme.spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  artistName: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  ratingText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
    marginLeft: Theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.card,
    marginBottom: Theme.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
  },
  section: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.md,
  },
  bioText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
    lineHeight: 24,
  },
  gigCard: {
    marginBottom: Theme.spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Theme.spacing.xs,
  },
  categoryChip: {
    backgroundColor: Theme.colors.card,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
    margin: Theme.spacing.xs,
  },
  categoryText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text,
  },
  bottomBar: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  messageButtonText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background,
    marginLeft: Theme.spacing.sm,
  },
  errorText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.error,
    textAlign: 'center',
    marginTop: Theme.spacing.xl,
  },
}); 