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
import { GetUserResponseDto } from './getUserResponseDto';


export interface UserControllerFindAllDefaultResponse { 
    hasNext: boolean;
    hasPrevious: boolean;
    totalCount: number;
    data: Array<GetUserResponseDto>;
}

