// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-terser';
config.transformer.minifierConfig = {
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info']
  }
};

module.exports = config;