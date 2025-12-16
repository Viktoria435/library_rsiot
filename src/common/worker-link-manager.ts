import { Worker } from '../worker/dto/worker.dto';
import { bookLinkManager } from './book-link-manager';
import { LinkManager } from './LinkManager';
import { Link } from './Link';
import { Book } from '../book/dto/book.dto';

export interface WorkerWithBooks extends Omit<Worker, 'issuedBooks'> {
  issuedBooks: Book[];
}

export class WorkerLinkManager extends LinkManager<Worker> {
  protected fileName = 'workers.txt';
  protected tableName = 'workers';

  async enrich(worker: Worker): Promise<WorkerWithBooks> {
    const issuedBooks = await bookLinkManager.resolveMany(
      worker.issuedBooks as unknown as Link[],
    );

    return {
      ...worker,
      issuedBooks,
    };
  }
}

export const workerLinkManager = new WorkerLinkManager();
