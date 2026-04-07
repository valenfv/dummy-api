import { IsString, IsEmail, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Jane' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 25000, minimum: 1 })
  @IsNotEmpty({ message: 'loan_amount should not be empty' })
  @IsNumber({}, { message: 'loan_amount must be a number' })
  @Min(1, { message: 'loan_amount must not be less than 1' })
  loan_amount: number;
}
