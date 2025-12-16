import { lzssEncode, lzssDecode } from './lzss.util';
import {
  encryptWithAlphabet,
  decryptWithAlphabet,
} from './offset-encryption.util';
import { getOrCreateKey } from 'src/common/key-manager';

export async function encryptData(data: string): Promise<string> {
  const compressed = lzssEncode(data);
  const key = await getOrCreateKey();
  const encrypted = encryptWithAlphabet(compressed, key);

  return encrypted;
}

export async function decryptData(encrypted: string): Promise<string> {
  const key = await getOrCreateKey();
  const decrypted = decryptWithAlphabet(encrypted, key);
  const decompressed = lzssDecode(decrypted);
  console.log('decompressed', decompressed);

  return decompressed;
}
