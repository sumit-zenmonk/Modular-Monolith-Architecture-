import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsUUID } from 'class-validator';

export class CreateFollowerOfCreatorDto {
    @IsUUID()
    @IsNotEmpty()
    follower_uuid: string;

    @IsUUID()
    @IsNotEmpty()
    following_uuid: string;
}