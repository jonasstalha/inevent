import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, DollarSign, Calendar, ChartBar as BarChart, ClipboardCheck, Ticket, ChevronRight } from 'lucide-react-native';

import { useApp } from '@/src/context/AppContext';
import { useAuth } from '@/src/context/AuthContext';
import { Theme } from '@/src/constants/theme';
import { Card } from '@/src/components/common/Card';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { artists, orders, gigs, tickets } = useApp();
  const router = useRouter();

  // Calculate stats
  const totalUsers = artists.length + 2; // Plus admin and client user
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalSales = orders.reduce((total, order) => total + order.totalPrice, 0);
  const totalTickets = tickets.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, Admin</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Users size={20} color={Theme.colors.primary} />
          </View>
          <Text style={styles.statValue}>{totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <DollarSign size={20} color={Theme.colors.success} />
          </View>
          <Text style={styles.statValue}>${totalSales}</Text>
          <Text style={styles.statLabel}>Total Sales</Text>
        </Card>
      </View>

      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <ClipboardCheck size={20} color={Theme.colors.info} />
          </View>
          <Text style={styles.statValue}>{pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ticket size={20} color={Theme.colors.warning} />
          </View>
          <Text style={styles.statValue}>{totalTickets}</Text>
          <Text style={styles.statLabel}>Active Tickets</Text>
        </Card>
      </View>

      <Card variant="elevated" style={styles.quickActionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => router.push('/(admin)/orders')}
        >
          <View style={styles.actionIconContainer}>
            <ClipboardCheck size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Review Orders</Text>
            <Text style={styles.actionSubtitle}>Check and approve pending orders</Text>
          </View>
          <ChevronRight size={18} color={Theme.colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => router.push('/(admin)/tickets')}
        >
          <View style={styles.actionIconContainer}>
            <Ticket size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Tickets</Text>
            <Text style={styles.actionSubtitle}>View and manage event tickets</Text>
          </View>
          <ChevronRight size={18} color={Theme.colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => router.push('/(admin)/analytics')}
        >
          <View style={styles.actionIconContainer}>
            <BarChart size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Analytics</Text>
            <Text style={styles.actionSubtitle}>Check platform performance metrics</Text>
          </View>
          <ChevronRight size={18} color={Theme.colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionItem, styles.lastActionItem]}
          onPress={() => router.push('/(admin)/settings')}
        >
          <View style={styles.actionIconContainer}>
            <Users size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Users</Text>
            <Text style={styles.actionSubtitle}>View and manage user accounts</Text>
          </View>
          <ChevronRight size={18} color={Theme.colors.textLight} />
        </TouchableOpacity>
      </Card>

      <Card variant="elevated" style={styles.recentActivityCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Platform Status</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Total Artists:</Text>
          <Text style={styles.statusValue}>{artists.length}</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Total Services:</Text>
          <Text style={styles.statusValue}>{gigs.length}</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Orders:</Text>
          <Text style={styles.statusValue}>{orders.length}</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Tickets:</Text>
          <Text style={styles.statusValue}>{tickets.length}</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Platform Health:</Text>
          <View style={styles.healthContainer}>
            <View style={styles.healthIndicator} />
            <Text style={styles.healthStatus}>Operational</Text>
          </View>
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
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  greeting: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.xs,
  },
  date: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
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
  quickActionsCard: {
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
    marginBottom: Theme.spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  lastActionItem: {
    borderBottomWidth: 0,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textLight,
  },
  recentActivityCard: {
    marginBottom: Theme.spacing.lg,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  statusLabel: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textDark,
  },
  statusValue: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary,
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.success,
    marginRight: Theme.spacing.xs,
  },
  healthStatus: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.success,
  },
});