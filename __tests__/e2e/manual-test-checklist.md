# Manual Testing Checklist

## Pre-Test Setup
- [ ] Install app on physical Android device
- [ ] Clear app data for fresh start
- [ ] Ensure device has internet connection
- [ ] Have test URLs ready

## Test URLs
```
Small PDF: https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
Small Image: https://via.placeholder.com/1920x1080.png
```

---

## Test 1: First Launch
- [ ] Open app for first time
- [ ] Verify home screen loads
- [ ] Verify no crashes
- [ ] Check theme (should default to dark)

## Test 2: Add Download
- [ ] Paste URL: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`
- [ ] Tap "Analyze URL"
- [ ] Verify validation shows:
  - Filename: dummy.pdf
  - File type detected
  - File size shown (if available)
- [ ] Tap "Add to Downloads"
- [ ] Verify success message
- [ ] Navigate to Queue
- [ ] Verify download appears

## Test 3: Download Progress
- [ ] Watch download progress
- [ ] Verify progress ring animates
- [ ] Verify progress percentage updates
- [ ] Verify speed displays (B/s or KB/s)
- [ ] Verify bytes downloaded updates
- [ ] Wait for completion
- [ ] Verify status changes to "Completed"
- [ ] Verify notification appears

## Test 4: Pause/Resume
- [ ] Add new download (use larger file if possible)
- [ ] Let download start (wait for progress > 10%)
- [ ] Tap download item
- [ ] Select "Pause"
- [ ] Verify status = "Paused"
- [ ] Verify progress stopped
- [ ] Tap paused download
- [ ] Select "Resume"
- [ ] Verify download continues
- [ ] Let it complete

## Test 5: Multiple Downloads
- [ ] Add 3 downloads
- [ ] Verify max concurrent respected (default 3)
- [ ] Pause one download
- [ ] Verify next pending starts automatically
- [ ] Complete all downloads

## Test 6: Library
- [ ] Navigate to Library tab
- [ ] Verify completed downloads appear
- [ ] Tap search box
- [ ] Type filename
- [ ] Verify search filters results
- [ ] Clear search
- [ ] Tap filter chip (e.g., "Documents")
- [ ] Verify only documents shown
- [ ] Tap sort button
- [ ] Verify sort changes (Date → Name → Size → Type)

## Test 7: Settings
- [ ] Navigate to Settings tab
- [ ] Tap "Theme"
- [ ] Cycle through Light → Dark → Auto
- [ ] Verify theme changes instantly
- [ ] Tap accent color swatch
- [ ] Change to different color (e.g., pink)
- [ ] Verify UI accent updates
- [ ] Tap "Max Concurrent Downloads"
- [ ] Change to 1
- [ ] Add 2 downloads in Queue
- [ ] Verify only 1 downloads at a time
- [ ] Toggle "Data Saver Mode"
- [ ] Verify toggle works

## Test 8: Smart Paste
- [ ] Copy URL to clipboard (outside app)
- [ ] Return to app home screen
- [ ] Tap "Check Clipboard"
- [ ] Verify URL populates input
- [ ] Verify Smart Paste FAB glows (if URL detected)
- [ ] Tap Smart Paste FAB
- [ ] Verify URL pasted

## Test 9: Queue Management
- [ ] Add 5 downloads
- [ ] Let some complete
- [ ] Tap "Clear Completed"
- [ ] Confirm action
- [ ] Verify completed removed from queue
- [ ] Tap filter tab "Failed" (if any)
- [ ] Tap failed download
- [ ] Select "Retry"
- [ ] Verify download restarts

## Test 10: Error Handling
- [ ] Enter invalid URL: "not a url"
- [ ] Tap "Analyze"
- [ ] Verify error message
- [ ] Enter HTML URL: "https://google.com"
- [ ] Tap "Analyze"
- [ ] Verify warning about non-direct file
- [ ] Turn off Wi-Fi/cellular
- [ ] Try to start download
- [ ] Verify network error shown
- [ ] Turn on Wi-Fi/cellular
- [ ] Verify download can proceed

## Test 11: App Restart
- [ ] Start a download (let it reach 30-50%)
- [ ] Force quit app (swipe away from recent apps)
- [ ] Reopen app
- [ ] Verify download state restored
- [ ] Verify download shows as "pending" or "paused"
- [ ] Verify can resume download

## Test 12: Accessibility
- [ ] Enable TalkBack (Android)
- [ ] Navigate all screens
- [ ] Verify all buttons announced
- [ ] Verify download status announced
- [ ] Disable TalkBack
- [ ] Enable large text (system settings)
- [ ] Verify text scales correctly
- [ ] Verify no truncation issues
- [ ] Disable large text

## Test 13: Performance
- [ ] Add 10 downloads
- [ ] Scroll through queue
- [ ] Verify smooth scrolling (no lag)
- [ ] Watch all animations
- [ ] Verify 60 FPS (smooth, no jank)
- [ ] Let app run for 10 minutes
- [ ] Check battery usage (should be reasonable)

## Test 14: Edge Cases
- [ ] Fill device storage (if possible)
- [ ] Try to download large file
- [ ] Verify storage warning
- [ ] Download very small file (< 1KB)
- [ ] Verify completes successfully
- [ ] Add same URL twice
- [ ] Verify both downloads added
- [ ] Rapidly toggle theme 10 times
- [ ] Verify no crashes

## Test 15: Cleanup
- [ ] Go to Library
- [ ] Long press file
- [ ] Select "Delete" (if implemented)
- [ ] Verify file removed
- [ ] Go to Settings
- [ ] Verify all settings saved
- [ ] Force quit app
- [ ] Reopen
- [ ] Verify settings persisted

---

## Pass Criteria
- ✅ No crashes
- ✅ All core features work
- ✅ Animations smooth
- ✅ Theme switching instant
- ✅ Downloads complete successfully
- ✅ Settings persist
- ✅ Accessible with TalkBack

## Notes
Record any issues found:
- Issue description
- Steps to reproduce
- Screenshot if applicable
- Device info (model, Android version)

---

**Test Completed By**: _________________  
**Date**: _________________  
**Device**: _________________  
**Android Version**: _________________  
**Result**: ☐ PASS  ☐ FAIL
