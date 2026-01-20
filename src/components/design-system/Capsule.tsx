/**
 * Download Capsule - Main download item component with Aurora Glass styling
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@theme/tokens';
import { typography } from '@theme/typography';
import { AuroraGlass } from './AuroraGlass';
import { ProgressRing } from './ProgressRing';
import { SpeedMeter } from './SpeedMeter';
import { Download } from '@features/downloads/store/types';
import { formatBytes, formatProgress, formatTimeRemaining, truncateFilename } from '@utils/formatting';
import { haptics } from '@utils/haptics';

interface CapsuleProps {
  download: Download;
  onPress?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
}

export function Capsule({ download, onPress, onPause, onResume, onCancel }: CapsuleProps) {
  const theme = useTheme();

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const statusColor = theme.colors.status[download.status];

  return (
    <Pressable onPress={handlePress}>
      <AuroraGlass
        style={[
          styles.capsule,
          {
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
          theme.effects.shadows.md,
        ]}
        gradient
      >
        <View style={styles.content}>
          {/* Progress Ring */}
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={download.progress}
              size={theme.components.progressRing.size}
              strokeWidth={theme.components.progressRing.strokeWidth}
              color={statusColor}
            />
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text
              style={[
                typography.bodyLarge,
                { color: theme.colors.text },
                styles.filename,
              ]}
              numberOfLines={1}
            >
              {truncateFilename(download.filename, 35)}
            </Text>

            <View style={styles.meta}>
              <Text style={[typography.caption, { color: theme.colors.textSecondary }]}>
                {download.status === 'downloading' ? formatProgress(download.progress) : download.status}
              </Text>
              <Text style={[typography.caption, { color: theme.colors.textTertiary }]}>
                {' • '}
              </Text>
              <Text style={[typography.caption, { color: theme.colors.textSecondary }]}>
                {download.bytesTotal
                  ? `${formatBytes(download.bytesDownloaded)} / ${formatBytes(download.bytesTotal)}`
                  : formatBytes(download.bytesDownloaded)}
              </Text>
            </View>

            {download.status === 'downloading' && (
              <View style={styles.stats}>
                <SpeedMeter speed={download.speed} />
                {download.estimatedTimeRemaining && (
                  <>
                    <Text style={[typography.caption, { color: theme.colors.textTertiary }]}>
                      {' • '}
                    </Text>
                    <Text style={[typography.caption, { color: theme.colors.textSecondary }]}>
                      {formatTimeRemaining(download.estimatedTimeRemaining)} remaining
                    </Text>
                  </>
                )}
              </View>
            )}

            {download.error && (
              <Text
                style={[typography.caption, { color: theme.colors.error }]}
                numberOfLines={1}
              >
                {download.error}
              </Text>
            )}
          </View>
        </View>
      </AuroraGlass>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  capsule: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  progressContainer: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  filename: {
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
