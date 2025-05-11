import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';
import { Card } from '../common/Card';
import { Theme } from '../../constants/theme';
import { Artist } from '../../models/types';

interface ArtistCardProps {
  artist: Artist;
  onPress: (artistId: string) => void;
  onHire: (artistId: string) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onPress, onHire }) => {
  return (
    <TouchableOpacity onPress={() => onPress(artist.id)} activeOpacity={0.9}>
      <Card variant="elevated" style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: artist.profileImage || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
            style={styles.avatar}
          />
          <View style={styles.headerRight}>
            <Text style={styles.name}>{artist.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={Theme.colors.warning} fill={Theme.colors.warning} />
              <Text style={styles.rating}>{artist.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.categoryContainer}>
          {artist.categories.map((category, index) => (
            <View key={index} style={styles.category}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.bio} numberOfLines={2}>
          {artist.bio}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.location}>
            <MapPin size={14} color={Theme.colors.textLight} />
            <Text style={styles.locationText}>{artist.location}</Text>
          </View>
          <Button title="Hire" onPress={() => onHire(artist.id)} color={Theme.colors.primary} />
        </View>
        
        {artist.featured && <View style={styles.featuredBadge}><Text style={styles.featuredText}>Featured</Text></View>}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Theme.spacing.md,
  },
  headerRight: {
    flex: 1,
  },
  name: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  rating: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.sm,
  },
  category: {
    backgroundColor: Theme.colors.primaryLight,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  categoryText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.secondary,
  },
  bio: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textLight,
    marginLeft: 4,
  },
  featuredBadge: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  featuredText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.secondary,
  },
});