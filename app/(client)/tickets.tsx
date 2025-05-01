// app/(client)/tickets/index.js
import { View, Text } from 'react-native';

export default function TicketsScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        My Tickets
      </Text>
      <Text style={{ fontSize: 30,  }}>
        this is teckets page 
      </Text>
    </View>
  );
}

// For header title (optional)
export function unstable_settings() {
  return {
    title: 'Tickets',
  };
}