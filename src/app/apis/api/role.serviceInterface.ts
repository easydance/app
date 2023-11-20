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
import { CreateRoleRequestDto } from '../model/models';
import { PatchRoleRequestDto } from '../model/models';
import { RoleControllerCreateDefaultResponse } from '../model/models';
import { RoleControllerFindAllDefaultResponse } from '../model/models';
import { RoleControllerFindOneDefaultResponse } from '../model/models';
import { RoleControllerReplaceDefaultResponse } from '../model/models';
import { RoleControllerUpdateDefaultResponse } from '../model/models';
import { UpdateRoleRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface RoleServiceInterface {
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
     * @param createRoleRequestDto 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    create(createRoleRequestDto: CreateRoleRequestDto, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<RoleControllerCreateDefaultResponse>;

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
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<RoleControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    findOne(id: any, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<RoleControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateRoleRequestDto 
     */
    replace(id: number, updateRoleRequestDto: UpdateRoleRequestDto, extraHttpRequestParams?: any): Observable<RoleControllerReplaceDefaultResponse>;

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
     * @param patchRoleRequestDto 
     */
    update(id: number, patchRoleRequestDto: PatchRoleRequestDto, extraHttpRequestParams?: any): Observable<RoleControllerUpdateDefaultResponse>;

}
