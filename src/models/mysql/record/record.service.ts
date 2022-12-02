import { Injectable } from '@nestjs/common';
import { CustomEntityManager } from 'models/repository';
import { MysqlCustomRepository } from '../mysql.repository';
import { GetRecordsTestDto, RecordDto } from './record.dto';
import { Record } from './record.entity';

@Injectable()
export class RecordService {
  constructor(private recordRepository: MysqlCustomRepository<Record>) {}
  async getByLike(params: GetRecordsTestDto) {
    const builder = this.recordRepository.createQueryBuilder();
    if (params.content)
      builder.where('content like :content', {
        content: `%${params.content}%`,
      });
    if (params.name) builder.andWhere('name like :name', { name: `%${params.name}%` });
    return builder.getMany();
  }

  async deleteAndCreate(id: number, body: RecordDto) {
    await this.recordRepository.transaction(async (manager: CustomEntityManager<Record>) => {
      await manager.insert(Record, body);
      await manager.delete(Record, id);
    });
  }
}
