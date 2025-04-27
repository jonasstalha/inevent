import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingUp, DollarSign, Users, Calendar, Plus, ChevronRight } from 'lucide-react-native';

import { useAuth } from '@/src/context/AuthContext';
import { useApp } from '@/src/context/AppContext';
import { Theme } from '@/src/constants/theme';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';

export default function ArtistDashboardScreen() {
  const { user } = useAuth();
  const { orders, getGigsByArtistId, getOrdersByArtistId } = useApp();
  const router = useRouter();

  // Get artist data
  const artistGigs = user ? getGigsByArtistId(user.id) : [];
  const artistOrders = user ? getOrdersByArtistId(user.id) : [];
  
  // Calculate stats
  const pendingOrders = artistOrders.filter(order => order.status === 'pending').length;
  const confirmedOrders = artistOrders.filter(order => order.status === 'confirmed').length;
  const totalEarnings = artistOrders
    .filter(order => order.status === 'completed' || order.status === 'confirmed')
    .reduce((total, order) => total + order.totalPrice, 0);

  // Recent activity (combine orders and sort by date)
  const recentActivity = [...artistOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Artist'}</Text>
        </View>
        <Button
          title="Add New Service"
          variant="primary"
          size="small"
          leftIcon={<Plus size={16} color={Theme.colors.secondary} />}
          onPress={() => router.push('/(artist)/add-service')}
        />
      </View>

      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <TrendingUp size={20} color={Theme.colors.primary} />
          </View>
          <Text style={styles.statValue}>{artistGigs.length}</Text>
          <Text style={styles.statLabel}>Active Services</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <DollarSign size={20} color={Theme.colors.success} />
          </View>
          <Text style={styles.statValue}>${totalEarnings}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Users size={20} color={Theme.colors.info} />
          </View>
          <Text style={styles.statValue}>{confirmedOrders}</Text>
          <Text style={styles.statLabel}>Clients</Text>
        </Card>
      </View>

      <Card variant="elevated" style={styles.ordersCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <TouchableOpacity onPress={() => router.push('/(artist)/orders')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orderStats}>
          <View style={styles.orderStat}>
            <Text style={styles.orderStatNumber}>{pendingOrders}</Text>
            <Text style={styles.orderStatLabel}>Pending</Text>
          </View>
          <View style={styles.orderStat}>
            <Text style={styles.orderStatNumber}>{confirmedOrders}</Text>
            <Text style={styles.orderStatLabel}>Confirmed</Text>
          </View>
          <View style={styles.orderStat}>
            <Text style={styles.orderStatNumber}>{artistOrders.length - (pendingOrders + confirmedOrders)}</Text>
            <Text style={styles.orderStatLabel}>Completed</Text>
          </View>
        </View>
      </Card>

      <Card variant="elevated" style={styles.activityCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentActivity.length > 0 ? (
          <View>
            {recentActivity.map((activity, index) => (
              <TouchableOpacity 
                key={activity.id}
                style={[
                  styles.activityItem,
                  index === recentActivity.length - 1 && styles.lastActivityItem,
                ]}
                onPress={() => router.push(`/(artist)/order/${activity.id}`)}
              >
                <View style={styles.activityIconContainer}>
                  <Calendar size={18} color={Theme.colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    New order - ${activity.totalPrice}
                  </Text>
                  <Text style={styles.activityTime}>
                    {new Date(activity.createdAt).toLocaleString()}
                  </Text>
                </View>
                <ChevronRight size={18} color={Theme.colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyActivity}>
            <Text style={styles.emptyText}>No recent activity found</Text>
          </View>
        )}
      </Card>

      <Card variant="elevated" style={styles.quickActionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(artist)/add-service')}
          >
            <Plus size={24} color={Theme.colors.primary} />
            <Text style={styles.quickActionText}>Add Service</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(artist)/tickets')}
          >
            <Ticket size={24} color={Theme.colors.primary} />
            <Text style={styles.quickActionText}>Create Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(artist)/store')}
          >
            <Store size={24} color={Theme.colors.primary} />
            <Text style={styles.quickActionText}>Manage Store</Text>
          </TouchableOpacity>
        </View>
      </Card>
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
    marginBottom: Theme.spacing.xl,
  },
  greeting: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
  },
  userName: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  statValue: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
  },
  statLabel: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textLight,
  },
  ordersCard: {
    marginBottom: Theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  cardTitle: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
  },
  seeAll: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary,
  },
  orderStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderStat: {
    flex: 1,
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  orderStatNumber: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.xs,
  },
  orderStatLabel: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
  },
  activityCard: {
    marginBottom: Theme.spacing.lg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  lastActivityItem: {
    borderBottomWidth: 0,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textLight,
  },
  emptyActivity: {
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
  },
  quickActionsCard: {
    marginBottom: Theme.spacing.lg,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  quickActionText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textDark,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
});