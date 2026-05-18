import { useClerk, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  ACCENT,
  BG,
  CARD_BG,
  CARD_BORDER,
  TEXT,
  TEXT_MUTED,
} from "@/constants/colors";

const MOCK_STATS = { totalDistance: 1284.5, avgPace: "4'12\"", totalRuns: 156 };

const MOCK_TROPHIES = [
  {
    id: "1",
    name: "First 10K",
    icon: { ios: "trophy.fill", android: "emoji_events", web: "emoji_events" },
  },
  {
    id: "2",
    name: "30 Day Streak",
    icon: {
      ios: "flame.fill",
      android: "local_fire_department",
      web: "local_fire_department",
    },
  },
  {
    id: "3",
    name: "Half Marathon",
    icon: { ios: "star.fill", android: "star", web: "star" },
  },
  {
    id: "4",
    name: "Full Marathon",
    icon: {
      ios: "crown.fill",
      android: "workspace_premium",
      web: "workspace_premium",
    },
  },
];

const MOCK_RUNS = [
  {
    id: "1",
    title: "Evening Interval Session",
    date: "Yesterday",
    distance: 8.2,
    time: "34:12",
  },
  {
    id: "2",
    title: "Long Recovery Run",
    date: "2 days ago",
    distance: 15.0,
    time: "1:12:45",
  },
  {
    id: "3",
    title: "Morning Sprint Drills",
    date: "Nov 12",
    distance: 5.5,
    time: "22:10",
  },
];

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").toUpperCase() ||
    "ATHLETE";
  const memberYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ── Header ── */}
          <ThemedView style={styles.header}>
            <ThemedView style={styles.headerLeft}>
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              ) : (
                <ThemedView style={styles.avatarPlaceholder}>
                  <ThemedText style={styles.avatarInitial}>
                    {fullName.charAt(0)}
                  </ThemedText>
                </ThemedView>
              )}
              <ThemedText style={styles.brand}>RUN CLUB</ThemedText>
            </ThemedView>
            <Pressable hitSlop={12}>
              <SymbolView
                name={{
                  ios: "bell",
                  android: "notifications",
                  web: "notifications",
                }}
                size={22}
                tintColor={ACCENT}
              />
            </Pressable>
          </ThemedView>

          {/* ── Hero ── */}
          <ThemedView style={styles.hero}>
            <ThemedText style={styles.heroName}>{fullName}</ThemedText>
            <ThemedText style={styles.heroSub}>
              ELITE MEMBER SINCE {memberYear}
            </ThemedText>
          </ThemedView>

          {/* ── Total Distance ── */}
          <ThemedView style={styles.distanceCard}>
            <ThemedView style={styles.distanceContent}>
              <ThemedText style={styles.distanceLabel}>
                TOTAL DISTANCE
              </ThemedText>
              <ThemedText style={styles.distanceValue}>
                {MOCK_STATS.totalDistance.toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                })}
              </ThemedText>
              <ThemedText style={styles.distanceUnit}>KILOMETERS</ThemedText>
            </ThemedView>
            <ThemedView style={styles.waveDecor} />
          </ThemedView>

          {/* ── Stats Row ── */}
          <ThemedView style={styles.statsRow}>
            <ThemedView style={styles.statCard}>
              <SymbolView
                name={{ ios: "speedometer", android: "speed", web: "speed" }}
                size={24}
                tintColor={ACCENT}
              />
              <ThemedText style={styles.statValue}>
                {MOCK_STATS.avgPace}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Avg Pace</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <SymbolView
                name={{
                  ios: "figure.run",
                  android: "directions_run",
                  web: "directions_run",
                }}
                size={24}
                tintColor={ACCENT}
              />
              <ThemedText style={styles.statValue}>
                {MOCK_STATS.totalRuns}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Runs</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* ── Trophy Cabinet ── */}
          <ThemedView style={styles.section}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                TROPHY CABINET
              </ThemedText>
              <Pressable hitSlop={8}>
                <ThemedText style={styles.viewAll}>View All</ThemedText>
              </Pressable>
            </ThemedView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trophyList}
            >
              {MOCK_TROPHIES.map((trophy, i) => (
                <ThemedView key={trophy.id} style={styles.trophyItem}>
                  <ThemedView
                    style={[
                      styles.trophyCard,
                      i === 0 && styles.trophyCardActive,
                    ]}
                  >
                    <SymbolView
                      name={trophy.icon as any}
                      size={32}
                      tintColor={ACCENT}
                    />
                  </ThemedView>
                  <ThemedText style={styles.trophyName}>
                    {trophy.name}
                  </ThemedText>
                </ThemedView>
              ))}
            </ScrollView>
          </ThemedView>

          {/* ── Past Runs ── */}
          <ThemedView style={styles.section}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>PAST RUNS</ThemedText>
            </ThemedView>
            <ThemedView style={styles.runList}>
              {MOCK_RUNS.map((run) => (
                <Pressable
                  key={run.id}
                  style={({ pressed }) => [
                    styles.runCard,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedView style={styles.runThumb} />
                  <ThemedView style={styles.runInfo}>
                    <ThemedText style={styles.runTitle}>{run.title}</ThemedText>
                    <ThemedView style={styles.runMeta}>
                      <SymbolView
                        name={{
                          ios: "figure.run",
                          android: "directions_run",
                          web: "directions_run",
                        }}
                        size={11}
                        tintColor={TEXT_MUTED}
                      />
                      <ThemedText style={styles.runStat}>
                        {run.distance} km
                      </ThemedText>
                      <SymbolView
                        name={{
                          ios: "clock",
                          android: "schedule",
                          web: "schedule",
                        }}
                        size={11}
                        tintColor={TEXT_MUTED}
                      />
                      <ThemedText style={styles.runStat}>{run.time}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={styles.runRight}>
                    <ThemedText style={styles.runDate}>{run.date}</ThemedText>
                    <SymbolView
                      name={{
                        ios: "chevron.right",
                        android: "chevron_right",
                        web: "chevron_right",
                      }}
                      size={14}
                      tintColor={TEXT_MUTED}
                    />
                  </ThemedView>
                </Pressable>
              ))}
            </ThemedView>
          </ThemedView>

          {/* ── Sign Out ── */}
          <ThemedView style={styles.signOutSection}>
            <SignOutButton />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  safeArea: { flex: 1 },

  // Header
  header: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: ACCENT,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: ACCENT,
  },
  avatarInitial: { color: ACCENT, fontSize: 18, fontWeight: "800" },
  brand: {
    color: ACCENT,
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: 2,
  },

  // Hero
  hero: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 6,
  },
  heroName: {
    color: ACCENT,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
  },
  heroSub: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
  },

  // Distance card — lime left accent border
  distanceCard: {
    backgroundColor: CARD_BG,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    overflow: "hidden",
  },
  distanceContent: { backgroundColor: "transparent", flex: 1, gap: 2 },
  distanceLabel: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  distanceValue: {
    color: ACCENT,
    fontSize: 52,
    fontWeight: "900",
    lineHeight: 56,
    letterSpacing: -1,
  },
  distanceUnit: {
    color: TEXT,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  waveDecor: {
    width: 90,
    height: 60,
    backgroundColor: "#3A3A3A",
    borderRadius: 50,
    opacity: 0.5,
  },

  // Stats
  statsRow: {
    backgroundColor: "transparent",
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 16,
    gap: 4,
  },
  statValue: { color: TEXT, fontSize: 26, fontWeight: "900", marginTop: 8 },
  statLabel: { color: TEXT_MUTED, fontSize: 12, fontWeight: "500" },

  // Section
  section: { backgroundColor: "transparent", marginBottom: 28 },
  sectionHeader: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: 1,
  },
  viewAll: { color: ACCENT, fontSize: 13, fontWeight: "700" },

  // Trophies
  trophyList: { paddingHorizontal: 20, gap: 12 },
  trophyItem: {
    backgroundColor: "transparent",
    alignItems: "center",
    gap: 8,
    width: 90,
  },
  trophyCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  trophyCardActive: { borderColor: ACCENT, borderWidth: 2 },
  trophyName: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  // Past runs
  runList: { backgroundColor: "transparent", paddingHorizontal: 20, gap: 10 },
  runCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  runThumb: { width: 76, height: 76, backgroundColor: "#252525" },
  runInfo: {
    backgroundColor: "transparent",
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  runTitle: { color: TEXT, fontSize: 14, fontWeight: "700", lineHeight: 18 },
  runMeta: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  runStat: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: "500",
    marginRight: 6,
  },
  runRight: {
    backgroundColor: "transparent",
    alignItems: "flex-end",
    paddingRight: 14,
    paddingVertical: 12,
    gap: 16,
    minWidth: 72,
  },
  runDate: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
  },

  // Sign out
  signOutSection: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingBottom: 48,
    paddingTop: 8,
  },
});
