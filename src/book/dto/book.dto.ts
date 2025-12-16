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
import { BookStatus, Genre } from 'src/types/book.types';

export class Book {
  @ApiProperty({
    description: 'Уникальный идентификатор книги',
    example: 'b1f3c2e7-9bd1-4f41-82b3-fc4c938f4a1d',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Название книги',
    example: 'Pride and Prejudice',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(2, { message: 'Title must be at least 2 characters' })
  @MaxLength(100, { message: 'Title must be at most 100 characters' })
  title: string;

  @ApiProperty({
    description: 'Автор книги',
    example: 'Jane Austen',
  })
  @IsString()
  @IsNotEmpty({ message: 'Author is required' })
  @MinLength(2, { message: 'Author must be at least 2 characters' })
  @MaxLength(100, { message: 'Author must be at most 100 characters' })
  author: string;

  @ApiProperty({
    description: 'Количество страниц',
    example: 279,
  })
  @IsInt({ message: 'Pages must be an integer' })
  @Min(1, { message: 'Pages must be at least 1' })
  @Max(10000, { message: 'Pages must be at most 10000' })
  pages: number;

  @ApiProperty({
    description: 'Год публикации',
    example: 1813,
  })
  @IsInt({ message: 'Year must be an integer' })
  @Min(1000, { message: 'Year must be at least 1000' })
  @Max(new Date().getFullYear(), {
    message: `Year cannot be greater than ${new Date().getFullYear()}`,
  })
  year: number;

  @ApiProperty({
    description: 'Жанр книги',
    enum: Genre,
    example: Genre.Romance,
  })
  @IsEnum(Genre, { message: 'Invalid genre' })
  genre: Genre;

  @ApiProperty({
    description: 'Статус книги',
    enum: BookStatus,
    example: BookStatus.AVAILABLE,
  })
  @IsEnum(BookStatus, { message: 'Invalid book status' })
  status: BookStatus;
}
