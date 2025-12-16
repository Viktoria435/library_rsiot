import { LinkManager } from './LinkManager';
import { Book } from '../book/dto/book.dto';

export class BookLinkManager extends LinkManager<Book> {
  protected fileName = 'books.txt';
  protected tableName = 'books';
}

export const bookLinkManager = new BookLinkManager();
