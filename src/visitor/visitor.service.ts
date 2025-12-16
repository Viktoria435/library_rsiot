/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileManager } from 'src/utils/file-manager';
import { parseTxtRow, serializeTxtRow } from 'src/utils/file.utils';
import { Visitor } from './dto/visitor.dto';
import { randomUUID } from 'crypto';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Book } from 'src/book/dto/book.dto';
import { bookLinkManager } from 'src/common/book-link-manager';
import { VisitorLinkManager } from 'src/common/visitor-link-manager';
import { Link } from 'src/common/Link';

@Injectable()
export class VisitorService {
  private file = new FileManager('src/data/visitors.txt');
  private visitorLinkManager: VisitorLinkManager = new VisitorLinkManager();

  async getAll(): Promise<Visitor[]> {
    const lines = await this.file.readLines();
    return lines.map(parseTxtRow) as unknown as Visitor[];
  }

  async getById(id: string): Promise<Visitor> {
    const allVisitors = await this.getAll();
    const visitor = allVisitors.find((v) => v.id === id);
    if (!visitor) {
      throw new NotFoundException(`Visitor with id ${id} not found`);
    }

    return this.visitorLinkManager.enrich(visitor);
  }

  async add(dto: CreateVisitorDto): Promise<Visitor> {
    const newVisitor: Visitor = {
      id: randomUUID(),
      name: dto.name.trim(),
      surname: dto.surname.trim(),
      registrationDate: new Date(),
      currentBooks: [],
      history: [],
    };

    const lines = await this.file.readLines();
    lines.push(await serializeTxtRow(newVisitor));
    await this.file.writeLines(lines);

    return newVisitor;
  }

  async update(id: string, dto: UpdateVisitorDto): Promise<Visitor> {
    const visitors = await this.getAll();
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1)
      throw new NotFoundException(`Visitor with id ${id} not found`);

    visitors[index] = { ...visitors[index], ...dto };
    await this.file.writeLines(
      await Promise.all(visitors.map((visitor) => serializeTxtRow(visitor))),
    );
    return visitors[index];
  }

  async delete(id: string): Promise<void> {
    const visitors = await this.getAll();
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1)
      throw new NotFoundException(`Visitor with id ${id} not found`);

    if (visitors[index].currentBooks.length > 0) {
      throw new BadRequestException(
        'Cannot delete visitor with unreturned books',
      );
    }

    visitors.splice(index, 1);
    await this.file.writeLines(
      await Promise.all(visitors.map((visitor) => serializeTxtRow(visitor))),
    );
  }

  async addCurrentBooks(visitorId: string, books: Book[]): Promise<void> {
    const visitors = await this.getAll();
    const visitorIndex = visitors.findIndex((v) => v.id === visitorId);

    if (visitorIndex === -1) {
      throw new BadRequestException(`Visitor with id ${visitorId} not found`);
    }

    visitors[visitorIndex].currentBooks.push(
      ...books.map((b) => bookLinkManager.toLink(b.id)),
    );
    await this.file.writeLines(
      await Promise.all(visitors.map((visitor) => serializeTxtRow(visitor))),
    );
  }

  async moveToHistory(visitorId: string, books: Book[]): Promise<void> {
    const visitors = await this.getAll();
    const visitorIndex = visitors.findIndex((v) => v.id === visitorId);

    if (visitorIndex === -1) {
      throw new BadRequestException(`Visitor with id ${visitorId} not found`);
    }

    const visitor = visitors[visitorIndex];

    for (const book of books) {
      const currentBookIndex = visitor.currentBooks.findIndex(
        (b) => b.id === book.id,
      );

      if (currentBookIndex === -1) {
        throw new BadRequestException(
          `Visitor does not have book "${book.title}"`,
        );
      }

      const [removedBook] = visitor.currentBooks.splice(currentBookIndex, 1);
      visitor.history.push(removedBook);
    }

    await this.file.writeLines(
      await Promise.all(visitors.map((visitor) => serializeTxtRow(visitor))),
    );
  }

  async hasBook(visitorId: string, bookId: string): Promise<boolean> {
    const visitor = await this.getById(visitorId);
    if (!visitor) return false;

    return visitor.currentBooks.some((b: Link) => b.id === bookId);
  }
}
