import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  IsEnum,
  IsArray,
  ArrayMinSize,
  Min,
  Max,
} from 'class-validator';
import { DayOfWeek } from 'src/types/worker.types';

export class CreateWorkerDto {
  @ApiProperty({
    description: 'Имя сотрудника',
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Фамилия сотрудника',
    example: 'Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  surname: string;

  @ApiProperty({
    description: 'Опыт работы (в годах)',
    example: 5,
  })
  @IsInt()
  @Min(0)
  @Max(60)
  experience: number;

  @ApiProperty({
    description: 'Рабочие дни сотрудника',
    example: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    enum: DayOfWeek,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(DayOfWeek, { each: true })
  workDays: DayOfWeek[];
}
