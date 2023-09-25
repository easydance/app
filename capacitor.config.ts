/// <reference types="@codetrix-studio/capacitor-google-auth" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.easydance',
  appName: 'Easydance',
  webDir: 'www',
  server: {
    hostname: 'localhost',
    iosScheme: "https",
    androidScheme: 'https'
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
};

export default config;
