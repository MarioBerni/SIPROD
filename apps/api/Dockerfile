FROM node:18-alpine AS builder

# Install OpenSSL and build dependencies
RUN apk add --no-cache openssl

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/
COPY packages/utils/package.json ./packages/utils/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/tsconfig/api.json ./packages/tsconfig/
COPY packages/tsconfig/base/tsconfig.json ./packages/tsconfig/base/

# Install dependencies
RUN pnpm install --filter @siprod/api... --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Prisma client and build
WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build

# Production image
FROM node:18-alpine AS runner

# Install production dependencies
RUN apk add --no-cache openssl

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Install production dependencies only
WORKDIR /app/apps/api
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=4000

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 apiuser
RUN chown -R apiuser:nodejs /app
USER apiuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

CMD ["node", "dist/main.js"]
