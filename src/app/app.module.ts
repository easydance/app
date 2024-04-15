import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
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
import { SplashScreen } from '@capacitor/splash-screen';
import { VersionUpdaterService } from 'src/app/services/version-updater.service';
import { InstanceLogService } from 'src/app/services/instance-log.service';
import { GlobalErrorHandler } from 'src/app/services/global-error-handler.service';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: `${environment.BASE_API}`,
  };
  return new Configuration(params);
}

const globalErrorInterceptor = () => {

};

const init = (http: HttpClient, logger: InstanceLogService) => () => {
  logger.info('Init app', 'app-module.ts', {});
  SplashScreen.show();

  function loadGoogleMapsScript(key: string) {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.setAttribute('defer', '');
    googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?libraries=places&key=" + key;
    document.head.appendChild(googleMapsScript);
  }

  return new Promise(async (resolve, reject) => {
    const url = 'https://api.easydance.app/settings.json?v=' + Date.now();
    logger.info('Get settings from server', 'app-module.ts', { url });

    http.get(url)
      .subscribe(async (res: { [key: string]: any; }) => {
        logger.info('Assign settings to EASY_KEYS', 'app-module.ts', { EASY_KEYS: res });
        window.EASY_KEYS = {};
        Object.assign(window.EASY_KEYS, res);
        try {
          await VersionUpdaterService.init();
          logger.info('Version updater initialize', 'app-module.ts', {});
        } catch (err) {
          logger.error('Version updater initialize', 'app-module.ts', { err });
          console.error(err);
        }
        loadGoogleMapsScript(res['GOOGLE_MAPS_KEY']);
        SplashScreen.hide();
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
      // processes all errors
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
      deps: [InstanceLogService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [HttpClient, InstanceLogService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
