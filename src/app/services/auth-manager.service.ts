import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AuthService, LoginUserDataDto } from 'src/app/apis';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  private token?: string = localStorage.getItem('token') || undefined;
  public geolocation?: GeolocationPosition;

  private userStore = new BehaviorSubject<LoginUserDataDto | undefined>(undefined);
  public user$ = this.userStore.asObservable();
  public get user() {
    return this.userStore.getValue();
  }

  private geocodingStore = new BehaviorSubject<google.maps.GeocoderResult | undefined>(undefined);
  public geocoding$ = this.geocodingStore.asObservable();
  public get geocoding() {
    return this.geocodingStore.getValue();
  }

  constructor(private authService: AuthService) { }

  isAuthenticated() {
    return !!this.getToken();
  }

  login(username: string, password: string) {
    return this.authService.login({ password, username })
      .pipe(
        map(res => res.data),
        tap(
          data => {
            const { user, accessToken } = data;
            this.setToken(accessToken);
            this.setUser(user);
          }
        )
      );
  }

  me() {
    return this.authService.me().pipe(
      map(res => res.data),
      tap(data => {
        this.setUser(data);
      })
    );
  }

  getToken() {
    return this.token || localStorage.getItem('token') || undefined;
  }

  getCurrentPosition(): Promise<{ lat: number, lng: number; }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((res) => {
        this.geolocation = res;
        this.getReverseGeocoding(res.coords.latitude, res.coords.longitude);
        resolve({ lat: res.coords.latitude, lng: res.coords.longitude });
      }, err => reject(err));
    });
  }

  getReverseGeocoding(lat: number, lng: number): Promise<google.maps.GeocoderResult> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (res, status) => {
        if (status == google.maps.GeocoderStatus.OK && res) {
          this.geocodingStore.next(res[0]);
          return resolve(res[0]);
        }
        reject({ status: !res ? 'NO_RESULTS' : status, result: res });
      });
    });
  }

  private setToken(token: string | undefined) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
      return;
    }
    localStorage.removeItem('token');
  }

  private setUser(user: any | undefined) {
    this.userStore.next(user);
  }

}
