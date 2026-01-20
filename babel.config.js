module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@features': './src/features',
            '@services': './src/services',
            '@theme': './src/theme',
            '@utils': './src/utils',
            '@db': './src/db',
            '@hooks': './src/hooks',
            '@i18n': './src/i18n',
          },
        },
      ],
    ],
  };
};
