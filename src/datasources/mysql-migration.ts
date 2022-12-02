import { DataSource, DataSourceOptions } from 'typeorm';
import { mysqlOptions } from './mysql.datasource';

// 这个仅用作migrate 不要导入或者引用
export const mysqlMigration = new DataSource(mysqlOptions as DataSourceOptions);
