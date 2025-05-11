import { Tabs } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Home, Search, Ticket, User } from 'lucide-react-native';

const Theme = {
  colors: {
    primary: '#007bff',
    background: '#fff',
    card: '#fff',
    border: '#ddd',
    text: '#333',
    textLight: '#999',
  },
  typography: {
    fontFamily: {
      medium: 'System',
    },
  },
};

function TabBarButton({ onPress, children, isFocused }: any) {
  const scale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (isFocused) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.tabButton}>
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes
          .filter((route: any) => !route.name.startsWith('(hidden)')) // Exclude hidden folder routes
          .map((route: any, index: number) => {
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
            };

            const Icon = options.tabBarIcon ? options.tabBarIcon(iconProps) : null;

            return (
              <TabBarButton key={route.key} onPress={onPress} isFocused={isFocused}>
                {Icon}
                <Text style={[styles.tabLabel, { color: iconProps.color }]}>{label}</Text>
              </TabBarButton>
            );
          })}
      </View>
    </SafeAreaView>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: 'Tickets',
            tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
    height: 60,
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
