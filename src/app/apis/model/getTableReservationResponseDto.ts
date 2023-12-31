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
import { TablePartyRuleBaseDto } from './tablePartyRuleBaseDto';
import { UserBaseDto } from './userBaseDto';


export interface GetTableReservationResponseDto { 
    id?: number;
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    status: object;
    code: string;
    user: UserBaseDto;
    tablePartyRule: TablePartyRuleBaseDto;
}

