# Multi-stage build for a Vite React admin dashboard served by Nginx on Cloud Run

# 1) Builder stage: install deps and build static assets
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build

# 2) Runtime stage: serve with Nginx on port 8080 (Cloud Run default)
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx site with SPA-friendly config listening on 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run expects the app to listen on $PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
