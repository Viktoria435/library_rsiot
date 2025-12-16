import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookLinkManager } from '../common/book-link-manager';
import { VisitorModule } from '../visitor/visitor.module';
import { WorkerModule } from '../worker/worker.module';

@Module({
  imports: [VisitorModule, WorkerModule],
  controllers: [BookController],
  providers: [BookService, BookLinkManager],
  exports: [BookService, BookLinkManager],
})
export class BookModule {}
