const fs = require('fs');
const path = require('path');

module.exports = ({ config }) => {
  const googleServicesPath = path.resolve(__dirname, 'google-services.json');
  if (!fs.existsSync(googleServicesPath) && config.android) {
    delete config.android.googleServicesFile;
  }

  const googleServiceInfoPath = path.resolve(__dirname, 'GoogleService-Info.plist');
  if (!fs.existsSync(googleServiceInfoPath) && config.ios) {
    delete config.ios.googleServicesFile;
  }

  return config;
};
