# Getting Started Guide - Aurora Download Manager

## Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd /home/engine/project
npm install
```

### 2. Run the App
```bash
npm start
```

### 3. Launch on Device
- Press `a` for Android emulator
- OR scan QR code with Expo Go app on your Android device

That's it! The app should now be running.

---

## Detailed Setup Guide

### Prerequisites Checklist
- [ ] **Node.js** 18+ installed (`node --version`)
- [ ] **npm** or **yarn** installed
- [ ] **Expo CLI** installed globally:
  ```bash
  npm install -g expo-cli
  ```
- [ ] **Android Studio** (for emulator) OR **Expo Go** app on physical device
- [ ] **Git** (to clone repository)

### Step-by-Step Installation

#### Step 1: Navigate to Project
```bash
cd /home/engine/project
```

#### Step 2: Install Node Modules
```bash
npm install
```

**Expected Output**:
```
added 1234 packages in 45s
```

#### Step 3: Create Environment File (Optional)
```bash
cp .env.example .env
```

Edit `.env` if you want to customize defaults (not required for basic usage).

#### Step 4: Start Development Server
```bash
npm start
```

**Expected Output**:
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android)
```

#### Step 5: Choose Platform

**Option A: Android Emulator**
1. Ensure Android emulator is running
2. Press `a` in the terminal
3. App will install and launch

**Option B: Physical Device**
1. Install **Expo Go** from Play Store
2. Open Expo Go app
3. Scan QR code from terminal
4. App will download and launch

---

## Troubleshooting

### "Unable to resolve module..."
**Solution**: Clear cache and reinstall
```bash
npx expo start --clear
npm install
```

### "Metro bundler failed to start"
**Solution**: Kill existing Metro processes
```bash
pkill -f "expo"
npx expo start
```

### "Cannot connect to Metro"
**Solution**: Ensure device and computer on same WiFi
```bash
# Use tunnel mode
npx expo start --tunnel
```

### TypeScript Errors
**Solution**: Run type check
```bash
npm run type-check
```

### Database Errors
**Solution**: Reset app data
- On Android: Settings → Apps → Aurora Download Manager → Clear Data
- Rebuild: `npm start -- --clear`

---

## Project Structure Overview

```
media-download-manager/
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── queue.tsx      # Download queue
│   │   ├── library.tsx    # Downloaded files
│   │   └── settings.tsx   # Settings
│   └── _layout.tsx        # Root layout
│
├── src/                   # Source code
│   ├── components/        # UI components
│   ├── features/          # Feature modules (downloads)
│   ├── services/          # Business logic
│   ├── db/               # Database layer
│   ├── theme/            # Design tokens
│   ├── utils/            # Utilities
│   └── hooks/            # Custom hooks
│
├── __tests__/            # Tests
├── package.json          # Dependencies
├── app.json             # Expo config
└── tsconfig.json        # TypeScript config
```

---

## Available Scripts

### Development
```bash
# Start dev server
npm start

# Start for Android
npm run android

# Start for iOS (Mac only)
npm run ios

# Start for Web
npm run web
```

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality
```bash
# Run linter
npm run lint

# Type check
npm run type-check
```

---

## First-Time Usage

### 1. Launch App
Open the app on your device.

### 2. Paste a URL
On the **Home** screen:
1. Paste a URL: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`
2. Tap **"Analyze URL"**
3. See file details
4. Tap **"Add to Downloads"**

### 3. Watch Download Progress
1. Navigate to **Queue** tab
2. Watch the download progress ring animate
3. See speed and ETA update in real-time

### 4. View Downloaded File
1. Wait for download to complete
2. Navigate to **Library** tab
3. See your downloaded file

### 5. Customize Theme
1. Navigate to **Settings** tab
2. Tap **Theme** to toggle Light/Dark
3. Tap an **Accent Color** swatch
4. See instant UI update

---

## Understanding the App

### Home Screen
**Purpose**: Add new downloads

**Key Features**:
- URL input with validation
- Smart clipboard detection
- File metadata preview
- "Analyze" before download

**User Flow**:
1. Paste URL
2. Analyze
3. Review details
4. Add to downloads

### Queue Screen
**Purpose**: Manage active and pending downloads

**Key Features**:
- Filter by status (All, Pending, Downloading, etc.)
- Pause/Resume downloads
- Retry failed downloads
- Clear completed

**Actions**:
- Tap download → Open actions menu
- Swipe left → Quick delete (if implemented)
- Pause All → Pause all active downloads

### Library Screen
**Purpose**: Browse completed downloads

**Key Features**:
- Search by filename
- Filter by file type (Video, Audio, Image, etc.)
- Sort by Date, Name, Size, Type

**Actions**:
- Tap file → Preview (not fully implemented in v1)
- Long press → Share/Delete

### Settings Screen
**Purpose**: Customize app preferences

**Sections**:
1. **Appearance**: Theme, accent color, animations
2. **Downloads**: Max concurrent, data saver
3. **About**: Version, privacy, disclaimers

---

## Development Workflow

### Making Changes

1. **Edit Code**: Modify files in `src/` or `app/`
2. **Auto-Reload**: Metro bundler hot-reloads changes
3. **Test**: Verify changes work as expected
4. **Commit**: Git commit your changes

### Adding a New Screen

1. Create file in `app/` directory:
   ```bash
   touch app/new-screen.tsx
   ```

2. Add screen content:
   ```tsx
   export default function NewScreen() {
     return <View><Text>New Screen</Text></View>;
   }
   ```

3. Navigate to `/new-screen` in the app

### Adding a New Component

1. Create file in `src/components/`:
   ```bash
   touch src/components/MyComponent.tsx
   ```

2. Export component:
   ```tsx
   export function MyComponent() {
     const theme = useTheme();
     return <View>...</View>;
   }
   ```

3. Import and use:
   ```tsx
   import { MyComponent } from '@components/MyComponent';
   ```

---

## Building for Production

### Option 1: EAS Build (Recommended)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure Build**:
   ```bash
   eas build:configure
   ```

4. **Build for Android**:
   ```bash
   eas build --platform android --profile production
   ```

5. **Download APK/AAB**:
   - Check build status in browser
   - Download when complete
   - Install on device or submit to Play Store

### Option 2: Local Build (Advanced)

1. **Prebuild**:
   ```bash
   npx expo prebuild
   ```

2. **Build APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Find APK**:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## Database Management

### Viewing Database
The app uses SQLite stored at:
```
/data/data/com.aurora.downloadmanager/databases/aurora_downloads.db
```

**To inspect** (requires rooted device or emulator):
```bash
adb shell
cd /data/data/com.aurora.downloadmanager/databases
sqlite3 aurora_downloads.db
.tables
SELECT * FROM downloads;
```

### Resetting Database
To start fresh:
1. Uninstall app
2. Reinstall
3. Database will be recreated

---

## Customization

### Changing Colors
Edit `src/theme/auroraTokens.ts`:
```typescript
colors: {
  neon: {
    cyan: '#00d9ff',  // Change this
    pink: '#ff006e',  // Or this
  }
}
```

### Changing Max Downloads
Edit `src/utils/constants.ts`:
```typescript
export const DOWNLOAD_CONSTANTS = {
  MAX_CONCURRENT_DOWNLOADS: 3,  // Change to 1-10
}
```

### Adding Languages
1. Create `src/i18n/es.ts` (for Spanish)
2. Copy structure from `en.ts`
3. Translate strings
4. Import in `src/i18n/i18n.ts`
5. Add language selector in settings

---

## Performance Tips

### Optimizing Animations
If animations lag:
1. Enable **Reduced Motion** in settings
2. Run on physical device (not emulator)
3. Close other apps

### Database Performance
For large download history:
1. Regularly clear completed downloads
2. Database has indexes for fast queries
3. Consider archiving old downloads

### Memory Management
If app crashes with large files:
1. Lower max concurrent downloads
2. Enable data saver mode
3. Download smaller files first

---

## Common Tasks

### Task: Download a Video
1. Go to Home screen
2. Paste video URL
3. Tap "Analyze URL"
4. Verify video detected
5. Tap "Add to Downloads"
6. Go to Queue to watch progress

### Task: Pause All Downloads
1. Go to Queue screen
2. Tap pause icon (top right)
3. All active downloads pause

### Task: Change Theme
1. Go to Settings
2. Tap "Theme"
3. Cycle through Light/Dark/Auto

### Task: Find a Downloaded File
1. Go to Library
2. Type filename in search
3. Or tap file type filter

---

## Learning Resources

### Expo Documentation
- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://expo.github.io/router/)
- [Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)

### React Native
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## Getting Help

### Check Logs
```bash
# View Metro logs
npm start

# View device logs (Android)
adb logcat | grep ReactNative
```

### Debug Mode
Enable debug:
1. Shake device
2. Tap "Debug Remote JS"
3. Open Chrome DevTools

### Report Issues
If you find a bug:
1. Check console for errors
2. Note steps to reproduce
3. Check `TESTING.md` for similar issues

---

## Next Steps

- [ ] Complete manual test checklist (`__tests__/e2e/manual-test-checklist.md`)
- [ ] Read architecture docs (`ARCHITECTURE.md`)
- [ ] Explore UX spec (`UX_SPEC.md`)
- [ ] Review Play Store checklist (`PLAY_STORE_CHECKLIST.md`)
- [ ] Run unit tests (`npm test`)

---

**You're all set! Start downloading with Aurora.** ✨
