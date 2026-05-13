import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsUUID, Length } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 255)
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}