import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: MysqlConnectionOptions = {
  type:
    (process.env.DATABASE_TYPE as MysqlConnectionOptions['type']) || 'mysql',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  database: process.env.DATABASE_SCHEMA || '',
  username: process.env.DATABASE_USERNAME || '',
  password: process.env.DATABASE_PASSWORD || '',
  entities: ['dist/**/*.entity{.ts,.js}'],
  /* Note : it is unsafe to use synchronize: true for schema synchronization on production once you get data in your database. */
  synchronize: !!parseInt(process.env.DATABASE_SYNCHRONIZATION, 10) || false,
  // autoLoadEntities: true,
};

export default {
  ...typeOrmConfig,
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
