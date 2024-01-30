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
import { RoleBaseDto } from './roleBaseDto';
import { ClubBaseDto } from './clubBaseDto';
import { ProfileImageDto } from './profileImageDto';


export interface UpdateUserResponseDto { 
    id?: number;
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
    email: string;
    password: string;
    sourceId: string | null;
    providerAuthName: string | null;
    firstName?: string | null;
    lastName?: string | null;
    birthDate?: string | null;
    roles: Array<RoleBaseDto>;
    club: ClubBaseDto;
    profileImage: ProfileImageDto;
    previousProfileImages: Array<ProfileImageDto>;
    followers: number;
    following: number;
    followingClubs: number;
    isFollowing: boolean;
    city?: string;
}

