import { Injectable } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { BundleInfo, CapacitorUpdater } from '@capgo/capacitor-updater';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HotfixUpdaterService {

  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController
  ) { }

  async silentInstall(confirm: boolean) {
    await CapacitorUpdater.notifyAppReady();
    const { bundle: currentBundle } = await CapacitorUpdater.current();
    this.printBundleInfo(currentBundle, 'CURRENT BUNDLE');
    if (currentBundle.version != window.EASY_KEYS?.['LAST_HOTFIX_VERSION']) {
      CapacitorUpdater.download({
        url: window.EASY_KEYS?.['LAST_HOTFIX_URL'] || '',
        version: window.EASY_KEYS?.['LAST_HOTFIX_VERSION'] || '0.0.0',

      }).then(async data => {
        if (data) {
          this.printBundleInfo(data, 'CURRENT HOTFIX');
          const toast = await this.toastCtrl.create({
            message: 'Una nuova versione dell\'app è disponibile!',
            buttons: [
              {
                text: 'aggiorna',
                handler: async () => {
                  await this.setVersion(data);
                }
              }
            ]
          });
          toast.present();
        }
      });



    }
  }

  async checkUpdates() {
    await CapacitorUpdater.notifyAppReady();
    const { bundle: currentBundle } = await CapacitorUpdater.current();
    this.printBundleInfo(currentBundle, 'CURRENT BUNDLE');

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
    this.printBundleInfo(data, 'LOADED BUNDLE');
    SplashScreen.show({ fadeInDuration: 500 });
    try {
      await CapacitorUpdater.set({ id: data.id });
    } catch (err) {
      console.log(err);
      SplashScreen.hide({ fadeOutDuration: 500 }); // in case the set fail, otherwise the new app will have to hide it
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
    this.printBundleInfo(data, 'CURRENT HOTFIX');

    if (data) {
      SplashScreen.show({ fadeOutDuration: 500 });
      await this.setVersion(data);
    }
  }

  private printBundleInfo(data: BundleInfo, title?: string) {
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
