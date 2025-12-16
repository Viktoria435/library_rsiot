import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsDateString,
  ArrayNotEmpty,
} from 'class-validator';

export class ReturnBookDto {
  @ApiProperty({
    description: 'Список ID книг, которые возвращаются',
    example: ['book1', 'book2'],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'bookIds cannot be empty' })
  @IsString({ each: true })
  bookIds: string[];

  @ApiProperty({
    description: 'ID посетителя',
    example: 'visitor123',
  })
  @IsString()
  visitorId: string;

  @ApiProperty({
    description: 'ID сотрудника, который принимает книги',
    example: 'employee456',
  })
  @IsString()
  workerId: string;

  @ApiProperty({
    description: 'Дата возврата (ISO)',
    example: '2025-11-25',
  })
  @IsDateString()
  returnDate: string;
}
