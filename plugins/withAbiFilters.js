// const { withAppBuildGradle } = require('@expo/config-plugins');

// module.exports = function withSingleAbi(config) {
//   return withAppBuildGradle(config, (cfg) => {
//     cfg.modResults.contents = cfg.modResults.contents.replace(
//       /defaultConfig\s*\{[\s\S]*?}/m,
//       (match) =>
//         match +
//         `
// android {
//     defaultConfig {
//         ndk {
//             abiFilters 'armeabi-v7a'
//         }
//     }
//     packagingOptions {
//         exclude 'lib/x86/libc++_shared.so'
//         exclude 'lib/x86_64/libc++_shared.so'
//         exclude 'lib/arm64-v8a/libc++_shared.so'
//     }
// }
// `
//     );
//     return cfg;
//   });
// };

const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withABI(config) {
  return withAppBuildGradle(config, (cfg) => {
    const newContent = cfg.modResults.contents.replace(
      /defaultConfig\s*\{[\s\S]*?}/m,
      `$&
        ndk {
            abiFilters 'armeabi-v7a'
        }`
    );
    cfg.modResults.contents = newContent;
    return cfg;
  });
};