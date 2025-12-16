import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WorkerService } from './worker.service';
import { Worker } from './dto/worker.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { DayOfWeek } from '../types/worker.types';
import { WorkerWithBooks } from '../common/worker-link-manager';
import { buildDownloadFile } from '../utils/download.utils';

@ApiTags('Workers')
@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all workers' })
  @ApiResponse({ status: 200, description: 'Returns all workers' })
  async getWorkers(): Promise<WorkerWithBooks[]> {
    return await this.workerService.getAllWithIssuedBooks();
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download worker data as file' })
  @ApiParam({ name: 'id', type: 'string' })
  async downloadWorker(@Param('id') id: string) {
    const worker = await this.workerService.getByIdWithIssuedBooks(id);
    if (!worker) {
      throw new NotFoundException(`Worker with id ${id} not found`);
    }
    return buildDownloadFile('workers', id, worker);
  }

  @Get('by-work-days')
  @ApiOperation({ summary: 'Get workers by work days' })
  @ApiQuery({ name: 'workDays', type: 'array', items: { type: 'string' } })
  @ApiResponse({ status: 200, description: 'Returns workers by work days' })
  async getWorkersByWorkDays(
    @Query('workDays') workDays: DayOfWeek[],
  ): Promise<WorkerWithBooks[]> {
    return await this.workerService.getByWorkDays(workDays);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new worker' })
  @ApiResponse({ status: 201, description: 'Worker created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addWorker(@Body() body: CreateWorkerDto): Promise<Worker> {
    return await this.workerService.add(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns the employee' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async getWorker(@Param('id') id: string): Promise<WorkerWithBooks> {
    const worker = await this.workerService.getByIdWithIssuedBooks(id);
    if (!worker) {
      throw new NotFoundException(`Worker with id ${id} not found`);
    }
    return worker;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a worker' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() body: Partial<CreateWorkerDto>,
  ): Promise<Worker> {
    const updated = await this.workerService.update(id, body);
    if (!updated) {
      throw new NotFoundException(`Worker with id ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a worker' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 204, description: 'Worker deleted successfully' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  async deleteWorker(@Param('id') id: string): Promise<void> {
    const deleted = await this.workerService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Worker with id ${id} not found`);
    }
  }
}
