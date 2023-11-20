import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { AuthService, SignUpDto } from 'src/app/apis';
import { IComparator, IValidatorConfig, getFormValidationErrors } from 'src/app/validators/form-conditions.validator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  @ViewChild('hurraModal') hurraModal?: IonModal;

  @ViewChild("formStep0") formStep0?: NgForm;
  @ViewChild("formStep1") formStep1?: NgForm;
  @ViewChild("formStep2") formStep2?: NgForm;
  @ViewChild("formStep3") formStep3?: NgForm;

  get currentForm(): NgForm | undefined {
    return this['formStep' + this.currentStep.index as keyof typeof this] as NgForm | undefined;
  }

  public formSteps = [
    {
      title: 'Recupera password',
      nextLabel: 'Invia',
      index: 0
    },
    {
      title: 'Reimposta password',
      nextLabel: 'Prosegui',
      index: 1
    },
  ];
  public currentStep = this.formSteps[0];
  public showPassword: boolean = false;
  public user: SignUpDto = {
  };

  public validators0: IValidatorConfig[] = [
    {
      inputs: ['email'],
      comparator: IComparator.VALID_EMAIL,
      key: 'email',
      messageError: "Email non valida"
    },
  ];

  public validators1: IValidatorConfig[] = [
    {
      inputs: ['password', 'confirmPassword'],
      comparator: IComparator.EQUALS,
      key: 'confirmPassword',
      messageError: "Le password non coincidono."
    },
    {
      comparator: (form) => PASSWORD_REGEX.test(form.get('password')?.value),
      key: 'password',
      keyError: 'invalid-password-format',
      messageError: "Password non valida"
    },
    {
      comparator: (form) => PASSWORD_REGEX.test(form.get('confirmPassword')?.value),
      key: 'confirmPassword',
      keyError: 'invalid-password-format',
      messageError: "Password non valida"
    }
  ];

  public otp: string = '';

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }


  goPrev(wizard: HTMLElement) {
    if (this.currentStep.index - 1 < 0) {
      return;
    }
    const swiper = (wizard as any).swiper;
    swiper.slidePrev();
    this.currentStep = this.formSteps[this.currentStep.index - 1];
  }

  getFormValidationErrors() {
    if (this.currentForm) {
      const errors = getFormValidationErrors(this.currentForm);
      return errors;
    }
    return {};
  }


  goBack() {
    this.navCtrl.back();
  }

  async goNext(wizard: HTMLElement) {
    if (this.currentStep.index === 0) {
      await lastValueFrom(this.authService.requestRecovery({ user: this.user.email || 'no-email' }));
    }
    if (this.currentStep.index + 1 == this.formSteps.length) {
      if (!(this.otp && this.user.password && this.user.confirmPassword)) return;
      this.authService.updatePassword({ token: this.otp, password: this.user.password, confirmPassword: this.user.confirmPassword })
        .pipe(
          catchError(err => {
            this.toastCtrl.create({ message: 'Non è stato possibile completare cambiare la password', duration: 3000 }).then(f => f.present());
            return throwError(() => err);
          })
        )
        .subscribe(res => {
          this.hurraModal?.present();
        });
    }
    if (this.currentStep.index + 1 > this.formSteps.length - 1 || !this.currentForm || this.currentForm.invalid) {
      return;
    }
    const swiper = (wizard as any).swiper;
    swiper.slideNext();
    this.currentStep = this.formSteps[this.currentStep.index + 1];
  }
}
