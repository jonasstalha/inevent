import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useRouter } from 'expo-router';

interface GigCardProps {
  gig: {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    rating?: number;
  };
  onPress: (gigId: string) => void;
  onBuy: (gigId: string) => void;
}

export const GigCard: React.FC<GigCardProps> = ({ gig, onPress, onBuy }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(client)/(hidden)/gig/[gigId]',
      params: { 
        gigId: gig.id,
        title: gig.title,
        price: gig.price,
        image: gig.image,
        rating: gig.rating
      }
    });
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.95}
    >
      <Image source={{ uri: gig.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{gig.title}</Text>
          <Text style={styles.price}>{gig.price}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {gig.description}
        </Text>

        {gig.rating && (
          <View style={styles.ratingContainer}>
            <Star size={14} color={Theme.colors.warning} fill={Theme.colors.warning} />
            <Text style={styles.ratingText}>{gig.rating.toFixed(1)}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.buyButton}
          onPress={handlePress}
        >
          <Text style={styles.buyButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Theme.colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 16,
    color: Theme.colors.textDark,
    marginRight: 8,
  },
  price: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 18,
    color: Theme.colors.primary,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 14,
    color: Theme.colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 14,
    color: Theme.colors.textDark,
    marginLeft: 4,
  },
  buyButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 15,
    color: Theme.colors.white,
  },
});