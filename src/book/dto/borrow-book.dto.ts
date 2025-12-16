import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsDateString,
  ArrayNotEmpty,
} from 'class-validator';

export class BorrowBookDto {
  @ApiProperty({
    description: 'Список ID книг, которые выдаются',
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
    description: 'ID сотрудника, который выдает книги',
    example: 'employee456',
  })
  @IsString()
  workerId: string;

  @ApiProperty({
    description: 'Дата выдачи (ISO)',
    example: '2025-11-25',
  })
  @IsDateString()
  borrowDate: string;
}
