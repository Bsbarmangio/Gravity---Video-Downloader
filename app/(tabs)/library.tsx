/**
 * Library Screen - Browse downloaded files
 */
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useTheme } from '@theme/tokens';
import { typography } from '@theme/typography';
import { BlurredHeader } from '@components/layout/BlurredHeader';
import { AuroraGlass } from '@components/design-system/AuroraGlass';
import { useDownloadStore } from '@features/downloads/store/downloadStore';
import { useSettingsStore } from '@features/downloads/store/settingsStore';
import { haptics } from '@utils/haptics';
import { formatBytes, formatDate } from '@utils/formatting';
import { Ionicons } from '@expo/vector-icons';
import { Download, FileType } from '@features/downloads/store/types';

type FilterType = 'all' | FileType;
type SortType = 'name' | 'date' | 'size' | 'type';

export default function LibraryScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');

  const downloads = useDownloadStore((state) =>
    state.downloads.filter((d) => d.status === 'completed')
  );
  const setLastLibrarySort = useSettingsStore((state) => state.setLastLibrarySort);

  const filteredAndSortedDownloads = useMemo(() => {
    let result = downloads;

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((d) => d.fileType === filterType);
    }

    // Search filter
    if (searchQuery) {
      result = result.filter((d) =>
        d.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.filename.localeCompare(b.filename);
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'size':
          return (b.bytesTotal || 0) - (a.bytesTotal || 0);
        case 'type':
          return a.fileType.localeCompare(b.fileType);
        default:
          return 0;
      }
    });

    return result;
  }, [downloads, filterType, searchQuery, sortBy]);

  const handleSortChange = () => {
    haptics.selection();
    const sortOptions: SortType[] = ['date', 'name', 'size', 'type'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextSort = sortOptions[(currentIndex + 1) % sortOptions.length];
    setSortBy(nextSort);
    setLastLibrarySort(nextSort as any);
  };

  const renderDownloadItem = ({ item }: { item: Download }) => (
    <Pressable
      onPress={() => {
        haptics.light();
        // Open file preview (not implemented in this version)
      }}
    >
      <AuroraGlass
        style={[
          styles.fileCard,
          {
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
          theme.effects.shadows.sm,
        ]}
        gradient
      >
        <View style={styles.fileIcon}>
          <Ionicons
            name={getFileIcon(item.fileType)}
            size={32}
            color={theme.colors.accent}
          />
        </View>

        <View style={styles.fileInfo}>
          <Text
            style={[typography.body, { color: theme.colors.text }]}
            numberOfLines={2}
          >
            {item.filename}
          </Text>

          <View style={styles.fileMeta}>
            <Text style={[typography.caption, { color: theme.colors.textSecondary }]}>
              {item.bytesTotal ? formatBytes(item.bytesTotal) : 'Unknown size'}
            </Text>
            <Text style={[typography.caption, { color: theme.colors.textTertiary }]}>
              {' • '}
            </Text>
            <Text style={[typography.caption, { color: theme.colors.textSecondary }]}>
              {item.completedAt ? formatDate(item.completedAt) : 'Unknown date'}
            </Text>
          </View>
        </View>
      </AuroraGlass>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BlurredHeader
        title="Library"
        subtitle={`${filteredAndSortedDownloads.length} ${filteredAndSortedDownloads.length === 1 ? 'file' : 'files'}`}
        rightElement={
          <Pressable onPress={handleSortChange}>
            <View style={styles.sortButton}>
              <Ionicons name="swap-vertical" size={20} color={theme.colors.accent} />
              <Text style={[typography.caption, { color: theme.colors.accent, marginLeft: 4 }]}>
                {sortBy}
              </Text>
            </View>
          </Pressable>
        }
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <AuroraGlass
          style={[
            styles.searchBar,
            {
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            },
          ]}
          gradient
        >
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search files..."
            placeholderTextColor={theme.colors.textTertiary}
            style={[
              typography.body,
              {
                color: theme.colors.text,
                flex: 1,
                marginLeft: 8,
                paddingVertical: 12,
              },
            ]}
          />
        </AuroraGlass>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filters}>
        {(['all', 'video', 'audio', 'image', 'document', 'archive'] as FilterType[]).map(
          (type) => {
            const isActive = filterType === type;
            return (
              <Pressable
                key={type}
                onPress={() => {
                  haptics.selection();
                  setFilterType(type);
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive
                      ? theme.colors.accent
                      : theme.colors.border + '40',
                    borderRadius: theme.borderRadius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.label,
                    {
                      color: isActive ? '#ffffff' : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            );
          }
        )}
      </View>

      {/* File List */}
      <FlatList
        data={filteredAndSortedDownloads}
        renderItem={renderDownloadItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={[typography.body, { color: theme.colors.textSecondary, marginTop: 16 }]}>
              {searchQuery
                ? 'No files match your search'
                : 'No downloaded files yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function getFileIcon(fileType: FileType): any {
  switch (fileType) {
    case 'video':
      return 'videocam';
    case 'audio':
      return 'musical-notes';
    case 'image':
      return 'image';
    case 'document':
      return 'document-text';
    case 'archive':
      return 'archive';
    default:
      return 'document';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
});
