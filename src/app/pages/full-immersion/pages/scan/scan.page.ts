import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ClubService } from 'src/app/apis';
import { FullImmersionService } from 'src/app/pages/full-immersion/services/full-immersion.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  process: boolean = false;

  constructor(
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private readonly fullImmersionService: FullImmersionService,
    private readonly clubsService: ClubService,
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  ionViewDidEnter() {
    this.scan();
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
              this.fullImmersionService.selectedClub = (await lastValueFrom(this.clubsService.findOne(clubId, undefined, 'address'))).data;
              this.navCtrl.navigateForward('full-immersion/select-table');
              this.process = false;
            }
          } catch (error) {
            const toast = await this.toastCtrl.create({ message: "QR Code non valido!" });
            toast.present();
            this.process = false;
          }
        }
      },
    );
    BarcodeScanner.startScan({ lensFacing: LensFacing.Back })
      .then(() => {
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
}
