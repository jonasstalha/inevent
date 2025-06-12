import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CalendarDays, Clock } from 'lucide-react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Theme } from '../../constants/theme';
import { Order, Gig } from '../../models/types';

interface OrderCardProps {
  order: Order;
  gig: Gig;
  onPress: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, gig, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Theme.colors.warning;
      case 'confirmed':
        return Theme.colors.success;
      case 'rejected':
        return Theme.colors.error;
      case 'completed':
        return Theme.colors.info;
      default:
        return Theme.colors.textLight;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="outlined" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{gig.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <CalendarDays size={16} color={Theme.colors.textLight} />
          <Text style={styles.infoText}>Ordered {formatDate(order.createdAt)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Clock size={16} color={Theme.colors.textLight} />
          <Text style={styles.infoText}>Processing</Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Total:</Text>
        <Text style={styles.price}>${order.totalPrice.toFixed(2)}</Text>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="View Details"
          variant="outline"
          size="small"
          onPress={() => onPress(order.id)}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  statusText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.secondary,
  },
  infoContainer: {
    marginBottom: Theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
    marginLeft: Theme.spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    marginBottom: Theme.spacing.md,
  },
  priceLabel: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
  },
  price: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});