import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthManagerService } from "src/app/services/auth-manager.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private auth: AuthManagerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the auth token from the service.
        const authToken = this.auth.getToken();

        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        const authReq = req.clone(authToken ? {
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        } : {});

        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
}