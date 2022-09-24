const extraNodeModules = require('node-libs-browser');
const {getDefaultConfig} = require('metro-config');

module.exports = async () => {
  const {
    resolver: {sourceExts},
  } = await getDefaultConfig();
  return {
    resolver: {
      extraNodeModules,
      sourceExts: [...sourceExts, 'cjs'],
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
};
