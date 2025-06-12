import { Stack } from 'expo-router';

export default function HiddenLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
