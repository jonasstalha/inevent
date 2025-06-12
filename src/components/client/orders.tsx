import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useApp } from '@/src/context/AppContext';
import { useAuth } from '@/src/context/AuthContext';
import { Theme } from '@/src/constants/theme';
import { OrderCard } from '@/src/components/client/OrderCard';

export default function OrdersScreen() {
  const { user } = useAuth();
  const { orders, getGigById, getOrdersByClientId } = useApp();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'confirmed', 'completed'
  
  // Get client orders
  const clientOrders = user ? getOrdersByClientId(user.id) : [];
  
  // Filter orders based on active tab
  const filteredOrders = clientOrders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const handleOrderPress = (orderId: string) => {
    router.push(`/(client)/order/${orderId}`);
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No orders found</Text>
      <TouchableOpacity onPress={() => router.push('/(client)')}>
        <Text style={styles.browseLink}>Browse artists</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollableTab
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'completed', label: 'Completed' },
          ]}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      </View>
      
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        renderItem={({ item }) => {
          const gig = getGigById(item.gigId);
          if (!gig) return null;
          return <OrderCard order={item} gig={gig} onPress={handleOrderPress} />;
        }}
      />
    </View>
  );
}

interface Tab {
  id: string;
  label: string;
}

interface ScrollableTabProps {
  tabs: Tab[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
}

const ScrollableTab: React.FC<ScrollableTabProps> = ({ tabs, activeTab, onChangeTab }) => {
  return (
    <View style={tabStyles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            tabStyles.tab,
            activeTab === tab.id && tabStyles.activeTab,
          ]}
          onPress={() => onChangeTab(tab.id)}
        >
          <Text
            style={[
              tabStyles.tabText,
              activeTab === tab.id && tabStyles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.card,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.textDark,
  },
  tabsContainer: {
    backgroundColor: Theme.colors.card,
  },
  listContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl * 2,
  },
  emptyContainer: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    marginBottom: Theme.spacing.md,
  },
  browseLink: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary,
  },
});