FROM node:18-alpine AS builder

# Install OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/
COPY packages/utils/package.json ./packages/utils/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/tsconfig/api.json ./packages/tsconfig/
COPY packages/tsconfig/base/tsconfig.json ./packages/tsconfig/base/

# Install dependencies
RUN pnpm install --filter @siprod/api...

# Copy the rest of the application
COPY . .

# Generate Prisma client and build
WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app/apps/api

EXPOSE 4000

# Start the application
CMD ["pnpm", "start"]
