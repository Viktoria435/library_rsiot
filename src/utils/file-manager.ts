import * as fs from 'fs/promises';
import * as path from 'path';
// import { CryptoProvider } from './crypto.utils';

export class FileManager {
  constructor(
    private readonly filePath: string,
    // private readonly crypto = new CryptoProvider(),
  ) {}

  private async ensureFile(): Promise<void> {
    const dir = path.dirname(this.filePath);

    try {
      await fs.stat(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }

    try {
      await fs.stat(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, '', 'utf-8');
    }
  }

  async readLines(): Promise<string[]> {
    await this.ensureFile();
    const data = await fs.readFile(this.filePath, 'utf-8');

    if (!data) return [];

    try {
      // const decrypted = await this.crypto.decrypt(data);
      return data
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .filter(Boolean);
    } catch {
      return data
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .filter(Boolean);
    }
  }

  async writeLines(lines: string[]): Promise<void> {
    await this.ensureFile();
    const plain = lines.join('\n');
    // const encrypted = await this.crypto.encrypt(plain);
    await fs.writeFile(this.filePath, plain, 'utf-8');
  }
}
