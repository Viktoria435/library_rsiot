import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { WorkerModule } from './worker/worker.module';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  imports: [BookModule, WorkerModule, VisitorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
