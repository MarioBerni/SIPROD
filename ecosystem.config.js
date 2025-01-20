module.exports = {
  apps: [
    {
      name: "siprod-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./apps/web",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 3000,
        NODE_ENV: "production"
      },
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      time: true
    },
    {
      name: "siprod-backend",
      script: "./dist/src/index.js", // Actualizado la ruta del script del backend
      cwd: "./apps/api",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        // Node Environment
        NODE_ENV: "development",
        
        // Database Configuration
        DATABASE_URL: "postgresql://postgres:Mario7654321+@localhost:5432/siprod",
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "Mario7654321+",
        POSTGRES_DB: "siprod",
        POSTGRES_PORT: "5432",
        
        // API Configuration
        PORT: "4000",
        API_PREFIX: "/api",
        
        // Security Configuration
        JWT_SECRET: "siprod_jwt_dev_secret_2025_secure_key_32!",
        NEXT_PUBLIC_JWT_SECRET: "siprod_jwt_dev_secret_2025_secure_key_32!",
        SESSION_SECRET: "siprod_session_dev_secret_2025_very_secure_32!",
        SSL_ENABLED: "false",
        JWT_EXPIRATION: "24",
        MAX_LOGIN_ATTEMPTS: "5",
        SECURE_COOKIES: "false",
        ENABLE_RATE_LIMIT: "false",
        ENABLE_HELMET: "true",
        
        // Rate Limiting
        RATE_LIMIT_WINDOW: "15",
        RATE_LIMIT_MAX: "100",
        
        // CORS Configuration
        CORS_ORIGIN: "http://localhost:3000",
        
        // Redis Configuration
        REDIS_URL: "redis://localhost:6379",
        REDIS_PORT: "6379",
        
        // Logging Configuration
        LOG_LEVEL: "debug",
        LOG_FORMAT: "json"
      },
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      time: true
    }
  ]
};
