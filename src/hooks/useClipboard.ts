/**
 * Custom hook for clipboard operations
 */
import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { logger } from '@utils/logger';
import { isValidUrl } from '@utils/validators';

export function useClipboard() {
  const [clipboardContent, setClipboardContent] = useState<string>('');
  const [hasUrl, setHasUrl] = useState(false);

  /**
   * Check clipboard for URL
   */
  const checkClipboard = async (): Promise<string | null> => {
    try {
      const content = await Clipboard.getStringAsync();
      setClipboardContent(content);

      if (isValidUrl(content)) {
        setHasUrl(true);
        logger.debug('Valid URL found in clipboard');
        return content;
      } else {
        setHasUrl(false);
        return null;
      }
    } catch (error) {
      logger.error('Failed to check clipboard', error);
      return null;
    }
  };

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await Clipboard.setStringAsync(text);
      logger.debug('Text copied to clipboard');
      return true;
    } catch (error) {
      logger.error('Failed to copy to clipboard', error);
      return false;
    }
  };

  return {
    clipboardContent,
    hasUrl,
    checkClipboard,
    copyToClipboard,
  };
}
