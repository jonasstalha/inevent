import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View, TouchableOpacityProps } from 'react-native';
import { Theme } from '../../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  ...rest
}) => {
  const getBackgroundColor = () => {
    if (disabled) return Theme.colors.disabled;
    
    switch (variant) {
      case 'primary':
        return Theme.colors.primary;
      case 'secondary':
        return Theme.colors.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return Theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Theme.colors.textLight;
    
    switch (variant) {
      case 'primary':
        return Theme.colors.secondary;
      case 'secondary':
        return Theme.colors.primary;
      case 'outline':
        return Theme.colors.primary;
      case 'text':
        return Theme.colors.primary;
      default:
        return Theme.colors.secondary;
    }
  };

  const getBorderColor = () => {
    if (disabled) return Theme.colors.disabled;
    
    switch (variant) {
      case 'outline':
        return Theme.colors.primary;
      default:
        return 'transparent';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return Theme.typography.fontSize.sm;
      case 'medium':
        return Theme.typography.fontSize.md;
      case 'large':
        return Theme.typography.fontSize.lg;
      default:
        return Theme.typography.fontSize.md;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          ...getPadding(),
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...Theme.shadows.sm,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Theme.typography.fontFamily.medium,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: Theme.spacing.sm,
  },
  iconRight: {
    marginLeft: Theme.spacing.sm,
  },
});