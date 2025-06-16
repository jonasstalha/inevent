'use client';

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, User, Mail, Lock, Phone } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { Card } from '@/src/components/common/Card';
import { Theme } from '@/src/constants/theme';
import * as Google from 'expo-auth-session/providers/google';
import { registerWithEmail } from '@/src/firebase/firebaseAuth';
import { createUserProfile } from '@/src/firebase/userService';

// TypeScript interfaces
interface LoginValues {
  email: string;
  password: string;
}

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

// Validation schemas
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  phone: Yup.string().required('Phone number is required'),
  role: Yup.string().oneOf(['artist', 'client'], 'Invalid role').required('Role is required'),
});

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, register } = useAuth();
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Handle authentication and fetch user info
      console.log('Google auth success:', authentication);
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  const handleLogin = async (
    values: LoginValues,
    { setSubmitting, setErrors }: { 
      setSubmitting: (isSubmitting: boolean) => void; 
      setErrors: (errors: Partial<LoginValues>) => void;
    }
  ) => {
    try {
      setSubmitting(true);
      // Remove mockUsers logic, use Firebase Auth only
      try {
        const userCredential = await login(values.email, values.password);
        const { getUserRole } = await import('../src/firebase/userService');
        const role = await getUserRole(userCredential.user.uid);
        
        if (!role) throw new Error('User role not found');

        // Navigate based on role
        // Navigate based on role
        switch (role) {
          case 'client':
            router.replace('/(client)');
            break;
          case 'artist':
            router.replace('/artist/ArtistPlatform');
            break;
          case 'admin':
            router.replace('/(admin)');
            break;
          default:
            Alert.alert('Error', 'Unknown user role');
        }
      } catch (authError) {
        setErrors({ 
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        });
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setErrors({ email: error.message });
      } else {
        setErrors({ email: 'An unexpected error occurred' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Fix: registerWithEmail expects 3 arguments (email, password, name)
  // and returns userCredential
  // Update usage to pass name and handle return value
  const handleRegister = async (
    values: RegisterValues,
    { setSubmitting, setErrors }: { 
      setSubmitting: (isSubmitting: boolean) => void; 
      setErrors: (errors: Partial<RegisterValues>) => void;
    }
  ) => {
    try {
      setSubmitting(true);
      const userCredential = await register(values.email, values.password, values.name, values.role as 'artist' | 'client' | 'admin');
      
      if (userCredential.user) {
        await createUserProfile(userCredential.user.uid, {
          email: values.email,
          name: values.name,
          phone: values.phone,
          role: values.role
        });

        // Navigate based on role
        switch (values.role) {
          case 'client':
            router.replace('/(client)');
            break;
          case 'artist':
            router.replace('/artist/ArtistPlatform');
            break;
          case 'admin':
            router.replace('/(admin)');
            break;
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        email: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => setIsLoginMode(prev => !prev);
  const goBack = () => router.back();

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingView} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Theme.colors.textDark} />
          </TouchableOpacity>

          <Text style={styles.title}>{isLoginMode ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>
            {isLoginMode ? 'Sign in to continue' : 'Sign up to get started'}
          </Text>

          <Card variant="elevated" style={styles.card}>
            {isLoginMode ? (
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                  <View>
                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      leftIcon={<Mail size={20} color={Theme.colors.textLight} />}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={touched.email && errors.email ? errors.email : undefined}
                    />

                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      secureTextEntry
                      leftIcon={<Lock size={20} color={Theme.colors.textLight} />}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={touched.password && errors.password ? errors.password : undefined}
                    />

                    <Button
                      title="Login"
                      onPress={handleSubmit}
                      loading={isSubmitting}
                      fullWidth
                      style={styles.submitButton}
                    />
                  </View>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{ name: '', email: '', password: '', phone: '', role: 'client' }}
                validationSchema={RegisterSchema}
                onSubmit={handleRegister}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
                  <View>
                    <Input
                      label="Name"
                      placeholder="Enter your full name"
                      leftIcon={<User size={20} color={Theme.colors.textLight} />}
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      error={touched.name && errors.name ? errors.name : undefined}
                    />

                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      leftIcon={<Mail size={20} color={Theme.colors.textLight} />}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={touched.email && errors.email ? errors.email : undefined}
                    />
                    
                    <Input
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                      leftIcon={<Phone size={20} color={Theme.colors.textLight} />}
                      value={values.phone}
                      onChangeText={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      error={touched.phone && errors.phone ? errors.phone : undefined}
                    />
                    
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      secureTextEntry
                      leftIcon={<Lock size={20} color={Theme.colors.textLight} />}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={touched.password && errors.password ? errors.password : undefined}
                    />

                    <Text style={styles.label}>I am a:</Text>
                    <View style={styles.roleContainer}>
                      {['client', 'artist'].map(role => (
                        <TouchableOpacity
                          key={role}
                          style={[
                            styles.roleButton,
                            values.role === role && styles.selectedRole,
                          ]}
                          onPress={() => setFieldValue('role', role)}
                        >
                          <Text
                            style={[
                              styles.roleText,
                              values.role === role && styles.selectedRoleText,
                            ]}
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {touched.role && errors.role && (
                      <Text style={styles.errorText}>{errors.role}</Text>
                    )}

                    <Button
                      title="Register"
                      onPress={handleSubmit}
                      loading={isSubmitting}
                      fullWidth
                      style={styles.submitButton}
                    />
                  </View>
                )}
              </Formik>
            )}

            <Button
              title="Sign in with Google"
              onPress={handleGoogleSignIn}
              fullWidth
              style={styles.googleButton}
              variant="outline"
            />
          </Card>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.toggleLink}>{isLoginMode ? 'Sign Up' : 'Login'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Validation schemas
const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

const styles = StyleSheet.create({
  keyboardAvoidingView: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1 
  },
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  backButton: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textLight,
    marginBottom: Theme.spacing.xl,
  },
  card: { 
    width: '100%' 
  },
  label: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.xs,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  roleButton: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginRight: Theme.spacing.sm,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  roleText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textDark,
  },
  selectedRoleText: { 
    color: Theme.colors.secondary 
  },
  errorText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.error,
    marginTop: -Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  submitButton: { 
    marginTop: Theme.spacing.md 
  },
  googleButton: {
    marginTop: Theme.spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  toggleText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textLight,
  },
  toggleLink: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.xs,
  },
});
