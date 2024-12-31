module.exports = {
  apps: [
    {
      name: "siprod-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0",
      cwd: "/var/www/siprod/apps/web",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
        NEXT_PUBLIC_API_URL: "/api",
        NEXT_TELEMETRY_DISABLED: 1
      },
      max_memory_restart: "1G",
      error_file: "/var/www/siprod/logs/frontend-error.log",
      out_file: "/var/www/siprod/logs/frontend-out.log",
      time: true
    },
    {
      name: "siprod-backend",
      script: "dist/src/index.js",
      cwd: "/var/www/siprod/apps/api",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        DATABASE_URL: "postgresql://postgres:Mario7654321+@localhost:5432/siprod",
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "Mario7654321+",
        POSTGRES_DB: "siprod",
        POSTGRES_PORT: 5432,
        JWT_SECRET: "siprod_jwt_dev_secret_2025!",
        CORS_ORIGIN: "https://siprod.uy",
        API_PREFIX: "/api",
        PRISMA_ENGINE_TYPE: "library",
        RATE_LIMIT_WINDOW: 15,
        RATE_LIMIT_MAX: 100,
        LOG_LEVEL: "debug",
        LOG_FORMAT: "simple"
      },
      max_memory_restart: "2G",
      error_file: "/var/www/siprod/logs/backend-error.log",
      out_file: "/var/www/siprod/logs/backend-out.log",
      time: true
    }
  ]
};
