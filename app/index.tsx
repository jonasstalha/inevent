import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components/common/Button';
import { Theme } from '@/src/constants/theme';
import img from '../assets/images/favicon.png'; 

export default function LandingScreen() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the client home if the user is authenticated
    if (user) {
      router.replace('/(client)');
    }
  }, [user, router]);

  const handleGetStarted = () => {
    // In case the user is not authenticated, you can navigate to the authentication flow
    router.push('/(client)'); // You can modify this based on your authentication flow
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Alphabet</Text>
      </View>

      <View style={styles.heroContainer}>
        <Text style={styles.heading}>Connect with Amazing Artists</Text>
        <Text style={styles.subheading}>
          Book performers, photographers, chefs, and more for your next event
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={img}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </View>
      </View>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Discover Talent</Text>
          <Text style={styles.featureDescription}>Find the perfect artist for your event or project</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Book Easily</Text>
          <Text style={styles.featureDescription}>Simple booking process with secure payments</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.lg,
  },
  logoContainer: {
    marginTop: Theme.spacing.xxl,
    alignItems: 'center',
  },
  logoText: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xxxl,
    color: Theme.colors.primary,
  },
  heroContainer: {
    marginTop: Theme.spacing.xl,
    alignItems: 'center',
  },
  heading: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.textDark,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  subheading: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(138, 43, 226, 0.2)', // Violet with opacity
  },
  features: {
    marginTop: Theme.spacing.xl,
  },
  featureItem: {
    marginBottom: Theme.spacing.lg,
  },
  featureTitle: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.xs,
  },
  featureDescription: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
  },
  footer: {
    marginTop: '-10',
    marginBottom: Theme.spacing.xl,
  },
});
