import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  @MaxLength(22)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(22)
  lastName: string;

  @IsNumber()
  @IsPositive()
  age: number;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(22)
  password: string;
}
