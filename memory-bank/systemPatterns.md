# System Patterns: Checkatrade Awards Nomination System

## Overall Architecture

```mermaid
flowchart TD
    subgraph Frontend
        NF[Nomination Form]
        AF[Admin Dashboard]
    end
    
    subgraph Backend
        API[API Layer]
        AI[AI Processing]
        DB[Database]
        FS[File Storage]
    end
    
    subgraph External
        CT[Checkatrade API]
        OAI[OpenAI API]
        GCS[GCP Storage]
    end
    
    NF -->|Submit Nomination| API
    NF -->|Trade Search| CT
    NF -->|Real-time Feedback| AI
    AF -->|Manage Nominations| API
    
    API -->|Store/Retrieve| DB
    API -->|Validate Trade| CT
    API -->|Process Text| AI
    API -->|Store/Retrieve Images| FS
    
    AI -->|Analyze Text| OAI
    FS -->|Cloud Storage| GCS
```

## Current Implementation Structure

### Frontend Components

#### Multi-step Nomination Form
```mermaid
flowchart TD
    NF[NominationForm]
    TS[TradeSearch]
    RF[Relationship Field]
    ACS[Award Category Selection]
    JF[JustificationField]
    IU[ImageUpload]
    OS[Optional Sections]
    MN[Multi-step Navigation]
    
    NF --> TS
    NF --> RF
    NF --> ACS
    NF --> JF
    NF --> IU
    NF --> OS
    NF --> MN
    
    JF -->|On Idle/Check| AI[AI Feedback]
    TS -->|API Search| CT[Checkatrade API]
    
    subgraph Progressive Enhancement
        OS -->|Optional| AD[Additional Details]
        OS -->|Optional| RI[Region Information]
        OS -->|Optional| PI[Phone Information]
    end
    
    subgraph Form Navigation
        MN -->|Step 1| S1[Nominee Selection]
        MN -->|Step 2| S2[Nominator Details]
        MN -->|Step 3| S3[Award Category]
        MN -->|Step 4| S4[Justification]
        MN -->|Step 5| S5[Supporting Materials]
    end
```

#### AI Feedback Implementation
```mermaid
flowchart TD
    JF[Justification Field] --> IM[Input Monitoring]
    
    IM --> IT[Idle Timer]
    IM --> EB[Explicit Button]
    
    IT -->|After 15s| TA[Trigger Analysis]
    EB -->|User Click| TA
    
    TA --> AK{API Key Available?}
    
    AK -->|Yes| OA[OpenAI Analysis]
    AK -->|No| MR[Mock Response]
    
    OA --> FR[Format Response]
    MR --> FR
    
    FR --> DS[Display Suggestions]
    FR --> QI[Quality Indicator]
    FR --> CA[Criteria Alignment]
```

#### Form State Management
```mermaid
flowchart TD
    RHF[React Hook Form] --> FS[Form State]
    FS --> FV[Form Validation]
    FS --> SD[Step Data]
    
    SD --> S1[Step 1 Data]
    SD --> S2[Step 2 Data]
    SD --> S3[Step 3 Data]
    SD --> S4[Step 4 Data]
    SD --> S5[Step 5 Data]
    
    S1 --> NV[Navigate Steps]
    S2 --> NV
    S3 --> NV
    S4 --> NV
    S5 --> NV
    
    FS --> AS[Award Selection]
    AS --> FC[Filter Categories]
    
    FS --> RS[Relationship Selection]
    RS --> FC
```

### Backend Data Model

```mermaid
erDiagram
    NOMINATION {
        id string PK
        timestamp datetime
        award_category string
        region string
        status string
        quality_score float
        nomination_count integer
        is_shortlisted boolean
        manual_override boolean
    }
    
    NOMINEE {
        id string PK
        company_id string
        company_name string
        trade_name string
        trade_type string
        contact_email string
        contact_phone string
        is_valid_member boolean
        needs_review boolean
        location string
    }
    
    NOMINATOR {
        id string PK
        name string
        email string
        phone string
        relationship string
    }
    
    JUSTIFICATION {
        id string PK
        nomination_id string FK
        text string
        sentiment_score float
        criteria_alignment float
        feedback string
        quality_assessment string
    }
    
    MEDIA {
        id string PK
        nomination_id string FK
        url string
        type string
        description string
        storage_path string
    }
    
    AWARD_CATEGORY {
        id string PK
        name string
        description string
        allows_self_nomination boolean
        region string
    }
    
    NOMINATION ||--|| NOMINEE : "nominates"
    NOMINATION ||--|| NOMINATOR : "submitted by"
    NOMINATION ||--o{ JUSTIFICATION : "includes"
    NOMINATION ||--o{ MEDIA : "contains"
    NOMINATION }|--|| AWARD_CATEGORY : "belongs to"
```

## Implemented Design Patterns

### Progressive Enhancement Pattern
- Core form with essential fields presented first
- Optional sections revealed via "Add More Details" button
- Preserves simplicity while allowing for detailed submissions
- Implemented through conditional rendering and state management

```mermaid
flowchart TD
    Core[Core Form Fields] --> Optional[Optional Fields]
    Core --> Submit[Quick Submit]
    Optional --> Details[Additional Details]
    Optional --> Region[Regional Information]
    Optional --> Submit
```

### Multi-step Form Pattern
- Form divided into logical steps to reduce cognitive load
- State preserved between steps
- Navigation controls for moving forward and backward
- Validation at each step before proceeding

```mermaid
flowchart LR
    S1[Step 1: Nominee] --> S2[Step 2: Nominator]
    S2 --> S3[Step 3: Category]
    S3 --> S4[Step 4: Justification]
    S4 --> S5[Step 5: Supporting Materials]
    S5 --> Submit[Submit]
    
    S2 -.-> S1
    S3 -.-> S2
    S4 -.-> S3
    S5 -.-> S4
```

### AI Integration Pattern
- Real-time processing for immediate feedback
- Idle-detection to minimize API calls
- Explicit check option for user control
- Development mode with mock responses
- Graceful fallback for API failures

```mermaid
flowchart TD
    Input[User Input] --> ID{Idle for 15s?}
    ID -->|Yes| Analyze[Analyze Text]
    
    Input --> EC{Explicit Check?}
    EC -->|Yes| Analyze
    
    Analyze --> API{API Available?}
    API -->|Yes| OAI[OpenAI Processing]
    API -->|No| Mock[Mock Response]
    
    OAI --> Format[Format Response]
    Mock --> Format
    
    Format --> Display[Display Feedback]
```

### Form Validation Pattern
- Client-side validation for immediate feedback
- Real-time field validation
- Step validation before proceeding
- Form-level validation before submission
- Implemented using React Hook Form

```mermaid
flowchart TD
    Input[User Input] --> FV[Field Validation]
    FV -->|Valid| Continue[Continue]
    FV -->|Invalid| Error[Show Error]
    
    Next[Next Step] --> SV[Step Validation]
    SV -->|Valid| NS[Proceed to Next Step]
    SV -->|Invalid| Highlight[Highlight Errors]
    
    Submit[Submit Form] --> FNV[Final Validation]
    FNV -->|Valid| Send[Send Data]
    FNV -->|Invalid| Focus[Focus on Errors]
```

### Repository Pattern (Planned)
- Centralized data access logic
- Abstraction over database operations
- Simplified testing and maintenance
- Implementation pending backend development

### Adapter Pattern for External APIs
- Abstraction over Checkatrade API
- Consistent interface for OpenAI integration
- Error handling and retry logic
- Mock responses for development mode

## Code Quality Patterns

### ESLint Configuration
- ESLint configured with Next.js and TypeScript rules
- Max-lines rule enforced to limit files to 200 lines
- Ensures components remain focused and maintainable
- Encourages breaking down large components into smaller, reusable pieces
- Improves code readability and maintainability

### Nomination Quality Assessment
```mermaid
flowchart TD
    Text[Justification Text] --> QA[Quality Analysis]
    QA --> Score[Quality Score]
    Score --> Feedback[Quality Feedback]
    
    QA --> CA[Criteria Analysis]
    CA --> Trust[Trust Score]
    CA --> Quality[Quality Score]
    CA --> Reliability[Reliability Score]
    
    QA --> SI[Suggested Improvements]
    SI --> Specific[Specific Examples]
    SI --> Evidence[Evidence Suggestions]
    SI --> Detail[Detail Recommendations]
```

### Nomination Processing Pipeline (Planned)
```mermaid
flowchart LR
    S[Submission] --> V[Validation]
    V --> A[AI Analysis]
    A --> C[Categorization]
    C --> D[Duplicate Detection]
    D --> CT[Count Nominations]
    CT --> R[Ranking]
    R --> SL[Shortlisting]
    SL --> MR[Manual Review]
```

## Security Considerations (Planned)
- Input sanitization to prevent injection attacks
- Rate limiting to prevent abuse
- Data encryption for sensitive information
- Access control for administrative functions
- GDPR compliance for handling personal data
- Secure image upload and storage

## Scalability Patterns (Planned)
- Pagination for handling large nomination sets
- Caching for frequently accessed data
- Efficient filtering and sorting for admin operations
- Optimized database queries for reporting
- Load balancing for regional event scaling
