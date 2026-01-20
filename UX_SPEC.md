# UX Specification - Aurora Download Manager

## Design Philosophy

**Aurora Glass** is a unique design language that combines:
- **Glassmorphism**: Frosted glass effects with blur and transparency
- **Gradient Backgrounds**: Smooth color transitions creating depth
- **Neon Accents**: Vibrant, customizable accent colors
- **Micro-interactions**: Subtle animations and haptic feedback

---

## Color Palette

### Dark Mode (Default)
- **Background**: `#0f0f23` (Deep navy)
- **Surface**: `#1a1a2e` (Dark slate)
- **Surface Glass**: `rgba(26, 26, 46, 0.7)` (Semi-transparent)
- **Text**: `#ffffff` (White)
- **Text Secondary**: `#b8c1ec` (Light blue-gray)
- **Border**: `#2a2a3e` (Subtle divider)

### Light Mode
- **Background**: `#f8f9fa` (Off-white)
- **Surface**: `#ffffff` (Pure white)
- **Surface Glass**: `rgba(255, 255, 255, 0.7)` (Semi-transparent)
- **Text**: `#1a1a2e` (Dark navy)
- **Text Secondary**: `#6c757d` (Gray)
- **Border**: `#e9ecef` (Light gray)

### Neon Accents (Customizable)
- **Cyan** (default): `#00d9ff`
- **Pink**: `#ff006e`
- **Purple**: `#8338ec`
- **Green**: `#06ffa5`
- **Yellow**: `#ffbe0b`
- **Blue**: `#3a86ff`

### Status Colors
- **Pending**: `#6c757d` (Gray)
- **Downloading**: `#00d9ff` (Cyan)
- **Paused**: `#ffbe0b` (Yellow)
- **Completed**: `#06ffa5` (Green)
- **Failed**: `#ff006e` (Pink/Red)

---

## Typography

### Font Scale
- **Display**: 48px, Bold (Hero text)
- **H1**: 32px, Bold (Main headings)
- **H2**: 24px, Bold (Section headings)
- **H3**: 20px, Semi-bold (Sub-headings)
- **H4**: 16px, Semi-bold (Card titles)
- **Body**: 14px, Regular (Default text)
- **Body Large**: 16px, Regular (Emphasis)
- **Label**: 12px, Medium (UI labels)
- **Caption**: 10px, Regular (Metadata)

### Line Heights
- **Tight**: 1.2 (Headings)
- **Normal**: 1.5 (Body text)
- **Relaxed**: 1.8 (Long-form content)

---

## Spacing System

Based on 4px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **xxl**: 32px
- **xxxl**: 48px

---

## Component Library

### 1. **AuroraGlass**
**Purpose**: Glassmorphism container with blur and gradient support

**Variants**:
- Default: Semi-transparent surface with blur
- Gradient: Linear gradient overlay

**Usage**:
- Cards
- Input fields
- Bottom sheets
- Headers

### 2. **Capsule** (Download Item)
**Anatomy**:
```
┌───────────────────────────────────────────────┐
│  [Progress Ring]  Filename.mp4                │
│                   75% • 1.2 MB / 5 MB         │
│                   1.5 MB/s • 2s remaining     │
└───────────────────────────────────────────────┘
```

**States**:
- Pending: Gray ring, no speed/ETA
- Downloading: Cyan ring, animated progress, speed/ETA
- Paused: Yellow ring, "Paused" text
- Completed: Green ring, 100%, "Completed"
- Failed: Red ring, error message

**Interactions**:
- Tap: Open actions menu
- Long press: Quick actions (pause/resume/cancel)

### 3. **ProgressRing**
**Animation**:
- Smooth transition when progress updates (300ms ease-out)
- Gradient stroke color based on status
- Circular path with rounded ends

**Dimensions**:
- Size: 56px diameter
- Stroke width: 4px
- Background: Border color
- Foreground: Accent/status color

### 4. **SmartPasteButton** (FAB)
**Behavior**:
- Default: Cyan FAB with "+" icon
- URL detected: Pulsing glow effect, "clipboard" icon
- Tap: Paste URL from clipboard

**Animation**:
- Glow opacity: 0 → 0.8 (1s repeat)
- Press: Scale 1 → 0.9 → 1 (spring physics)

**Position**: Fixed bottom-right (24px margin)

### 5. **BottomSheet** (Queue Dock)
**States**:
- Collapsed: 80px height, shows "X Active Downloads"
- Expanded: 80% screen height, shows download list

**Gestures**:
- Pan down: Collapse
- Pan up: Expand
- Tap handle: Toggle

**Animation**:
- Spring physics (damping: 20, stiffness: 90)
- Handle bar indicator (40px × 4px)

### 6. **BlurredHeader**
**Anatomy**:
```
┌─────────────────────────────────────────┐
│  Aurora Download        [Right Element] │
│  Your media download manager            │
└─────────────────────────────────────────┘
```

**Features**:
- Blurred background (gradient overlay)
- Safe area insets (top padding)
- Optional subtitle
- Optional right element (actions)

---

## Screen Flows

### Home Screen

**Purpose**: Add new downloads

**Layout**:
```
┌──────────────────────────────────────┐
│  [Blurred Header]                    │
│  Aurora Download                     │
│  Your media download manager         │
├──────────────────────────────────────┤
│                                      │
│  Enter Download URL                  │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ https://example.com/file.mp4   │ │
│  └────────────────────────────────┘ │
│                                      │
│  [Paste from Clipboard]              │
│  [Analyze URL]                       │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ ✓ File Detected                │ │
│  │ Filename: video.mp4            │ │
│  │ Size: 5 MB                     │ │
│  │ Type: video/mp4                │ │
│  │                                │ │
│  │ [Add to Downloads]             │ │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
        [Smart Paste FAB]
```

**User Flow**:
1. User pastes or types URL
2. Tap "Analyze URL"
3. App validates URL (HEAD request)
4. Shows file metadata
5. User taps "Add to Downloads"
6. Download added to queue
7. Auto-navigates to Queue screen

**Edge Cases**:
- Invalid URL: Show inline error
- Not a direct file: Warning message
- Network error: Show retry option

### Queue Screen

**Purpose**: Manage download queue

**Filters**:
- All
- Pending
- Downloading
- Paused
- Completed
- Failed

**Layout**:
```
┌──────────────────────────────────────┐
│  [Blurred Header]          [Pause All]│
│  Download Queue                      │
│  5 total                             │
├──────────────────────────────────────┤
│  [All] [Pending] [Downloading] ...   │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │
│  │ [🔵] video.mp4                 │ │
│  │      75% • 1.2 MB / 5 MB       │ │
│  │      1.5 MB/s • 2s remaining   │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ [⏸️] audio.mp3                 │ │
│  │      Paused • 500 KB / 3 MB    │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ [✓] image.jpg                  │ │
│  │      Completed • 2 MB          │ │
│  └────────────────────────────────┘ │
├──────────────────────────────────────┤
│  [Clear Completed]                   │
└──────────────────────────────────────┘
```

**Interactions**:
- Tap Capsule: Open actions (Pause/Resume/Cancel)
- Swipe left: Quick delete
- Long press: Multi-select mode
- Drag: Reorder queue

**Actions**:
- Pause All: Pause all active downloads
- Clear Completed: Remove all completed items

### Library Screen

**Purpose**: Browse and manage downloaded files

**Layout**:
```
┌──────────────────────────────────────┐
│  [Blurred Header]          [Sort: Date]│
│  Library                             │
│  12 files                            │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │
│  │ 🔍 Search files...             │ │
│  └────────────────────────────────┘ │
│                                      │
│  [All] [Video] [Audio] [Image] ...   │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │
│  │ 📹 vacation.mp4                │ │
│  │    25 MB • 2h ago              │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 🎵 song.mp3                    │ │
│  │    3 MB • yesterday            │ │
│  └────────────────────────────────┘ │
│  ...                                 │
└──────────────────────────────────────┘
```

**Features**:
- Search by filename
- Filter by file type
- Sort by: Date, Name, Size, Type
- Tap file: Preview/Play (not implemented in v1)
- Long press: Share/Delete

### Settings Screen

**Purpose**: Configure app preferences

**Sections**:
1. **Appearance**
   - Theme (Light/Dark/Auto)
   - Accent Color (color picker)
   - Reduced Motion toggle

2. **Downloads**
   - Max Concurrent Downloads (1-4)
   - Data Saver Mode toggle

3. **About**
   - Version info
   - Privacy Policy
   - Content Rights Disclaimer

**Layout**:
```
┌──────────────────────────────────────┐
│  [Blurred Header]                    │
│  Settings                            │
│  Customize your experience           │
├──────────────────────────────────────┤
│  Appearance                          │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🎨 Theme              Dark   › │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 🌈 Accent Color                │ │
│  │    ⚫ ⚫ 🔵 ⚫ ⚫ ⚫           │ │
│  └────────────────────────────────┘ │
│                                      │
│  Downloads                           │
│  ┌────────────────────────────────┐ │
│  │ 📥 Max Concurrent      3     › │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 📶 Data Saver Mode    [OFF]   │ │
│  └────────────────────────────────┘ │
│                                      │
│  About                               │
│  ┌────────────────────────────────┐ │
│  │ ℹ️  Version           1.0.0    │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

## Interactions & Animations

### Haptic Feedback
- **Light**: Button taps, selections
- **Medium**: Important actions (analyze, download)
- **Heavy**: Critical actions (delete, cancel)
- **Success**: Download complete, validation passed
- **Warning**: Pause, non-direct file
- **Error**: Failed download, invalid URL

### Transitions
- **Screen navigation**: Slide from right (300ms)
- **Tab switch**: Cross-fade (200ms)
- **Modal open**: Slide up with fade (400ms)
- **List items**: Fade in with stagger (150ms each)

### Micro-interactions
- **Button press**: Scale 1 → 0.95 (100ms)
- **Capsule tap**: Scale 1 → 0.98 with shadow (150ms)
- **FAB press**: Scale 1 → 0.9 → 1.1 → 1 (spring)
- **Progress ring**: Smooth arc animation (300ms ease-out)
- **Skeleton loader**: Opacity pulse 0.3 → 1 → 0.3 (1s repeat)

---

## Accessibility

### WCAG Compliance
- **Text Contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Touch Targets**: Minimum 44×44pt for all interactive elements
- **Screen Reader**: Semantic labels for all UI elements
- **Keyboard Navigation**: Full support (though less common on mobile)

### Reduced Motion
- When enabled:
  - Disable progress ring animations
  - Disable FAB glow effect
  - Simplify screen transitions
  - Remove skeleton loader pulse

### Font Scaling
- Support system font size settings
- Optional in-app multiplier (1x, 1.2x, 1.5x, 2x)

### Color Blindness
- Don't rely solely on color for status
- Use icons + text labels
- High contrast mode support

---

## Responsive Design

### Phone (Portrait)
- Default layout as shown above
- Single column
- FAB bottom-right

### Phone (Landscape)
- Horizontal scroll for filters
- Two-column grid for library
- FAB repositioned to avoid keyboard

### Tablet
- Two-column layout for queue/library
- Sidebar navigation instead of tabs
- Larger type scale

---

## Edge Cases & Error States

### Empty States
- **Queue**: "No downloads in queue" with download icon
- **Library**: "No downloaded files yet" with folder icon
- **Search**: "No files match your search" with search icon

### Loading States
- **URL Analysis**: Skeleton loader in result card
- **Download List**: Skeleton loaders for capsules
- **Library**: Skeleton loaders for file cards

### Error States
- **Network Error**: "Network error. Please check your connection."
- **Invalid URL**: Inline error message under input
- **Storage Full**: Alert before download starts
- **Download Failed**: Red capsule with error message + retry button

### Warnings
- **Non-Direct File**: Yellow warning box with explanation
- **Low Storage**: Warning icon next to file size

---

## User Journeys

### Journey 1: First Download
1. Open app (sees Home screen)
2. Tap "Check Clipboard" or paste URL
3. Tap "Analyze URL"
4. See validation result
5. Tap "Add to Downloads"
6. Navigate to Queue screen (auto or manual)
7. Watch download progress
8. Receive completion notification
9. Navigate to Library to view file

### Journey 2: Manage Queue
1. Open Queue screen
2. See list of downloads
3. Tap downloading item → Pause
4. Tap paused item → Resume
5. Swipe failed item → Retry
6. Tap "Clear Completed"
7. Queue cleaned up

### Journey 3: Browse Library
1. Open Library screen
2. Type filename in search
3. Tap file type filter (e.g., "Videos")
4. Tap sort button → Change sort
5. Long press file → Share
6. File shared via system sheet

### Journey 4: Customize Appearance
1. Open Settings screen
2. Tap Theme → Cycle through Light/Dark/Auto
3. Tap accent color swatch → Change to purple
4. See instant UI update
5. Settings auto-saved

---

## Design Principles

1. **Clarity First**: Every action should be obvious
2. **Feedback Always**: Haptics, animations, notifications
3. **Consistency**: Same patterns throughout app
4. **Performance**: Smooth 60 FPS animations
5. **Accessibility**: Inclusive design for all users
6. **Delight**: Subtle surprises (Aurora glow, spring physics)

---

## Future UX Enhancements

- [ ] Swipe gestures for quick actions
- [ ] 3D Touch/Haptic Touch on capsules
- [ ] Drag-and-drop URL from browser
- [ ] Widget for quick paste + download
- [ ] Siri shortcuts integration
- [ ] Split-screen support (Android)
- [ ] Picture-in-picture video preview
- [ ] Custom notification actions
- [ ] Batch selection in queue/library
- [ ] Undo/redo for deletions

---

**Aurora Download Manager** - Where function meets beauty. ✨
