/**
 * 
 * Your api
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AddressBaseDto } from './addressBaseDto';
import { ClubBaseDto } from './clubBaseDto';
import { AttachmentBaseDto } from './attachmentBaseDto';


export interface GetPartyResponseDto { 
    tags?: string;
    description?: string;
    id?: number;
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    title: string;
    isWaitingList: boolean;
    hidden: boolean;
    from: string;
    to: string;
    cover: AttachmentBaseDto;
    club: ClubBaseDto;
    address: AddressBaseDto;
    images: Array<AttachmentBaseDto>;
}

