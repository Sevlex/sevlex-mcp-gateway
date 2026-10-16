FROM node:22-slim AS base

WORKDIR /app

# Install build dependencies for native modules and container health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/
COPY bin/ ./bin/
COPY sevlex.json ./sevlex.json

# Prepare persistent data directory
RUN mkdir -p /data

# Environment defaults
ENV PORT=8080
ENV NODE_ENV=production
ENV SEVLEX_CONFIG_PATH=/data/sevlex.json
ENV SEVLEX_DB_PATH=/data/audit_log.db

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/sse || exit 1

CMD ["npx", "tsx", "src/cli.ts", "sse", "8080"]
