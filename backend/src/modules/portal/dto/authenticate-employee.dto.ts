import {
  IsMACAddress,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class AuthenticateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  msnv: string;

  @IsMACAddress()
  macAddress: string;
}