/**
 * Queue Screen - View and manage download queue
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useTheme } from '@theme/tokens';
import { typography } from '@theme/typography';
import { BlurredHeader } from '@components/layout/BlurredHeader';
import { Capsule } from '@components/design-system/Capsule';
import { useDownloadStore } from '@features/downloads/store/downloadStore';
import { haptics } from '@utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { Download, DownloadStatus } from '@features/downloads/store/types';

export default function QueueScreen() {
  const theme = useTheme();
  const [filter, setFilter] = useState<DownloadStatus | 'all'>('all');

  const downloads = useDownloadStore((state) => state.downloads);
  const startDownload = useDownloadStore((state) => state.startDownload);
  const pauseDownload = useDownloadStore((state) => state.pauseDownload);
  const resumeDownload = useDownloadStore((state) => state.resumeDownload);
  const cancelDownload = useDownloadStore((state) => state.cancelDownload);
  const retryDownload = useDownloadStore((state) => state.retryDownload);
  const clearCompleted = useDownloadStore((state) => state.clearCompleted);

  const filteredDownloads =
    filter === 'all'
      ? downloads
      : downloads.filter((d) => d.status === filter);

  const handlePauseAll = () => {
    haptics.medium();
    downloads
      .filter((d) => d.status === 'downloading')
      .forEach((d) => pauseDownload(d.id));
  };

  const handleClearCompleted = () => {
    haptics.medium();
    Alert.alert(
      'Clear Completed',
      'Are you sure you want to remove all completed downloads from the queue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCompleted();
            haptics.success();
          },
        },
      ]
    );
  };

  const handleDownloadPress = (download: Download) => {
    haptics.light();

    const actions: any[] = [];

    if (download.status === 'downloading') {
      actions.push({
        text: 'Pause',
        onPress: () => {
          pauseDownload(download.id);
          haptics.success();
        },
      });
    }

    if (download.status === 'paused') {
      actions.push({
        text: 'Resume',
        onPress: () => {
          resumeDownload(download.id);
          haptics.success();
        },
      });
    }

    if (download.status === 'failed') {
      actions.push({
        text: 'Retry',
        onPress: () => {
          retryDownload(download.id);
          haptics.success();
        },
      });
    }

    if (download.status !== 'completed') {
      actions.push({
        text: 'Cancel',
        style: 'destructive',
        onPress: () => {
          cancelDownload(download.id);
          haptics.warning();
        },
      });
    }

    actions.push({ text: 'Close', style: 'cancel' });

    Alert.alert(download.filename, 'Choose an action', actions);
  };

  const renderDownload = ({ item }: { item: Download }) => (
    <Capsule
      download={item}
      onPress={() => handleDownloadPress(item)}
      onPause={() => pauseDownload(item.id)}
      onResume={() => resumeDownload(item.id)}
      onCancel={() => cancelDownload(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BlurredHeader
        title="Download Queue"
        subtitle={`${filteredDownloads.length} ${filter === 'all' ? 'total' : filter}`}
        rightElement={
          <Pressable onPress={handlePauseAll}>
            <Ionicons name="pause-circle" size={28} color={theme.colors.accent} />
          </Pressable>
        }
      />

      {/* Filter Tabs */}
      <View style={[styles.filters, { borderBottomColor: theme.colors.border }]}>
        {(['all', 'pending', 'downloading', 'paused', 'completed', 'failed'] as const).map(
          (status) => {
            const count = status === 'all' ? downloads.length : downloads.filter((d) => d.status === status).length;
            const isActive = filter === status;

            return (
              <Pressable
                key={status}
                onPress={() => {
                  haptics.selection();
                  setFilter(status);
                }}
                style={[
                  styles.filterTab,
                  isActive && {
                    borderBottomWidth: 2,
                    borderBottomColor: theme.colors.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.label,
                    {
                      color: isActive ? theme.colors.accent : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
                <Text
                  style={[
                    typography.caption,
                    {
                      color: isActive ? theme.colors.accent : theme.colors.textTertiary,
                      marginLeft: 4,
                    },
                  ]}
                >
                  ({count})
                </Text>
              </Pressable>
            );
          }
        )}
      </View>

      {/* Download List */}
      <FlatList
        data={filteredDownloads}
        renderItem={renderDownload}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="download-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={[typography.body, { color: theme.colors.textSecondary, marginTop: 16 }]}>
              No downloads in queue
            </Text>
          </View>
        }
      />

      {/* Action Bar */}
      {downloads.some((d) => d.status === 'completed') && (
        <View
          style={[
            styles.actionBar,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          <Pressable
            onPress={handleClearCompleted}
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.error + '20',
                borderRadius: theme.borderRadius.md,
              },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            <Text style={[typography.button, { color: theme.colors.error, marginLeft: 8 }]}>
              Clear Completed
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  list: {
    paddingVertical: 8,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  actionBar: {
    padding: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
