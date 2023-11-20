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
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';

import { AddressControllerCountDefaultResponse } from '../model/models';
import { CreatePartyRequestDto } from '../model/models';
import { CurrentParty } from '../model/models';
import { PartyControllerCreateDefaultResponse } from '../model/models';
import { PartyControllerFindAllDefaultResponse } from '../model/models';
import { PartyControllerFindOneDefaultResponse } from '../model/models';
import { PartyControllerReplaceDefaultResponse } from '../model/models';
import { PartyControllerUpdateDefaultResponse } from '../model/models';
import { PatchPartyRequestDto } from '../model/models';
import { UpdatePartyRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface PartyServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * 
     * 
     * @param id 
     */
    _delete(id: number, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * 
     * 
     * @param page 
     * @param pageSize 
     * @param filters 
     * @param sorting 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    count(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<AddressControllerCountDefaultResponse>;

    /**
     * 
     * 
     * @param createPartyRequestDto 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    create(createPartyRequestDto: CreatePartyRequestDto, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<PartyControllerCreateDefaultResponse>;

    /**
     * 
     * 
     * @param club 
     */
    current(club: number, extraHttpRequestParams?: any): Observable<CurrentParty>;

    /**
     * 
     * 
     * @param page 
     * @param pageSize 
     * @param filters 
     * @param sorting 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<PartyControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    findOne(id: any, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<PartyControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updatePartyRequestDto 
     */
    replace(id: number, updatePartyRequestDto: UpdatePartyRequestDto, extraHttpRequestParams?: any): Observable<PartyControllerReplaceDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     */
    restore(id: number, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * 
     * 
     * @param id 
     * @param patchPartyRequestDto 
     */
    update(id: number, patchPartyRequestDto: PatchPartyRequestDto, extraHttpRequestParams?: any): Observable<PartyControllerUpdateDefaultResponse>;

}
