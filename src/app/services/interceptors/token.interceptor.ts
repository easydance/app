import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NavController } from "@ionic/angular";
import { catchError, map, throwError } from "rxjs";
import { AuthManagerService } from "src/app/services/auth-manager.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private auth: AuthManagerService, private navCtrl: NavController) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the auth token from the service.
        const authToken = this.auth.getToken();

        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        const authReq = req.clone(authToken ? {
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        } : {});

        // send cloned request with header to the next handler.
        // return next.handle(authReq);
        return next.handle(authReq).pipe(
            catchError(err => {
                if (err.status === 401) {
                    this.auth.logout();
                    this.navCtrl.navigateRoot('/login');
                }
                return throwError(() => err);
            }));
    }
}