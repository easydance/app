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
import { UserBaseDto } from './userBaseDto';
import { TableOrderRowBaseDto } from './tableOrderRowBaseDto';
import { TableBaseDto } from './tableBaseDto';


export interface UpdateTableOrderRequestDto { 
    id?: number;
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    bill: number | null;
    table: TableBaseDto;
    user: UserBaseDto;
    rows: Array<TableOrderRowBaseDto>;
    status: UpdateTableOrderRequestDto.StatusEnum;
}
export namespace UpdateTableOrderRequestDto {
    export type StatusEnum = 'COMPLETED' | 'IN_PROGRESS' | 'CREATED' | 'PROCESSED' | 'CANCELED' | 'DELIVERED';
    export const StatusEnum = {
        Completed: 'COMPLETED' as StatusEnum,
        InProgress: 'IN_PROGRESS' as StatusEnum,
        Created: 'CREATED' as StatusEnum,
        Processed: 'PROCESSED' as StatusEnum,
        Canceled: 'CANCELED' as StatusEnum,
        Delivered: 'DELIVERED' as StatusEnum
    };
}


