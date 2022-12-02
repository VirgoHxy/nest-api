import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CustomRepository } from 'models/repository';
import { DataSource, EntityTarget } from 'typeorm';

@Injectable()
export class MysqlCustomRepository<T> extends CustomRepository<T> {
  constructor(
    @Inject('entity') entityClass?: EntityTarget<T>,
    @InjectDataSource('mysqlDataSource') mysqlDataSource?: DataSource,
  ) {
    super(entityClass, mysqlDataSource);
  }
}
