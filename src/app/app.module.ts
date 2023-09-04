import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FlatpickrModule } from 'angularx-flatpickr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiModule, Configuration, ConfigurationParameters } from 'src/app/apis';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UiModule } from 'src/app/components/ui.module';
import { TokenInterceptor } from 'src/app/services/interceptors/token.interceptor';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: 'https://easydance-dev.oddacoding.net/api',
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    UiModule,
    FlatpickrModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
