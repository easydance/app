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

import { CreatePriceListItemRequestDto } from '../model/models';
import { PatchPriceListItemRequestDto } from '../model/models';
import { PriceListItemControllerCreateDefaultResponse } from '../model/models';
import { PriceListItemControllerFindAllDefaultResponse } from '../model/models';
import { PriceListItemControllerFindOneDefaultResponse } from '../model/models';
import { PriceListItemControllerReplaceDefaultResponse } from '../model/models';
import { PriceListItemControllerUpdateDefaultResponse } from '../model/models';
import { UpdatePriceListItemRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface PriceListItemServiceInterface {
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
     * @param createPriceListItemRequestDto 
     * @param fields 
     * @param includes 
     * @param withDeleted 
     */
    create(createPriceListItemRequestDto: CreatePriceListItemRequestDto, fields?: string, includes?: string, withDeleted?: string, extraHttpRequestParams?: any): Observable<PriceListItemControllerCreateDefaultResponse>;

    /**
     * 
     * 
     * @param page 
     * @param pageSize 
     * @param filters 
     * @param sorting 
     * @param fields 
     * @param includes 
     * @param withDeleted 
     */
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, withDeleted?: string, extraHttpRequestParams?: any): Observable<PriceListItemControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     * @param withDeleted 
     */
    findOne(id: any, fields?: string, includes?: string, withDeleted?: string, extraHttpRequestParams?: any): Observable<PriceListItemControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updatePriceListItemRequestDto 
     */
    replace(id: number, updatePriceListItemRequestDto: UpdatePriceListItemRequestDto, extraHttpRequestParams?: any): Observable<PriceListItemControllerReplaceDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param patchPriceListItemRequestDto 
     */
    update(id: number, patchPriceListItemRequestDto: PatchPriceListItemRequestDto, extraHttpRequestParams?: any): Observable<PriceListItemControllerUpdateDefaultResponse>;

}
