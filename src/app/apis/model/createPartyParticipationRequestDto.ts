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
import { CreatePartyParticipationRequestDtoParty } from './createPartyParticipationRequestDtoParty';


export interface CreatePartyParticipationRequestDto { 
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    pr: string;
    participants?: number;
    party: CreatePartyParticipationRequestDtoParty;
}

