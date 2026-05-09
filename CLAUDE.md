# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start              # Start Expo dev server (then press i/a/w for iOS/Android/Web)
pnpm ios                # Build and run on iOS simulator (expo run:ios)
pnpm android            # Build and run on Android emulator (expo run:android)
pnpm web                # Start web server
pnpm lint               # Run ESLint via expo lint
```

Requires `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env` — the root layout throws if missing.

## Architecture

**Expo Router (file-based routing)** — entry is `expo-router/entry`; all screens live in `src/app/`. The `@/*` alias maps to `src/*`; `@/assets/*` maps to `assets/`.

**Auth** — Clerk (`@clerk/expo`) wraps the entire app in `src/app/_layout.tsx`. `tokenCache` uses `expo-secure-store`. The home screen gates content behind `useAuth` and renders `<AuthView mode="signInOrUp" />` when signed out.

**Tab navigation** — `src/components/app-tabs.tsx` uses `expo-router/unstable-native-tabs` (`NativeTabs`) on iOS/Android. `src/components/app-tabs.web.tsx` uses `expo-router/ui` (`Tabs`/`TabList`/`TabSlot`) and renders a floating pill-style nav bar. Platform-specific files (`.web.tsx`, `.web.ts`) are resolved automatically by Metro/Expo.

**Theming** — `src/constants/theme.ts` defines `Colors` (light/dark), `Fonts` (platform-specific font stacks), `Spacing` (4px base scale), `BottomTabInset`, and `MaxContentWidth`. `useTheme()` in `src/hooks/use-theme.ts` returns the active color palette. `ThemedText` and `ThemedView` consume `useTheme()` and accept a `type`/`themeColor` prop to select semantic colors without inline style objects.

**Animations** — `AnimatedSplashOverlay` and `AnimatedIcon` in `src/components/animated-icon.tsx` use `react-native-reanimated` keyframes. The splash overlay uses `react-native-worklets` (`scheduleOnRN`) to call a state setter from a worklet callback after the animation completes.

**Android package ID**: `com.token.erc721.runningclub` (set in `app.json`).

**React Compiler** is enabled (`experiments.reactCompiler: true` in `app.json`) — avoid manual `useMemo`/`useCallback` unless profiling shows a need.
