/**
 * URL Input Component with Aurora Glass styling
 */
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';
import { useTheme } from '@theme/tokens';
import { typography } from '@theme/typography';
import { AuroraGlass } from '../design-system/AuroraGlass';
import { haptics } from '@utils/haptics';
import { isValidUrl } from '@utils/validators';

interface URLInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (url: string) => void;
  placeholder?: string;
}

export function URLInput({ value, onChangeText, onSubmit, placeholder }: URLInputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const isValid = value.length === 0 || isValidUrl(value);

  const handleSubmit = () => {
    if (isValid && value.length > 0) {
      haptics.light();
      onSubmit?.(value);
    }
  };

  return (
    <AuroraGlass
      style={[
        styles.container,
        {
          borderRadius: theme.borderRadius.lg,
          borderWidth: 2,
          borderColor: isFocused
            ? theme.colors.accent
            : isValid
            ? theme.colors.border
            : theme.colors.error,
        },
      ]}
      gradient
    >
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder || 'https://example.com/file.mp4'}
          placeholderTextColor={theme.colors.textTertiary}
          style={[
            typography.body,
            {
              color: theme.colors.text,
              flex: 1,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
            },
          ]}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          accessible
          accessibilityLabel="URL input field"
        />
      </View>
      
      {!isValid && value.length > 0 && (
        <Text
          style={[
            typography.caption,
            {
              color: theme.colors.error,
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: theme.spacing.sm,
            },
          ]}
        >
          Invalid URL format
        </Text>
      )}
    </AuroraGlass>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
