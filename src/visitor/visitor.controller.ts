import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { Visitor } from './dto/visitor.dto';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { buildDownloadFile } from '../utils/download.utils';

@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Get('all')
  async getAll(): Promise<Visitor[]> {
    return this.visitorService.getAll();
  }

  @Get(':id/download')
  async download(@Param('id') id: string) {
    const visitor = await this.visitorService.getById(id);
    return buildDownloadFile('visitors', id, visitor);
  }

  @Post('create')
  async create(@Body() dto: CreateVisitorDto): Promise<Visitor> {
    return this.visitorService.add(dto);
  }
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Visitor> {
    return this.visitorService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVisitorDto,
  ): Promise<Visitor> {
    return this.visitorService.update(id, dto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.visitorService.delete(id);
  }
}
