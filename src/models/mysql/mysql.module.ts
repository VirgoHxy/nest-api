import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './record/record.entity';
import { RecordModule } from './record/record.module';

@Module({
  imports: [TypeOrmModule.forFeature([Record], 'mysqlDataSource'), RecordModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class MysqlModule {}
