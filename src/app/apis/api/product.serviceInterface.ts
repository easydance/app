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
import { CreateProductRequestDto } from '../model/models';
import { PatchProductRequestDto } from '../model/models';
import { ProductControllerCreateDefaultResponse } from '../model/models';
import { ProductControllerFindAllDefaultResponse } from '../model/models';
import { ProductControllerFindOneDefaultResponse } from '../model/models';
import { ProductControllerReplaceDefaultResponse } from '../model/models';
import { ProductControllerUpdateDefaultResponse } from '../model/models';
import { UpdateProductRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface ProductServiceInterface {
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
     * @param createProductRequestDto 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    create(createProductRequestDto: CreateProductRequestDto, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<ProductControllerCreateDefaultResponse>;

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
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<ProductControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    findOne(id: any, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<ProductControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateProductRequestDto 
     */
    replace(id: number, updateProductRequestDto: UpdateProductRequestDto, extraHttpRequestParams?: any): Observable<ProductControllerReplaceDefaultResponse>;

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
     * @param patchProductRequestDto 
     */
    update(id: number, patchProductRequestDto: PatchProductRequestDto, extraHttpRequestParams?: any): Observable<ProductControllerUpdateDefaultResponse>;

}
