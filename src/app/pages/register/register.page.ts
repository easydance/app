import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors } from '@angular/forms';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { catchError, throwError } from 'rxjs';
import { AuthService, GetTagResponseDto, SignUpDto, TagService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { IComparator, IValidatorConfig, getFormValidationErrors } from 'src/app/validators/form-conditions.validator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

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
      title: 'Registrati',
      index: 0
    },
    {
      title: 'Informazioni',
      index: 1
    },
    {
      title: 'Foto profilo',
      index: 2
    },
    {
      title: 'Interessi',
      index: 3
    },
  ];
  public currentStep = this.formSteps[0];
  public showPassword: boolean = false;
  public tags: GetTagResponseDto[] = [];
  public user: SignUpDto = {
  };

  public validators0: IValidatorConfig[] = [
    {
      inputs: ['email', 'confirmEmail'],
      comparator: IComparator.EQUALS,
      key: 'confirmEmail',
      messageError: "Le email non coincidono."
    },
    {
      inputs: ['password', 'confirmPassword'],
      comparator: IComparator.EQUALS,
      key: 'confirmPassword',
      messageError: "Le password non coincidono."
    },
    {
      inputs: ['email'],
      comparator: IComparator.VALID_EMAIL,
      key: 'email',
      messageError: "Email non valida"
    },
    {
      inputs: ['confirmEmail'],
      comparator: IComparator.VALID_EMAIL,
      key: 'confirmEmail',
      messageError: "Email non valida"
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
  public profileValidator: IValidatorConfig[] = [{
    comparator: (form) => !!this.user.profile,
    keyError: 'required',
    key: 'profile',
    messageError: 'Foto profilo obbligatoria'
  }];

  constructor(
    private tagsService: TagService,
    private authService: AuthManagerService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tagsService.findAll().subscribe(res => {
      this.tags = res.data;
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  goNext(wizard: HTMLElement) {
    if (this.currentStep.index + 1 == this.formSteps.length) {
      this.authService.signUp(this.user)
        .pipe(
          catchError(async err => {
            const toast = await this.toastCtrl.create({ message: 'Non è stato possibile completare la registrazione' });
            toast.present();
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

  goPrev(wizard: HTMLElement) {
    if (this.currentStep.index - 1 < 0) {
      return;
    }
    const swiper = (wizard as any).swiper;
    swiper.slidePrev();
    this.currentStep = this.formSteps[this.currentStep.index - 1];
  }

  toggleInterest(tag: GetTagResponseDto) {
    if (!this.user.tags) {
      this.user.tags = [];
    }
    if (this.user.tags.some(t => t == tag.name)) {
      this.user.tags = this.user.tags.filter(t => t != tag.name);
    } else {
      this.user.tags.push(tag.name);
    }
  }

  isSelectedTag(tag: GetTagResponseDto) {
    return !!this.user.tags?.some(t => t == tag.name);
  }

  openDatetime() {
    document.querySelector('#datetime-button')?.shadowRoot?.querySelector('button')?.click();
  }
  changeBirth(data: any) {
    this.user.birth = DateTime.fromISO(data.detail.value).toFormat('dd/LL/yyyy');
  }

  preview($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (!target?.files) {
      if (target) target.value = '';
      return;
    }
    const file = target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('RESULT', reader.result);
      this.user.profile = reader.result as string;
      target.value = '';
    };
    reader.readAsDataURL(file);
  }

  getFormValidationErrors() {
    if (this.currentForm) {
      const errors = getFormValidationErrors(this.currentForm);
      console.log(errors);
      return errors;
    }
    return {};
  }
}
