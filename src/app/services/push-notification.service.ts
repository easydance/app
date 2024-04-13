import { EventEmitter, Injectable } from '@angular/core';
import {
  PushNotifications,
  Token,
  RegistrationError,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { NavController, Platform } from '@ionic/angular';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { PushNotificationService as ServerPushNotificationService } from "../apis/api/pushNotification.service";
import { Payload as PushNotificationPayload } from 'src/app/apis';
import { Observable, Subject, debounceTime } from 'rxjs';


const Debounce = <T extends (Observable<any> | undefined)>(time: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method: (...args: any[]) => T = descriptor.value;
  const methodSubject: Subject<void> = new Subject();
  const method$ = methodSubject.asObservable().pipe(debounceTime(time));

  descriptor.value = function (...args: any[]) {
    const result = method.apply(this, args);
    if (result == undefined) {
      methodSubject.next(undefined);
    }
    result?.subscribe(res => {
      methodSubject.next(res);
    });
    return method$;
  };

  return descriptor;
};

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  registrationToken?: string;
  payload: PushNotificationPayload = { coords: null };

  public registration: EventEmitter<Token> = new EventEmitter();
  public registrationError: EventEmitter<RegistrationError> = new EventEmitter();
  public pushNotificationReceived: EventEmitter<PushNotificationSchema> = new EventEmitter();
  public pushNotificationActionPerformed: EventEmitter<ActionPerformed> = new EventEmitter();

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private authManager: AuthManagerService,
    private pushNotification: ServerPushNotificationService
  ) {

    this.authManager.geocoding$.subscribe(geo => {
      if (geo) {
        this.payload.coords = {
          lat: geo.geometry.location.lat(),
          lng: geo.geometry.location.lng()
        };
        this.updatePayload()?.subscribe(res => {
          console.log("UPDATE paylod notification result:", res);
        });
      }
    });
    this.authManager.user$.subscribe(user => {
      if (user) {
        this.updatePayload()?.subscribe(res => {
          console.log("UPDATE paylod notification result:", res);
        });
      }
    });

  }

  initialize() {
    return this.registerNotifications()
      .then(res => {
        this.addListeners();
      });
  }

  async addListeners() {
    await PushNotifications.addListener('registration', token => {
      if (!localStorage.getItem('enableNotification') || localStorage.getItem('enableNotification') == 'true') {
        console.info('Registration token: ', token.value);
        this.registrationToken = token.value;
        this.updatePayload()?.subscribe(res => {
          console.log("REGISTRATION TOKEN UPDATE: ", res);
        });
        this.registration.emit(token);
        return;
      }
      console.info('Delete all registrations with token: ', token.value);
      this.pushNotification.findAll(0, 100, JSON.stringify({ token: token.value })).subscribe(res => {
        const ids = res.data.map(r => r.id).filter(r => (r ?? 0) > 0) as number[];
        this.pushNotification.deleteMany(ids);
      });
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
      this.registrationError.emit(err);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
      this.pushNotificationReceived.emit(notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
      this.pushNotificationActionPerformed.emit(notification);
      this.handleNotificationType(notification);
    });
  };

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  };

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
    return notificationList;
  };

  handleNotificationType(notification: ActionPerformed) {
    this.platform.ready().then(res => {

      const { data } = notification.notification;
      if (data?.type == 'go_to_event' && data.event_id) {
        console.log(`====================================\n\n GOTO EVENT NOTIFICATION: event id ${data.event_id} \n\n ${JSON.stringify(data, undefined, 2)} \n\n====================================`);
        this.navCtrl.navigateForward('/event-detail/' + data.event_id);
        return;
      }

      if (data?.type == 'go_to_club' && data.club_id) {
        console.log(`====================================\n\n GOTO CLUB NOTIFICATION: event id ${data.club_id} \n\n ${JSON.stringify(data, undefined, 2)} \n\n====================================`);
        this.navCtrl.navigateForward('/club-detail/' + data.club_id);
        return;
      }

      if (data?.type == 'go_to_stories' && data.user_id) {
        console.log(`====================================\n\n GOTO STORIES NOTIFICATION: user id ${data.user_id} \n\n ${JSON.stringify(data, undefined, 2)} \n\n====================================`);
        this.navCtrl.navigateForward('/home', {
          queryParams: {
            openStories: data.user_id
          }
        });
        return;
      }

      if (data?.type == 'go_to_story' && data.story_id) {
        console.log(`====================================\n\n GOTO STORY NOTIFICATION: user id ${data.story_id} \n\n ${JSON.stringify(data, undefined, 2)} \n\n====================================`);
        this.navCtrl.navigateForward('/home', {
          queryParams: {
            openStories: data.story_id
          }
        });
        return;
      }
    });
  }


  @Debounce(2000)
  updatePayload() {
    if (this.registrationToken) {
      return this.pushNotification.set({
        token: this.registrationToken,
        payload: this.payload
      });
    }
    return;
  }

}
