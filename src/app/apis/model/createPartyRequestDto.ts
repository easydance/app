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


export interface CreatePartyRequestDto { 
    tags?: string;
    description: string;
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
    orderEnabled: boolean;
    hidden: boolean;
    from: string;
    to: string;
    cover: number;
    club: ClubBaseDto;
    address: AddressBaseDto;
    images: Array<number>;
}

