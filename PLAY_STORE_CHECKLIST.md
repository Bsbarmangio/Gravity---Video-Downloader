# Play Store Compliance Checklist

## Pre-Submission Requirements

### 1. App Information

- [ ] **App Name**: "Aurora Download Manager"
- [ ] **Package Name**: `com.aurora.downloadmanager`
- [ ] **Version Code**: 1 (increment with each release)
- [ ] **Version Name**: 1.0.0
- [ ] **Target SDK**: API 33+ (Android 13+)
- [ ] **Min SDK**: API 24 (Android 7.0)

### 2. App Assets

#### Icon
- [ ] **Adaptive Icon**: 512×512px (foreground + background)
- [ ] **Play Store Icon**: 512×512px PNG (32-bit, no transparency)
- [ ] **Feature Graphic**: 1024×500px (required for Play Store listing)

#### Screenshots
- [ ] Minimum 2 screenshots (up to 8 recommended)
- [ ] Dimensions: 16:9 or 9:16 aspect ratio
- [ ] Resolution: At least 1080p
- [ ] Required screens:
  - Home screen with URL input
  - Queue screen with active downloads
  - Library screen with files
  - Settings screen

#### Video (Optional)
- [ ] YouTube demo video (30 seconds to 2 minutes)
- [ ] Showcase key features

### 3. App Description

#### Short Description (80 characters max)
```
Aurora-themed download manager with glassmorphism UI and smart queue system.
```

#### Full Description (4000 characters max)
```
Aurora Download Manager - Download with Style ✨

Manage your media downloads with a beautiful, unique Aurora Glass interface. Download videos, audio, images, documents, and archives from direct URLs with powerful queue management and real-time progress tracking.

🌟 KEY FEATURES

Direct File Downloads
• Support for MP4, MP3, MOV, MKV, WebM, JPG, PNG, PDF, ZIP, and more
• Smart URL validation before download
• Automatic file type detection

Queue Management
• Add multiple downloads and manage queue
• Pause, resume, and cancel anytime
• Automatic retry with smart backoff
• Configure 1-4 concurrent downloads

Aurora Glass UI
• Unique glassmorphism design
• Animated progress rings
• Customizable neon accent colors
• Dark and light themes

Advanced Features
• Real-time download speed and ETA
• Search and filter your library
• Bandwidth limiting (data saver mode)
• Haptic feedback for interactions
• Offline-first architecture

Privacy-First
• No data collection
• All files stored locally on your device
• No ads, no tracking

📱 PERFECT FOR

• Downloading video tutorials
• Saving audio podcasts
• Archiving documents
• Managing media libraries
• Organizing downloads by type

⚠️ IMPORTANT
You are responsible for ensuring you have legal rights to download content. Aurora Download Manager is a tool for managing downloads of content you own or have permission to access.

🔒 PRIVACY
Aurora Download Manager does not collect any personal data. All downloads and settings are stored locally on your device and never transmitted to external servers.

💡 REQUIREMENTS
• Android 7.0 (API 24) or higher
• Internet connection for downloads
• Storage space for downloaded files

📧 SUPPORT
For questions or feedback, please contact: support@auroradownload.app

Built with ❤️ for media management
```

### 4. Permissions Justification

Document why each permission is needed:

| Permission | Justification |
|------------|---------------|
| `INTERNET` | Required to download files from URLs |
| `READ_EXTERNAL_STORAGE` | Read downloaded files (Android <13) |
| `WRITE_EXTERNAL_STORAGE` | Save downloaded files (Android <13) |
| `POST_NOTIFICATIONS` | Show download progress and completion notifications |

### 5. Privacy Policy

**URL**: Host at a public URL (required by Google)

**Template**:
```markdown
# Privacy Policy - Aurora Download Manager

Last Updated: [Date]

## Introduction
Aurora Download Manager ("we", "our", "the app") is committed to protecting your privacy. This policy explains our data practices.

## Data Collection
Aurora Download Manager does NOT collect, transmit, or store any personal data. Specifically:

- ✅ No user accounts
- ✅ No analytics or tracking
- ✅ No third-party SDKs that collect data
- ✅ No advertising

## Data Storage
All data is stored locally on your device:

- **Downloads**: Saved to your device's app sandbox directory
- **Settings**: Stored in local SQLite database
- **Queue State**: Persisted locally for app restart recovery

## Data Sharing
We do not share any data with third parties because we do not collect any data.

## Permissions
The app requests the following permissions:

- **Internet**: To download files from URLs you provide
- **Storage**: To save downloaded files to your device
- **Notifications**: To show download progress and completion alerts

## User Control
You have full control:

- Delete downloads anytime from the Library screen
- Uninstall the app to remove all data
- No data remains on external servers

## Children's Privacy
Aurora Download Manager does not knowingly collect data from anyone, including children under 13.

## Changes to This Policy
We may update this policy. Changes will be posted in the app and on this page.

## Contact
For questions about this privacy policy:
Email: privacy@auroradownload.app

## Consent
By using Aurora Download Manager, you consent to this privacy policy.
```

### 6. Content Rating

Complete Google Play Console Content Rating Questionnaire:

- [ ] **Category**: Utility
- [ ] **Target Audience**: Everyone
- [ ] **Ads**: No
- [ ] **In-App Purchases**: No
- [ ] **User-Generated Content**: No
- [ ] **Social Features**: No
- [ ] **Location Sharing**: No

Expected Rating: **Everyone** (E for Everyone)

### 7. Build Configuration

#### `app.json` Checklist
- [ ] `android.package` set to `com.aurora.downloadmanager`
- [ ] `android.versionCode` incremented
- [ ] `expo.version` updated
- [ ] `android.permissions` minimized
- [ ] `android.allowBackup` set to `false`
- [ ] `expo.icon` points to 1024×1024 PNG
- [ ] `android.adaptiveIcon` configured

#### Signing
- [ ] Generate upload keystore:
  ```bash
  keytool -genkey -v -keystore upload-keystore.jks \
    -alias aurora-key -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] Store keystore securely
- [ ] Note keystore password and alias

### 8. Build & Test

- [ ] **Build Release APK**:
  ```bash
  eas build --platform android --profile production
  ```
- [ ] **Test on Physical Device**:
  - Install APK via ADB
  - Test all core features
  - Verify no crashes

- [ ] **ProGuard/R8** (if enabled):
  - Verify no obfuscation issues
  - Test all features still work

### 9. Store Listing

- [ ] **App Category**: Tools
- [ ] **Tags**: download manager, file downloader, media downloader
- [ ] **Website**: (optional) https://auroradownload.app
- [ ] **Email**: support@auroradownload.app
- [ ] **Phone**: (optional)

### 10. Release Track

For first release:
- [ ] **Internal Testing** (closed alpha)
  - 10-20 testers
  - Test for 1-2 weeks
- [ ] **Closed Beta** (opt-in)
  - 100+ testers
  - Fix critical bugs
- [ ] **Production** (public release)

### 11. Compliance Checks

#### Google Play Policies
- [ ] No copyrighted content in screenshots
- [ ] No misleading claims
- [ ] Accurate feature descriptions
- [ ] Privacy policy accessible
- [ ] Age-appropriate content

#### Security
- [ ] No hardcoded API keys
- [ ] HTTPS only for network requests
- [ ] Input validation for URLs
- [ ] No eval() or dynamic code execution

#### Accessibility
- [ ] Content descriptions on all images/icons
- [ ] Keyboard navigation (where applicable)
- [ ] Screen reader compatible
- [ ] Sufficient color contrast

### 12. Post-Launch Monitoring

- [ ] Set up Google Play Console alerts
- [ ] Monitor crash reports
- [ ] Respond to user reviews (< 24 hours)
- [ ] Track download/retention metrics

---

## Submission Steps

### Step 1: Prepare Release
1. Update version in `app.json`
2. Run final tests
3. Build production APK/AAB

### Step 2: Google Play Console
1. Log in to [Google Play Console](https://play.google.com/console)
2. Create new application
3. Fill out store listing
4. Upload assets (icon, screenshots, feature graphic)
5. Set pricing (Free)

### Step 3: Release Management
1. Upload APK/AAB to Internal Testing
2. Add test users
3. Publish to Internal Testing
4. Wait for review (24-48 hours)
5. Fix any issues

### Step 4: Production Release
1. Promote from Internal → Closed Beta
2. Gather feedback
3. Promote to Production
4. Submit for review
5. Wait for approval (1-7 days)

### Step 5: Post-Approval
1. Announce launch
2. Monitor reviews and crashes
3. Respond to user feedback
4. Plan updates

---

## Review Rejection Reasons (To Avoid)

❌ **Common Rejection Reasons**:
- Missing privacy policy
- Misleading screenshots
- Crashes on test devices
- Permissions not justified
- Copyrighted content
- Inappropriate content

✅ **How We Avoid Them**:
- Privacy policy hosted and linked
- Authentic, clear screenshots
- Thorough testing on multiple devices
- Minimal permissions with justifications
- Original Aurora Glass design
- Utility app with no inappropriate content

---

## Legal Requirements

### 1. Terms of Service (Recommended)

```markdown
# Terms of Service - Aurora Download Manager

Last Updated: [Date]

## Acceptance of Terms
By using Aurora Download Manager, you agree to these terms.

## User Responsibilities
- You are responsible for ensuring you have legal rights to download content
- You will not use the app for illegal purposes
- You will not attempt to circumvent app security

## Disclaimer
Aurora Download Manager is provided "as is" without warranties. We are not responsible for:
- Lost or corrupted downloads
- Third-party content you download
- Data usage from downloads

## Limitation of Liability
We are not liable for damages arising from your use of the app.

## Changes to Terms
We may update these terms. Continued use implies acceptance.

## Contact
support@auroradownload.app
```

### 2. DMCA Compliance

Include DMCA notice in app:
```
Aurora Download Manager is a tool for downloading content you own or have permission to access. 
We do not host, store, or share any content. Users are solely responsible for ensuring they have 
legal rights to download content.
```

---

## Maintenance Schedule

### Regular Updates
- **Bug Fixes**: Within 1 week of discovery
- **Feature Updates**: Monthly or quarterly
- **Security Patches**: Immediately

### Version Increment Rules
- **Patch** (1.0.X): Bug fixes, minor tweaks
- **Minor** (1.X.0): New features, improvements
- **Major** (X.0.0): Major redesign, breaking changes

---

## Checklist Summary

**Before Submission**:
- ✅ All features tested and working
- ✅ Privacy policy hosted
- ✅ Screenshots and assets prepared
- ✅ Version numbers updated
- ✅ Release build tested on physical device

**During Review**:
- ✅ Monitor Play Console for messages
- ✅ Respond to review team within 24 hours
- ✅ Fix issues promptly

**After Approval**:
- ✅ Monitor crash reports
- ✅ Respond to reviews
- ✅ Plan next update

---

## Contact Google Play Support

If issues arise:
1. Log in to Play Console
2. Click "Help & Feedback"
3. Select issue category
4. Provide detailed information
5. Wait for response (24-72 hours)

---

**Ready to launch Aurora Download Manager!** 🚀
