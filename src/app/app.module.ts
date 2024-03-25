import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiModule, BASE_PATH, Configuration, ConfigurationParameters } from 'src/app/apis';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { UiModule } from 'src/app/components/ui.module';
import { TokenInterceptor } from 'src/app/services/interceptors/token.interceptor';
import { environment } from 'src/environments/environment';
import "@codetrix-studio/capacitor-google-auth";
import { I18nHandlerModule } from 'src/app/i18n/custom-translator.loader';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: `${environment.BASE_API}`,
  };
  return new Configuration(params);
}

const init = (http: HttpClient) => () => {
  function loadGoogleMapsScript(key: string) {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.setAttribute('defer', '');
    googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?libraries=places&key=" + key;
    document.head.appendChild(googleMapsScript);
  }

  return new Promise(async (resolve, reject) => {
    http.get('https://api.easydance.app/settings.json').subscribe((res: { [key: string]: any; }) => {
      (<any>window).EASY_KEYS = {};
      Object.assign((<any>window).EASY_KEYS, res);
      loadGoogleMapsScript(res['GOOGLE_MAPS_KEY']);
      resolve(true);
    });
  });

};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    UiModule,
    I18nHandlerModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: BASE_PATH, useValue: environment.BASE_API },
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [HttpClient],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
