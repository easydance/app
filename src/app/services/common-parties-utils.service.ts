import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { GetSavedPartyResponseDto, SavedPartyService, UserToClubFollowerService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

const calcWeekend = () => {
  const dayOfWeek = (new Date().getDay() - 1 + 7) % 7;
  const dayToFriday = dayOfWeek - 4;
  let from = DateTime.now().startOf('day');
  if (dayToFriday < 0) from = DateTime.now().startOf('day').plus({ days: Math.abs(dayToFriday) });
  let to = DateTime.fromMillis(from.toMillis()).plus({ days: 2 }).endOf('day');
  return { to, from };
};


@Injectable({
  providedIn: 'root'
})
export class CommonPartiesUtils {

  constructor(
    private authManager: AuthManagerService,
    private navCtrl: NavController,
    private savedPartiesService: SavedPartyService,
    private clubFollowerService: UserToClubFollowerService,
    private translate: TranslateService
  ) { }

  public Filters = () => ({
    Tonight: {
      from: {
        $lte: DateTime.now().endOf('day').toISO()
      },
      to: {
        $gte: DateTime.now().startOf('day').toISO()
      }
    },
    Weekend: {
      from: {
        $lte: calcWeekend().to.toISO()
      },
      to: {
        $gte: calcWeekend().from.toISO()
      }
    },
    InCurrentPosition: () => {
      let center = this.authManager.geolocation?.coords;
      return !center ? {} : {
        address: {
          lat: { $between: [center.latitude - 0.1, center.latitude + 0.1] },
          lng: { $between: [center.longitude - 0.1, center.longitude + 0.1] },
        }
      };
    },
    InCoords: (center: { latitude: number, longitude: number; }) => ({
      address: {
        lat: { $between: [center.latitude - 0.1, center.latitude + 0.1] },
        lng: { $between: [center.longitude - 0.1, center.longitude + 0.1] },
      }
    }),
    InDay: (date: Date) => ({
      from: {
        $lte: DateTime.fromJSDate(date).endOf('day').toISO()
      },
      to: {
        $gte: DateTime.fromJSDate(date).startOf('day').toISO()
      }
    })
  });

  public CommonFilterActions = {
    Today: () => {
      this.navCtrl.navigateForward('/events-list', {
        queryParams: {
          title: this.translate.instant('APP.COMMON_FILTERS.TODAY', { city: this.authManager.currentCity }),
          header: {
            title: this.translate.instant('APP.COMMON_FILTERS.TODAY_TITLE'),
            subtitle: this.translate.instant('APP.COMMON_FILTERS.TODAY_SUBTITLE')
          },
          filters: JSON.stringify({
            ...this.Filters().Tonight,
            ...this.Filters().InCurrentPosition()
          })
        }
      });
    },
    Saved: async () => {
      const savedParties = await lastValueFrom(this.savedPartiesService.findAll(0, 100, JSON.stringify({
        user: { id: this.authManager.user?.id || 0 }
      }), undefined, undefined, 'party'));
      this.navCtrl.navigateForward('/events-list', {
        queryParams: {
          title: this.translate.instant('APP.COMMON_FILTERS.SAVED'),
          header: {
            title: this.translate.instant('APP.COMMON_FILTERS.SAVED_TITLE'),
            subtitle: this.translate.instant('APP.COMMON_FILTERS.SAVED_SUBTITLE')
          },
          filters: JSON.stringify({
            id: { $in: savedParties.data.reduce((a, b) => [...a, ...(b.party?.id ? [b.party.id] : [])], [] as number[]) }
          }),
        }
      });
    },
    Weekend: () => {
      this.navCtrl.navigateForward('/events-list', {
        queryParams: {
          title: this.translate.instant('APP.COMMON_FILTERS.WEEKEND', { city: this.authManager.currentCity }),
          header: {
            title: this.translate.instant('APP.COMMON_FILTERS.WEEKEND_TITLE'),
            subtitle: this.translate.instant('APP.COMMON_FILTERS.WEEKEND_SUBTITLE')
          },
          filters: JSON.stringify({
            ...this.Filters().Weekend,
            ...this.Filters().InCurrentPosition()
          })
        }
      });
    },
    FavoritesClubs: async () => {
      const favoritesClubs = await lastValueFrom(this.clubFollowerService.findAll(0, 100, JSON.stringify({
        user: { id: this.authManager.user?.id || 0 }
      }), undefined, undefined, 'club'));
      this.navCtrl.navigateForward('/events-list', {
        queryParams: {
          title: this.translate.instant('APP.COMMON_FILTERS.PREFERED_CLUBS'),
          header: {
            title: this.translate.instant('APP.COMMON_FILTERS.PREFERED_CLUBS_TITLE'),
            subtitle: this.translate.instant('APP.COMMON_FILTERS.PREFERED_CLUBS_SUBTITLE')
          },
          filters: JSON.stringify({
            ...this.Filters().Tonight,
            club: { id: { $in: favoritesClubs.data.map(fc => fc.club?.id) } }
          })
        }
      });
    },
    ForYou: () => {
      this.navCtrl.navigateForward('/events-list', {
        queryParams: {
          title: this.translate.instant('APP.COMMON_FILTERS.FOR_YOU', { city: this.authManager.currentCity }),
          header: {
            title: this.translate.instant('APP.COMMON_FILTERS.FOR_YOU_TITLE'),
            subtitle: this.translate.instant('APP.COMMON_FILTERS.FOR_YOU_SUBTITLE')
          },
          filters: JSON.stringify({
            ...this.Filters().Tonight,
            ...this.Filters().InCurrentPosition()
          })
        }
      });
    }
  };
}
