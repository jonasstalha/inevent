import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Theme } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  containerStyle?: object;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  secureTextEntry,
  containerStyle,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.error,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            secureTextEntry && styles.inputWithRightIcon,
            style,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor={Theme.colors.placeholder}
          {...rest}
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            {isPasswordVisible ? (
              <EyeOff size={20} color={Theme.colors.textLight} />
            ) : (
              <Eye size={20} color={Theme.colors.textLight} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.card,
  },
  focused: {
    borderColor: Theme.colors.primary,
  },
  error: {
    borderColor: Theme.colors.error,
  },
  input: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: Theme.spacing.xl,
  },
  leftIcon: {
    paddingLeft: Theme.spacing.md,
  },
  eyeIcon: {
    padding: Theme.spacing.sm,
    position: 'absolute',
    right: 0,
  },
  errorText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.error,
    marginTop: Theme.spacing.xs,
  },
});