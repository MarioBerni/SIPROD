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
        NEXT_PUBLIC_API_URL: "https://siprod.uy/api",
        NEXT_TELEMETRY_DISABLED: 1,
        HOST: "0.0.0.0"
      },
      max_memory_restart: "1G",
      error_file: "/var/www/siprod/logs/frontend-error.log",
      out_file: "/var/www/siprod/logs/frontend-out.log",
      time: true
    },
    {
      name: "siprod-backend",
      script: "dist/index.js",
      cwd: "/var/www/siprod/apps/api",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        DATABASE_URL: "postgresql://siprod_user:siprod_pass@localhost:5432/siprod_db",
        JWT_SECRET: "your_production_jwt_secret_here",
        CORS_ORIGIN: "https://siprod.uy",
        API_PREFIX: "/api",
        HOST: "0.0.0.0",
        PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
        PRISMA_CLIENT_ENGINE_TYPE: "binary"
      },
      max_memory_restart: "2G",
      error_file: "/var/www/siprod/logs/backend-error.log",
      out_file: "/var/www/siprod/logs/backend-out.log",
      time: true,
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
      max_restarts: 10,
      restart_delay: 4000,
      autorestart: true,
      post_update: [
        "cd /var/www/siprod/apps/api && pnpm install",
        "cd /var/www/siprod/apps/api && pnpm prisma generate",
        "cd /var/www/siprod/apps/api && pnpm build"
      ]
    }
  ]
};
