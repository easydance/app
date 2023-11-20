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
import { CreateStoryRequestDto } from '../model/models';
import { PatchStoryRequestDto } from '../model/models';
import { StoryControllerCreateDefaultResponse } from '../model/models';
import { StoryControllerFindAllDefaultResponse } from '../model/models';
import { StoryControllerFindOneDefaultResponse } from '../model/models';
import { StoryControllerReplaceDefaultResponse } from '../model/models';
import { StoryControllerUpdateDefaultResponse } from '../model/models';
import { UpdateStoryRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface StoryServiceInterface {
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
     * @param createStoryRequestDto 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    create(createStoryRequestDto: CreateStoryRequestDto, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<StoryControllerCreateDefaultResponse>;

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
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<StoryControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    findOne(id: any, fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<StoryControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateStoryRequestDto 
     */
    replace(id: number, updateStoryRequestDto: UpdateStoryRequestDto, extraHttpRequestParams?: any): Observable<StoryControllerReplaceDefaultResponse>;

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
     * @param patchStoryRequestDto 
     */
    update(id: number, patchStoryRequestDto: PatchStoryRequestDto, extraHttpRequestParams?: any): Observable<StoryControllerUpdateDefaultResponse>;

}
