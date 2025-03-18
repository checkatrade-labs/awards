# Technical Context: Checkatrade Awards Nomination System

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Meta-framework**: Next.js 15.2.2 for server-side rendering and API routes
- **UI Library**: Tailwind CSS for styling
- **Form Management**: React Hook Form for progressive enhancement approach
- **State Management**: React Context API for global state
- **API Client**: Axios for API requests
- **Code Quality**: ESLint with max-lines rule (200 lines) to enforce component size limits

### Backend
- **Framework**: Node.js with Express (via Next.js API routes)
- **Database**: PostgreSQL for structured data storage
- **ORM/ODM**: Prisma for database operations
- **Authentication**: JWT for admin access (planned)
- **File Storage**: GCP Storage for image uploads (planned)

### AI Integration
- **Service**: OpenAI API
- **Models**: 
  - GPT-4o for text analysis, quality assessment, and real-time feedback
  - Embeddings for semantic similarity and duplicate detection (planned)
- **Fallback**: Mock responses for development environment

### Deployment
- **Hosting**: Google Cloud Platform (planned)
- **Backend Hosting**: Google Cloud Run (planned)
- **CI/CD**: GitHub Actions (planned)
- **Database**: Cloud SQL (PostgreSQL) (planned)

## Implementation Details

### Form Components
We've implemented a multi-step nomination form with several key components:

1. **TradeSearch.tsx**
   - Autocomplete search for Checkatrade members
   - Integration with Checkatrade API
   - Debounced search with loading states
   - Display of trade details including location and skills

2. **JustificationField.tsx**
   - Text area for nomination justification
   - AI analysis triggered on 15-second idle or explicit check
   - Quality feedback with visual indicators
   - Criteria alignment visualization with trust, quality, and reliability metrics
   - Suggestions for improvement

3. **ImageUpload.tsx**
   - Drag and drop file upload
   - Client-side validation for file type and size
   - Preview of uploaded images
   - Multiple image support with limit control

4. **NominationForm.tsx**
   - Multi-step form navigation
   - React Hook Form integration
   - Progressive enhancement with optional fields
   - Step validation before proceeding
   - Award category filtering based on relationship

### AI Services
We've implemented AI services for nomination quality assessment:

1. **aiService.ts**
   - Integration with OpenAI API
   - Text analysis for nomination quality
   - Real-time feedback on justification text
   - Scoring against judging criteria
   - Fallback mock responses for development
   - Error handling and retry logic

### External API Integration
We're integrating with the Checkatrade API for trade validation:

1. **checkatradeService.ts**
   - Trade search for autocomplete
   - Trade profile retrieval for validation
   - Error handling for API failures
   - Response transformation for UI components

### Data Models
We've defined comprehensive TypeScript interfaces and Prisma schema:

1. **nomination.ts**
   - Type definitions for all entities
   - Form data interfaces
   - API response types
   - Enums for status and relationships

2. **schema.prisma**
   - Entity relationships
   - Field types and constraints
   - Indexes for efficient querying
   - One-to-many and many-to-one relationships

## External API Integration

### Checkatrade API
- **Base URL**: `https://api.checkatrade.com/v1/consumer-public/`
- **Endpoints**:
  - Trade Search: `trades?name={searchTerm}&page={page}&size={size}`
  - Trade Profile: `trades/{companyId}`
- **Response Format**: JSON
- **Authentication**: None required for public endpoints
- **Rate Limiting**: None observed
- **Usage**: 
  - Autocomplete for trade selection in nomination form
  - Validation of trade membership
  - Retrieving trade details for displaying in the form

### OpenAI API
- **Base URL**: `https://api.openai.com/v1/`
- **Endpoints**:
  - Text Analysis: `chat/completions`
- **Authentication**: API Key required
- **Rate Limiting**: Applied based on account tier
- **Usage**:
  - Real-time feedback on nomination quality
  - Scoring nominations against judging criteria
  - Detecting duplicate nominations (planned)
  - Analyzing sentiment and enthusiasm

## Development Environment

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git
- PostgreSQL (for local development)
- Google Cloud SDK (for deployment)
- OpenAI API key (for full AI functionality)

### Environment Variables
```
# API Keys
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/checkatrade_awards

# Storage (Planned)
GCS_BUCKET=your-bucket-name
GCS_CREDENTIALS_PATH=/path/to/your-service-account.json

# Environment
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Local Development Setup
```bash
# Clone repository
git clone [repository-url]
cd checkatrade-awards

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with appropriate values

# Run development server
npm run dev
```

## Technical Constraints

### Implemented Workarounds
- **OpenAI API Key**: Added fallback mock responses for development without API key
- **Database Connection**: Will use local SQLite during development if PostgreSQL is unavailable
- **Checkatrade API**: Implemented error handling for various response scenarios

### Performance Considerations
- **AI Response Time**: OpenAI API calls may introduce latency, requiring UI feedback during processing
- **Image Uploads**: Client-side validation to handle potentially large image files
- **Real-time Feedback**: Balance between immediate feedback and user experience
- **Multi-step Form**: State preservation between steps to avoid data loss

### Security Implementation (Planned)
- **Input Validation**: Client-side and server-side validation
- **XSS Prevention**: Content sanitization
- **CSRF Protection**: Token-based protection
- **Rate Limiting**: API endpoint protection
- **Image Validation**: Server-side validation of uploaded images

### Accessibility Implementation
- **Semantic HTML**: Proper heading structure and ARIA attributes
- **Keyboard Navigation**: Fully navigable form
- **Color Contrast**: WCAG 2.1 AA compliant
- **Error Messaging**: Clear, descriptive error messages
- **Progressive Enhancement**: Functional without JavaScript

## Technical Decisions

### Form Design Decisions
- **Multi-step Approach**: Reduces cognitive load by dividing the form into logical sections
- **Progressive Enhancement**: Balances simplicity with detail collection
- **Idle-triggered Analysis**: Minimizes API calls while providing timely feedback
- **Client-side Validation**: Provides immediate feedback before submission

### AI Integration Decisions
- **Mock Response Fallback**: Enables development without requiring API keys
- **Quality Criteria Weighting**: Trust, quality, and reliability are weighted equally
- **Explicit Check Button**: Gives user control over when analysis happens
- **Suggestion Display**: Shows specific, actionable improvements

### Data Storage Decisions (Planned)
- **PostgreSQL**: Offers relational structure ideal for nomination data
- **Prisma ORM**: Provides type safety and query builder
- **File Storage**: GCP Cloud Storage for scalable image storage
- **Database Indexing**: Optimized for query performance

### API Design Decisions (Planned)
- **RESTful Endpoints**: Standard HTTP methods for CRUD operations
- **Middleware**: Authentication, validation, and error handling
- **Response Format**: Consistent JSON structure
- **Error Handling**: Descriptive error messages and appropriate status codes
