const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'brand.config.json');
const BRAND_ASSETS_DIR = path.join(ROOT, 'brand_assets');

function main() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('\n  ✗ brand.config.json not found.');
    console.error('    Copy brand.config.example.json to brand.config.json and fill in your values.\n');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  console.log(`\n  Applying brand: ${config.appName}\n`);

  updateAppJson(config);
  updateAppConfig(config);
  updateColors(config);
  updateStrings(config);
  updateTailwind(config);
  updateLocales(config);
  copyAssets();
  copyFirebaseConfigs(config);

  console.log('\n  ✓ Brand applied successfully!\n');
}

function updateAppJson(config) {
  const filePath = path.join(ROOT, 'app.json');
  const appJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (config.appName) appJson.expo.name = config.appName;
  if (config.slug) appJson.expo.slug = config.slug;
  if (config.bundleIdentifier) appJson.expo.ios.bundleIdentifier = config.bundleIdentifier;
  if (config.packageName) appJson.expo.android.package = config.packageName;

  if (config.firebase && config.firebase.enabled) {
    const googleServicesExists = fs.existsSync(path.join(BRAND_ASSETS_DIR, 'google-services.json'));
    const googleServiceInfoExists = fs.existsSync(path.join(BRAND_ASSETS_DIR, 'GoogleService-Info.plist'));

    if (googleServicesExists || googleServiceInfoExists) {
      if (!appJson.expo.plugins) appJson.expo.plugins = [];

      const firebasePlugins = ['@react-native-firebase/app', '@react-native-firebase/messaging'];
      firebasePlugins.forEach(plugin => {
        if (!appJson.expo.plugins.includes(plugin)) {
          appJson.expo.plugins.push(plugin);
        }
      });
    }

    if (googleServiceInfoExists) {
      appJson.expo.ios.googleServicesFile = './GoogleService-Info.plist';
    } else {
      delete appJson.expo.ios.googleServicesFile;
    }

    if (googleServicesExists) {
      appJson.expo.android.googleServicesFile = './google-services.json';
    } else {
      delete appJson.expo.android.googleServicesFile;
    }
  } else {
    delete appJson.expo.ios.googleServicesFile;
    delete appJson.expo.android.googleServicesFile;
    if (appJson.expo.plugins) {
      appJson.expo.plugins = appJson.expo.plugins.filter(
        p => p !== '@react-native-firebase/app' && p !== '@react-native-firebase/messaging'
      );
      if (appJson.expo.plugins.length === 0) delete appJson.expo.plugins;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(appJson, null, 2) + '\n');
  console.log('  ✓ app.json');
}

function updateAppConfig(config) {
  const filePath = path.join(ROOT, 'constants', 'AppConfig.js');
  let content = fs.readFileSync(filePath, 'utf8');

  if (config.appName) {
    content = content.replace(/appName:\s*'[^']*'/, `appName: '${config.appName}'`);
  }
  if (config.website) {
    content = content.replace(/website:\s*'[^']*'/, `website: '${config.website}'`);
  }
  if (config.supportEmail) {
    content = content.replace(/supportEmail:\s*'[^']*'/, `supportEmail: '${config.supportEmail}'`);
  }

  fs.writeFileSync(filePath, content);
  console.log('  ✓ constants/AppConfig.js');
}

function updateColors(config) {
  if (!config.colors) return;

  const filePath = path.join(ROOT, 'constants', 'Colors.js');
  let content = fs.readFileSync(filePath, 'utf8');

  if (config.colors.primary) {
    content = content.replace(/primary:\s*'[^']*'/, `primary: '${config.colors.primary}'`);
  }
  if (config.colors.secondary) {
    content = content.replace(/secondary:\s*'[^']*'/, `secondary: '${config.colors.secondary}'`);
  }

  fs.writeFileSync(filePath, content);
  console.log('  ✓ constants/Colors.js');
}

function updateStrings(config) {
  if (!config.groupCode) return;

  const filePath = path.join(ROOT, 'constants', 'Strings.js');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /(^\s+GROUP_CODE:\s*)'[^']*'/m,
    `$1'${config.groupCode}'`
  );

  fs.writeFileSync(filePath, content);
  console.log('  ✓ constants/Strings.js');
}

function updateTailwind(config) {
  if (!config.colors) return;

  const filePath = path.join(ROOT, 'tailwind.config.js');
  let content = fs.readFileSync(filePath, 'utf8');

  if (config.colors.brand) {
    content = content.replace(/brand:\s*'[^']*'/, `brand: '${config.colors.brand}'`);
  }
  if (config.colors.accent) {
    content = content.replace(/accent:\s*'[^']*'/, `accent: '${config.colors.accent}'`);
  }

  fs.writeFileSync(filePath, content);
  console.log('  ✓ tailwind.config.js');
}

function updateLocales(config) {
  if (config.appName) {
    const enPath = path.join(ROOT, 'locales', 'en.json');
    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    en.eshkul = config.appName;
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
    console.log('  ✓ locales/en.json');
  }

  if (config.appNameBn) {
    const bnPath = path.join(ROOT, 'locales', 'bn.json');
    const bn = JSON.parse(fs.readFileSync(bnPath, 'utf8'));
    bn.eshkul = config.appNameBn;
    fs.writeFileSync(bnPath, JSON.stringify(bn, null, 2) + '\n');
    console.log('  ✓ locales/bn.json');
  }
}

function copyAssets() {
  if (!fs.existsSync(BRAND_ASSETS_DIR)) return;

  const assetFiles = ['icon.png', 'logo.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'];
  const assetsDir = path.join(ROOT, 'assets');
  let copied = 0;

  assetFiles.forEach(file => {
    const src = path.join(BRAND_ASSETS_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(assetsDir, file));
      copied++;
    }
  });

  if (copied > 0) {
    console.log(`  ✓ assets/ (${copied} file${copied > 1 ? 's' : ''} copied)`);
  }
}

function copyFirebaseConfigs(config) {
  if (!config.firebase || !config.firebase.enabled) return;
  if (!fs.existsSync(BRAND_ASSETS_DIR)) return;

  const firebaseFiles = [
    { name: 'google-services.json', dest: path.join(ROOT, 'google-services.json') },
    { name: 'GoogleService-Info.plist', dest: path.join(ROOT, 'GoogleService-Info.plist') },
  ];

  let copied = 0;

  firebaseFiles.forEach(({ name, dest }) => {
    const src = path.join(BRAND_ASSETS_DIR, name);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      copied++;
    }
  });

  if (copied > 0) {
    console.log(`  ✓ Firebase configs (${copied} file${copied > 1 ? 's' : ''} copied)`);
  }
}

main();
