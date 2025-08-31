# Use Node.js 18 slim image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port (Cloud Run uses 8080)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]

