/// <reference types="@codetrix-studio/capacitor-google-auth" />
/// <reference types="@capacitor/push-notifications" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.easydance',
  appName: 'Easydance',
  webDir: 'www',
  server: {
    hostname: '127.0.0.1',
    iosScheme: 'https',
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      keystorePath: '/Users/addo/Documents/Workspace/@easydance/app/keys/easydance.keystore',
      keystoreAlias: 'easydance',
    },
    includePlugins: [
      '@capacitor/push-notifications',
      '@capacitor-mlkit/barcode-scanning',
      '@capacitor-community/camera-preview',
      '@capacitor/app',
      '@capacitor/geolocation',
      '@capacitor/filesystem',
      '@capacitor/haptics',
      '@capacitor/keyboard',
      '@capacitor/status-bar',
      '@codetrix-studio/capacitor-google-auth',
      'com.virtuoworks.cordova-plugin-canvascamera',
      '@capacitor/share'
    ],
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      androidClientId: "862020674291-6ltb6ufrfmupsdhi2irtg68ba0eqg2ib.apps.googleusercontent.com",
      iosClientId: "862020674291-6ltb6ufrfmupsdhi2irtg68ba0eqg2ib.apps.googleusercontent.com",
      serverClientId: "862020674291-6ltb6ufrfmupsdhi2irtg68ba0eqg2ib.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  }
};

export default config;
