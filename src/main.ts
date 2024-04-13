import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { VersionUpdaterService } from 'src/app/services/version-updater.service';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));


declare global {
  interface Window {
    EASY_KEYS: Record<string, any>;
    VersionUpdaterService: VersionUpdaterService;
  }
}
