module.exports = {
  apps: [
    {
      name: "siprod-frontend",
      script: "npm",  
      args: "start",
      cwd: "/var/www/siprod/apps/web",
      instances: 1,
      exec_mode: "fork", 
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "https://siprod.uy/api",
        NEXT_TELEMETRY_DISABLED: 1
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
      instances: 2,
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        DATABASE_URL: "postgresql://siprod_user:siprod_pass@localhost:5432/siprod_db",
        JWT_SECRET: "your_production_jwt_secret_here",
        CORS_ORIGIN: "https://siprod.uy",
        API_PREFIX: "/api"
      },
      max_memory_restart: "1G",
      error_file: "/var/www/siprod/logs/backend-error.log",
      out_file: "/var/www/siprod/logs/backend-out.log",
      time: true
    }
  ]
};
