import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { VisitorService } from '../visitor/visitor.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { DateUtils } from '../utils/date.utils';
import { WorkerService } from '../worker/worker.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { buildDownloadFile } from '../utils/download.utils';

@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly visitorService: VisitorService,
    private readonly workerService: WorkerService,
  ) {}

  @Get('all')
  async getAll() {
    return await this.bookService.getAll();
  }

  @Get(':id/download')
  async download(@Param('id') id: string) {
    const book = await this.bookService.getById(id);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return buildDownloadFile('books', id, book);
  }

  @Post('create')
  async create(@Body() dto: CreateBookDto) {
    return await this.bookService.add(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const book = await this.bookService.getById(id);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return book;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    const updated = await this.bookService.update(id, dto);
    if (!updated) throw new NotFoundException(`Book with id ${id} not found`);
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.bookService.delete(id);
    if (!deleted) throw new NotFoundException(`Book with id ${id} not found`);
    return { message: `Book with id ${id} deleted successfully` };
  }

  @Post('borrow')
  async borrow(@Body() dto: BorrowBookDto) {
    const visitor = await this.visitorService.getById(dto.visitorId);
    if (!visitor) throw new NotFoundException(`Visitor not found`);

    const worker = await this.workerService.getById(dto.workerId);
    if (!worker) throw new NotFoundException(`Worker not found`);

    if (!DateUtils.isWorkingDay(dto.borrowDate, worker.workDays)) {
      throw new BadRequestException('Library is closed on this day');
    }

    const borrowedBooks = await this.bookService.borrowBooks(
      dto.bookIds,
      visitor,
    );
    await this.visitorService.addCurrentBooks(visitor.id, borrowedBooks);
    await this.workerService.addIssuedBooks(worker.id, borrowedBooks);

    return { message: `Successfully borrowed ${borrowedBooks.length} book(s)` };
  }

  @Post('return')
  async return(@Body() dto: ReturnBookDto) {
    const visitor = await this.visitorService.getById(dto.visitorId);
    if (!visitor) throw new NotFoundException(`Visitor not found`);

    const worker = await this.workerService.getById(dto.workerId);
    if (!worker) throw new NotFoundException(`Worker not found`);

    if (!DateUtils.isWorkingDay(dto.returnDate, worker.workDays)) {
      throw new BadRequestException('Library is closed on this day');
    }

    const returnedBooks = await this.bookService.returnBooks(
      dto.bookIds,
      visitor,
    );
    await this.visitorService.moveToHistory(visitor.id, returnedBooks);

    return { message: `Successfully returned ${returnedBooks.length} book(s)` };
  }
}
