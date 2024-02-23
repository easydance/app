import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, lastValueFrom, throwError } from 'rxjs';
import { ClubService } from 'src/app/apis';
import { FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  process: boolean = false;

  testObj: { timeoutId?: any, nClicks: number; } = { nClicks: 0 };

  constructor(
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private readonly fullImmersionService: FullImmersionService,
    private readonly clubsService: ClubService,
    private readonly navCtrl: NavController,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.scan();
    }, 500);
  }

  ionViewWillLeave() {
    document.querySelector('body')?.classList.remove('barcode-scanner-active');

    BarcodeScanner.stopScan()
      .then(() => {
      });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    // const { barcodes } = await BarcodeScanner.scan();
    // this.barcodes.push(...barcodes);
    document.querySelector('body')?.classList.add('barcode-scanner-active');
    // Add the `barcodeScanned` listener
    await BarcodeScanner.addListener(
      'barcodeScanned',
      async result => {
        if (!this.process) {
          this.process = true;
          try {
            const { clubId } = JSON.parse(result.barcode.displayValue);
            if (clubId) {
              this.clubsService.findOne(clubId, undefined, 'address')
                .pipe(catchError(
                  er => throwError(() => er)
                )).subscribe(clubResponse => {
                  this.fullImmersionService.setSelectedClub(clubResponse.data);
                });
              try {
                const currentPartyResponse = await this.clubsService.getCurrentParty(clubId).toPromise();
                this.fullImmersionService.setCurrentParty(currentPartyResponse!);

                this.navCtrl.navigateForward('full-immersion/select-table');
                this.process = false;
              } catch (error: any) {
                const toast = await this.toastCtrl.create({
                  message: this.translateService.instant(`API_RESPONSE.ERRORS.${error.error.errors.i18n}`),
                  duration: 2000
                });
                toast.present();
                setTimeout(() => {
                  this.process = false;
                }, 3000);
              }
            }
          } catch (error) {
            const toast = await this.toastCtrl.create({ message: "QR Code non valido!", duration: 2000 });
            toast.present();
            setTimeout(() => {
              this.process = false;
            }, 3000);
          }
        }
      },
    );
    BarcodeScanner.startScan({ lensFacing: LensFacing.Back })
      .then(() => {
      }).catch(error => {
        console.error(error);
        document.querySelector('body')?.classList.remove('barcode-scanner-active');
      });
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async test(e: Event) {
    if (environment.production) return;
    if (!this.testObj.timeoutId) {
      this.testObj.timeoutId = setTimeout(() => {
        this.testObj.nClicks = 0;
        this.testObj.timeoutId = undefined;
        console.log("[TEST] Reset counter");
      }, 5000);
    }
    this.testObj.nClicks += 1;
    console.log("[TEST] N° click:", this.testObj.nClicks);

    if (this.testObj.nClicks == 5) {
      let clubId = 1;
      debugger;
      console.log("[TEST] Start test");
      this.fullImmersionService.setSelectedClub((await lastValueFrom(this.clubsService.findOne(clubId, undefined, 'address'))).data);
      this.navCtrl.navigateForward('full-immersion/select-table');
    }

  }
}
