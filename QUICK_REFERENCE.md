# Quick Reference Guide

## Essential Commands

### Development
```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Clear cache and restart
npx expo start --clear
```

### Testing
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type check
npm run type-check

# Lint code
npm run lint
```

### Building
```bash
# Install EAS CLI (first time)
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android --profile production

# Build for development
eas build --platform android --profile development
```

---

## Project Structure Quick Reference

```
app/                  # Screens (Expo Router)
├── (tabs)/          # Tab navigation
│   ├── index.tsx    # Home
│   ├── queue.tsx    # Queue
│   ├── library.tsx  # Library
│   └── settings.tsx # Settings
└── _layout.tsx      # Root

src/
├── components/      # UI components
├── features/        # Zustand stores
├── services/        # Business logic
├── db/             # SQLite
├── theme/          # Design tokens
├── utils/          # Utilities
└── hooks/          # Custom hooks
```

---

## File Paths Cheat Sheet

### Frequently Edited
```
Theme:          src/theme/auroraTokens.ts
Constants:      src/utils/constants.ts
Downloads:      src/features/downloads/store/downloadStore.ts
Settings:       src/features/downloads/store/settingsStore.ts
Home Screen:    app/(tabs)/index.tsx
```

### Configuration
```
Expo:           app.json
TypeScript:     tsconfig.json
Dependencies:   package.json
EAS Build:      eas.json
Babel:          babel.config.js
```

---

## Common Tasks

### Add a New Dependency
```bash
npm install package-name
# or
npx expo install package-name
```

### Update Expo
```bash
npx expo upgrade
```

### Reset Project
```bash
# Clear cache
npx expo start --clear

# Reset metro
rm -rf node_modules
npm install
```

### Debug
```bash
# View logs
npx expo start

# Android logs
adb logcat | grep ReactNative

# Remote debug
# Shake device → "Debug Remote JS"
```

---

## Design Tokens

### Colors
```typescript
theme.colors.background
theme.colors.surface
theme.colors.text
theme.colors.accent
theme.colors.status.downloading
```

### Spacing
```typescript
theme.spacing.xs   // 4px
theme.spacing.sm   // 8px
theme.spacing.md   // 12px
theme.spacing.lg   // 16px
theme.spacing.xl   // 24px
```

### Typography
```typescript
import { typography } from '@theme/typography';

typography.h1
typography.body
typography.caption
```

---

## Useful Snippets

### Import useTheme
```typescript
import { useTheme } from '@theme/tokens';

const theme = useTheme();
```

### Create Zustand Store
```typescript
import { create } from 'zustand';

export const useMyStore = create<State>((set) => ({
  value: 0,
  increment: () => set((state) => ({ value: state.value + 1 })),
}));
```

### Add Screen (Expo Router)
```typescript
// app/my-screen.tsx
export default function MyScreen() {
  return <View><Text>My Screen</Text></View>;
}
```

### Database Query
```typescript
import { getDatabase } from '@db/sqlite';

const db = getDatabase();
const results = await db.getAllAsync('SELECT * FROM downloads');
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Module not found | `npm install`, check imports |
| Metro won't start | `pkill -f expo`, `npm start` |
| TypeScript errors | `npm run type-check` |
| Database error | Clear app data, reinstall |
| Expo Go connection | Same WiFi, or use tunnel mode |
| Build fails | Check `eas.json`, update Expo |

---

## Environment Variables

Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Edit values:
```
MAX_CONCURRENT_DOWNLOADS=3
DEFAULT_RETRY_LIMIT=3
DEBUG_MODE=true
```

---

## Git Workflow

```bash
# Stage changes
git add .

# Commit
git commit -m "Add feature"

# Push
git push origin main

# Pull latest
git pull origin main
```

---

## Testing Checklist (Quick)

- [ ] URL validation works
- [ ] Download starts and completes
- [ ] Pause/resume works
- [ ] Queue filters work
- [ ] Library search works
- [ ] Theme toggle works
- [ ] Settings persist
- [ ] No crashes

---

## Build Checklist (Quick)

- [ ] Update version in `app.json`
- [ ] Run `npm test`
- [ ] Run `npm run type-check`
- [ ] Test on physical device
- [ ] Build: `eas build --platform android`

---

## Key Files to Remember

**Most Important**:
1. `README.md` - Start here
2. `GETTING_STARTED.md` - Setup guide
3. `app.json` - Expo config
4. `package.json` - Dependencies

**For Development**:
- `src/features/downloads/store/downloadStore.ts` - Download logic
- `src/theme/auroraTokens.ts` - Design tokens
- `app/(tabs)/index.tsx` - Home screen

**For Deployment**:
- `PLAY_STORE_CHECKLIST.md` - Submission guide
- `eas.json` - Build config
- `ARCHITECTURE.md` - Technical docs

---

## Support Contacts

**Documentation**:
- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Zustand: https://github.com/pmndrs/zustand

**Community**:
- Expo Forums: https://forums.expo.dev/
- React Native Discord: https://www.reactiflux.com/

---

**Quick Tip**: Keep this file open while developing! 🚀
