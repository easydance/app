import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, of } from 'rxjs';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Injectable({
  providedIn: 'root'
})
export class InstanceLogService {

  private instance: string = `${Math.random().toString(32)}-${Math.random().toString(32)}`;
  apiKey = 'bfdf911e-f80a-4edb-b959-e3d45d37cc7b';
  path = 'https://logger.oddacoding.net/logs';

  constructor(private httpService: HttpClient, private authManager: AuthManagerService) { }

  request(type: string, message: string, path: string, payload: any) {
    payload['sessionId'] = this.instance;
    payload['user'] = {
      isAuthenticated: this.authManager.isAuthenticated(),
      userId: this.authManager.user?.id
    };
    return lastValueFrom(
      this.httpService
        .post(
          this.path,
          {
            type,
            message,
            path,
            payload
          },
          {
            headers: {
              'x-api': this.apiKey,
            },
          },
        )
        .pipe(
          catchError((er) => {
            console.log('cannot log');
            return of();
          }),
        ),
    );
  }

  info(message: string, path: string, payload: any) {
    return this.request('INFO', message, path, payload);
  }

  warning(message: string, path: string, payload: any) {
    return this.request('WARNING', message, path, payload);
  }

  debug(message: string, path: string, payload: any) {
    return this.request('DEBUG', message, path, payload);
  }

  error(message: string, path: string, payload: any) {
    return this.request('ERROR', message, path, payload);
  }
}
