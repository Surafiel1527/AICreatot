# CreatorBoost - AI-Powered Content Creation Platform

## Overview

CreatorBoost is a modern full-stack web application designed to help content creators generate viral content ideas, optimize hashtags, and create engaging videos for social media platforms (YouTube, TikTok, Instagram). The platform leverages Google's Gemini AI to provide intelligent content suggestions, trending topic analysis, and script generation capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with authentication middleware
- **Authentication**: Replit's OpenID Connect integration with Passport.js
- **Session Management**: Express sessions with PostgreSQL store using connect-pg-simple

### Data Storage Solutions
- **Database**: PostgreSQL via Neon serverless database
- **ORM**: Drizzle ORM with connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Session Storage**: Database-backed sessions table for authentication persistence

### Database Schema Design
- **Users Table**: Profile information and authentication data
- **Content Ideas**: AI-generated content suggestions with platform-specific metadata
- **Video Content**: Generated scripts and video creation data
- **Hashtags**: Platform-specific hashtag collections with trending scores
- **Content Calendar**: Scheduled content with publishing dates
- **Platform Stats**: User engagement metrics across social platforms

### Authentication & Authorization
- **Provider**: Replit OpenID Connect for seamless platform integration
- **Strategy**: Session-based authentication with secure HTTP-only cookies
- **Middleware**: Custom authentication middleware for protecting API routes
- **Security**: CSRF protection and secure session configuration

### AI Integration Architecture
- **Provider**: Google Gemini AI for content generation
- **Services**: Modular service layer for different AI capabilities:
  - Content idea generation with platform optimization
  - Hashtag analysis and trending topic detection
  - Video script creation with style customization
  - Media search and content creation assistance

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary AI provider for content generation, hashtag optimization, and trend analysis
- **API Integration**: @google/genai SDK for seamless AI model interaction

### Media Services
- **Pexels API**: Stock photography and video content for content creation
- **Pixabay API**: Additional media resources for diverse content options

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: Real-time capabilities via ws package for database connections

### Development Tools
- **Replit Integration**: Platform-specific tooling and development banner
- **Vite Plugins**: Custom error modal and cartographer for enhanced development experience
- **ESBuild**: Production bundling for server-side code optimization

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Font Integration**: Google Fonts (Inter, Poppins) for typography hierarchy

### Utilities & Helpers
- **Class Variance Authority**: Type-safe component variant management
- **date-fns**: Date manipulation and formatting utilities
- **Memoizee**: Function memoization for performance optimization
- **clsx & tailwind-merge**: Conditional class name management