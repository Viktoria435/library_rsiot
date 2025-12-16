import { Module, forwardRef } from '@nestjs/common';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { VisitorLinkManager } from 'src/common/visitor-link-manager';
import { BookModule } from '../book/book.module';

@Module({
  imports: [forwardRef(() => BookModule)],
  controllers: [VisitorController],
  providers: [VisitorService, VisitorLinkManager],
  exports: [VisitorService, VisitorLinkManager],
})
export class VisitorModule {}
