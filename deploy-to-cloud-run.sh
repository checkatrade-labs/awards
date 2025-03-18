#!/bin/bash
set -e

# Configuration
PROJECT_ID="playground-jamespain-poc-21017"  # Replace with your GCP project ID
SERVICE_NAME="awards"
REGION="europe-west2"  # Replace with your preferred region
OPENAI_API_KEY="$(grep OPENAI_API_KEY .env | cut -d '=' -f2)"

# Build the Docker image using Cloud Build
echo "Building Docker image using Cloud Build..."
IMAGE_NAME="europe-west2-docker.pkg.dev/$PROJECT_ID/$SERVICE_NAME/$SERVICE_NAME"
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="OPENAI_API_KEY=$OPENAI_API_KEY" \
  --project $PROJECT_ID

# Set IAM policy to allow all users to access the service
echo "Setting IAM policy to allow public access..."
gcloud run services add-iam-policy-binding $SERVICE_NAME \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region=$REGION \
  --project=$PROJECT_ID

echo "Deployment complete! Your application is now running on Cloud Run."
echo "You can access it at: $(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID)"
