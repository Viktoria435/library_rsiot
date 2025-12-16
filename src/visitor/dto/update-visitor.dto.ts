import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateVisitorDto {
  @ApiProperty({
    description: 'Visitor first name',
    example: 'John',
  })
  @IsString()
  @Length(2, 50)
  name?: string;

  @ApiProperty({
    description: 'Visitor surname',
    example: 'Doe',
  })
  @IsString()
  @Length(2, 50)
  surname?: string;
}
