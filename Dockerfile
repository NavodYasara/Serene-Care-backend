# ==========================================
# STAGE 1: Builder (The Prep Kitchen)
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install ALL dependencies (including devDependencies like typescript)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript (generates the dist/ folder)
RUN npm run build

# ==========================================
# STAGE 2: Runner (The Serving Table)
# ==========================================
FROM node:18-alpine AS runner

WORKDIR /serene-app

# Set production environment
ENV NODE_ENV=production

# Copy package files to install production dependencies
COPY package*.json ./

# Install ONLY production-level dependencies (saves space and memory)
RUN npm ci --only=production

# Copy the compiled JS files from the builder stage
COPY --from=builder /app/dist ./dist

# Run as a non-root user (security best practice)
USER node

# Expose the application port
EXPOSE 5000

# Run the compiled JavaScript server
CMD ["node", "dist/server.js"]