module.exports = {
  apps: [
    {
      name: "siprod-frontend-dev",
      script: "pnpm",
      args: "dev",
      cwd: "./apps/web",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_restarts: 3,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "http://localhost:4000/api",
        NEXT_TELEMETRY_DISABLED: 1
      }
    },
    {
      name: "siprod-backend-dev",
      script: "pnpm",
      args: "dev",
      cwd: "./apps/api",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_restarts: 3,
      env: {
        NODE_ENV: "development",
        PORT: 4000,
        DATABASE_URL: "postgresql://postgres:Mario7654321+@localhost:5432/siprod",
        JWT_SECRET: "Mario7654321+",
        CORS_ORIGIN: "http://localhost:3000",
        API_PREFIX: "/api",
        PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
        PRISMA_CLIENT_ENGINE_TYPE: "binary",
        RATE_LIMIT_WINDOW: 15,
        RATE_LIMIT_MAX: 100
      }
    }
  ]
};
