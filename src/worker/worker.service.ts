import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Book } from 'src/book/dto/book.dto';
import { bookLinkManager } from 'src/common/book-link-manager';
import {
  WorkerLinkManager,
  WorkerWithBooks,
} from 'src/common/worker-link-manager';
import { FileManager } from 'src/utils/file-manager';
import { parseTxtRow, serializeTxtRow } from 'src/utils/file.utils';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { Worker } from './dto/worker.dto';
import { DayOfWeek } from 'src/types/worker.types';
import { Link } from 'src/common/Link';

@Injectable()
export class WorkerService {
  private file = new FileManager('src/data/workers.txt');
  private workerLinkManager = new WorkerLinkManager();

  async getAll(): Promise<Worker[]> {
    const lines = await this.file.readLines();
    const workers = lines.map(parseTxtRow) as unknown as Worker[];
    return workers;
  }

  async getAllWithIssuedBooks(): Promise<WorkerWithBooks[]> {
    const workers = await this.getAll();
    return Promise.all(
      workers.map((worker) => this.workerLinkManager.enrich(worker)),
    );
  }

  async getByWorkDays(workDays: DayOfWeek[]): Promise<WorkerWithBooks[]> {
    const workers = await this.getAll();
    const enriched = await Promise.all(
      workers.map((w) => this.workerLinkManager.enrich(w)),
    );
    const filtered = enriched.filter((w) =>
      w.workDays.some((day) => workDays.includes(day)),
    );

    if (filtered.length === 0) {
      throw new NotFoundException(
        `No workers found with work days: ${workDays.join(', ')}`,
      );
    }

    return filtered;
  }

  async getById(id: string): Promise<Worker | null> {
    const workers = await this.getAll();
    const worker = workers.find((w) => w.id === id);
    return worker as Worker;
  }

  async getByIdWithIssuedBooks(id: string): Promise<WorkerWithBooks | null> {
    const worker = await this.getById(id);
    if (!worker) return null;
    return this.workerLinkManager.enrich(worker);
  }

  async add(dto: CreateWorkerDto): Promise<Worker> {
    const workers = await this.getAll();

    const newWorker: Worker = {
      id: randomUUID(),
      name: dto.name.trim(),
      surname: dto.surname.trim(),
      experience: dto.experience,
      workDays: dto.workDays,
      issuedBooks: [],
    };

    workers.push(newWorker);
    await this.file.writeLines(
      await Promise.all(workers.map((worker) => serializeTxtRow(worker))),
    );

    return newWorker;
  }

  async update(
    id: string,
    dto: Partial<CreateWorkerDto>,
  ): Promise<Worker | null> {
    const workers = await this.getAll();
    const index = workers.findIndex((w) => w.id === id);

    if (index === -1) return null;

    workers[index] = {
      ...workers[index],
      ...dto,
    };
    await this.file.writeLines(
      await Promise.all(workers.map((worker) => serializeTxtRow(worker))),
    );
    return workers[index];
  }

  async delete(id: string): Promise<boolean> {
    const workers = await this.getAll();
    const index = workers.findIndex((w) => w.id === id);

    if (index === -1) return false;

    workers.splice(index, 1);
    await this.file.writeLines(
      await Promise.all(workers.map((worker) => serializeTxtRow(worker))),
    );

    return true;
  }

  async addIssuedBooks(workerId: string, books: Book[]): Promise<void> {
    const workers = await this.getAll();
    const index = workers.findIndex((worker) => worker.id === workerId);

    if (index === -1) {
      throw new NotFoundException(`Worker with id ${workerId} not found`);
    }

    const target = workers[index];
    const existingBookIds = new Set(
      target.issuedBooks.map((link: Link) => link.id),
    );

    for (const book of books) {
      if (!existingBookIds.has(book.id)) {
        target.issuedBooks.push(bookLinkManager.toLink(book.id));
      }
    }

    workers[index] = target;

    await this.file.writeLines(
      await Promise.all(workers.map((worker) => serializeTxtRow(worker))),
    );
  }
}
