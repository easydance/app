/// <reference types="@codetrix-studio/capacitor-google-auth" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.easydance',
  appName: 'Easydance',
  webDir: 'www',
  server: {
    hostname: 'localhost',
    iosScheme: "https",
    androidScheme: 'https'
  },
  android: {
    includePlugins: [
      '@capacitor-mlkit/barcode-scanning',
      '@capacitor-community/camera-preview',
      '@capacitor/app',
      '@capacitor/geolocation',
      '@capacitor/google-maps',
      '@capacitor/haptics',
      '@capacitor/keyboard',
      '@capacitor/status-bar',
      '@codetrix-studio/capacitor-google-auth',
      'com.virtuoworks.cordova-plugin-canvascamera',
      'cordova-plugin-file',
      'cordova-plugin-media-capture'
    ],
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      androidClientId: "862020674291-6ltb6ufrfmupsdhi2irtg68ba0eqg2ib.apps.googleusercontent.com",
      iosClientId: "862020674291-6ltb6ufrfmupsdhi2irtg68ba0eqg2ib.apps.googleusercontent.com",
      serverClientId: "862020674291-6ltb6ufrfmupsdhi2irtg68ba0eqg2ib.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    }
  }
,
    android: {
       buildOptions: {
          keystorePath: '/Users/addo/Documents/Workspace/@easydance/app/keys/easydance.keystore',
          keystoreAlias: 'easydance',
       }
    }
  };

export default config;
