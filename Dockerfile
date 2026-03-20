# ── Stage 1: Build ────────────────────────────────────────────────
FROM node:24-alpine AS build

RUN apk add --no-cache bash

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ src/
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────────
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist/ dist/
COPY bin/ bin/
COPY file_inputs.txt ./

ENTRYPOINT ["node", "dist/index.js"]
