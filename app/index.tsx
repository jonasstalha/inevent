import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handlePress = () => {
    router.replace({ pathname: '/(client)' }); // Go to main client app index
  };

  const handleArtistPress = () => {
    router.replace({ pathname: '/artist' }); // Go to artist side
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
