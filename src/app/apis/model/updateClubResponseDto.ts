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
import { WarehouseBaseDto } from './warehouseBaseDto';
import { AddressBaseDto } from './addressBaseDto';
import { UserBaseDto } from './userBaseDto';
import { ClubBaseDtoSocialsValueValue } from './clubBaseDtoSocialsValueValue';
import { PartyBaseDto } from './partyBaseDto';
import { AttachmentBaseDto } from './attachmentBaseDto';


export interface UpdateClubResponseDto { 
    id?: number;
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    name: string;
    covers: Array<AttachmentBaseDto>;
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
    owner: UserBaseDto;
    address: AddressBaseDto;
    parties: Array<PartyBaseDto>;
    warehouse: WarehouseBaseDto;
    profile: AttachmentBaseDto;
    currentCover: number;
    description: string;
    socials?: { [key: string]: { [key: string]: ClubBaseDtoSocialsValueValue; }; } | null;
    followerCount: number;
}
