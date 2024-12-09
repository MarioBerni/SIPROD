module.exports = {
  apps: [
    {
      name: "siprod-frontend",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "./apps/web",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "https://api.siprod.gub.uy",
        NEXT_TELEMETRY_DISABLED: 1
      }
    },
    {
      name: "siprod-backend",
      script: "dist/main.js",
      cwd: "./apps/api",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        DATABASE_URL: "postgresql://siprod_user:siprod_pass@localhost:5432/siprod_db",
        JWT_SECRET: "your_production_jwt_secret_here",
        CORS_ORIGIN: "https://siprod.gub.uy"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
