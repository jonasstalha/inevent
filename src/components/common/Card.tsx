import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Theme } from '../../constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  borderRadius = 'medium',
  style,
  ...rest
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return Theme.spacing.sm;
      case 'medium':
        return Theme.spacing.md;
      case 'large':
        return Theme.spacing.lg;
      default:
        return Theme.spacing.md;
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'none':
        return 0;
      case 'small':
        return Theme.borderRadius.sm;
      case 'medium':
        return Theme.borderRadius.md;
      case 'large':
        return Theme.borderRadius.lg;
      default:
        return Theme.borderRadius.md;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      padding: getPadding(),
      borderRadius: getBorderRadius(),
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyles,
          backgroundColor: Theme.colors.card,
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: Theme.colors.card,
          borderWidth: 1,
          borderColor: Theme.colors.border,
        };
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: Theme.colors.card,
          ...Theme.shadows.md,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <View style={[getStyles(), style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});