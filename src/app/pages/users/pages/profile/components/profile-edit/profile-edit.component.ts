import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { GetTagResponseDto, LoginUserDataDto, TagService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { getFileReader } from 'src/app/utils/filereader.utils';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfileEditComponent implements OnInit, OnChanges {

  @Input() public user?: LoginUserDataDto;
  @Output() saved: EventEmitter<void> = new EventEmitter();

  public editedUser?: LoginUserDataDto & { photo?: string; };
  public tagsSearch: string = '';
  public descriptionWordLimit: number = 500;
  private allTags: GetTagResponseDto[] = [];
  public searchedTags: GetTagResponseDto[] = [];
  public get socialsKeys() {
    return ['facebook', 'instagram', 'twitter'].filter(l => !Object.keys(this.editedUser?.socials || {}).includes(l));
  };
  public currentSocialEditing?: string;

  constructor(
    private ngZone: NgZone,
    private tagsService: TagService,
    private authManager: AuthManagerService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.tagsService.findAll(0, 10000, undefined, '{"name": 1}').subscribe(res => {
      this.allTags = res.data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'].currentValue?.id != changes['user'].previousValue?.id) {
      this.editedUser = changes['user'].currentValue;
    }
  }

  searchTag() {
    if (!this.tagsSearch) {
      this.searchedTags = [];
      return;
    }
    this.searchedTags = this.allTags.filter(t => t.name.toLowerCase().includes(this.tagsSearch.toLowerCase())); //.slice(0, 5);
  }

  selectTag(tag: GetTagResponseDto) {
    if (this.editedUser) {
      if (!this.editedUser.tags.includes(tag.name)) {
        this.editedUser.tags.push(tag.name);
      }
    }
    this.tagsSearch = '';
    this.searchedTags = [];
  }

  deselectTag(tag: string) {
    if (this.editedUser) {
      this.editedUser.tags = this.editedUser.tags.filter(t => t != tag);
    }
  }

  preview($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (!target?.files) {
      if (target) target.value = '';
      return;
    }
    const file = target.files[0];
    const reader = getFileReader();
    reader.onloadend = () => {
      console.log('RESULT', reader.result);
      if (this.editedUser) this.editedUser.photo = reader.result as string;
      target.value = '';
      this.ngZone.run(() => { });
    };
    reader.readAsDataURL(file);
  }

  async save() {
    if (!this.editedUser) return;
    const loading = await this.loadingCtrl.create({ message: 'Salvataggio...' });
    loading.present();
    const {
      description,
      firstName,
      lastName,
      birthDate,
      socials,
      tags
    } = this.editedUser;

    this.authManager.updateMe({
      description: description!,
      firstName: firstName!,
      lastName: lastName!,
      profile: this.editedUser.photo!,
      socials: socials as any,
      tags
    }).pipe(
      catchError(err => {
        this.toastCtrl.create({ message: 'Non è stato possibile salvare le modifiche', duration: 3000 })
          .then(toast => {
            toast.present();
            loading.dismiss();
          });
        return throwError(() => err);
      })
    ).subscribe(res => {
      this.toastCtrl.create({ message: 'Profilo salvato!', duration: 3000 })
        .then(toast => {
          toast.present();
          loading.dismiss();
        });
      this.saved.emit();
      loading.dismiss();
    });
  }

  addSocial(logo: string) {
    if (this.editedUser) {
      if (!this.editedUser.socials) {
        this.editedUser.socials = {};
      }
      this.editedUser.socials[logo] = { username: '' };
      this.currentSocialEditing = logo;
    }
  }

  toggleSocialEdit(key: string) {
    this.currentSocialEditing = this.currentSocialEditing == key ? undefined : key;
  }

  setSocialValue(logo: string, key: string, $event: any) {
    if (this.editedUser?.socials) {
      if (!this.editedUser.socials[logo]) {
        this.editedUser.socials[logo] = {};
      }
      this.editedUser.socials[logo] = {
        ...this.editedUser.socials[logo],
        ...{ [key]: $event.target.value }
      };
    }
  }

  deleteSocial(key: string) {
    if (this.editedUser?.socials) {
      delete this.editedUser.socials[key];
    }
  }
}
