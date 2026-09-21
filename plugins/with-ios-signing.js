const { withXcodeProject } = require('expo/config-plugins');

const SETTINGS = {
  CODE_SIGN_STYLE: 'Automatic',
  '"CODE_SIGNING_ALLOWED[sdk=iphonesimulator*]"': 'NO',
  '"CODE_SIGNING_REQUIRED[sdk=iphonesimulator*]"': 'NO',
  '"CODE_SIGN_IDENTITY[sdk=iphonesimulator*]"': '""',
};

module.exports = function withIosSigning(config) {
  return withXcodeProject(config, (cfg) => {
    const configurations = cfg.modResults.pbxXCBuildConfigurationSection();

    Object.values(configurations).forEach((entry) => {
      if (!entry || typeof entry !== 'object' || !entry.buildSettings) return;
      Object.assign(entry.buildSettings, SETTINGS);
    });

    return cfg;
  });
};
