import { ConfigService, ConfigType, registerAs } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { typeOrmConfig } from 'src/config/orm.config';

const databaseConfig = registerAs<MysqlConnectionOptions>(
  'db',
  () => typeOrmConfig,
);

export type DatabaseConfigType = ConfigType<typeof databaseConfig>;

export const databaseConfigFactory = async (
  configService: ConfigService<{ db: DatabaseConfigType }>,
): Promise<MysqlConnectionOptions> => ({
  // entities: [ 'dist/**/*.entity{.ts,.js}' ],
  ...configService.get<MysqlConnectionOptions>('db', { infer: true }),
});

export default databaseConfig;
