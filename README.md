# Awards Nomination System

A Next.js application for a trade awards nomination system. This application allows users to nominate trades for awards, with AI-powered feedback on nominations and integration with the Checkatrade API.

## Features

- Multi-step nomination form with real-time validation
- AI-powered feedback on nomination quality
- Integration with Checkatrade API for trade search and validation
- Responsive design for all devices
- Admin panel for reviewing nominations

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- React Hook Form for form management
- Tailwind CSS for styling
- Prisma ORM with PostgreSQL
- OpenAI integration for AI-powered feedback

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/awards-ai"
OPENAI_API_KEY="your-openai-api-key" # Optional, will use mock data if not provided
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Database Schema

The application uses Prisma with PostgreSQL. The main models include:

- Nomination: The core nomination data
- Nominee: Information about the nominated trade
- Nominator: Information about the person making the nomination
- Justification: Text explaining why the trade deserves the award
- Media: Supporting images or documents
- AwardCategory: Available award categories

## AI Integration

The application uses OpenAI for analyzing nomination quality. If no API key is provided, the application will use mock data for AI responses.

## Deployment

### Manual Deployment

The application can be deployed to Google Cloud Run using the included `deploy-to-cloud-run.sh` script, or to Vercel for a simpler deployment process.

### CI/CD with GitHub Actions

This project includes GitHub Actions workflows for automated deployments:

1. **PR Preview Deployments** (`.github/workflows/pr-preview.yml`)
   - Triggered when a PR is opened, updated, or reopened
   - Builds and deploys a preview version to Google Cloud Run
   - Each PR gets its own isolated deployment with a unique URL
   - Posts the preview URL as a comment on the PR

2. **PR Cleanup** (`.github/workflows/pr-cleanup.yml`)
   - Triggered when a PR is closed (merged or rejected)
   - Automatically deletes the PR preview deployment
   - Removes the associated Docker image from Artifact Registry

3. **Production Deployment** (`.github/workflows/production-deploy.yml`)
   - Triggered when changes are pushed to the main branch
   - Builds and deploys the application to the production environment
   - Tags Docker images with both the Git SHA and 'latest'

### GitHub Secrets Required

To use the CI/CD workflows, you need to set up the following GitHub secrets:

- `OPENAI_API_KEY`: Your OpenAI API key for the application

### Google Cloud Setup

The CI/CD workflows require the following Google Cloud setup:

1. A Google Cloud project with Cloud Run and Artifact Registry enabled
2. Workload Identity Federation configured for GitHub Actions
3. A service account with appropriate permissions
4. An Artifact Registry repository named 'awards' in europe-west2
