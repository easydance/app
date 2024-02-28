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
import { CreateFacebookClubLinksRequestDto } from '../model/models';
import { FacebookClubLinksControllerCreateDefaultResponse } from '../model/models';
import { FacebookClubLinksControllerFindAllDefaultResponse } from '../model/models';
import { FacebookClubLinksControllerFindOneDefaultResponse } from '../model/models';
import { FacebookClubLinksControllerReplaceDefaultResponse } from '../model/models';
import { FacebookClubLinksControllerUpdateDefaultResponse } from '../model/models';
import { PatchFacebookClubLinksRequestDto } from '../model/models';
import { UpdateFacebookClubLinksRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface FacebookClubLinksServiceInterface {
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
     * @param createFacebookClubLinksRequestDto 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    create(createFacebookClubLinksRequestDto: CreateFacebookClubLinksRequestDto, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<FacebookClubLinksControllerCreateDefaultResponse>;

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
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<FacebookClubLinksControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    findOne(id: any, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<FacebookClubLinksControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateFacebookClubLinksRequestDto 
     */
    replace(id: number, updateFacebookClubLinksRequestDto: UpdateFacebookClubLinksRequestDto, extraHttpRequestParams?: any): Observable<FacebookClubLinksControllerReplaceDefaultResponse>;

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
     * @param patchFacebookClubLinksRequestDto 
     */
    update(id: number, patchFacebookClubLinksRequestDto: PatchFacebookClubLinksRequestDto, extraHttpRequestParams?: any): Observable<FacebookClubLinksControllerUpdateDefaultResponse>;

}