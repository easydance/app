import { Injectable } from '@angular/core';
import { App, AppInfo } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { BundleInfo, CapacitorUpdater } from '@capgo/capacitor-updater';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { InstanceLogService } from 'src/app/services/instance-log.service';

@Injectable({
  providedIn: 'root'
})
export class HotfixUpdaterService {

  currentVersion?: BundleInfo;

  constructor(
    private readonly logger: InstanceLogService,
    private readonly toastCtrl: ToastController,
    private readonly translate: TranslateService
  ) {
    // App.addListener('appStateChange', async (state) => {
    //   if (state.isActive) {
    //     // Ensure download occurs while the app is active, or download may fail
    //     CapacitorUpdater.download({
    //       url: window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
    //       version: window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',
    //     }).then(version => {
    //       this.currentVersion = version;
    //     });
    //   }

    //   if (!state.isActive && this.currentVersion) {
    //     this.setVersion(this.currentVersion);
    //   }
    // });
  }

  private isToUpdate(currentVersion: string, hotfixVersion: string) {
    const currentNumericVersion = parseInt(currentVersion.split('.').map(n => n.padStart(3, '0')).join('').padEnd(9, '0'));
    const hotfixNumericVersion = parseInt(hotfixVersion.split('.').map(n => n.padStart(3, '0')).join('').padEnd(9, '0'));
    return currentNumericVersion < hotfixNumericVersion;
  }

  async askInstall(confirm: boolean) {
    await CapacitorUpdater.notifyAppReady();
    const appInfo = await App.getInfo();
    const { bundle: currentBundle } = await CapacitorUpdater.current();
    currentBundle.version = currentBundle.version == 'builtin' ? appInfo.version : currentBundle.version;
    this.printBundleInfo(currentBundle, appInfo, 'CURRENT BUNDLE');
    if (this.isToUpdate(currentBundle.version, window.EASY_KEYS?.['LAST_HOTFIX_VERSION'])) {
      this.logger.info(`Downloading new hotfix`, 'hotfix-updater.service.ts', {
        url: window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
        version: window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',
      });
      CapacitorUpdater.download({
        url: window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
        version: window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',
      }).then(async data => {
        if (data) {
          this.printBundleInfo(data, appInfo, 'CURRENT HOTFIX');
          const toast = await this.toastCtrl.create({
            message: this.translate.instant('APP.HOTFIX.NEW_VERSION'),
            buttons: [
              {
                text: this.translate.instant('APP.HOTFIX.UPDATE'),
                handler: async () => {
                  this.logger.info(`Set new hotfix version`, 'hotfix-updater.service.ts', {
                    data
                  });
                  await this.setVersion(data);
                }
              },
            ]
          });
          toast.present();
        }
      });
    }
    SplashScreen.hide({ fadeOutDuration: 500 });
  }

  async checkUpdates() {
    await CapacitorUpdater.notifyAppReady();
    const { bundle: currentBundle } = await CapacitorUpdater.current();
    const appInfo = await App.getInfo();
    await this.printBundleInfo(currentBundle, appInfo, 'CURRENT BUNDLE');

    if (currentBundle.version != window.EASY_KEYS?.['LAST_HOTFIX_VERSION']) {
      this.downloadAndInstall();
    }
  }

  async removeAllBundles(excludeVersions: string[] = []) {
    const result = await CapacitorUpdater.list();
    for (let bundle of result.bundles.filter(b => !excludeVersions.includes(b.version))) {
      await CapacitorUpdater.delete(bundle);
    }
  }

  async setVersion(data: BundleInfo) {
    const appInfo = await App.getInfo();
    this.printBundleInfo(data, appInfo, 'LOADED BUNDLE');
    this.logger.info(`Show splashscreen in setVersion`, 'hotfix-updater.service.ts', { data });
    SplashScreen.show({ fadeInDuration: 500 });
    try {
      this.logger.info(`Start setVersion`, 'hotfix-updater.service.ts', { data });
      await CapacitorUpdater.set({ id: data.id });
      this.logger.info(`End setVersion`, 'hotfix-updater.service.ts', { data });
      SplashScreen.hide({ fadeOutDuration: 500 });
      this.logger.info(`Hide splashscreen in setVersion`, 'hotfix-updater.service.ts', { data });
    } catch (err: any) {
      console.log(err);
      SplashScreen.hide({ fadeOutDuration: 500 }); // in case the set fail, otherwise the new app will have to hide it
      this.logger.error(`Hide splashscreen in setVersion`, 'hotfix-updater.service.ts', {
        err,
        message: err.message,
        stack: err.stack
      });
    }
  }

  async reset() {
    SplashScreen.show({ fadeInDuration: 500 });
    await CapacitorUpdater.reset();
    SplashScreen.hide({ fadeOutDuration: 500 });
  }

  async getVersion() {
    const { bundle, native } = await CapacitorUpdater.current();

    return bundle.version || native;
  }

  private async downloadAndInstall(url?: string, version?: string) {
    let data: BundleInfo | null = await CapacitorUpdater.download({
      url: url || window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
      version: version || window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',

    });
    const appInfo = await App.getInfo();
    this.printBundleInfo(data, appInfo, 'CURRENT HOTFIX');

    if (data) {
      SplashScreen.show({ fadeOutDuration: 500 });
      await this.setVersion(data);
    }
  }

  private async printBundleInfo(data: BundleInfo, appInfo: AppInfo, title?: string) {
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    console.log(`||  ${title || 'CURRENT BUNDLE'}: `);
    console.log('||  -             id: ' + data.id);
    console.log('||  -         status: ' + data.status);
    console.log('||  -        version: ' + data.version);
    console.log('||  -       checksum: ' + data.checksum);
    console.log('||  -           data: ' + data.downloaded);
    console.log('|| ');
    console.log('||  NATIVE INFO:');
    console.log('||  -             ID: ' + appInfo.id);
    console.log('||  -        version: ' + appInfo.version + ' (' + appInfo.build + ')');
    console.log('||  -           name: ' + appInfo.name);
    console.log('|| ');
    console.log('||  - Is to Update? ' + `${this.isToUpdate(data.version, window.EASY_KEYS?.['LAST_HOTFIX_VERSION'])} (${data.version} < ${window.EASY_KEYS?.['LAST_HOTFIX_VERSION']})`);
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    this.logger.info(` ${title || 'CURRENT BUNDLE'}`, 'hotfix-updater.service.ts', { bundle: data });
  }
}
