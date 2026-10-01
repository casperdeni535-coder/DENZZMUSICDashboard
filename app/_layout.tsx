import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { BotProvider } from '@/contexts/BotContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <BotProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </BotProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
