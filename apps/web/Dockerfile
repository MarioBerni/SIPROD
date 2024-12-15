FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/tsconfig/nextjs.json ./packages/tsconfig/
COPY packages/tsconfig/base/tsconfig.json ./packages/tsconfig/base/

# Install dependencies
RUN pnpm install --filter @siprod/web...

# Copy the rest of the application
COPY . .

# Build the application
WORKDIR /app/apps/web
RUN pnpm build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/apps/web

EXPOSE 3000

# Start Next.js
CMD ["pnpm", "start"]
