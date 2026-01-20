# Component Library - Aurora Glass Design System

## Overview

Aurora Download Manager uses a custom component library built on the **Aurora Glass** design language. All components are designed for consistency, accessibility, and visual impact.

---

## Design System Components

### 1. **AuroraGlass**
**File**: `src/components/design-system/AuroraGlass.tsx`

**Purpose**: Glassmorphism container with blur and gradient effects.

**Props**:
```typescript
interface AuroraGlassProps {
  children: React.ReactNode;
  intensity?: number;           // Blur intensity (default: 80)
  tint?: 'light' | 'dark' | 'default';
  gradient?: boolean;           // Enable gradient overlay
  gradientColors?: string[];    // Custom gradient colors
  style?: ViewStyle;
}
```

**Usage**:
```tsx
<AuroraGlass gradient style={styles.card}>
  <Text>Content with gradient background</Text>
</AuroraGlass>
```

**Variants**:
- Default: Semi-transparent surface
- Gradient: Linear gradient from dark to light

---

### 2. **ProgressRing**
**File**: `src/components/design-system/ProgressRing.tsx`

**Purpose**: Animated circular progress indicator with gradient stroke.

**Props**:
```typescript
interface ProgressRingProps {
  progress: number;      // 0-1
  size?: number;         // Diameter (default: 56)
  strokeWidth?: number;  // Line thickness (default: 4)
  color?: string;        // Ring color (default: theme accent)
}
```

**Usage**:
```tsx
<ProgressRing 
  progress={0.75} 
  size={64} 
  color={theme.colors.accent}
/>
```

**Features**:
- Smooth 300ms animation on progress change
- Rounded stroke caps
- Clockwise rotation starting from top

---

### 3. **Capsule** (Download Item)
**File**: `src/components/design-system/Capsule.tsx`

**Purpose**: Main download item card with progress, metadata, and actions.

**Props**:
```typescript
interface CapsuleProps {
  download: Download;
  onPress?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
}
```

**Usage**:
```tsx
<Capsule 
  download={downloadItem}
  onPress={() => handlePress(downloadItem.id)}
  onPause={() => pauseDownload(downloadItem.id)}
/>
```

**Display States**:
- Pending: Gray ring, "Pending" text
- Downloading: Cyan ring, progress %, speed, ETA
- Paused: Yellow ring, "Paused" text
- Completed: Green ring, "Completed" text
- Failed: Red ring, error message

---

### 4. **SpeedMeter**
**File**: `src/components/design-system/SpeedMeter.tsx`

**Purpose**: Display download speed in human-readable format.

**Props**:
```typescript
interface SpeedMeterProps {
  speed: number;  // bytes per second
}
```

**Usage**:
```tsx
<SpeedMeter speed={1500000} />
// Displays: "1.43 MB/s"
```

---

### 5. **SkeletonLoader**
**File**: `src/components/design-system/SkeletonLoader.tsx`

**Purpose**: Loading placeholder with pulsing animation.

**Props**:
```typescript
interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}
```

**Usage**:
```tsx
<SkeletonLoader width="100%" height={20} />
<SkeletonLoader width={120} height={16} />
```

**Animation**: Opacity pulse from 0.3 → 1 (1s repeat)

---

### 6. **GradientText**
**File**: `src/components/design-system/GradientText.tsx`

**Purpose**: Text with gradient color (simplified version).

**Props**:
```typescript
interface GradientTextProps extends TextProps {
  colors?: string[];
}
```

**Usage**:
```tsx
<GradientText colors={['#00d9ff', '#667eea']}>
  Aurora Download
</GradientText>
```

**Note**: True gradient text requires additional libraries. This version uses the first color.

---

## Input Components

### 7. **URLInput**
**File**: `src/components/input/URLInput.tsx`

**Purpose**: Text input for URL entry with validation and glassmorphism styling.

**Props**:
```typescript
interface URLInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (url: string) => void;
  placeholder?: string;
}
```

**Usage**:
```tsx
<URLInput 
  value={url}
  onChangeText={setUrl}
  onSubmit={handleAnalyze}
  placeholder="https://example.com/file.mp4"
/>
```

**Features**:
- Real-time URL validation
- Focus state with accent border
- Error state with red border
- Submit on keyboard "Go"

---

### 8. **SmartPasteButton**
**File**: `src/components/input/SmartPasteButton.tsx`

**Purpose**: Floating action button that detects URLs from clipboard.

**Props**:
```typescript
interface SmartPasteButtonProps {
  hasUrl: boolean;
  onPress: () => void;
}
```

**Usage**:
```tsx
<SmartPasteButton 
  hasUrl={clipboardHasUrl}
  onPress={handlePasteFromClipboard}
/>
```

**Features**:
- Pulsing glow when URL detected
- Spring physics on press
- Icon changes: "+" (default) → "clipboard" (URL detected)
- Fixed position: bottom-right

---

## Layout Components

### 9. **BlurredHeader**
**File**: `src/components/layout/BlurredHeader.tsx`

**Purpose**: Screen header with glassmorphism effect and safe area handling.

**Props**:
```typescript
interface BlurredHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}
```

**Usage**:
```tsx
<BlurredHeader 
  title="Download Queue"
  subtitle="5 total"
  rightElement={<Icon name="settings" />}
/>
```

**Features**:
- Gradient background
- Safe area insets (top padding)
- Optional subtitle
- Optional right-side element (actions/icons)

---

### 10. **BottomSheet** (Queue Dock)
**File**: `src/components/layout/BottomSheet.tsx`

**Purpose**: Expandable bottom sheet for active downloads.

**Props**:
```typescript
interface BottomSheetProps {
  children: React.ReactNode;
  itemCount?: number;
}
```

**Usage**:
```tsx
<BottomSheet itemCount={activeDownloads.length}>
  <FlatList data={activeDownloads} ... />
</BottomSheet>
```

**Features**:
- Gesture-based expand/collapse
- Spring physics animation
- Min height: 80px
- Max height: 80% of screen
- Auto-hides when itemCount = 0

---

## Design Tokens

### Colors
Access via `useTheme()` hook:
```tsx
const theme = useTheme();

theme.colors.background
theme.colors.surface
theme.colors.text
theme.colors.accent
theme.colors.status.downloading
```

### Spacing
```tsx
theme.spacing.xs   // 4px
theme.spacing.sm   // 8px
theme.spacing.md   // 12px
theme.spacing.lg   // 16px
theme.spacing.xl   // 24px
```

### Typography
```tsx
import { typography } from '@theme/typography';

<Text style={typography.h1}>Heading</Text>
<Text style={typography.body}>Body text</Text>
<Text style={typography.caption}>Caption</Text>
```

### Border Radius
```tsx
theme.borderRadius.sm   // 8px
theme.borderRadius.md   // 12px
theme.borderRadius.lg   // 16px
theme.borderRadius.xl   // 24px
theme.borderRadius.full // 9999px
```

### Shadows
```tsx
style={[theme.effects.shadows.sm]}
style={[theme.effects.shadows.md]}
style={[theme.effects.shadows.lg]}
```

---

## Usage Examples

### Creating a Card
```tsx
import { AuroraGlass } from '@components/design-system/AuroraGlass';
import { useTheme } from '@theme/tokens';

function MyCard() {
  const theme = useTheme();
  
  return (
    <AuroraGlass 
      gradient
      style={[
        {
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        theme.effects.shadows.md
      ]}
    >
      <Text style={[typography.h4, { color: theme.colors.text }]}>
        Card Title
      </Text>
    </AuroraGlass>
  );
}
```

### Progress Indicator
```tsx
import { ProgressRing } from '@components/design-system/ProgressRing';
import { useDownloadStore } from '@features/downloads/store/downloadStore';

function DownloadProgress({ downloadId }) {
  const download = useDownloadStore(state => 
    state.getDownloadById(downloadId)
  );
  
  return (
    <ProgressRing 
      progress={download.progress}
      color={theme.colors.status[download.status]}
    />
  );
}
```

### Themed Button
```tsx
function ThemedButton({ title, onPress }) {
  const theme = useTheme();
  
  return (
    <Pressable 
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.accent,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.md,
      }}
    >
      <Text style={[typography.button, { color: '#ffffff' }]}>
        {title}
      </Text>
    </Pressable>
  );
}
```

---

## Accessibility Guidelines

### Screen Reader Labels
All interactive components have `accessible` and `accessibilityLabel` props:
```tsx
<Pressable 
  accessible
  accessibilityLabel="Download file"
  accessibilityHint="Starts downloading the file"
>
  ...
</Pressable>
```

### Touch Target Size
Minimum 44×44pt for all interactive elements:
```tsx
style={{
  minWidth: 44,
  minHeight: 44,
  justifyContent: 'center',
  alignItems: 'center',
}}
```

### Color Contrast
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text: Minimum 3:1
- Use `theme.colors` which meet these standards

---

## Animation Standards

### Duration
- **Fast**: 150ms (quick transitions)
- **Normal**: 300ms (default)
- **Slow**: 500ms (dramatic effects)

### Easing
```tsx
import Animated, { withTiming, Easing } from 'react-native-reanimated';

withTiming(value, {
  duration: 300,
  easing: Easing.out(Easing.ease)
})
```

### Spring Physics
```tsx
import { withSpring } from 'react-native-reanimated';

withSpring(value, {
  damping: 20,
  stiffness: 90
})
```

---

## Best Practices

1. **Use Theme Hook**: Always use `useTheme()` for colors, spacing, etc.
2. **Avoid Hardcoded Values**: Use design tokens instead
3. **Accessibility First**: Add labels to all interactive elements
4. **Haptic Feedback**: Use `haptics.light()` for button presses
5. **Memoize Components**: Use `React.memo` for list items
6. **Type Safety**: Leverage TypeScript for prop validation

---

## Creating New Components

### Template
```tsx
/**
 * ComponentName - Brief description
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@theme/tokens';

interface ComponentNameProps {
  // Props here
}

export function ComponentName({ ...props }: ComponentNameProps) {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Styles
  },
});
```

---

**Aurora Glass Component Library** - Build with consistency. ✨
