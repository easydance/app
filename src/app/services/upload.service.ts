import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateAttachmentResponseDto } from "src/app/apis";
import { environment } from "src/environments/environment";

export type entityType = 'PARTY.COVER' | 'USER.PROFILE' | 'CLUB.COVER' | 'CLUB.PROFILE';

@Injectable({
    providedIn: 'root'
})
export class AttachmentHelperService {

    constructor(private httpClient: HttpClient) {
    }

    upload(entityId: number, entityType: entityType, file: File) {
        const formData = new FormData();

        formData.set('entityType', entityType);
        formData.set('file', file);

        if (entityId)
            formData.set('entityId', entityId.toString());

        return this.httpClient
            .post<{ data: CreateAttachmentResponseDto; }>(
                environment.BASE_API + '/attachments/upload',
                formData
            );
    }
}