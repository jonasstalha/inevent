// src/components/artist/Store.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function Store() {
  // Only allow French, Arabic, and English as language options
  const supportedLanguages = [
    { code: 'French', label: 'Français' },
    { code: 'Arabic', label: 'العربية' },
    { code: 'English', label: 'English' },
  ];

  return (
    <View style={{ padding: 20 }}>
      <Text>Store Screen Placeholder</Text>
      {/* Example: Show supported languages */}
      <View style={{ marginTop: 20 }}>
        {supportedLanguages.map(lang => (
          <Text key={lang.code} style={{ fontSize: 16, marginBottom: 4 }}>{lang.label}</Text>
        ))}
      </View>
    </View>
  );
}
