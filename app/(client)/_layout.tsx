import { Tabs } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Home, Search, Ticket, User, Bell, LogIn } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

const Theme = {
  colors: {
    primary: '#4361EE',
    secondary: '#3F37C9',
    accent: '#4CC9F0',
    background: '#F8F9FA',
    card: '#FFFFFF',
    cardDark: '#F0F2F5',
    border: '#E1E5EA',
    text: '#1A1B25',
    textSecondary: '#4F5565',
    textLight: '#9CA3AF',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
      semibold: 'System',
    },
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

// Header component with title and right icons
function Header({ title }) {
  const navigation = useNavigation();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/auth'); // ✅ this navigates to /app/auth.tsx
  };

  const handleNotificationsPress = () => {
    navigation.navigate('(hidden)/notifications');
  };
  
  return (
    <SafeAreaView edges={['top']} style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity 
            onPress={handleLogout} 
            style={styles.headerIconButton}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <LogIn color={Theme.colors.textSecondary} size={22} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleNotificationsPress} 
            style={styles.headerIconButton}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper} onclick={handleNotificationsPress}>
              <Bell color={Theme.colors.textSecondary} size={22} />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function TabBarButton({ onPress, children, isFocused }) {
  const scale = useState(new Animated.Value(1))[0];
  const translateY = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isFocused) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.05,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(translateY, {
          toValue: -4,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.tabButton}>
      <Animated.View 
        style={{ 
          transform: [{ scale }, { translateY }],
          opacity: isFocused ? 1 : 0.8,
        }}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.tabBarContainer}>
      <BlurView 
        intensity={90} 
        tint="light" 
        style={styles.blurView}
      >
        <View style={styles.tabBar}>
          {state.routes
            .filter((route) => !route.name.startsWith('(hidden)')) // Exclude hidden folder routes
            .map((route, index) => {
              const { options } = descriptors[route.key];
              const label = options.title || route.name;
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const iconProps = {
                color: isFocused ? Theme.colors.primary : Theme.colors.textLight,
                size: 24,
                strokeWidth: isFocused ? 2.5 : 2,
              };

              const Icon = options.tabBarIcon ? options.tabBarIcon(iconProps) : null;

              return (
                <TabBarButton key={route.key} onPress={onPress} isFocused={isFocused}>
                  <View style={styles.tabButtonContent}>
                    {isFocused && <View style={styles.tabIndicator} />}
                    {Icon}
                    <Text style={[
                      styles.tabLabel, 
                      { 
                        color: iconProps.color,
                        fontWeight: isFocused ? '600' : 'normal',
                      }
                    ]}>{label}</Text>
                  </View>
                </TabBarButton>
              );
            })}
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

export default function Layout() {
  // Function to get page title based on route name
  const getPageTitle = (routeName) => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'search':
        return 'Discover';
      case 'tickets':
        return 'My Tickets';
      case 'profile':
        return 'My Profile';
      default:
        return 'App';
    }
  };

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: true,
          header: () => <Header title={getPageTitle(route.name)} />,
          tabBarStyle: { display: 'none' },
          contentStyle: { backgroundColor: Theme.colors.background },
        })}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, strokeWidth }) => <Home color={color} size={size} strokeWidth={strokeWidth} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size, strokeWidth }) => <Search color={color} size={size} strokeWidth={strokeWidth} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: 'Tickets',
            tabBarIcon: ({ color, size, strokeWidth }) => <Ticket color={color} size={size} strokeWidth={strokeWidth} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, strokeWidth }) => <User color={color} size={size} strokeWidth={strokeWidth} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.text,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    padding: 8,
    marginLeft: 8,
  },
  tabBarContainer: {
    backgroundColor: Theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBar: {
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: Theme.typography.fontFamily.medium,
    marginTop: 4,
  },
});