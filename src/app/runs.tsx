import { SymbolView } from 'expo-symbols';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ACCENT, BG } from '@/constants/colors';

export default function RunsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.center}>
        <SymbolView
          name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
          size={48}
          tintColor={ACCENT}
        />
        <ThemedText style={styles.title}>RUNS</ThemedText>
        <ThemedText style={styles.sub}>Coming soon</ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title:     { color: ACCENT, fontSize: 32, fontWeight: '900', fontStyle: 'italic', letterSpacing: 2 },
  sub:       { color: '#7A7A7A', fontSize: 14, fontWeight: '500' },
});
