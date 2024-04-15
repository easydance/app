import { Injectable } from '@angular/core';

import { BundleInfo, CapacitorUpdater } from '@capgo/capacitor-updater';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

export class VersionUpdaterService {

  static CapacitorUpdater = CapacitorUpdater;

  constructor() { }

  static async init() {
    await CapacitorUpdater.notifyAppReady();
    const { bundle: currentBundle } = await CapacitorUpdater.current();
    this.printBundleInfo(currentBundle, 'CURRENT BUNDLE');

    if (currentBundle.version == window.EASY_KEYS?.['LAST_HOTFIX_VERSION']) {
      console.log("HotFixVersion same to now!");
      return;
    }

    let data: BundleInfo | null = await CapacitorUpdater.download({
      url: window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
      version: window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',

    });
    this.printBundleInfo(data, 'CURRENT HOTFIX');

    if (data) {
      SplashScreen.show({ fadeOutDuration: 500 });
      await this.setVersion(data);
    }
  }

  static async removeAllBundles(excludeVersions: string[] = []) {
    const result = await CapacitorUpdater.list();
    for (let bundle of result.bundles.filter(b => !excludeVersions.includes(b.version))) {
      await CapacitorUpdater.delete(bundle);
    }
  }

  static async setVersion(data: BundleInfo) {
    this.printBundleInfo(data, 'LOADED BUNDLE');
    SplashScreen.show();
    try {
      await CapacitorUpdater.set({ id: data.id });
      console.log({
        method: 'CapacitorUpdater.set(...)',
        params: { id: data.id },
        value: undefined
      });
    } catch (err) {
      console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|| ', err);
      console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log({
        method: 'CapacitorUpdater.set error',
        value: err
      });
      console.log(err);
      SplashScreen.hide(); // in case the set fail, otherwise the new app will have to hide it
    }
  }

  static async reset() {
    SplashScreen.show();
    await CapacitorUpdater.reset();
    SplashScreen.hide();
  }

  static async getVersion() {
    const { bundle, native } = await CapacitorUpdater.current();

    return bundle.version || native;
  }

  private static printBundleInfo(data: BundleInfo, title?: string) {
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    console.log(`||  ${title || 'CURRENT BUNDLE'}: `);
    console.log('||  -         id: ' + data.id);
    console.log('||  -     status: ' + data.status);
    console.log('||  -    version: ' + data.version);
    console.log('||  -   checksum: ' + data.checksum);
    console.log('||  -       data: ' + data.downloaded);
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
  }
}

window.VersionUpdaterService = VersionUpdaterService;
