FROM node:22-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js application
ENV ADMIN_API_KEY=sevlex_secret_123
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

ENV PORT=3000
ENV NODE_ENV=production
ENV SEVLEX_POLICY_PATH=/data/sevlex.json
ENV SEVLEX_DB_PATH=/data/audit_log.db

EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
