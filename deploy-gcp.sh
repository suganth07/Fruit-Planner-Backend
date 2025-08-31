#!/bin/bash

# Fruit Planner Backend - GCP Cloud Run Deployment Script
# Make sure you have gcloud CLI installed and authenticated

set -e  # Exit on any error

# Configuration
PROJECT_ID="your-gcp-project-id"  # Replace with your actual GCP project ID
SERVICE_NAME="fruit-planner-backend"
REGION="us-central1"  # Change to your preferred region
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting deployment to Google Cloud Run..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed. Please install it first."
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

echo "📋 Project ID: $PROJECT_ID"
echo "🏷️  Service Name: $SERVICE_NAME"
echo "🌍 Region: $REGION"
echo "🐳 Image: $IMAGE_NAME"

# Prompt for project ID if not set
if [ "$PROJECT_ID" = "your-gcp-project-id" ]; then
    echo "⚠️  Please update PROJECT_ID in this script with your actual GCP project ID"
    read -p "Enter your GCP Project ID: " PROJECT_ID
    IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
fi

# Set the project
echo "🔧 Setting GCP project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the application locally
echo "🔨 Building the application..."
npm run build

# Build and push Docker image
echo "🐳 Building Docker image..."
docker build -t $IMAGE_NAME .

echo "📤 Pushing image to Google Container Registry..."
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 2Gi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0 \
    --set-env-vars NODE_ENV=production,PORT=8080 \
    --timeout 300

echo "✅ Deployment completed!"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')
echo "🌐 Your backend is now live at: $SERVICE_URL"
echo "🔍 Health check: $SERVICE_URL/health"

echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables (secrets) in GCP Secret Manager:"
echo "   - DATABASE_URL (your NeonDB connection string)"
echo "   - JWT_SECRET (a secure random string)"
echo "   - GEMINI_API_KEY (your Google Gemini API key)"
echo ""
echo "2. Update your frontend configuration to use this backend URL:"
echo "   EXPO_PUBLIC_API_BASE_URL=$SERVICE_URL/api"
echo ""
echo "3. Test your API endpoints:"
echo "   curl $SERVICE_URL/health"
