/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FileManager } from '../utils/file-manager';
import { parseTxtRow } from '../utils/file.utils';
import { Link } from './Link';

export abstract class LinkManager<T> {
  protected abstract fileName: string;
  protected abstract tableName: string;

  private getFile() {
    return new FileManager(`../data/${this.fileName}`);
  }

  toLink(id: string): Link {
    return new Link(this.tableName, id);
  }

  async resolve(link: Link): Promise<T | null> {
    if (link.table !== this.tableName)
      throw new Error(`Expected link to ${this.tableName}, got ${link.table}`);

    const file = this.getFile();
    const rows = await file.readLines();
    const items = rows.map(parseTxtRow) as T[];

    return items.find((i: any) => i.id === link.id) || null;
  }

  async resolveMany(links: Link[]): Promise<T[]> {
    const resolved = await Promise.all(links.map((l) => this.resolve(l)));
    return resolved.filter((i) => i !== null) as T[];
  }
}
