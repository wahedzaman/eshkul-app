# Rebranding Instructions

This guide explains how to rebrand the Eshkul app for different organizations.

## 1. App Configuration

The main configuration file is located at `constants/AppConfig.js`.

```javascript
export default {
  appName: "Eshkul", // Change the app name here
  website: "https://eshkul.com",
  supportEmail: "support@eshkul.com",
};
```

Update these values to match the new organization's details.

## 2. App Identity (app.json)

To change the package name, bundle identifier, and app name displayed on the device, update `app.json`:

```json
{
  "expo": {
    "name": "Eshkul", // Display Name
    "slug": "eshkul", // URL slug
    "ios": {
      "bundleIdentifier": "com.eshkul.eshkul" // Unique iOS ID
    },
    "android": {
      "package": "com.eshkul.eshkul" // Unique Android ID
    }
  }
}
```

## 3. Assets

Replace the following files in the `assets/` directory with the new organization's assets:

- `icon.png` (App Icon)
- `splash.png` (Splash Screen Image)
- `adaptive-icon.png` (Android Adaptive Icon)
- `favicon.png` (Web Favicon)
- `logo.png` (Used in Login Screen)

## 4. Colors

To change the color scheme, update `tailwind.config.js` or `global.css`.

If you are using specific colors in the code (e.g., `#2563eb` for the primary color), search and replace them globally or define them in `tailwind.config.js` theme extension:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Update this value
      },
    },
  },
};
```

## 5. Translations

Update the translation files in `locales/`:

- `locales/en.json` (English)
- `locales/bn.json` (Bangla)

Ensure that the keys remain the same, but update the values to reflect the new organization's terminology if needed.
