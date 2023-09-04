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
import { ClubBaseDto } from './clubBaseDto';
import { PartyBaseDto } from './partyBaseDto';


export interface UpdateAddressResponseDto { 
    id?: number;
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    street: string;
    streetNumber: string;
    zipCode: string;
    city: string;
    country: string;
    formattedAddress: string | null;
    lat: number | null;
    lng: number | null;
    club: ClubBaseDto;
    parties: Array<PartyBaseDto>;
}

