import { Module, forwardRef } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { ExamsModule } from '../exams/exams.module';

@Module({
  imports: [forwardRef(() => ExamsModule)],
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
