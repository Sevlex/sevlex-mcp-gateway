FROM node:20-alpine AS base

RUN apk add --no-cache python3 make g++ curl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Next.js application
RUN npm run build

ENV PORT=3000
ENV NODE_ENV=production
ENV SEVLEX_POLICY_PATH=/data/sevlex.json
ENV SEVLEX_DB_PATH=/data/audit_log.db

EXPOSE 3000

CMD ["npm", "start"]
