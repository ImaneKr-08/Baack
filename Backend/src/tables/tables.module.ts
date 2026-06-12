import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { QrCodesModule } from 'src/qr-codes/qr-codes.module';

@Module({
  imports:[QrCodesModule],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
