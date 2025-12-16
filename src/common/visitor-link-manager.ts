import { LinkManager } from './LinkManager';
import { Visitor } from '../visitor/dto/visitor.dto';
import { bookLinkManager } from './book-link-manager';
import { Link } from './Link';

export interface VisitorWithBooks
  extends Omit<Visitor, 'currentBooks' | 'history'> {
  currentBooks: any[];
  history: any[];
}

export class VisitorLinkManager extends LinkManager<Visitor> {
  protected fileName = 'visitors.txt';
  protected tableName = 'visitors';

  async enrich(visitor: Visitor): Promise<VisitorWithBooks> {
    const currentBooks = await bookLinkManager.resolveMany(
      visitor.currentBooks as unknown as Link[],
    );

    const history = await bookLinkManager.resolveMany(
      visitor.history as unknown as Link[],
    );

    return {
      ...visitor,
      currentBooks,
      history,
    };
  }
}

export const visitorLinkManager = new VisitorLinkManager();
