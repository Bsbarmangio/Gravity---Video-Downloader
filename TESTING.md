# Testing Strategy - Aurora Download Manager

## Overview

This document outlines the testing approach for Aurora Download Manager, including unit tests, integration tests, and manual testing procedures.

---

## Test Coverage Goals

- **Unit Tests**: 70%+ coverage for core logic
- **Integration Tests**: Critical user flows
- **Manual Tests**: UI/UX, accessibility, edge cases

---

## Unit Tests

### Setup

```bash
# Install dependencies (already included)
npm install

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure

```
__tests__/
├── unit/
│   ├── validators.test.ts
│   ├── formatting.test.ts
│   ├── downloadQueue.test.ts
│   └── retryManager.test.ts
└── integration/
    └── downloadFlow.test.ts
```

### 1. Validators (`validators.test.ts`)

**Test Cases**:
- ✅ `isValidUrl` returns true for valid HTTP/HTTPS URLs
- ✅ `isValidUrl` returns false for invalid URLs
- ✅ `extractFilenameFromUrl` extracts filename from URL
- ✅ `getFileExtension` returns correct extension
- ✅ `getFileTypeCategory` categorizes file types correctly
- ✅ `isDirectFileMimeType` identifies direct files
- ✅ `sanitizeFilename` removes dangerous characters

**Example**:
```typescript
describe('validators', () => {
  test('isValidUrl returns true for valid URLs', () => {
    expect(isValidUrl('https://example.com/file.mp4')).toBe(true);
    expect(isValidUrl('http://example.com/download')).toBe(true);
  });

  test('isValidUrl returns false for invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('ftp://example.com')).toBe(false);
  });

  test('getFileTypeCategory categorizes correctly', () => {
    expect(getFileTypeCategory('mp4')).toBe('video');
    expect(getFileTypeCategory('mp3')).toBe('audio');
    expect(getFileTypeCategory('jpg')).toBe('image');
  });
});
```

### 2. Formatting (`formatting.test.ts`)

**Test Cases**:
- ✅ `formatBytes` formats bytes correctly
- ✅ `formatSpeed` formats speed correctly
- ✅ `formatTimeRemaining` formats time correctly
- ✅ `formatProgress` formats percentage correctly
- ✅ `truncateFilename` truncates long filenames

**Example**:
```typescript
describe('formatting', () => {
  test('formatBytes returns correct format', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  test('formatSpeed returns correct format', () => {
    expect(formatSpeed(1024)).toBe('1 KB/s');
    expect(formatSpeed(1048576)).toBe('1 MB/s');
  });

  test('formatTimeRemaining handles edge cases', () => {
    expect(formatTimeRemaining(0)).toBe('--');
    expect(formatTimeRemaining(45)).toBe('45s');
    expect(formatTimeRemaining(125)).toBe('2m 5s');
    expect(formatTimeRemaining(3665)).toBe('1h 1m');
  });
});
```

### 3. Download Queue Logic (`downloadQueue.test.ts`)

**Test Cases**:
- ✅ `addDownload` creates download with correct initial state
- ✅ `updateDownload` updates properties correctly
- ✅ `startDownload` respects max concurrent limit
- ✅ `pauseDownload` removes from active pool
- ✅ `retryDownload` increments retry count
- ✅ `clearCompleted` removes only completed downloads

**Example**:
```typescript
import { useDownloadStore } from '@features/downloads/store/downloadStore';

describe('downloadStore', () => {
  beforeEach(() => {
    // Reset store state
    useDownloadStore.setState({ downloads: [], activeDownloads: [] });
  });

  test('addDownload creates download with pending status', () => {
    const store = useDownloadStore.getState();
    const id = store.addDownload({
      url: 'https://example.com/file.mp4',
      filename: 'file.mp4',
      bytesTotal: 1000000,
      startedAt: null,
      completedAt: null,
      localUri: null,
      error: null,
      checksum: null,
      maxRetries: 3,
    });

    const download = store.getDownloadById(id);
    expect(download?.status).toBe('pending');
    expect(download?.retryCount).toBe(0);
  });

  test('maxConcurrent is respected', () => {
    const store = useDownloadStore.getState();
    store.setMaxConcurrent(2);

    // Add 3 downloads
    const id1 = store.addDownload(mockDownload());
    const id2 = store.addDownload(mockDownload());
    const id3 = store.addDownload(mockDownload());

    // Only 2 should be active
    expect(store.activeDownloads.length).toBeLessThanOrEqual(2);
  });
});
```

### 4. Retry Manager (`retryManager.test.ts`)

**Test Cases**:
- ✅ Exponential backoff increases correctly
- ✅ Max retry limit is enforced
- ✅ Retry count increments on each attempt
- ✅ Successful retry resets count

---

## Integration Tests

### Download Flow (`downloadFlow.test.ts`)

**Test Scenario**: Complete download lifecycle

```typescript
describe('Download Flow', () => {
  test('complete download lifecycle', async () => {
    // 1. Add download
    const store = useDownloadStore.getState();
    const id = store.addDownload(mockDownload());

    // 2. Start download
    await store.startDownload(id);

    // 3. Verify downloading state
    expect(store.getDownloadById(id)?.status).toBe('downloading');

    // 4. Simulate progress
    store.updateDownload(id, {
      progress: 0.5,
      bytesDownloaded: 500000,
      speed: 100000,
    });

    // 5. Complete download
    store.updateDownload(id, {
      status: 'completed',
      progress: 1,
      completedAt: new Date(),
    });

    // 6. Verify completion
    expect(store.getDownloadById(id)?.status).toBe('completed');
  });
});
```

---

## Manual Testing

### Checklist

#### Core Functionality
- [ ] **Add Download**
  - Paste URL in input field
  - Click "Analyze URL"
  - Verify validation result shows correct metadata
  - Click "Add to Downloads"
  - Verify download appears in queue

- [ ] **Download Progress**
  - Watch progress ring animate
  - Verify speed displays (MB/s)
  - Verify ETA updates
  - Verify bytes downloaded / total

- [ ] **Pause/Resume**
  - Tap downloading item
  - Select "Pause"
  - Verify status changes to "Paused"
  - Tap paused item
  - Select "Resume"
  - Verify download continues

- [ ] **Cancel Download**
  - Tap downloading item
  - Select "Cancel"
  - Verify download removed from queue

- [ ] **Retry Failed Download**
  - Simulate failed download (invalid URL or network error)
  - Verify retry count increments
  - Tap failed item → "Retry"
  - Verify download restarts

- [ ] **Queue Management**
  - Add multiple downloads
  - Verify only max concurrent are active
  - Pause one download
  - Verify next pending starts automatically

- [ ] **Library**
  - Complete a download
  - Navigate to Library
  - Verify file appears
  - Search for file by name
  - Filter by file type
  - Sort by date/name/size

- [ ] **Settings**
  - Change theme (Light/Dark/Auto)
  - Change accent color
  - Adjust max concurrent downloads
  - Toggle data saver mode
  - Verify settings persist after app restart

#### Edge Cases
- [ ] **Invalid URL**
  - Enter invalid URL
  - Verify validation error shows

- [ ] **Network Offline**
  - Turn off Wi-Fi/cellular
  - Try to start download
  - Verify error message
  - Turn on network
  - Verify auto-retry (if implemented)

- [ ] **Storage Full**
  - Fill device storage (difficult to test)
  - Try to download large file
  - Verify warning before download

- [ ] **App Restart**
  - Start a download
  - Force quit app (swipe away)
  - Reopen app
  - Verify download state restored
  - Verify download resumes or shows as pending

- [ ] **Large File**
  - Download file >100MB
  - Verify progress updates smoothly
  - Pause and resume
  - Verify final file size matches

- [ ] **Multiple File Types**
  - Download video (.mp4)
  - Download audio (.mp3)
  - Download image (.jpg)
  - Download document (.pdf)
  - Download archive (.zip)
  - Verify all appear in library with correct icons

#### UI/UX
- [ ] **Animations**
  - Progress ring animates smoothly
  - FAB glows when URL detected
  - Bottom sheet expands/collapses with gesture
  - Screen transitions are smooth

- [ ] **Haptic Feedback**
  - Button taps give light haptic
  - Download complete gives success haptic
  - Error gives error haptic

- [ ] **Glassmorphism**
  - Cards have frosted glass effect
  - Gradients display correctly
  - Blur is subtle and readable

- [ ] **Theme Switching**
  - Toggle between light/dark
  - Verify all screens update instantly
  - Verify contrast is readable

#### Accessibility
- [ ] **Screen Reader**
  - Enable TalkBack (Android) or VoiceOver (iOS)
  - Navigate all screens
  - Verify all buttons have labels
  - Verify download status announced

- [ ] **Large Text**
  - Enable system large text
  - Verify text scales correctly
  - Verify no text truncation issues

- [ ] **Reduced Motion**
  - Enable reduced motion in settings
  - Verify animations are simplified or removed

- [ ] **Color Contrast**
  - Use accessibility scanner
  - Verify contrast ratios meet WCAG AA

---

## Performance Testing

### Metrics to Monitor
- **FPS**: 60 FPS during animations
- **Memory**: Stable, no leaks
- **Battery**: Reasonable consumption during downloads
- **Storage**: Efficient use, no leftover temp files

### Tools
- **React DevTools Profiler**: Measure render performance
- **Android Studio Profiler**: CPU, memory, network
- **Chrome DevTools**: For React Native debugging

### Scenarios
- Download 10 files simultaneously
- Scroll through queue with 100+ items
- Toggle theme repeatedly
- Leave app downloading overnight

---

## Regression Testing

After each update, run:
1. ✅ Unit test suite (`npm test`)
2. ✅ Manual smoke test (core flows)
3. ✅ Accessibility audit
4. ✅ Performance check (FPS, memory)

---

## Bug Reporting Template

```markdown
### Bug Description
Clear, concise description of the issue.

### Steps to Reproduce
1. Open app
2. Navigate to Queue
3. Tap download item
4. ...

### Expected Behavior
What should happen?

### Actual Behavior
What actually happens?

### Screenshots/Logs
Attach screenshots or console logs

### Environment
- Device: Pixel 6
- Android Version: 13
- App Version: 1.0.0
```

---

## CI/CD Testing (Future)

### GitHub Actions Workflow
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run type-check
```

---

## Test Data

### Mock Downloads
```typescript
const mockDownloads = [
  {
    url: 'https://example.com/video.mp4',
    filename: 'video.mp4',
    bytesTotal: 5000000,
  },
  {
    url: 'https://example.com/audio.mp3',
    filename: 'audio.mp3',
    bytesTotal: 3000000,
  },
  {
    url: 'https://example.com/image.jpg',
    filename: 'image.jpg',
    bytesTotal: 200000,
  },
];
```

### Test URLs (Use with caution)
- Small file: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf` (13KB)
- Video sample: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`

---

## Conclusion

A comprehensive testing strategy ensures:
- **Reliability**: Core features work consistently
- **Quality**: Bugs caught before release
- **Confidence**: Safe to ship updates
- **User Trust**: Professional, polished experience

**Test early, test often!** 🧪
