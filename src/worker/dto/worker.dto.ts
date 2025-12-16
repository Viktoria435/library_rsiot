import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Link } from 'src/common/Link';
import { DayOfWeek } from 'src/types/worker.types';

export class Worker {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsString({ message: 'Id must be a string' })
  @IsNotEmpty({ message: 'Id cannot be empty' })
  id: string;

  @ApiProperty({ example: 'John' })
  @IsString({ message: 'Id must be a string' })
  @IsNotEmpty({ message: 'Id cannot be empty' })
  name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: 'Id must be a string' })
  @IsNotEmpty({ message: 'Id cannot be empty' })
  surname: string;

  @ApiProperty({ example: 4 })
  @IsInt({ message: 'Experience must be an integer' })
  @Min(0, { message: 'Experience cannot be negative' })
  experience: number;

  @ApiProperty({
    example: [DayOfWeek.MONDAY, DayOfWeek.THURSDAY],
    enum: DayOfWeek,
    isArray: true,
  })
  @IsEnum(DayOfWeek, {
    each: true,
    message: 'Each workDay must be a valid DayOfWeek',
  })
  workDays: DayOfWeek[];

  @ApiProperty({ example: [], type: [Link] })
  issuedBooks: Link[];
}
