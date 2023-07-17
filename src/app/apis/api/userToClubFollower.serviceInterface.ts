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

import { CreateUserToClubFollowerRequestDto } from '../model/models';
import { PatchUserToClubFollowerRequestDto } from '../model/models';
import { UpdateUserToClubFollowerRequestDto } from '../model/models';
import { UserToClubFollowerControllerCreateDefaultResponse } from '../model/models';
import { UserToClubFollowerControllerFindAllDefaultResponse } from '../model/models';
import { UserToClubFollowerControllerFindOneDefaultResponse } from '../model/models';
import { UserToClubFollowerControllerReplaceDefaultResponse } from '../model/models';
import { UserToClubFollowerControllerUpdateDefaultResponse } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface UserToClubFollowerServiceInterface {
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
     * @param createUserToClubFollowerRequestDto 
     * @param fields 
     * @param includes 
     */
    create(createUserToClubFollowerRequestDto: CreateUserToClubFollowerRequestDto, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<UserToClubFollowerControllerCreateDefaultResponse>;

    /**
     * 
     * 
     * @param page 
     * @param pageSize 
     * @param filters 
     * @param sorting 
     * @param fields 
     * @param includes 
     */
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<UserToClubFollowerControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     */
    findOne(id: any, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<UserToClubFollowerControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateUserToClubFollowerRequestDto 
     */
    replace(id: number, updateUserToClubFollowerRequestDto: UpdateUserToClubFollowerRequestDto, extraHttpRequestParams?: any): Observable<UserToClubFollowerControllerReplaceDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param patchUserToClubFollowerRequestDto 
     */
    update(id: number, patchUserToClubFollowerRequestDto: PatchUserToClubFollowerRequestDto, extraHttpRequestParams?: any): Observable<UserToClubFollowerControllerUpdateDefaultResponse>;

}
