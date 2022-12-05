import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { appConfig, dbConfig } from '../config';

export const mysqlOptions: TypeOrmModuleOptions = {
  /* typeorm配置 */
  type: 'mysql',
  host: dbConfig.mysql.host,
  port: dbConfig.mysql.port,
  username: dbConfig.mysql.username,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  // 启动项目是否自动生成数据库架构
  synchronize: false,
  // 是否启动日志 sql语句打印
  logging: appConfig.debug,
  // 启动项目是否自动运行迁移
  migrationsRun: false,
  entities: [join(__dirname, '..', 'models/mysql/**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations/**/*.{ts,js}')],
  /* nest配置 */
  name: 'mysqlDataSource',
  // 自动加载entity
  autoLoadEntities: true,
};
