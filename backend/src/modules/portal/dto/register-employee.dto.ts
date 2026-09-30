import {
  IsEmail,
  IsMACAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  msnv: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsMACAddress()
  macAddress: string;
}