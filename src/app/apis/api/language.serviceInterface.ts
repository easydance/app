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

import { CreateLanguageRequestDto } from '../model/models';
import { LanguageControllerCreateDefaultResponse } from '../model/models';
import { LanguageControllerFindAllDefaultResponse } from '../model/models';
import { LanguageControllerFindOneDefaultResponse } from '../model/models';
import { LanguageControllerReplaceDefaultResponse } from '../model/models';
import { LanguageControllerUpdateDefaultResponse } from '../model/models';
import { PatchLanguageRequestDto } from '../model/models';
import { UpdateLanguageRequestDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface LanguageServiceInterface {
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
     * @param createLanguageRequestDto 
     * @param fields 
     * @param includes 
     */
    create(createLanguageRequestDto: CreateLanguageRequestDto, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<LanguageControllerCreateDefaultResponse>;

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
    findAll(page?: number, pageSize?: number, filters?: string, sorting?: string, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<LanguageControllerFindAllDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param fields 
     * @param includes 
     */
    findOne(id: any, fields?: string, includes?: string, extraHttpRequestParams?: any): Observable<LanguageControllerFindOneDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param updateLanguageRequestDto 
     */
    replace(id: number, updateLanguageRequestDto: UpdateLanguageRequestDto, extraHttpRequestParams?: any): Observable<LanguageControllerReplaceDefaultResponse>;

    /**
     * 
     * 
     * @param id 
     * @param patchLanguageRequestDto 
     */
    update(id: number, patchLanguageRequestDto: PatchLanguageRequestDto, extraHttpRequestParams?: any): Observable<LanguageControllerUpdateDefaultResponse>;

}
