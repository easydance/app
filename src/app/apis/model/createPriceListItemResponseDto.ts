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
import { ProductBaseDto } from './productBaseDto';
import { PartyBaseDto } from './partyBaseDto';


export interface CreatePriceListItemResponseDto { 
    id?: number;
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    price: number | null;
    qta: number | null;
    party: PartyBaseDto;
    product: ProductBaseDto;
}

