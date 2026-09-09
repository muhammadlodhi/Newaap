const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  project: {
    ios: {},
    android: {},
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
