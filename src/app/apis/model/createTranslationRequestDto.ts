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
import { LanguageBaseDto } from './languageBaseDto';


export interface CreateTranslationRequestDto { 
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    i18n: string;
    translation: string;
    language: LanguageBaseDto;
}

