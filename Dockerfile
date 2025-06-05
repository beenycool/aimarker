# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Production image for frontend
FROM node:18-alpine AS frontend

WORKDIR /app

# Copy built files from builder
COPY --from=frontend-builder /app/out ./out

# Install serve to serve static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "out", "-l", "3000"]