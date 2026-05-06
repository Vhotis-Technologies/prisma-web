# Multi-stage build for smaller production image
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Production stage - much smaller
FROM node:18-alpine AS production

WORKDIR /app
RUN npm install -g serve --silent
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]