import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateVisitorDto {
  @ApiProperty({ description: 'Visitor first name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiProperty({ description: 'Visitor surname', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  surname: string;

  // @ApiProperty({ description: 'Registration date', example: '2025-11-26' })
  // @IsDateString()
  // registrationDate: string;
}
