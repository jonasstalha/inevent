import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Chrome as Home, ClipboardCheck, Ticket, ChartBar as BarChart3, Settings } from 'lucide-react-native';
import { Theme } from '@/src/constants/theme';

export default function AdminTabLayout() {
  const { user, loading } = useAuth();

  // Check if the user is logged in and has the correct role
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      // Redirect if not an admin user
      return;
    }
  }, [user, loading]);

  // Show loading or redirect if no user or wrong role
  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth" />;
  }

  if (user.role !== 'admin') {
    // Redirect to the appropriate role's layout
    return <Redirect href={`/(${user.role})`} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: Theme.colors.card,
          borderTopColor: Theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Theme.typography.fontFamily.medium,
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <ClipboardCheck size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color, size }) => <Ticket size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}