import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiModule, BASE_PATH, Configuration, ConfigurationParameters } from 'src/app/apis';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UiModule } from 'src/app/components/ui.module';
import { TokenInterceptor } from 'src/app/services/interceptors/token.interceptor';
import { environment } from 'src/environments/environment';
import "@codetrix-studio/capacitor-google-auth";

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: `${environment.BASE_API}/api`,
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
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: BASE_PATH, useValue: environment.BASE_API },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
