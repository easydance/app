import { Injectable } from '@angular/core';

import { BundleInfo, CapacitorUpdater } from '@capgo/capacitor-updater';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

export class VersionUpdaterService {

  static lastWorkflow: any[] = [];
  static CapacitorUpdater = CapacitorUpdater;

  constructor() { }

  static async init() {
    const workflow: any[] = [];
    const result = await CapacitorUpdater.notifyAppReady();
    workflow.push({ method: 'CapacitorUpdater.notifyAppReady()', value: result });

    // await this.removeAllBundles();
    let data: BundleInfo | null = await CapacitorUpdater.download({
      url: window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
      version: window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',

    });
    workflow.push({
      method: 'CapacitorUpdater.download(...)',
      params: [{
        url: window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
        version: window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',

      }],
      value: data
    });

    this.printBundleInfo(data, 'CURRENT HOTFIX');
    const { bundle: currentBundle } = await CapacitorUpdater.current();
    this.printBundleInfo(currentBundle, 'CURRENT BUNDLE');
    workflow.push({
      method: 'CapacitorUpdater.current()',
      value: data
    });

    workflow.push({
      method: 'result.bundle.version != currentBundle.version && data',
      value: result.bundle.version != currentBundle.version && data
    });
    // Do the switch when user leave app
    if (result.bundle.version != currentBundle.version && data) {
      SplashScreen.show({ fadeOutDuration: 500 });
      try {
        await CapacitorUpdater.set({ id: data.id });
        workflow.push({
          method: 'CapacitorUpdater.set(...)',
          params: { id: data.id },
          value: undefined
        });
      } catch (err) {
        console.log(err);
        SplashScreen.hide({ fadeOutDuration: 500 }); // in case the set fail, otherwise the new app will have to hide it
        workflow.push({
          method: 'CapacitorUpdater.set error',
          value: err
        });
      }
      VersionUpdaterService.lastWorkflow = workflow;
    }

    // const result = await CapacitorUpdater.notifyAppReady();
    // let data: BundleInfo | null = null;
    // App.addListener('appStateChange', async (state) => {
    //   if (state.isActive) {
    //     console.log('App is active');
    //     // Do the download during user active app time to prevent failed download
    //     data = await CapacitorUpdater.download({
    //       url: window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
    //       version: window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',
    //     });
    //     this.printBundleInfo(data);
    //   }
    //   if (!state.isActive && data) {
    //     console.log('App is background');
    //     // Do the switch when user leave app
    //     this.printBundleInfo(data, 'LOADED BUNDLE');
    //     SplashScreen.show();
    //     try {
    //       await CapacitorUpdater.set({ id: data.id });
    //     } catch (err) {
    //       console.log(err);
    //       SplashScreen.hide(); // in case the set fail, otherwise the new app will have to hide it
    //     }
    //   }
    // });
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
    } catch (err) {
      console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|| ', err);
      console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

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
    const buildIn = await CapacitorUpdater.getBuiltinVersion();
    const hotFix = await CapacitorUpdater.getLatest();
    return hotFix.version || buildIn?.version;
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
