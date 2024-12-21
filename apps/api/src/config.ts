interface Config {
  port: number;
  logLevel: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
}

export const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
};
