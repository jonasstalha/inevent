import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface GigCardProps {
  gig: {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
  };
  onPress: (gigId: string) => void;
  onBuy: (gigId: string) => void;
}

export const GigCard: React.FC<GigCardProps> = ({ gig, onPress, onBuy }) => {
  return (
    <TouchableOpacity onPress={() => onPress(gig.id)} style={styles.container}>
      <Image source={{ uri: gig.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{gig.title}</Text>
        <Text style={styles.price}>{gig.price}</Text>
        <TouchableOpacity onPress={() => onBuy(gig.id)}>
          <Text style={styles.buyButton}>Buy Now</Text>
        </TouchableOpacity>
      </View>
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
  buyButton: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary,
  },
});