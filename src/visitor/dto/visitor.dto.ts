import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Link } from '../../common/Link';

export class Visitor {
  @ApiProperty({
    description: 'Visitor ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id: string;

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

  @ApiProperty({ description: 'Registration date', example: '2025-11-26' })
  @IsDateString()
  registrationDate: Date;

  @ApiProperty({ description: 'Currently borrowed books', type: [Link] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Link)
  currentBooks: Link[];

  @ApiProperty({ description: 'History of returned books', type: [Link] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Link)
  history: Link[];
}
