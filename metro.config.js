const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.transformer.minifierPath = 'metro-minify-terser';

config.transformer.minifierConfig = {
  compress: {
    // Only strip console.* calls in production builds so console.log is
    // still usable while debugging in development.
    drop_console: process.env.NODE_ENV === 'production',
  },
};

module.exports = config;