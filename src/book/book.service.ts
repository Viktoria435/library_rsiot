import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Book } from './dto/book.dto';
import { FileManager } from '../utils/file-manager';
import { parseTxtRow, serializeTxtRow } from '../utils/file.utils';
import { randomUUID } from 'crypto';
import { BookStatus } from '../types/book.types';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Visitor } from '../visitor/dto/visitor.dto';
import { bookLinkManager } from '../common/book-link-manager';

@Injectable()
export class BookService {
  private file = new FileManager('src/data/books.txt');

  async getAll(): Promise<Book[]> {
    const lines = await this.file.readLines();
    return lines.map(parseTxtRow) as unknown as Book[];
  }

  async getById(id: string): Promise<Book | null> {
    const books = await this.getAll();
    return books.find((b) => b.id === id) || null;
  }

  async add(dto: CreateBookDto): Promise<Book> {
    const newBook: Book = {
      id: randomUUID(),
      ...dto,
      status: BookStatus.AVAILABLE,
    };
    const lines = await this.file.readLines();
    lines.push(serializeTxtRow(newBook));
    await this.file.writeLines(lines);
    return newBook;
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book | null> {
    const books = await this.getAll();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...dto };
    await this.file.writeLines(books.map(serializeTxtRow));
    return books[index];
  }

  async delete(id: string): Promise<boolean> {
    const books = await this.getAll();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    await this.file.writeLines(books.map(serializeTxtRow));
    return true;
  }

  async borrowBooks(bookIds: string[], visitor: Visitor): Promise<Book[]> {
    const books = await this.getAll();
    const borrowed: Book[] = [];

    for (const bookId of bookIds) {
      const book = books.find((b) => b.id === bookId);
      if (!book)
        throw new NotFoundException(`Book with id ${bookId} not found`);
      if (book.status === BookStatus.BORROWED) {
        throw new BadRequestException(
          `Book "${book.title}" is already borrowed`,
        );
      }

      book.status = BookStatus.BORROWED;
      visitor.currentBooks.push(bookLinkManager.toLink(bookId));

      borrowed.push(book);
    }

    await this.file.writeLines(books.map(serializeTxtRow));
    return borrowed;
  }

  async returnBooks(bookIds: string[], visitor: Visitor): Promise<Book[]> {
    const books = await this.getAll();
    const returned: Book[] = [];

    for (const bookId of bookIds) {
      const book = books.find((b) => b.id === bookId);
      if (!book)
        throw new NotFoundException(`Book with id ${bookId} not found`);
      if (book.status === BookStatus.AVAILABLE) {
        throw new BadRequestException(`Book "${book.title}" is not borrowed`);
      }

      const currentBookIndex = visitor.currentBooks.findIndex(
        (link) => link.id === bookId,
      );

      if (currentBookIndex === -1) {
        throw new BadRequestException(
          `Visitor does not have book "${book.title}"`,
        );
      }

      book.status = BookStatus.AVAILABLE;
      const returnedLink = visitor.currentBooks.splice(currentBookIndex, 1)[0];
      visitor.history.push(returnedLink);
      returned.push(book);
    }

    await this.file.writeLines(books.map(serializeTxtRow));
    return returned;
  }
}
