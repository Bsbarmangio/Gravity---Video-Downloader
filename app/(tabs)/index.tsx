/**
 * Home Screen - URL input and analysis
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useTheme } from '@theme/tokens';
import { typography } from '@theme/typography';
import { BlurredHeader } from '@components/layout/BlurredHeader';
import { URLInput } from '@components/input/URLInput';
import { SmartPasteButton } from '@components/input/SmartPasteButton';
import { AuroraGlass } from '@components/design-system/AuroraGlass';
import { SkeletonLoader } from '@components/design-system/SkeletonLoader';
import { useClipboard } from '@hooks/useClipboard';
import { validateFileUrl } from '@services/network/fileValidator';
import { useDownloadStore } from '@features/downloads/store/downloadStore';
import { haptics } from '@utils/haptics';
import { formatBytes } from '@utils/formatting';
import { sanitizeFilename } from '@utils/validators';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const { hasUrl, checkClipboard } = useClipboard();
  const addDownload = useDownloadStore((state) => state.addDownload);

  useEffect(() => {
    // Check clipboard on mount
    checkClipboard();
  }, []);

  const handleCheckClipboard = async () => {
    haptics.light();
    const clipUrl = await checkClipboard();
    if (clipUrl) {
      setUrl(clipUrl);
      haptics.success();
    }
  };

  const handleAnalyze = async () => {
    if (!url) return;

    setIsAnalyzing(true);
    haptics.medium();

    try {
      const result = await validateFileUrl(url);
      setValidationResult(result);

      if (!result.isValid) {
        haptics.error();
      } else if (!result.isDirectFile) {
        haptics.warning();
      } else {
        haptics.success();
      }
    } catch (error) {
      haptics.error();
      Alert.alert('Error', 'Failed to analyze URL');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!validationResult || !validationResult.isValid) return;

    haptics.success();

    const filename = sanitizeFilename(validationResult.filename);

    addDownload({
      url,
      filename,
      bytesTotal: validationResult.fileSize,
      startedAt: null,
      completedAt: null,
      localUri: null,
      error: null,
      checksum: null,
      maxRetries: 3,
    });

    Alert.alert('Success', 'Download added to queue');
    
    // Reset
    setUrl('');
    setValidationResult(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BlurredHeader
        title="Aurora Download"
        subtitle="Your media download manager"
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[typography.h4, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
            Enter Download URL
          </Text>

          <URLInput
            value={url}
            onChangeText={setUrl}
            onSubmit={handleAnalyze}
            placeholder="https://example.com/file.mp4"
          />

          <View style={styles.actions}>
            <Pressable
              onPress={handleCheckClipboard}
              style={[
                styles.button,
                styles.secondaryButton,
                { borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.borderRadius.md },
              ]}
            >
              <Ionicons name="clipboard-outline" size={20} color={theme.colors.text} />
              <Text style={[typography.button, { color: theme.colors.text, marginLeft: 8 }]}>
                Paste from Clipboard
              </Text>
            </Pressable>

            <Pressable
              onPress={handleAnalyze}
              disabled={!url || isAnalyzing}
              style={[
                styles.button,
                styles.primaryButton,
                {
                  backgroundColor: theme.colors.accent,
                  borderRadius: theme.borderRadius.md,
                  opacity: !url || isAnalyzing ? 0.5 : 1,
                },
              ]}
            >
              <Ionicons name="search" size={20} color="#ffffff" />
              <Text style={[typography.button, { color: '#ffffff', marginLeft: 8 }]}>
                {isAnalyzing ? 'Analyzing...' : 'Analyze URL'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Analysis Result */}
        {isAnalyzing && (
          <AuroraGlass
            style={[styles.resultCard, { borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg }]}
            gradient
          >
            <SkeletonLoader height={20} style={{ marginBottom: 12 }} />
            <SkeletonLoader height={16} width="60%" style={{ marginBottom: 8 }} />
            <SkeletonLoader height={16} width="80%" />
          </AuroraGlass>
        )}

        {validationResult && !isAnalyzing && (
          <AuroraGlass
            style={[
              styles.resultCard,
              {
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg,
                borderWidth: 1,
                borderColor: validationResult.isValid
                  ? validationResult.isDirectFile
                    ? theme.colors.success
                    : theme.colors.warning
                  : theme.colors.error,
              },
            ]}
            gradient
          >
            <View style={styles.resultHeader}>
              <Ionicons
                name={
                  validationResult.isValid
                    ? validationResult.isDirectFile
                      ? 'checkmark-circle'
                      : 'warning'
                    : 'close-circle'
                }
                size={32}
                color={
                  validationResult.isValid
                    ? validationResult.isDirectFile
                      ? theme.colors.success
                      : theme.colors.warning
                    : theme.colors.error
                }
              />
              <Text style={[typography.h4, { color: theme.colors.text, marginLeft: 12 }]}>
                {validationResult.isValid ? 'File Detected' : 'Invalid URL'}
              </Text>
            </View>

            <View style={styles.resultDetails}>
              <DetailRow label="Filename" value={validationResult.filename} theme={theme} />
              {validationResult.fileSize && (
                <DetailRow label="Size" value={formatBytes(validationResult.fileSize)} theme={theme} />
              )}
              {validationResult.mimeType && (
                <DetailRow label="Type" value={validationResult.mimeType} theme={theme} />
              )}
              {validationResult.supportsResume && (
                <DetailRow label="Resume Support" value="Yes" theme={theme} />
              )}
            </View>

            {validationResult.error && (
              <View
                style={[
                  styles.warningBox,
                  { backgroundColor: theme.colors.warning + '20', borderRadius: theme.borderRadius.sm, padding: 12, marginTop: 12 },
                ]}
              >
                <Text style={[typography.caption, { color: theme.colors.warning }]}>
                  ⚠️ {validationResult.error}
                </Text>
              </View>
            )}

            {validationResult.isValid && (
              <Pressable
                onPress={handleDownload}
                style={[
                  styles.downloadButton,
                  {
                    backgroundColor: theme.colors.accent,
                    borderRadius: theme.borderRadius.md,
                    marginTop: theme.spacing.lg,
                  },
                ]}
              >
                <Ionicons name="download" size={20} color="#ffffff" />
                <Text style={[typography.button, { color: '#ffffff', marginLeft: 8 }]}>
                  Add to Downloads
                </Text>
              </Pressable>
            )}
          </AuroraGlass>
        )}
      </ScrollView>

      <SmartPasteButton hasUrl={hasUrl} onPress={handleCheckClipboard} />
    </View>
  );
}

function DetailRow({ label, value, theme }: any) {
  return (
    <View style={styles.detailRow}>
      <Text style={[typography.label, { color: theme.colors.textSecondary }]}>{label}:</Text>
      <Text style={[typography.body, { color: theme.colors.text, marginLeft: 8 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButton: {},
  secondaryButton: {},
  resultCard: {
    marginTop: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningBox: {},
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});
