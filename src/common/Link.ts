export class Link {
  constructor(
    public table: string,
    public id: string,
  ) {}

  static fromString(str: string): Link {
    const [table, id] = str.split(':');
    return new Link(table, id);
  }

  toString(): string {
    return `${this.table}:${this.id}`;
  }
}
