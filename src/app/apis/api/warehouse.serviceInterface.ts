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

import { CreateWarehouseRequestDto } from '../model/models';
import { PatchWarehouseRequestDto } from '../model/models';
import { UpdateWarehouseRequestDto } from '../model/models';
import { WarehouseControllerCreateDefaultResponse } from '../model/models';
import { WarehouseControllerFindAllDefaultResponse } from '../model/models';
import { WarehouseControllerFindOneDefaultResponse } from '../model/models';
import { WarehouseControllerReplaceDefaultResponse } from '../model/models';
import { WarehouseControllerUpdateDefaultResponse } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface WarehouseServiceInterface {
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
     * @param createWarehouseRequestDto 
     * @param fields 
     * @param includes 
     */
    create(createWarehouseRequestDto: CreateWarehouseRequestDto, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<WarehouseControllerCreateDefaultResponse>;

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
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<WarehouseControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     */
    findOne(id: any, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<WarehouseControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateWarehouseRequestDto 
     */
    replace(id: number, updateWarehouseRequestDto: UpdateWarehouseRequestDto, extraHttpRequestParams?: any): Observable<WarehouseControllerReplaceDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param patchWarehouseRequestDto 
     */
    update(id: number, patchWarehouseRequestDto: PatchWarehouseRequestDto, extraHttpRequestParams?: any): Observable<WarehouseControllerUpdateDefaultResponse>;

}
