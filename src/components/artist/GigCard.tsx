import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { Card } from '../common/Card';
import { Theme } from '../../constants/theme';
import { Gig } from '../../models/types';

interface GigCardProps {
  gig: Gig;
  onPress: (gigId: string) => void;
}

export const GigCard: React.FC<GigCardProps> = ({ gig, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(gig.id)} activeOpacity={0.9}>
      <Card variant="elevated" style={styles.container} padding="none">
        <Image source={{ uri: gig.images[0] }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {gig.title}
          </Text>
          <Text style={styles.price}>${gig.basePrice} base price</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={Theme.colors.warning} fill={Theme.colors.warning} />
            <Text style={styles.rating}>
              {gig.rating.toFixed(1)} ({gig.reviewCount})
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: Theme.borderRadius.md,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.xs,
  },
  price: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
    marginLeft: Theme.spacing.xs,
  },
});