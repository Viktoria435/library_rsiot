/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Link } from '../common/Link';
function isLinkString(value: string | undefined) {
  if (!value) return false;
  return /^[a-zA-Z]+:[^:]+$/.test(value);
}

export function parseTxtRow(row: string): any {
  if (typeof row !== 'string') {
    throw new Error('parseTxtRow: row is not string: ' + JSON.stringify(row));
  }

  const parts = row.split(';');
  const obj: any = {};

  for (const part of parts) {
    const [key, rawValue] = part.split('=');
    const value = rawValue?.trim();

    if (!key) continue;

    if (value?.startsWith('[') && value.includes(':')) {
      const arr = JSON.parse(value) as string[];
      obj[key] = arr.map((s: string) =>
        isLinkString(s) ? Link.fromString(s) : s,
      );
      continue;
    }
    if (isLinkString(value)) {
      obj[key] = Link.fromString(value);
      continue;
    }

    if (value === '[]') {
      obj[key] = [];
      continue;
    }

    if (value?.startsWith('[') || value?.startsWith('{')) {
      try {
        obj[key] = JSON.parse(value) as unknown;
        continue;
      } catch {
        obj[key] = value;
      }
    }

    obj[key] = value;
  }

  return obj;
}

export function serializeTxtRow(obj: any): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value instanceof Link) {
        return `${key}=${value.toString()}`;
      }

      if (Array.isArray(value) && value.every((v) => v instanceof Link)) {
        return `${key}=${JSON.stringify(value.map((v) => v.toString()))}`;
      }

      if (Array.isArray(value) && value.length === 0) {
        return `${key}=[]`;
      }

      if (typeof value === 'object') {
        return `${key}=${JSON.stringify(value)}`;
      }

      return `${key}=${value as string}`;
    })
    .join(';');
}
