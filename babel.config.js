module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    "env": {
    "production": {
      "plugins": ["transform-remove-console"]
     }
    },
    plugins: [
      'react-native-worklets/plugin', // ✅ Cambiado aquí
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/screens': './components/screens',
            '@/navigation': './components/navigation',
            '@/assets': './assets'
          }
        }
      ]
    ]
  };
};