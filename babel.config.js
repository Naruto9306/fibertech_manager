// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [
//       [
//         'module-resolver',
//         {
//           root: ['./'],
//           alias: {
//             '@': './',
//             '@/components': './components',
//             '@/screens': './components/screens',
//             '@/navigation': './components/navigation',
//             '@/assets': './assets'
//           }
//         }
//       ],
//       'react-native-reanimated/plugin',
//     ]
//   };
// };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
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