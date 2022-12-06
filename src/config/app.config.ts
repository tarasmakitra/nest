import { ConfigType, registerAs } from '@nestjs/config';

const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
}));

export type AppConfigType = ConfigType<typeof appConfig>;

export default appConfig;
