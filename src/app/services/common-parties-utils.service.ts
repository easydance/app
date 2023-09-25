import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { GetSavedPartyResponseDto, SavedPartyService, UserToClubFollowerService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

const dayOfWeek = (new Date().getDay() - 1 + 7) % 7;
const dayToFriday = dayOfWeek - 4;
let from = DateTime.now().startOf('day');
if (dayToFriday < 0) from = DateTime.now().startOf('day').plus({ days: Math.abs(dayToFriday) });
let to = DateTime.fromMillis(from.toMillis()).plus({ days: 2 }).endOf('day');


@Injectable({
  providedIn: 'root'
})
export class CommonPartiesUtils {

  constructor(
    private authManager: AuthManagerService,
    private navCtrl: NavController,
    private savedPartiesService: SavedPartyService,
    private clubFollowerService: UserToClubFollowerService
  ) { }

  public Filters = {
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
        $lte: from.toISO()
      },
      to: {
        $gte: to.toISO()
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
  };

  public CommonFilterActions = {
    Today: () => {
      this.navCtrl.navigateForward('/events-list', {
        queryParams: {
          title: 'Eventi di oggi a ' + this.authManager.currentCity,
          header: {
            title: 'Oggi',
            subtitle: 'Eventi'
          },
          filters: JSON.stringify({
            ...this.Filters.Tonight,
            ...this.Filters.InCurrentPosition()
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
          title: 'Eventi salvati',
          header: {
            title: 'Salvati',
            subtitle: 'Eventi'
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
          title: 'Eventi questo weekend a ' + this.authManager.currentCity,
          header: {
            title: 'ven - dom',
            subtitle: 'Eventi'
          },
          filters: JSON.stringify({
            ...this.Filters.Weekend,
            ...this.Filters.InCurrentPosition()
          })
        }
      });
    },
    FavoritesClubs: async () => {
      const favoritesClubs = await lastValueFrom(this.clubFollowerService.findAll(0, 100, JSON.stringify({
        user: { id: this.authManager.user?.id || 0 }
      }), undefined, undefined, 'party'));
      this.navCtrl.navigateForward('/events-list', {
        queryParams: {
          title: 'Eventi nei tuoi locali preferiti',
          header: {
            title: 'Locali preferiti',
            subtitle: 'Eventi'
          },
          filters: JSON.stringify({
            ...this.Filters.Tonight,
            $in: favoritesClubs.data.map(fc => fc.club?.id)
          })
        }
      });
    },
    ForYou: () => { }
  };
}
