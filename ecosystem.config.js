module.exports = {
  apps: [
    {
      name: "siprod-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0",
      cwd: "./apps/web",
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
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      time: true
    },
    {
      name: "siprod-backend",
      script: "dist/src/index.js",
      cwd: "./apps/api",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production"
      },
      max_memory_restart: "2G",
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      time: true
    }
  ]
};
