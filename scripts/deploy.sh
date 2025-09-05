#!/bin/bash

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client with latest schema
echo "🔧 Generating Prisma client..."
npx prisma generate

# Apply database migrations
echo "🗄️ Applying database migrations..."
npx prisma migrate deploy

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Deployment process completed!"
