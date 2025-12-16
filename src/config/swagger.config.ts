import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('Library API Documentation')
    .addBearerAuth()
    .build();
}
