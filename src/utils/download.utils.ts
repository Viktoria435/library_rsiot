import { StreamableFile } from '@nestjs/common';

export function buildDownloadFile(
  table: string,
  id: string,
  payload: unknown,
): StreamableFile {
  const content = JSON.stringify(payload, null, 2);
  const buffer = Buffer.from(content, 'utf-8');
  return new StreamableFile(buffer, {
    type: 'text/plain',
    disposition: `attachment; filename="${table}-${id}.txt"`,
  });
}
