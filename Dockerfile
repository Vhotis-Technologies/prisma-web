# Multi-stage build for smaller production image
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_CLIENT_WEB_URL=https://staging.app.prismavalet.com
ENV REACT_APP_CLIENT_WEB_URL=$REACT_APP_CLIENT_WEB_URL
RUN npm run build

# Production stage - much smaller
FROM node:18-alpine AS production

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]