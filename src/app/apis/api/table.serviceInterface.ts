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
import { CreateTableRequestDto } from '../model/models';
import { PatchTableRequestDto } from '../model/models';
import { TableControllerCreateDefaultResponse } from '../model/models';
import { TableControllerFindAllDefaultResponse } from '../model/models';
import { TableControllerFindOneDefaultResponse } from '../model/models';
import { TableControllerReplaceDefaultResponse } from '../model/models';
import { TableControllerUpdateDefaultResponse } from '../model/models';
import { UpdateTableRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface TableServiceInterface {
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
     * @param createTableRequestDto 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    create(createTableRequestDto: CreateTableRequestDto, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<TableControllerCreateDefaultResponse>;

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
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<TableControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    findOne(id: any, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<TableControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateTableRequestDto 
     */
    replace(id: number, updateTableRequestDto: UpdateTableRequestDto, extraHttpRequestParams?: any): Observable<TableControllerReplaceDefaultResponse>;

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
     * @param patchTableRequestDto 
     */
    update(id: number, patchTableRequestDto: PatchTableRequestDto, extraHttpRequestParams?: any): Observable<TableControllerUpdateDefaultResponse>;

}
