import { ConfigType, registerAs } from '@nestjs/config';

const authConfig = registerAs('auth', () => {
  const config = {
    hashSalt: process.env.HASH_SALT || '',
    hashRounds: parseInt(process.env.HASH_ROUNDS, 10) || 10,
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
  };

  if (!config.hashSalt.length) {
    throw new Error('Invalid Hash Salt Configuration.');
  }

  if (!config.jwtSecret.length) {
    throw new Error('Invalid JWT Secret Configuration.');
  }

  return config;
});

export type AuthConfig = ConfigType<typeof authConfig>;

export const AUTH_CONFIG_KEY = authConfig.KEY;

export default authConfig;
