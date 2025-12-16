import { StreamableFile } from '@nestjs/common';

export function buildDownloadFile(
  table: string,
  id: string,
  payload: unknown,
): StreamableFile {
  const content = JSON.stringify(payload, null, 2);
  const buffer = Buffer.from(content, 'utf-8');
  const safeTable = table.replace(/[^a-z0-9_-]/gi, '') || 'item';
  const safeId = id.replace(/[^a-z0-9_-]/gi, '') || 'data';
  return new StreamableFile(buffer, {
    type: 'text/plain',
    disposition: `attachment; filename="${safeTable}-${safeId}.txt"`,
  });
}
