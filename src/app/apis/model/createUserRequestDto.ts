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


export interface CreateUserRequestDto { 
    email: string;
    username?: string | null;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    clubName: string;
}

