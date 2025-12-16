import { promises as fs } from 'fs';
import path from 'path';
import {
  decryptWithAlphabet,
  encryptWithAlphabet,
} from 'src/utils/offset-encryption.util';

const dataDir = path.join(process.cwd(), 'src/data/encrypted/');
const keyFile = path.join(dataDir, '.encryption_key');

const MASTER_KEY = process.env.MASTER_KEY || 'RSIOT_SECRET_KEY_VARIAHT1';

export async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function getOrCreateKey(): Promise<string> {
  await ensureDataDir();

  try {
    const encryptedKey = await fs.readFile(keyFile, 'utf-8');
    return decryptWithAlphabet(encryptedKey, MASTER_KEY);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('ENOENT')) {
      const newKey = generateRandomKey(16);
      await saveKey(newKey);
      return newKey;
    }
    throw err;
  }
}

export async function saveKey(key: string): Promise<void> {
  await ensureDataDir();
  const encryptedKey = encryptWithAlphabet(key, MASTER_KEY);
  await fs.writeFile(keyFile, encryptedKey, 'utf-8');
}

export function generateRandomKey(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
