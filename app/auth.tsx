import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { Card } from '@/src/components/common/Card';
import { Theme } from '@/src/constants/theme';

// Validation schemas
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['artist', 'client', 'admin'], 'Invalid role').required('Role is required'),
});

export default function AuthScreen() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string }, { setSubmitting, setErrors }: any) => {
    try {
      await login(values.email, values.password);
      // No need to navigate, root layout will handle redirection based on user role
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (
    values: { name: string; email: string; password: string; role: 'artist' | 'client' | 'admin' },
    { setSubmitting, setErrors }: any
  ) => {
    try {
      await register(values.email, values.password, values.name, values.role);
      // No need to navigate, root layout will handle redirection based on user role
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const goBack = () => {
    router.back();
  };

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
                initialValues={{ name: '', email: '', password: '', role: 'client' as 'client' | 'artist' | 'admin' }}
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
                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          values.role === 'client' && styles.selectedRole,
                        ]}
                        onPress={() => setFieldValue('role', 'client')}
                      >
                        <Text
                          style={[
                            styles.roleText,
                            values.role === 'client' && styles.selectedRoleText,
                          ]}
                        >
                          Client
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          values.role === 'artist' && styles.selectedRole,
                        ]}
                        onPress={() => setFieldValue('role', 'artist')}
                      >
                        <Text
                          style={[
                            styles.roleText,
                            values.role === 'artist' && styles.selectedRoleText,
                          ]}
                        >
                          Artist
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          values.role === 'admin' && styles.selectedRole,
                        ]}
                        onPress={() => setFieldValue('role', 'admin')}
                      >
                        <Text
                          style={[
                            styles.roleText,
                            values.role === 'admin' && styles.selectedRoleText,
                          ]}
                        >
                          Admin
                        </Text>
                      </TouchableOpacity>
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
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    width: '100%',
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
    color: Theme.colors.secondary,
  },
  errorText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.error,
    marginTop: -Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  submitButton: {
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