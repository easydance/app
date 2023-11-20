import { NgModule, inject } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TranslationService } from "src/app/apis";

export class CustomTranslatorLoader extends TranslateHttpLoader {
    translateService: TranslationService = inject(TranslationService);

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    override getTranslation(lang: string): Observable<Object> {
        return this.translateService.get(lang);
    }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new CustomTranslatorLoader(http);
}

@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient, TranslationService]
            }
        })
    ],
    exports: [
        TranslateModule
    ]
})
export class I18nHandlerModule {

}