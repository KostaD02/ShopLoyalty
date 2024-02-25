import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(22)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(22)
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
