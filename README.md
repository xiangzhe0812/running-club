# Running Club

A cross-platform running club app built with Expo (iOS · Android · Web).

## Features

- **Home** — upcoming run card, weekly metrics (distance, pace, time), club activity feed
- **Runs** — scheduled group runs
- **Track** — start and record a run
- **Ranks** — leaderboard
- **Profile** — user profile with Clerk-powered sign-out
- **Auth** — sign-in / sign-up gate via Clerk; session stored in `expo-secure-store`

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 55 + Expo Router (file-based routing) |
| Language | TypeScript 5.9, React 19 |
| Auth | Clerk (`@clerk/expo`) |
| Navigation | `expo-router/unstable-native-tabs` (iOS/Android) · `expo-router/ui` (Web) |
| Animations | `react-native-reanimated` 4 + `react-native-worklets` |
| Styling | `StyleSheet` + theme system (`src/constants/theme.ts`) |
| Compiler | React Compiler enabled (no manual `useMemo`/`useCallback`) |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Expo CLI (`npm i -g expo`)
- A [Clerk](https://clerk.com) publishable key

### Install

```bash
pnpm install
```

### Environment

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Run

```bash
pnpm start        # Expo dev server — press i / a / w for iOS / Android / Web
pnpm ios          # Build and run on iOS simulator
pnpm android      # Build and run on Android emulator
pnpm web          # Start web server
```

## Project Structure

```
src/
├── app/               # Screens (Expo Router file-based routes)
│   ├── _layout.tsx    # Root layout — Clerk provider + tab navigator
│   ├── index.tsx      # Home screen
│   ├── runs.tsx       # Runs screen
│   ├── track.tsx      # Track screen
│   ├── ranks.tsx      # Ranks screen
│   ├── explore.tsx    # Explore screen
│   └── profile.tsx    # Profile screen
├── components/        # Shared UI components
│   ├── app-tabs.tsx         # Native tab bar (iOS/Android)
│   ├── app-tabs.web.tsx     # Floating pill tab bar (Web)
│   ├── animated-icon.tsx    # Reanimated splash overlay + icon
│   ├── auth-screen.tsx      # Clerk auth gate
│   ├── themed-text.tsx      # Theme-aware Text
│   └── themed-view.tsx      # Theme-aware View
├── constants/
│   └── theme.ts       # Colors, Fonts, Spacing, BottomTabInset, MaxContentWidth
└── hooks/
    ├── use-theme.ts         # Returns active color palette
    └── use-color-scheme.ts  # Platform-aware color scheme
```

## CI

### PR Review

`.github/workflows/pr-review.yml` runs on every PR (opened, updated, reopened) and posts an automated Claude code review as a PR comment.

**Required secret:** add `ANTHROPIC_API_KEY` in *GitHub repo → Settings → Secrets and variables → Actions*.

## Linting

```bash
pnpm lint    # ESLint via expo lint
```

## Android Package ID

`com.token.erc721.runningclub`
