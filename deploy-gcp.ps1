# Fruit Planner Backend - GCP Cloud Run Deployment Script (PowerShell)
# Make sure you have gcloud CLI installed and authenticated

param(
    [string]$ProjectId = "your-gcp-project-id",  # Replace with your actual GCP project ID
    [string]$ServiceName = "fruit-planner-backend",
    [string]$Region = "us-central1"  # Change to your preferred region
)

$ErrorActionPreference = "Stop"

$ImageName = "gcr.io/$ProjectId/$ServiceName"

Write-Host "🚀 Starting deployment to Google Cloud Run..." -ForegroundColor Green

# Check if gcloud is installed
try {
    gcloud version | Out-Null
} catch {
    Write-Host "❌ Error: gcloud CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Error: Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Project ID: $ProjectId" -ForegroundColor Cyan
Write-Host "🏷️  Service Name: $ServiceName" -ForegroundColor Cyan
Write-Host "🌍 Region: $Region" -ForegroundColor Cyan
Write-Host "🐳 Image: $ImageName" -ForegroundColor Cyan

# Prompt for project ID if not set
if ($ProjectId -eq "your-gcp-project-id") {
    Write-Host "⚠️  Please update ProjectId parameter with your actual GCP project ID" -ForegroundColor Yellow
    $ProjectId = Read-Host "Enter your GCP Project ID"
    $ImageName = "gcr.io/$ProjectId/$ServiceName"
}

# Set the project
Write-Host "🔧 Setting GCP project..." -ForegroundColor Blue
gcloud config set project $ProjectId

# Enable required APIs
Write-Host "🔌 Enabling required APIs..." -ForegroundColor Blue
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the application locally
Write-Host "🔨 Building the application..." -ForegroundColor Blue
npm run build

# Build and push Docker image
Write-Host "🐳 Building Docker image..." -ForegroundColor Blue
docker build -t $ImageName .

Write-Host "📤 Pushing image to Google Container Registry..." -ForegroundColor Blue
docker push $ImageName

# Deploy to Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Blue
gcloud run deploy $ServiceName `
    --image $ImageName `
    --platform managed `
    --region $Region `
    --allow-unauthenticated `
    --port 8080 `
    --memory 2Gi `
    --cpu 1 `
    --max-instances 10 `
    --min-instances 0 `
    --set-env-vars NODE_ENV=production,PORT=8080 `
    --timeout 300

Write-Host "✅ Deployment completed!" -ForegroundColor Green

# Get the service URL
$ServiceUrl = gcloud run services describe $ServiceName --platform managed --region $Region --format 'value(status.url)'
Write-Host "🌐 Your backend is now live at: $ServiceUrl" -ForegroundColor Green
Write-Host "🔍 Health check: $ServiceUrl/health" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up environment variables (secrets) in GCP Secret Manager:" -ForegroundColor White
Write-Host "   - DATABASE_URL (your NeonDB connection string)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET (a secure random string)" -ForegroundColor Gray
Write-Host "   - GEMINI_API_KEY (your Google Gemini API key)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update your frontend configuration to use this backend URL:" -ForegroundColor White
Write-Host "   EXPO_PUBLIC_API_BASE_URL=$ServiceUrl/api" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test your API endpoints:" -ForegroundColor White
Write-Host "   curl $ServiceUrl/health" -ForegroundColor Gray
