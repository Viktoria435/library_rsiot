import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { BookStatus, Genre } from '../../types/book.types';

export class CreateBookDto {
  @ApiProperty({
    description: 'Название книги',
    example: 'Pride and Prejudice',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Автор книги',
    example: 'Jane Austen',
  })
  @IsString()
  @IsNotEmpty({ message: 'Author is required' })
  @MinLength(2)
  @MaxLength(100)
  author: string;

  @ApiProperty({
    description: 'Количество страниц',
    example: 279,
  })
  @IsInt()
  @Min(1)
  @Max(10000)
  pages: number;

  @ApiProperty({
    description: 'Год публикации',
    example: 1813,
  })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({
    description: 'Жанр книги',
    enum: Genre,
    example: Genre.Romance,
  })
  @IsEnum(Genre)
  genre: Genre;

  @ApiProperty({
    description: 'Статус книги',
    enum: BookStatus,
    example: BookStatus.AVAILABLE,
  })
  @IsEnum(BookStatus, { message: 'Invalid book status' })
  status: BookStatus;
}
