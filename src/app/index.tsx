import { useUser } from '@clerk/expo';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ACCENT, BG, CARD_BG, CARD_BORDER, TEXT, TEXT_MUTED } from '@/constants/colors';

const TEXT_DIM = '#AAAAAA';

const UPCOMING_RUN = {
  title: 'MIDNIGHT CITY\nCIRCUIT',
  time: 'Tonight, 9:00 PM',
  location: 'Central Plaza',
  attending: 24,
};

const WEEKLY = {
  dateRange: 'May 15 – May 21',
  distance: 32.4,
  goal: 50,
  avgPace: "4'52\"",
  paceChange: '4% vs LW',
  timeActive: '3H 12M',
  sessions: 5,
};

const ACTIVITY = [
  {
    id: '1',
    initials: 'MT',
    name: 'Marcus Thorne',
    activity: 'Morning Interval Sprints',
    timeAgo: '2h ago',
    stats: [
      { label: 'Distance', value: '8.2',    unit: 'KM' },
      { label: 'Pace',     value: "4'12\"", unit: '' },
      { label: 'Elevation',value: '142',    unit: 'M' },
    ],
  },
  {
    id: '2',
    initials: 'ER',
    name: 'Elena Rodriguez',
    activity: 'Long Endurance Run',
    timeAgo: '5h ago',
    stats: [
      { label: 'Distance', value: '15.0',   unit: 'KM' },
      { label: 'Pace',     value: "5'30\"", unit: '' },
      { label: 'Time',     value: '1:22:15',unit: '' },
    ],
  },
];

export default function HomeScreen() {
  const { user } = useUser();
  const progressPct = `${((WEEKLY.distance / WEEKLY.goal) * 100).toFixed(0)}%`;
  const remaining = (WEEKLY.goal - WEEKLY.distance).toFixed(1);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>

        {/* ── Header ── */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.brand}>RUN CLUB</ThemedText>
          <ThemedView style={styles.headerRight}>
            <Pressable hitSlop={12}>
              <SymbolView
                name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
                size={22}
                tintColor={TEXT}
              />
            </Pressable>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.headerAvatar} />
            ) : (
              <ThemedView style={styles.headerAvatarPlaceholder}>
                <ThemedText style={styles.headerAvatarInitial}>
                  {(user?.firstName ?? 'A').charAt(0)}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          {/* ── Upcoming Run ── */}
          <ThemedView style={styles.upcomingCard}>
            <ThemedView style={styles.upcomingBadge}>
              <SymbolView
                name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
                size={12}
                tintColor="#000"
              />
              <ThemedText style={styles.upcomingBadgeText}>UPCOMING RUN</ThemedText>
            </ThemedView>
            <ThemedText style={styles.upcomingTitle}>{UPCOMING_RUN.title}</ThemedText>
            <ThemedView style={styles.upcomingMeta}>
              <SymbolView
                name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                size={13}
                tintColor={TEXT_DIM}
              />
              <ThemedText style={styles.upcomingMetaText}>{UPCOMING_RUN.time}</ThemedText>
              <ThemedView style={styles.metaDot} />
              <SymbolView
                name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
                size={13}
                tintColor={TEXT_DIM}
              />
              <ThemedText style={styles.upcomingMetaText}>{UPCOMING_RUN.location}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.attendingRow}>
              <SymbolView
                name={{ ios: 'person.3', android: 'group', web: 'group' }}
                size={14}
                tintColor={ACCENT}
              />
              <ThemedText style={styles.attendingText}>
                {UPCOMING_RUN.attending} attending
              </ThemedText>
            </ThemedView>
            <Pressable style={({ pressed }) => [styles.joinButton, pressed && styles.pressed]}>
              <ThemedText style={styles.joinButtonText}>JOIN THE PACK</ThemedText>
            </Pressable>
          </ThemedView>

          {/* ── Weekly Metrics ── */}
          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>WEEKLY METRICS</ThemedText>
            <ThemedText style={styles.sectionDate}>{WEEKLY.dateRange}</ThemedText>
          </ThemedView>

          {/* Distance progress card */}
          <ThemedView style={styles.distanceCard}>
            <ThemedText style={styles.distanceLabel}>TOTAL DISTANCE</ThemedText>
            <ThemedView style={styles.distanceRow}>
              <ThemedText style={styles.distanceValue}>{WEEKLY.distance}</ThemedText>
              <ThemedText style={styles.distanceGoal}> / {WEEKLY.goal} KM</ThemedText>
            </ThemedView>
            <ThemedView style={styles.progressTrack}>
              <ThemedView style={[styles.progressFill, { width: progressPct }]} />
            </ThemedView>
            <ThemedText style={styles.distanceRemaining}>{remaining} KM to go</ThemedText>
          </ThemedView>

          {/* Pace + Time cards */}
          <ThemedView style={styles.metricsRow}>
            <ThemedView style={styles.metricCard}>
              <ThemedText style={styles.metricLabel}>AVG PACE</ThemedText>
              <ThemedText style={styles.metricValue}>{WEEKLY.avgPace}</ThemedText>
              <ThemedView style={styles.metricChangeRow}>
                <SymbolView
                  name={{ ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }}
                  size={11}
                  tintColor={ACCENT}
                />
                <ThemedText style={styles.metricChange}>{WEEKLY.paceChange}</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.metricCard}>
              <ThemedText style={styles.metricLabel}>TIME ACTIVE</ThemedText>
              <ThemedText style={styles.metricValue}>{WEEKLY.timeActive}</ThemedText>
              <ThemedText style={styles.metricSub}>{WEEKLY.sessions} Sessions</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* ── Club Activity ── */}
          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>CLUB ACTIVITY</ThemedText>
            <Pressable hitSlop={8}>
              <ThemedText style={styles.viewAll}>VIEW ALL</ThemedText>
            </Pressable>
          </ThemedView>

          {ACTIVITY.map((item) => (
            <ThemedView key={item.id} style={styles.activityCard}>
              <ThemedView style={styles.activityTop}>
                <ThemedView style={styles.activityAvatar}>
                  <ThemedText style={styles.activityAvatarText}>{item.initials}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.activityInfo}>
                  <ThemedText style={styles.activityName}>{item.name}</ThemedText>
                  <ThemedText style={styles.activityType}>{item.activity}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.activityTime}>{item.timeAgo}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.activityStats}>
                {item.stats.map((stat, i) => (
                  <ThemedView key={i} style={styles.statItem}>
                    <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                    <ThemedView style={styles.statValueRow}>
                      <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                      {!!stat.unit && (
                        <ThemedText style={styles.statUnit}> {stat.unit}</ThemedText>
                      )}
                    </ThemedView>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          ))}

          <ThemedView style={styles.bottomPad} />
        </ScrollView>

        {/* ── FAB ── */}
        <Pressable style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
          <ThemedText style={styles.fabIcon}>+</ThemedText>
        </Pressable>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  safeArea:  { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  // Header
  header: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  brand: {
    color: ACCENT,
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  headerRight: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: ACCENT,
  },
  headerAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ACCENT,
  },
  headerAvatarInitial: { color: ACCENT, fontSize: 15, fontWeight: '800' },

  // Upcoming run
  upcomingCard: {
    backgroundColor: '#161a14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 20,
    gap: 12,
    marginBottom: 28,
  },
  upcomingBadge: {
    backgroundColor: ACCENT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  upcomingBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  upcomingTitle: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
    letterSpacing: 1,
  },
  upcomingMeta: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  upcomingMetaText: { color: TEXT_DIM, fontSize: 13, fontWeight: '500' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#444' },
  attendingRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendingText: { color: ACCENT, fontSize: 14, fontWeight: '700' },
  joinButton: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  joinButtonText: { color: '#000', fontSize: 14, fontWeight: '900', letterSpacing: 2 },

  // Section header
  sectionHeader: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: { color: TEXT, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  sectionDate:  { color: TEXT_MUTED, fontSize: 13, fontWeight: '500' },
  viewAll:      { color: ACCENT, fontSize: 13, fontWeight: '700', letterSpacing: 1 },

  // Distance card
  distanceCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 18,
    gap: 10,
    marginBottom: 12,
  },
  distanceLabel: { color: TEXT_MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  distanceRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  distanceValue: { color: ACCENT, fontSize: 48, fontWeight: '900', lineHeight: 52 },
  distanceGoal:  { color: TEXT, fontSize: 16, fontWeight: '700', marginBottom: 6, marginLeft: 4 },
  progressTrack: {
    height: 5,
    backgroundColor: '#2E2E2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 3,
  },
  distanceRemaining: { color: TEXT_MUTED, fontSize: 12, fontWeight: '500' },

  // Pace + time metrics
  metricsRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  metricCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 16,
    gap: 4,
  },
  metricLabel: { color: TEXT_MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  metricValue: { color: TEXT, fontSize: 26, fontWeight: '900', marginTop: 4 },
  metricChangeRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricChange: { color: ACCENT, fontSize: 12, fontWeight: '700' },
  metricSub:    { color: TEXT_MUTED, fontSize: 12, fontWeight: '500' },

  // Club activity
  activityCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    padding: 16,
    gap: 14,
    marginBottom: 10,
  },
  activityTop: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#383838',
  },
  activityAvatarText: { color: TEXT_MUTED, fontSize: 14, fontWeight: '700' },
  activityInfo: { backgroundColor: 'transparent', flex: 1, gap: 2 },
  activityName: { color: TEXT, fontSize: 15, fontWeight: '700' },
  activityType: { color: TEXT_MUTED, fontSize: 12, fontWeight: '500' },
  activityTime: { color: TEXT_MUTED, fontSize: 12, fontWeight: '500' },
  activityStats: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 4,
  },
  statItem: { backgroundColor: 'transparent', flex: 1, gap: 2 },
  statLabel: { color: TEXT_MUTED, fontSize: 11, fontWeight: '600' },
  statValueRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  statValue: { color: TEXT, fontSize: 20, fontWeight: '900' },
  statUnit:  { color: TEXT_MUTED, fontSize: 11, fontWeight: '600', marginBottom: 2, marginLeft: 2 },

  pressed:   { opacity: 0.8 },
  bottomPad: { height: 16, backgroundColor: 'transparent' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { color: '#000', fontSize: 28, fontWeight: '900', lineHeight: 30 },
});
