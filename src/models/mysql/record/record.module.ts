import { Module } from '@nestjs/common';
import { MysqlCustomRepository } from '../mysql.repository';
import { RecordController } from './record.controller';
import { Record } from './record.entity';
import { RecordService } from './record.service';

@Module({
  imports: [],
  providers: [{ provide: 'entity', useValue: Record }, MysqlCustomRepository, RecordService],
  controllers: [RecordController],
})
export class RecordModule {}
