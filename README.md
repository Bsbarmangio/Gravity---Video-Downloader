# Aurora Download Manager

> A world-class media download manager for Android with a unique Aurora Glass UI design system, built with React Native and Expo.

![Aurora Download Manager](https://via.placeholder.com/800x400/0f0f23/00d9ff?text=Aurora+Download+Manager)

## 🌟 Features

### Core Functionality
- **Direct File Downloads**: Download videos, audio, images, documents, and archives from direct URLs
- **Smart URL Validation**: Analyzes URLs before download to ensure they're direct file links
- **Queue Management**: Add multiple downloads, reorder, pause, resume, and cancel with ease
- **Progress Tracking**: Real-time progress with speed, ETA, and visual indicators
- **Pause/Resume Support**: Pause and resume downloads using range requests where supported
- **Auto-Retry**: Intelligent retry with exponential backoff for failed downloads
- **Offline-First**: All data stored locally in SQLite for persistence across app restarts

### Aurora Glass UI/UX
- **Glassmorphism Design**: Frosted glass effects, blurred backgrounds, and gradient overlays
- **Animated Progress Rings**: Smooth circular progress indicators with gradient strokes
- **Smart Paste Button**: Floating action button with glow effect when URL detected in clipboard
- **Queue Dock**: Expandable bottom sheet with gesture-based navigation
- **Neon Accents**: Customizable accent colors with cyan, pink, purple, green themes
- **Dark/Light Themes**: Automatic or manual theme switching with instant transitions
- **Haptic Feedback**: Tactile responses for all interactions

### Advanced Features
- **File Type Detection**: Automatic categorization (video, audio, image, document, archive)
- **Search & Filter**: Find downloads quickly with search and type filters
- **Bandwidth Limiting**: Data saver modes (low/medium/high)
- **Concurrent Downloads**: Configure 1-4 simultaneous downloads
- **Notifications**: Progress and completion notifications
- **Accessibility**: WCAG-compliant with screen reader support

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Android Studio** (for Android emulator) or a physical Android device
- **EAS CLI** (optional, for building): `npm install -g eas-cli`

### Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd /path/to/media-download-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed (defaults should work for development).

### Running the App

#### Development Mode (Expo Go)

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Run on Android**:
   - Press `a` in the terminal to open in Android emulator
   - OR scan the QR code with the Expo Go app on your Android device

3. **Run on iOS** (Mac only):
   - Press `i` in the terminal to open in iOS simulator

#### Production Build (Standalone APK)

For Play Store submission or testing true background behavior:

1. **Configure EAS Build**:
   ```bash
   eas build:configure
   ```

2. **Build for Android**:
   ```bash
   eas build --platform android --profile production
   ```

3. **Install the APK** on your device and test.

---

## 📁 Project Structure

```
media-download-manager/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Home screen (URL input)
│   │   ├── queue.tsx            # Download queue
│   │   ├── library.tsx          # Downloaded files library
│   │   └── settings.tsx         # Settings & preferences
│   ├── _layout.tsx              # Root layout with initialization
│   └── (tabs)/_layout.tsx       # Tab navigation layout
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── design-system/       # Aurora Glass components
│   │   │   ├── AuroraGlass.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── Capsule.tsx
│   │   │   ├── SpeedMeter.tsx
│   │   │   └── SkeletonLoader.tsx
│   │   ├── input/
│   │   │   ├── URLInput.tsx
│   │   │   └── SmartPasteButton.tsx
│   │   └── layout/
│   │       ├── BlurredHeader.tsx
│   │       └── BottomSheet.tsx
│   │
│   ├── features/downloads/
│   │   └── store/               # Zustand stores
│   │       ├── downloadStore.ts
│   │       ├── settingsStore.ts
│   │       └── types.ts
│   │
│   ├── services/
│   │   ├── network/
│   │   │   └── fileValidator.ts
│   │   ├── file/
│   │   │   ├── fileOperations.ts
│   │   │   └── fileDownloader.ts
│   │   └── notifications/
│   │       └── notificationService.ts
│   │
│   ├── db/
│   │   ├── sqlite.ts            # Database initialization
│   │   └── queries.ts           # CRUD operations
│   │
│   ├── theme/
│   │   ├── auroraTokens.ts      # Design tokens
│   │   ├── useTheme.ts          # Theme hook
│   │   └── typography.ts        # Typography presets
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatting.ts
│   │   ├── validators.ts
│   │   ├── logger.ts
│   │   └── haptics.ts
│   │
│   ├── i18n/
│   │   ├── en.ts                # English translations
│   │   └── i18n.ts              # i18n setup
│   │
│   └── hooks/
│       ├── useClipboard.ts
│       └── useDeviceInfo.ts
│
├── __tests__/                   # Test files
│   └── unit/
│
├── app.json                     # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 Aurora Glass Design System

The app features a unique **Aurora Glass** design language with:

- **Glassmorphism**: Frosted glass cards with blur effects and semi-transparent backgrounds
- **Gradient Backgrounds**: Smooth transitions from dark navy to deep purple
- **Neon Accents**: Vibrant cyan, pink, purple, and green accent colors
- **Animated Components**: Reanimated-powered smooth transitions and micro-interactions
- **Haptic Feedback**: Physical touch responses for key interactions

### Design Tokens

All design values are centralized in `src/theme/auroraTokens.ts`:
- **Colors**: Light/dark modes, gradients, neon accents, status colors
- **Spacing**: 4px-based scale (xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32)
- **Typography**: Predefined font sizes, weights, and line heights
- **Border Radius**: sm: 8, md: 12, lg: 16, xl: 24, full: 9999
- **Shadows & Blur**: Elevation levels and glassmorphism blur values

---

## 🛠️ Architecture

### State Management
- **Zustand**: Lightweight state management for downloads and settings
- **SQLite**: Persistent storage for download history and user preferences
- **React Hooks**: Custom hooks for clipboard, device info, and theme

### Download Engine
1. **URL Validation**: HEAD request to validate file and extract metadata
2. **Queue System**: Concurrent download management with configurable limits
3. **Progress Tracking**: Real-time updates with speed and ETA calculations
4. **Pause/Resume**: Using `expo-file-system`'s DownloadResumable API
5. **Retry Logic**: Exponential backoff (1s, 2s, 4s, 8s, 16s, 32s, max 60s)
6. **Persistence**: All state synced to SQLite for app restart recovery

### Database Schema

**downloads** table:
- `id`, `url`, `filename`, `fileType`, `status`
- `progress`, `bytesTotal`, `bytesDownloaded`, `speed`
- `createdAt`, `startedAt`, `completedAt`
- `localUri`, `error`, `retryCount`

**settings** table:
- `key`, `value`, `updatedAt`

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Manual Testing Checklist
See `__tests__/e2e/manual-test-checklist.md` for comprehensive manual testing scenarios.

---

## 🚧 Known Limitations & Considerations

### Background Downloads
- **Expo Limitation**: True background task support is limited in managed Expo workflow
- **Current Behavior**: Downloads pause when app is backgrounded
- **Workaround**: Downloads automatically resume when app is reopened
- **Production Solution**: For true background downloads, use EAS Build with custom dev client or transition to bare workflow

### Resume Support
- Resume functionality works only if the server supports HTTP range requests (`Accept-Ranges: bytes`)
- If range requests are not supported, downloads restart from the beginning

### File Access
- All downloads are stored in the app's sandbox directory (`FileSystem.documentDirectory`)
- Files can be shared via system share sheet but are not directly accessible in the system file manager

---

## 📱 Play Store Compliance

### Permissions
- `INTERNET`: Required for downloading files
- `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE`: For file operations

### Privacy Policy
- **No Data Collection**: The app does not collect, transmit, or store any personal data
- **Local Storage Only**: All downloads and settings are stored locally on the device
- A privacy policy template is provided in the app settings

### Content Rights
- Users are responsible for ensuring they have legal rights to download content
- A disclaimer is shown in the app settings

### Requirements Checklist
- ✅ Target SDK: Android 13+ (API level 33+)
- ✅ Signed APK/AAB
- ✅ Privacy policy accessible in-app
- ✅ Content rating: appropriate for all ages
- ✅ No malware, hate speech, or prohibited content
- ✅ `allowBackup=false` in app.json

---

## 🔧 Configuration

### Environment Variables
Edit `.env` to customize:
- `MAX_CONCURRENT_DOWNLOADS`: Default 3
- `DEFAULT_RETRY_LIMIT`: Default 3
- `DEFAULT_TIMEOUT_MS`: Default 30000 (30 seconds)

### User Settings (In-App)
- **Theme**: Light, Dark, Auto
- **Accent Color**: Cyan, Pink, Purple, Green, Yellow, Blue
- **Max Concurrent Downloads**: 1-4
- **Data Saver Mode**: On/Off
- **Reduced Motion**: On/Off (accessibility)

---

## 🐛 Troubleshooting

### "Database not initialized" error
- Ensure `initDatabase()` is called in `app/_layout.tsx`
- Check for errors in the console during app initialization

### Downloads not starting
- Verify the URL is a direct file link (not an HTML page)
- Check network connectivity
- Ensure storage space is available

### "Module not found" errors
- Run `npm install` to ensure all dependencies are installed
- Clear Metro cache: `npx expo start --clear`

### Animations not smooth
- Ensure you're testing on a physical device, not just an emulator
- Check that `react-native-reanimated` is properly installed

---

## 📄 License

This project is provided as-is for educational and personal use.

---

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive error handling
- Implementing checksum verification
- Adding batch download support
- Integrating with cloud storage services
- Supporting more file formats for preview

---

## 📚 Additional Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Detailed technical architecture
- **[UX_SPEC.md](./UX_SPEC.md)**: UX flows and design specifications
- **[TESTING.md](./TESTING.md)**: Testing strategy and guidelines
- **[PLAY_STORE_CHECKLIST.md](./PLAY_STORE_CHECKLIST.md)**: Compliance checklist

---

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

**Aurora Download Manager** - Download with style. ✨
