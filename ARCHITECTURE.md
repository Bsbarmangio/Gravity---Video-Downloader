# Architecture Documentation

## System Overview

Aurora Download Manager is built with a clean, modular architecture following React Native and Expo best practices.

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  (Expo Router Screens + Aurora Glass Components)            │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                      State Layer                            │
│  (Zustand Stores - Downloads, Settings)                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                    Service Layer                            │
│  (Network, File Ops, Notifications, Database)               │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                  Persistence Layer                          │
│  (SQLite Database + FileSystem)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Design Decisions

### 1. **State Management: Zustand**

**Why Zustand over Redux/Context?**
- **Minimal boilerplate**: No actions, reducers, or providers
- **TypeScript-first**: Excellent type inference
- **Performance**: Re-renders only subscribed components
- **Simple API**: Easy to understand and maintain
- **Size**: Lightweight (~1KB gzipped)

**Implementation**:
- `downloadStore.ts`: Manages download queue, progress, and actions
- `settingsStore.ts`: Manages user preferences and theme
- Automatic SQLite synchronization on state changes

### 2. **Routing: Expo Router**

**Why Expo Router?**
- **File-based routing**: Screens auto-discovered from `app/` directory
- **Type-safe navigation**: Auto-generated TypeScript types
- **Deep linking**: Built-in support for URL schemes
- **Tab navigation**: Easy setup with `(tabs)` groups
- **Stack navigation**: Modal screens with Stack.Screen

**Structure**:
```
app/
├── _layout.tsx          # Root layout (initialization)
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator
│   ├── index.tsx        # Home (/)
│   ├── queue.tsx        # Queue (/queue)
│   ├── library.tsx      # Library (/library)
│   └── settings.tsx     # Settings (/settings)
```

### 3. **Persistence: SQLite**

**Why SQLite over AsyncStorage?**
- **Structured data**: Relational schema with indexes
- **Query performance**: Fast lookups and filters
- **Transactions**: Atomic operations for data integrity
- **Scalability**: Handles thousands of records efficiently
- **Migrations**: Easy schema evolution

**Schema Design**:
- **downloads**: Core download metadata with status tracking
- **settings**: Key-value store for user preferences
- **Indexes**: On `status` and `createdAt` for fast filtering

### 4. **Animations: React Native Reanimated**

**Why Reanimated v3?**
- **60 FPS animations**: Runs on UI thread, not JS thread
- **Declarative API**: `useSharedValue`, `useAnimatedStyle`
- **Gesture integration**: Works seamlessly with Gesture Handler
- **Spring physics**: Natural, fluid animations

**Usage**:
- Progress rings with smooth transitions
- Bottom sheet with pan gestures
- Smart Paste button with scale animations
- Skeleton loaders with opacity cycling

### 5. **Design System: Aurora Glass**

**Custom vs. UI Library?**
- **Uniqueness**: Differentiated visual identity
- **Control**: Full customization without library constraints
- **Performance**: No unused components loaded
- **Learning**: Demonstrates design system architecture

**Components**:
- `AuroraGlass`: Glassmorphism wrapper with gradient support
- `ProgressRing`: Animated circular progress with Reanimated
- `Capsule`: Download item with progress and metadata
- `BlurredHeader`: Frosted glass header with safe area handling

---

## Download Engine Architecture

### Flow Diagram

```
User adds URL
    ↓
[validateFileUrl] → HEAD request to server
    ↓
{isValid, filename, fileSize, supportsResume}
    ↓
User confirms
    ↓
[addDownload] → Creates Download object
    ↓
Store in SQLite + Zustand
    ↓
[startDownload] → Check concurrency limit
    ↓
[downloadFile] → expo-file-system DownloadResumable
    ↓
Progress callbacks → Update Zustand + SQLite
    ↓
On completion → Mark as 'completed', show notification
    ↓
On error → Increment retryCount, schedule retry
```

### Concurrency Control

- **Max Concurrent**: Configurable (1-4)
- **Queue Management**: FIFO with manual reordering
- **Auto-Start**: Next pending download starts when slot opens
- **Pause/Resume**: Remove from active pool, preserve state

### Retry Logic

**Exponential Backoff**:
- Retry 1: 1 second
- Retry 2: 2 seconds
- Retry 3: 4 seconds
- Max: 60 seconds

**Max Retries**: 3 by default, configurable per download

### Error Handling

| Error Type | Handling |
|------------|----------|
| Network offline | Mark as failed, auto-retry when network returns |
| 404 Not Found | Mark as failed, show error message |
| Low storage | Warn before download, pause if space critical |
| Invalid URL | Prevent download, show validation error |
| Server timeout | Retry with backoff |

---

## Data Flow

### Download Lifecycle

1. **Creation** (`pending`):
   - User submits URL
   - Validation passes
   - Download object created
   - Stored in SQLite and Zustand

2. **Download** (`downloading`):
   - Added to active pool
   - Progress callbacks update state
   - Speed/ETA calculated
   - Notifications sent

3. **Completion** (`completed`):
   - File saved to local storage
   - Status updated in SQLite
   - Removed from active pool
   - Success notification

4. **Failure** (`failed`):
   - Error logged
   - Retry scheduled if under limit
   - Error notification

5. **Pause** (`paused`):
   - Removed from active pool
   - State preserved
   - Can resume later

### State Synchronization

```
User Action
    ↓
Zustand Store Update (in-memory)
    ↓
Trigger side effect (async)
    ↓
SQLite Update (persistent)
    ↓
UI Re-render (subscribed components only)
```

**Crash Recovery**:
- On app restart, load downloads from SQLite
- Downloads with status `downloading` → set to `pending`
- Auto-resume pending downloads if concurrency allows

---

## Component Hierarchy

### Home Screen
```
HomeScreen
├── BlurredHeader
├── URLInput
│   └── AuroraGlass
├── ValidationResult
│   └── AuroraGlass
│       ├── DetailRows
│       └── DownloadButton
└── SmartPasteButton (FAB)
```

### Queue Screen
```
QueueScreen
├── BlurredHeader
├── FilterTabs (all, pending, downloading, paused, completed, failed)
├── FlatList
│   └── Capsule (for each download)
│       ├── ProgressRing
│       ├── SpeedMeter
│       └── Metadata
└── ActionBar (clear completed)
```

### Library Screen
```
LibraryScreen
├── BlurredHeader
├── SearchBar (AuroraGlass)
├── FilterChips (file types)
└── FlatList
    └── FileCard (for each completed download)
        ├── FileIcon
        └── FileInfo
```

### Settings Screen
```
SettingsScreen
├── BlurredHeader
└── ScrollView
    ├── AppearanceSection
    │   ├── ThemeSetting
    │   ├── AccentColorPicker
    │   └── ReducedMotionToggle
    ├── DownloadsSection
    │   ├── MaxConcurrentSetting
    │   └── DataSaverToggle
    └── AboutSection
        ├── VersionInfo
        ├── PrivacyPolicy
        └── ContentDisclaimer
```

---

## Performance Optimizations

### 1. **Selective Re-rendering**
- Zustand: Components subscribe only to needed state slices
- React.memo: Capsule component memoized to prevent unnecessary renders
- FlatList: `keyExtractor` and `getItemLayout` for efficient scrolling

### 2. **Database Queries**
- Indexes on `status` and `createdAt`
- Batch updates where possible
- Async operations to avoid blocking UI

### 3. **Animations**
- Run on UI thread via Reanimated
- `useSharedValue` for smooth 60 FPS
- Conditional animations based on `reducedMotion` setting

### 4. **Image/Asset Loading**
- Minimal external assets
- SVG icons via `react-native-svg`
- Gradient backgrounds generated programmatically

---

## Security Considerations

### 1. **Data Privacy**
- No external data collection
- All data stored locally in device sandbox
- No analytics by default (structure ready for opt-in)

### 2. **URL Validation**
- Whitelist HTTP/HTTPS only
- HEAD request validation before download
- Warning for non-direct file links

### 3. **File Storage**
- Sandboxed `FileSystem.documentDirectory`
- No access to system files outside sandbox
- Filename sanitization to prevent path traversal

### 4. **Permissions**
- Minimal permission requests
- INTERNET: Required for downloads
- STORAGE: For file operations
- NOTIFICATIONS: Optional, with permission prompt

---

## Extensibility Points

### Adding New File Types
1. Update `SUPPORTED_FILE_TYPES` in `constants.ts`
2. Add MIME type mapping in `validators.ts`
3. Add icon mapping in `library.tsx`

### Adding Localization
1. Create new translation file (e.g., `src/i18n/es.ts`)
2. Import in `src/i18n/i18n.ts`
3. Add language selector in settings

### Integrating Analytics
1. Implement event tracking in `src/services/analytics/eventTracking.ts`
2. Add opt-in toggle in settings
3. Respect user privacy preferences

### Cloud Storage Integration
1. Create new service: `src/services/cloud/cloudSync.ts`
2. Add sync settings in `settingsStore.ts`
3. Implement upload/download logic

---

## Testing Strategy

### Unit Tests
- **Utils**: Validators, formatters, constants
- **Services**: Download queue logic, retry manager
- **Store**: Zustand state transitions

### Integration Tests
- **Database**: CRUD operations, migrations
- **Download Flow**: End-to-end download simulation

### Manual Testing
- **UI**: Visual regression, accessibility
- **Downloads**: Various file types, network conditions
- **Edge Cases**: Low storage, offline mode, app restart

---

## Deployment

### Development
```bash
npm start
# Press 'a' for Android, 'i' for iOS
```

### Production Build (EAS)
```bash
# Configure (first time)
eas build:configure

# Build APK
eas build --platform android --profile production

# Build AAB for Play Store
eas build --platform android --profile production --auto-submit
```

### Pre-Submit Checklist
- [ ] Update version in `app.json`
- [ ] Test on physical device
- [ ] Verify privacy policy accessible
- [ ] Check all permissions justified
- [ ] Test download/pause/resume flow
- [ ] Verify offline behavior
- [ ] Check theme switching
- [ ] Test accessibility features

---

## Future Enhancements

### Planned Features
- [ ] Batch download support (paste multiple URLs)
- [ ] Download scheduling (start at specific time)
- [ ] Cloud backup/restore
- [ ] In-app video/audio player
- [ ] File encryption
- [ ] FTP/SFTP support
- [ ] Torrent downloads (with legal disclaimer)

### Technical Improvements
- [ ] Background task with WorkManager (custom dev client)
- [ ] Checksum verification (MD5, SHA256)
- [ ] Split downloads (multi-threaded)
- [ ] Custom HTTP headers per download
- [ ] Proxy support

---

## Conclusion

Aurora Download Manager demonstrates a production-ready architecture with:
- Clean separation of concerns
- Type-safe TypeScript
- Performant state management
- Robust error handling
- Accessible, unique UI/UX
- Comprehensive documentation

The codebase is structured for maintainability, testability, and extensibility.
