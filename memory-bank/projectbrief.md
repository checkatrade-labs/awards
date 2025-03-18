# Project Brief: Checkatrade Awards Nomination System

## Overview
This project aims to develop an improved nomination system for the Checkatrade Awards, leveraging AI to streamline the nomination and shortlisting process. The system will replace the previous Google Forms approach with a more intelligent, efficient solution that reduces manual effort and improves the quality of nominations. Last year's event had 1,200 nominations across 11 award categories, and this year is expanding to four regional events plus a national finale.

## Core Requirements

### Nomination Form
- Create a React-based form for submitting award nominations with a balanced approach:
  - Simple by default: Minimal required fields with clear progress indication
  - Detailed by choice: Optional sections for additional information
  - Progressive enhancement: Start with essentials, then offer optional sections
- Implement trade autocomplete using Checkatrade's public APIs to ensure valid entries
- Provide real-time, non-intrusive feedback on nomination quality using AI
- Support image/photo submissions for better storytelling at awards events
- Categorize nominations automatically by award type
- Allow for flexible award categories that can adapt to changes

### AI-Assisted Processing
- Validate nominees against Checkatrade's member database
- Flag non-members for review rather than preventing nominations
- Analyze nomination text for quality, sentiment, and alignment with judging criteria (trust, quality, reliability)
- Provide real-time feedback to nominators to improve submission quality
- Flag and filter weak nominations (too short, lacking substance like "He's amazing")
- Detect and merge duplicate nominations
- Count nominations per trade automatically (last year, one trade had 100 nominations and was automatically shortlisted)

### Administration Interface
- Provide tools for reviewing and shortlisting nominations
- Implement AI-powered ranking based on nomination quality
- Enable filtering and sorting by various criteria (similar to last year's manual filtering by company name)
- Support regional categorization for the expanded 2025 event structure
- Allow manual override of AI scores and categorizations
- Provide batch operations for efficient processing

## Technical Specifications
- Frontend: React with Next.js
- AI Services: OpenAI GPT-4o for text analysis
- Integration: Checkatrade public APIs
  - Trade search: `https://api.checkatrade.com/v1/consumer-public/trades?name=abc`
  - Trade profile: `https://api.checkatrade.com/v1/consumer-public/trades/[companyid]`
- Database: PostgreSQL with Prisma ORM
- File Storage: GCP Storage for image uploads
- Hosting: Google Cloud Platform

## Success Criteria
- Reduce manual review time by at least 50%
- Improve nomination quality through real-time feedback
- Successfully handle the increased volume expected for 2025 regional events
- Provide accurate shortlisting recommendations that align with judging criteria
- Create a user-friendly experience for both nominators and administrators
- Balance ease of submission with gathering sufficient detail
- Support photo submissions to enhance storytelling at awards events
