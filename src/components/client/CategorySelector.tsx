import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Theme } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

const CATEGORIES = [
  { name: 'Mariage', icon: 'heart' },
  { name: 'Anniversaire', icon: 'gift' },
  { name: 'Traiteur', icon: 'coffee' },
  { name: 'Musique', icon: 'music' },
  { name: 'Neggafa', icon: 'user' },
  { name: 'Conference', icon: 'briefcase' },
  { name: "Evenement d'entreprise", icon: 'users' },
  { name: 'Kermesse', icon: 'smile' },
  { name: 'Henna', icon: 'leaf' },
  { name: 'Photographie', icon: 'camera' },
  { name: 'Animation', icon: 'film' },
  { name: 'Decoration', icon: 'award' },
  { name: 'Buffet', icon: 'coffee' },
];

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => onSelectCategory(category.name)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Icon
                name={category.icon}
                size={16}
                color={selectedCategory === category.name ? Theme.colors.secondary : Theme.colors.primary}
              />
            </View>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.selectedCategoryText,
              ]}
            >
              {category.name}
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
  iconWrapper: {
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});