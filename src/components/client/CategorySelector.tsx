import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Theme } from '../../constants/theme';

const CATEGORIES = [
  'All',
  'Music',
  'Photography',
  'Culinary Arts',
  'Visual Arts',
  'Dance',
  'Comedy',
  'Acting',
];

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => handleSelect(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.md,
  },
  scrollContainer: {
    paddingHorizontal: Theme.spacing.md,
  },
  categoryButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: Theme.colors.background,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  selectedCategory: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  categoryText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text,
  },
  selectedCategoryText: {
    color: Theme.colors.secondary,
  },
});