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
import { GetTableReservationResponseDto } from './getTableReservationResponseDto';


export interface TableReservationControllerFindAllDefaultResponse { 
    hasNext: boolean;
    hasPrevious: boolean;
    totalCount: number;
    data: Array<GetTableReservationResponseDto>;
}
