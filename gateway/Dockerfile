FROM node:20-alpine AS base

# Install build dependencies for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
COPY bin/ ./bin/
COPY sevlex.json ./sevlex.json

# Environment defaults
ENV PORT=8080
ENV SEVLEX_POLICY_PATH=/data/sevlex.json
ENV SEVLEX_DB_PATH=/data/audit_log.db

EXPOSE 8080

CMD ["npx", "tsx", "src/cli.ts", "sse", "8080"]
