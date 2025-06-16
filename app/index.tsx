import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const logoAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnimation, {
        toValue: 1.1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnimation, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    router.replace({ pathname: '/(client)' }); // Go to main client app index
  };

  const handleArtistPress = () => {
    router.replace({ pathname: '/artist' }); // Go to artist side
  };

  const logoStyle = {
    opacity: logoAnimation,
    transform: [
      {
        scale: logoAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/indexpage/mainpic.png')} 
        style={styles.heroImage} 
        resizeMode="cover" 
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image 
            source={require('../assets/indexpage/primary-logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
        </Animated.View>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Enter App</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginTop: 16, backgroundColor: '#2a2a72' }]}
          onPress={handleArtistPress}
        >
          <Text style={styles.buttonText}>Enter as Artist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // soft dark overlay for readability
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: width * 0.7,
    height: width * 0.3,
  },
  button: {
    backgroundColor: '#6a0dad', // vibrant violet
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
