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

import { CreateTableOrderRequestDto } from '../model/models';
import { PatchTableOrderRequestDto } from '../model/models';
import { TableOrderControllerCreateDefaultResponse } from '../model/models';
import { TableOrderControllerFindAllDefaultResponse } from '../model/models';
import { TableOrderControllerFindOneDefaultResponse } from '../model/models';
import { TableOrderControllerReplaceDefaultResponse } from '../model/models';
import { TableOrderControllerUpdateDefaultResponse } from '../model/models';
import { UpdateTableOrderRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface TableOrderServiceInterface {
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
     * @param createTableOrderRequestDto 
     * @param fields 
     * @param includes 
     */
    create(createTableOrderRequestDto: CreateTableOrderRequestDto, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<TableOrderControllerCreateDefaultResponse>;

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
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<TableOrderControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     */
    findOne(id: any, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<TableOrderControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateTableOrderRequestDto 
     */
    replace(id: number, updateTableOrderRequestDto: UpdateTableOrderRequestDto, extraHttpRequestParams?: any): Observable<TableOrderControllerReplaceDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param patchTableOrderRequestDto 
     */
    update(id: number, patchTableOrderRequestDto: PatchTableOrderRequestDto, extraHttpRequestParams?: any): Observable<TableOrderControllerUpdateDefaultResponse>;

}
