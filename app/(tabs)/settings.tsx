/**
 * Settings Screen - App configuration and preferences
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useTheme } from '@theme/tokens';
import { typography } from '@theme/typography';
import { BlurredHeader } from '@components/layout/BlurredHeader';
import { AuroraGlass } from '@components/design-system/AuroraGlass';
import { useSettingsStore, ThemeMode } from '@features/downloads/store/settingsStore';
import { useDownloadStore } from '@features/downloads/store/downloadStore';
import { haptics } from '@utils/haptics';
import { auroraTokens } from '@theme/auroraTokens';
import { APP_INFO } from '@utils/constants';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const theme = useTheme();

  const {
    theme: themeMode,
    accentColor,
    maxConcurrentDownloads,
    dataSaverMode,
    fontSize,
    reducedMotion,
    setTheme,
    setAccentColor,
    setMaxConcurrentDownloads,
    setDataSaverMode,
    setFontSize,
    setReducedMotion,
  } = useSettingsStore();

  const setMaxConcurrent = useDownloadStore((state) => state.setMaxConcurrent);

  const handleThemeChange = () => {
    haptics.selection();
    const modes: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setTheme(nextMode);
  };

  const handleAccentColorChange = (color: string) => {
    haptics.selection();
    setAccentColor(color);
  };

  const handleMaxConcurrentChange = () => {
    haptics.selection();
    const options = [1, 2, 3, 4];
    const currentIndex = options.indexOf(maxConcurrentDownloads);
    const nextValue = options[(currentIndex + 1) % options.length];
    setMaxConcurrentDownloads(nextValue);
    setMaxConcurrent(nextValue);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BlurredHeader title="Settings" subtitle="Customize your experience" />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Appearance Section */}
        <SectionHeader title="Appearance" theme={theme} />

        <SettingItem
          icon="color-palette"
          label="Theme"
          value={themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
          onPress={handleThemeChange}
          theme={theme}
        />

        <AuroraGlass
          style={[
            styles.settingCard,
            { borderRadius: theme.borderRadius.md, padding: theme.spacing.lg },
          ]}
          gradient
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Ionicons name="color-filter" size={20} color={theme.colors.textSecondary} />
              <Text style={[typography.body, { color: theme.colors.text, marginLeft: 12 }]}>
                Accent Color
              </Text>
            </View>
          </View>

          <View style={styles.colorPicker}>
            {Object.entries(auroraTokens.colors.neon).map(([name, color]) => (
              <Pressable
                key={name}
                onPress={() => handleAccentColorChange(color)}
                style={[
                  styles.colorSwatch,
                  {
                    backgroundColor: color,
                    borderWidth: accentColor === color ? 3 : 0,
                    borderColor: theme.colors.text,
                  },
                ]}
              />
            ))}
          </View>
        </AuroraGlass>

        <AuroraGlass
          style={[
            styles.settingCard,
            { borderRadius: theme.borderRadius.md, padding: theme.spacing.lg },
          ]}
          gradient
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Ionicons name="contract" size={20} color={theme.colors.textSecondary} />
              <Text style={[typography.body, { color: theme.colors.text, marginLeft: 12 }]}>
                Reduced Motion
              </Text>
            </View>
            <Switch
              value={reducedMotion}
              onValueChange={(value) => {
                haptics.light();
                setReducedMotion(value);
              }}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
            />
          </View>
        </AuroraGlass>

        {/* Downloads Section */}
        <SectionHeader title="Downloads" theme={theme} />

        <SettingItem
          icon="download"
          label="Max Concurrent Downloads"
          value={maxConcurrentDownloads.toString()}
          onPress={handleMaxConcurrentChange}
          theme={theme}
        />

        <AuroraGlass
          style={[
            styles.settingCard,
            { borderRadius: theme.borderRadius.md, padding: theme.spacing.lg },
          ]}
          gradient
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Ionicons name="cellular" size={20} color={theme.colors.textSecondary} />
              <Text style={[typography.body, { color: theme.colors.text, marginLeft: 12 }]}>
                Data Saver Mode
              </Text>
            </View>
            <Switch
              value={dataSaverMode}
              onValueChange={(value) => {
                haptics.light();
                setDataSaverMode(value);
              }}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
            />
          </View>
        </AuroraGlass>

        {/* About Section */}
        <SectionHeader title="About" theme={theme} />

        <SettingItem
          icon="information-circle"
          label="Version"
          value={APP_INFO.VERSION}
          theme={theme}
        />

        <SettingItem
          icon="shield-checkmark"
          label="Privacy Policy"
          onPress={() => {
            haptics.light();
            Alert.alert('Privacy Policy', 'Aurora Download Manager does not collect any personal data. All downloads are stored locally on your device.');
          }}
          theme={theme}
        />

        <SettingItem
          icon="document-text"
          label="Content Rights Disclaimer"
          onPress={() => {
            haptics.light();
            Alert.alert(
              'Content Rights',
              'You are responsible for ensuring you have the legal right to download any content. Aurora Download Manager is a tool for managing downloads of content you own or have permission to access.'
            );
          }}
          theme={theme}
        />

        <View style={styles.footer}>
          <Text style={[typography.caption, { color: theme.colors.textTertiary, textAlign: 'center' }]}>
            Aurora Download Manager v{APP_INFO.VERSION}
          </Text>
          <Text style={[typography.caption, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: 4 }]}>
            Made with ❤️ for media management
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, theme }: any) {
  return (
    <Text
      style={[
        typography.h4,
        {
          color: theme.colors.text,
          marginTop: 24,
          marginBottom: 12,
          paddingHorizontal: 4,
        },
      ]}
    >
      {title}
    </Text>
  );
}

function SettingItem({ icon, label, value, onPress, theme }: any) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <AuroraGlass
        style={[
          styles.settingCard,
          { borderRadius: theme.borderRadius.md, padding: theme.spacing.lg },
        ]}
        gradient
      >
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <Ionicons name={icon} size={20} color={theme.colors.textSecondary} />
            <Text style={[typography.body, { color: theme.colors.text, marginLeft: 12 }]}>
              {label}
            </Text>
          </View>

          {value && (
            <View style={styles.settingValue}>
              <Text style={[typography.body, { color: theme.colors.textSecondary }]}>
                {value}
              </Text>
              {onPress && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textTertiary}
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>
          )}

          {!value && onPress && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          )}
        </View>
      </AuroraGlass>
    </Pressable>
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
    paddingBottom: 48,
  },
  settingCard: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});
