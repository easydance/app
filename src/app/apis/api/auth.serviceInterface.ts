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

import { LoginDto } from '../model/models';
import { LoginResponseDto } from '../model/models';
import { MeResponseDto } from '../model/models';
import { SignUpDto } from '../model/models';
import { SignupResponseDataDto } from '../model/models';
import { SignupResponseDto } from '../model/models';
import { UpdateMeDto } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface AuthServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * 
     * 
     * @param loginDto 
     */
    login(loginDto: LoginDto, extraHttpRequestParams?: any): Observable<LoginResponseDto>;

    /**
     * 
     * 
     * @param fields 
     * @param includes 
     * @param deleted 
     */
    me(fields?: string, includes?: string, deleted?: string, extraHttpRequestParams?: any): Observable<MeResponseDto>;

    /**
     * 
     * 
     * @param signUpDto 
     * @param provider 
     * @param authorization 
     */
    signUp(signUpDto: SignUpDto, provider?: string, authorization?: string, extraHttpRequestParams?: any): Observable<SignupResponseDataDto>;

    /**
     * 
     * 
     * @param updateMeDto 
     */
    updateMe(updateMeDto: UpdateMeDto, extraHttpRequestParams?: any): Observable<SignupResponseDto>;

}
