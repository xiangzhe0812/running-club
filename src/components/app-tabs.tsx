import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ACCENT } from '@/constants/colors';

const TABS = [
  { name: 'home',    href: '/',        label: 'Home',    icon: { ios: 'square.grid.2x2', android: 'grid_view',         web: 'grid_view' } },
  { name: 'runs',    href: '/runs',    label: 'Runs',    icon: { ios: 'calendar',         android: 'calendar_month',    web: 'calendar_month' } },
  { name: 'track',   href: '/track',   label: 'Track',   icon: { ios: 'play.fill',         android: 'play_arrow',       web: 'play_arrow' } },
  { name: 'ranks',   href: '/ranks',   label: 'Ranks',   icon: { ios: 'chart.bar.fill',    android: 'bar_chart',        web: 'bar_chart' } },
  { name: 'profile', href: '/profile', label: 'Profile', icon: { ios: 'person',            android: 'person',           web: 'person' } },
] as const;

const INACTIVE = '#666666';
const TAB_BG = '#141414';

type TabItemProps = TabTriggerSlotProps & {
  label: string;
  icon: { readonly ios: string; readonly android: string; readonly web: string };
};

function TabItem({ label, icon, isFocused, ...props }: TabItemProps) {
  const color = isFocused ? ACCENT : INACTIVE;
  return (
    <Pressable {...props} style={styles.tabItem}>
      <SymbolView name={icon as any} size={24} tintColor={color} />
      <ThemedText style={[styles.tabLabel, { color }]}>{label}</ThemedText>
    </Pressable>
  );
}

function TabBar({ children, ...props }: ViewProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View {...props} style={[styles.tabBar, { paddingBottom: Math.max(bottom, 8) }]}>
      {children}
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <TabBar>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabItem label={tab.label} icon={tab.icon} />
            </TabTrigger>
          ))}
        </TabBar>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  slot: { flex: 1 },
  tabBar: {
    backgroundColor: TAB_BG,
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2A2A2A',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
