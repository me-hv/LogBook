<div align="center">

<br />

# 📖 LogBook

### A modern, Markdown-first publishing platform built for creators, developers, teams, and enterprises.

<br />

<!-- Hero Banner -->
<img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80" alt="LogBook Banner" width="100%" style="border-radius: 12px;" />

<br /><br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-Auth-FF6B6B?logo=auth0&logoColor=white)](https://better-auth.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Docker](https://img.shields.io/badge/Docker-Container-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Expo](https://img.shields.io/badge/Expo-Mobile-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/me-hv/LogBook/releases)

<br />

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit-black?style=for-the-badge)](https://logbook.vercel.app)
[![Documentation](https://img.shields.io/badge/📚%20Documentation-Read-blue?style=for-the-badge)](https://github.com/me-hv/LogBook/wiki)
[![Report Bug](https://img.shields.io/badge/🐛%20Report%20Bug-Open%20Issue-red?style=for-the-badge)](https://github.com/me-hv/LogBook/issues/new?assignees=&labels=bug&template=bug_report.md)
[![Request Feature](https://img.shields.io/badge/✨%20Request%20Feature-Suggest-purple?style=for-the-badge)](https://github.com/me-hv/LogBook/issues/new?assignees=&labels=enhancement&template=feature_request.md)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Billing & Monetization](#-billing--monetization)
- [Mobile App](#-mobile-app)
- [Security](#-security)
- [Performance](#-performance)
- [Deployment](#-deployment)
- [Docker Support](#-docker-support)
- [Roadmap](#-roadmap)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [Development Guidelines](#-development-guidelines)
- [Testing](#-testing)
- [Benchmark Targets](#-benchmark-targets)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)
- [Author](#-author)

---

## 🌟 Overview

**LogBook** is a full-stack, enterprise-grade, Markdown-first publishing platform designed to power blogs, newsletters, documentation sites, and full-scale multi-tenant SaaS publications. It ships with an AI writing assistant, a global federated creator network, white-label branding, native mobile apps, and everything a modern publishing team needs — out of the box.

### Why LogBook?

The publishing industry is fragmented. Developers need code-friendly tools. Creators need beautiful writing environments. Enterprises need security, compliance, and customization. LogBook unifies all three into a single platform built on open-source technologies.

### Problems It Solves

| Problem | LogBook Solution |
|---------|-----------------|
| No code-friendly CMS with great UX | Markdown-first editor with live preview |
| SaaS platforms don't support self-hosting | Full Docker + Railway + Vercel deployment support |
| AI tools require separate subscriptions | Built-in AI editorial, SEO, and review agents |
| Teams lack collaborative workflows | Multi-author support with RBAC and approval workflows |
| Enterprises need SSO & compliance | SAML 2.0, SCIM, MFA, and full audit logs |
| No native mobile writing experience | Full React Native iOS + Android apps with offline sync |

### Target Audience

- 🧑‍💻 **Developers** — Code-friendly Markdown editor with a full REST API and plugin system
- ✍️ **Bloggers & Creators** — Beautiful, distraction-free writing with AI assistance
- 👥 **Teams & Startups** — Multi-author collaboration with editorial workflows
- 🏢 **Enterprises** — SSO, SCIM provisioning, audit logs, white-label branding
- 🌐 **Organizations** — Multi-tenant SaaS with custom domains and federated publishing

---

## ✨ Features

<details open>
<summary><strong>📝 Publishing</strong></summary>

- **Markdown Editor** — Rich Markdown writing with syntax highlighting and toolbar shortcuts
- **Live Preview** — Side-by-side rendered preview as you type
- **Draft System** — Autosave drafts with versioning and recovery
- **Scheduled Publishing** — Schedule posts to publish at a specific date and time
- **Categories & Tags** — Organize content with nested categories and custom tags
- **SEO Built-in** — Meta titles, descriptions, OpenGraph images, schema markup, and canonical URLs
- **Custom Slugs** — Human-readable, editable URL slugs for every post

</details>

<details>
<summary><strong>🖥️ CMS & Admin</strong></summary>

- **Admin Dashboard** — Centralized control panel for all content, users, and settings
- **Media Management** — Upload, organize, and serve images and files with Supabase Storage
- **Multi-Author Support** — Invite authors, editors, and admins with granular access
- **Editorial Workflows** — Submit for review → Editorial approval → Publish pipeline
- **Comment Moderation** — Approve, reject, and manage reader comments
- **Subscriber Management** — Newsletter subscriber lists with import/export support

</details>

<details>
<summary><strong>🤖 AI Features</strong></summary>

- **AI Editorial Agent** — Suggest article topics, generate outlines, identify content gaps
- **AI SEO Agent** — Optimize titles, generate meta descriptions, improve keyword coverage
- **AI Content Review Agent** — Grammar check, readability analysis, brand voice consistency
- **AI Publishing Agent** — Recommend optimal publish times, generate social posts, create summaries
- **AI Analytics Agent** — Explain traffic changes, identify trends, predict post performance
- **Human-in-the-Loop** — All AI suggestions require human review before publishing

</details>

<details>
<summary><strong>👥 Collaboration</strong></summary>

- **Teams** — Workspace-level team management with invite links
- **RBAC** — Fine-grained role-based access control (Admin, Editor, Author, Viewer)
- **Permissions** — Per-resource permission assignments
- **Approval Workflows** — Multi-stage editorial review workflows
- **Activity Logs** — Full audit trail of team actions

</details>

<details>
<summary><strong>📊 Analytics</strong></summary>

- **Page Views** — Track views per post, category, and author
- **Engagement Metrics** — Comments, shares, newsletter open rates
- **Subscriber Analytics** — Growth curves, churn rates, and subscriber geography
- **AI Traffic Insights** — AI-powered trend explanations and traffic change alerts

</details>

<details>
<summary><strong>💳 Monetization</strong></summary>

- **Stripe Subscriptions** — Free, Starter, Pro, Business, and Enterprise tiers
- **Billing Portal** — Self-service plan upgrades, downgrades, and cancellations
- **Invoices** — Automatic invoice generation and PDF download
- **Usage Tracking** — Posts, seats, storage, and API calls tracked per tenant
- **Trial Support** — 14-day free trials with automatic billing transitions

</details>

<details>
<summary><strong>🔌 Developer Platform</strong></summary>

- **Public REST API** — Full CRUD API for posts, authors, categories, tags, and search
- **Webhooks** — Event-driven notifications for post publish, subscriber signup, and more
- **API Keys** — Scoped API key management with revocation support
- **Plugin System** — Marketplace-ready plugin architecture for custom integrations
- **SDK Support** — Node.js and TypeScript SDK for programmatic access
- **OpenAPI Docs** — Auto-generated Swagger documentation at `/api/docs`

</details>

<details>
<summary><strong>🏢 Enterprise</strong></summary>

- **SSO** — Google Workspace, Microsoft Entra ID, Okta, SAML 2.0, and OIDC
- **MFA** — TOTP authenticator app and backup recovery codes
- **SCIM Provisioning** — Automatic user provisioning and deprovisioning
- **Audit Logs** — Detailed immutable logs for all platform actions
- **RBAC** — Enterprise role mapping from SSO identity providers
- **Compliance** — GDPR-ready data export and account deletion
- **White-Label** — Full platform rebranding with custom logos, colors, and fonts

</details>

<details>
<summary><strong>📱 Mobile</strong></summary>

- **iOS & Android** — Native React Native app powered by Expo
- **Offline Editing** — Write and save posts without internet connectivity
- **Draft Sync** — Automatic background sync when connectivity is restored
- **Push Notifications** — Comment alerts, subscriber milestones, and team mentions
- **Biometric Auth** — Face ID and fingerprint login support
- **Mobile Dashboard** — Analytics summary, recent posts, and subscriber stats

</details>

<details>
<summary><strong>🌍 Infrastructure</strong></summary>

- **Multi-Region** — Database read replicas across US East, US West, Europe, and Asia Pacific
- **Edge Rendering** — Next.js Edge Runtime for global sub-100ms responses
- **CDN** — Global asset delivery with automatic image optimization
- **Redis Cache** — Session, query, and rate-limit caching
- **Queue System** — Background job processing for emails, webhooks, and AI tasks
- **Feature Flags** — Gradual rollout support for new features

</details>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│                                                         │
│   Next.js 16 App Router  │  React Native (Expo)         │
│   Server Components       │  iOS + Android              │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
┌──────────────▼──────────────────────────▼───────────────┐
│                    APPLICATION LAYER                      │
│                                                         │
│   Next.js Route Handlers  │  Server Actions             │
│   Edge Functions          │  API Middleware              │
└──────────────┬──────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│                     SERVICE LAYER                         │
│                                                          │
│   Better Auth  │  Stripe  │  AI Agents  │  Email         │
│   Webhooks     │  Plugins  │  Queues    │  Analytics      │
└──────────────┬────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│                       DATA LAYER                          │
│                                                          │
│   PostgreSQL (Supabase)  │  Redis Cache                  │
│   Prisma ORM             │  Supabase Storage             │
│   Multi-Tenant Schemas   │  Edge KV Store                │
└──────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Unified frontend and backend with Server Components |
| **Multi-Tenant via `tenantId`** | Single schema, isolated data per workspace |
| **Prisma ORM** | Type-safe database queries with auto-generated client |
| **Better Auth** | Modern, extensible auth without vendor lock-in |
| **Server Actions** | Co-located data mutations without separate API routes |
| **Edge Runtime** | Global low-latency rendering for public blog pages |

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | Next.js | 16.x | Full-stack React framework |
| **Frontend** | React | 19.x | UI component library |
| **Frontend** | TypeScript | 5.x | Type-safe development |
| **Frontend** | Tailwind CSS | 3.x | Utility-first styling |
| **Backend** | Next.js Route Handlers | 16.x | REST API endpoints |
| **Backend** | Server Actions | — | Colocated data mutations |
| **Database** | PostgreSQL | 16 | Primary relational database |
| **Database** | Prisma ORM | 7.x | Type-safe DB client |
| **Database** | Supabase | — | Hosted Postgres + Storage |
| **Authentication** | Better Auth | — | Sessions, OAuth, MFA |
| **Payments** | Stripe | — | Subscriptions and billing |
| **Mobile** | React Native + Expo | — | iOS and Android apps |
| **Cache** | Redis | 7.x | Session and query cache |
| **Queue** | Custom Worker | — | Background jobs and emails |
| **Storage** | Supabase Storage | — | Media and file uploads |
| **Email** | Mailgun | — | Transactional and newsletters |
| **CDN** | Vercel Edge | — | Static asset delivery |
| **Monitoring** | Custom Metrics | — | Request and error tracking |
| **Feature Flags** | Custom Engine | — | Gradual feature rollouts |

---

## 📁 Project Structure

```
LogBook/
│
├── src/                          # Next.js application source
│   ├── app/                      # App Router pages and layouts
│   │   ├── admin/                # Admin dashboard pages
│   │   ├── api/                  # REST API route handlers
│   │   ├── blog/                 # Public blog pages
│   │   ├── dashboard/            # Workspace management pages
│   │   ├── feed/                 # Federated publication feed
│   │   └── (auth)/               # Auth pages (login, register)
│   │
│   ├── components/               # Reusable UI components
│   │   ├── admin/                # Admin-specific components
│   │   ├── editor/               # Markdown editor components
│   │   └── ui/                   # Shared design system components
│   │
│   ├── lib/                      # Shared utilities and configurations
│   │   ├── auth/                 # Better Auth configuration
│   │   ├── db/                   # Prisma client instance
│   │   ├── email/                # Email templates and sender
│   │   └── stripe/               # Stripe configuration
│   │
│   ├── generated/                # Auto-generated Prisma client
│   └── proxy.ts                  # Subdomain routing proxy (replaces middleware)
│
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Complete Prisma schema definition
│   └── prisma.config.ts          # Prisma configuration file
│
├── public/                       # Static assets
│   ├── images/                   # Logos, icons, and illustrations
│   └── fonts/                    # Custom web fonts
│
├── mobile/                       # React Native Expo application
│   ├── src/
│   │   ├── screens/              # App screens (Dashboard, Editor, Profile)
│   │   ├── components/           # Mobile UI components
│   │   └── lib/                  # API client and offline storage
│   └── app.json                  # Expo configuration
│
├── infrastructure/               # Infrastructure utilities
│   ├── cache/redis.ts            # Redis client configuration
│   ├── queues/queue.ts           # Background job manager
│   ├── monitoring/metrics.ts     # Request and error metrics
│   ├── events/event-bus.ts       # Event broker
│   ├── edge/edge-config.ts       # Edge caching configuration
│   └── feature-flags/flags.ts   # Feature flag rollout engine
│
├── docs/                         # Additional documentation
│   ├── api/                      # API reference documentation
│   ├── deployment/               # Deployment guides
│   └── architecture/             # Architecture diagrams
│
├── .env.example                  # Environment variables template
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Production Docker image
└── package.json                  # Node.js dependencies and scripts
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** `>= 20.x`
- **pnpm** `>= 9.x` (or npm/yarn)
- **PostgreSQL** `>= 16` (or a [Supabase](https://supabase.com) project)
- **Redis** `>= 7.x` (optional for caching)

### 1. Clone the Repository

```bash
git clone https://github.com/me-hv/LogBook.git
cd LogBook
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Then edit `.env` with your credentials (see [Environment Variables](#-environment-variables)).

### 4. Setup the Database

```bash
# Push schema to database
npx prisma db push

# Generate the Prisma client
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. (Optional) Seed Demo Data

```bash
npm run db:seed
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Core Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session encryption | ✅ |
| `BETTER_AUTH_URL` | Base URL of the application (e.g. `http://localhost:3000`) | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public-facing application URL | ✅ |

### Database

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) | ✅ |
| `DIRECT_URL` | PostgreSQL direct connection string (for migrations) | ✅ |

### Supabase

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | ✅ |

### Stripe

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_...`) | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_...`) | ✅ |
| `STRIPE_FREE_PRICE_ID` | Stripe price ID for the Free tier | ✅ |
| `STRIPE_STARTER_PRICE_ID` | Stripe price ID for the Starter tier | ✅ |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for the Pro tier | ✅ |
| `STRIPE_BUSINESS_PRICE_ID` | Stripe price ID for the Business tier | ✅ |
| `STRIPE_ENTERPRISE_PRICE_ID` | Stripe price ID for the Enterprise tier | ✅ |

### Email

| Variable | Description | Required |
|----------|-------------|----------|
| `MAILGUN_API_KEY` | Mailgun API key for transactional emails | ⚡ Optional |
| `MAILGUN_DOMAIN` | Mailgun sending domain | ⚡ Optional |
| `EMAIL_FROM` | Default sender email address | ⚡ Optional |

### AI & Third-Party

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | ⚡ Optional |
| `REDIS_URL` | Redis connection URL for caching and queues | ⚡ Optional |

### Example `.env.example`

```env
# Core
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/logbook?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/logbook

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_FREE_PRICE_ID=price_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Email
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=mg.yourdomain.com

# AI
GEMINI_API_KEY=your_gemini_key

# Cache
REDIS_URL=redis://localhost:6379
```

---

## 🗄️ Database

LogBook uses a **multi-tenant PostgreSQL database** managed through Prisma ORM, hosted on Supabase.

### Multi-Tenant Design

Every resource in LogBook is scoped to a `Tenant`. This means a single database schema powers unlimited organizations with complete data isolation.

```
User (Global)
  └── Tenant (Organization/Publication)
        ├── Post[]
        ├── Category[]
        ├── Subscriber[]
        ├── ApiKey[]
        ├── AuditLog[]
        ├── TenantBranding
        ├── TenantDomain[]
        └── AIJob[]
```

### Key Models

| Model | Description |
|-------|-------------|
| `User` | Global user identity (spans all tenants) |
| `Tenant` | An organization or publication workspace |
| `Post` | Blog post with content, SEO data, and status |
| `Category` / `Tag` | Content organization taxonomy |
| `Subscriber` | Email newsletter subscriber |
| `AuditLog` | Immutable security and action audit trail |
| `MarketplaceApp` | Published plugin or theme extension |
| `AIJob` | Background AI agent task queue |
| `TenantBranding` | White-label branding per organization |
| `TenantDomain` | Custom domain with DNS verification |
| `Device` | Trusted device tracking for MFA |
| `Invoice` | Stripe billing invoice record |

### Running Migrations

```bash
# Development — Push schema changes
npx prisma db push

# Regenerate Prisma client after schema changes
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

---

## 📡 API Documentation

LogBook exposes a public REST API at `/api/v1/`. Interactive documentation is available at `/api/docs`.

### Authentication

API requests must include a valid API key in the `Authorization` header:

```http
Authorization: Bearer logbook_sk_xxxxxxxxxxxxxxxx
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/posts` | List published posts |
| `GET` | `/api/v1/posts/:slug` | Get a single post by slug |
| `GET` | `/api/v1/authors` | List all authors |
| `GET` | `/api/v1/categories` | List all categories |
| `GET` | `/api/v1/tags` | List all tags |
| `GET` | `/api/v1/search?q=` | Full-text search across posts |

### Example Request

```bash
curl -X GET https://yourpub.logbook.app/api/v1/posts \
  -H "Authorization: Bearer logbook_sk_xxxxxx" \
  -H "Content-Type: application/json"
```

### Example Response

```json
{
  "data": [
    {
      "id": "clzabc123",
      "title": "Getting started with Prisma",
      "slug": "getting-started-prisma",
      "excerpt": "A comprehensive guide to Prisma ORM...",
      "publishedAt": "2025-01-15T09:00:00Z",
      "author": {
        "name": "Ekatra",
        "avatar": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145
  }
}
```

### Webhooks

Configure webhooks from **Admin → Webhooks** to receive real-time notifications:

| Event | Description |
|-------|-------------|
| `post.published` | A post was published |
| `post.updated` | A published post was updated |
| `subscriber.created` | A new newsletter subscriber joined |
| `subscriber.deleted` | A subscriber unsubscribed |
| `comment.created` | A new comment was posted |

### Rate Limits

| Plan | Limit |
|------|-------|
| Free | 1,000 requests/hour |
| Starter | 5,000 requests/hour |
| Pro | 50,000 requests/hour |
| Business | 500,000 requests/hour |
| Enterprise | Unlimited |

---

## 🔒 Authentication

LogBook uses **[Better Auth](https://better-auth.com/)** — a modern, framework-agnostic authentication library.

### Supported Methods

| Method | Status |
|--------|--------|
| Email / Password | ✅ |
| Google OAuth | ✅ |
| GitHub OAuth | ✅ |
| Magic Link | ✅ |
| TOTP MFA | ✅ |
| SAML 2.0 (Enterprise) | ✅ |
| OpenID Connect | ✅ |
| Biometric (Mobile) | ✅ |

### Session Management

- Sessions are server-side, stored in PostgreSQL
- Configurable session expiry (default: 7 days)
- Device tracking with trusted device registry

### Multi-Factor Authentication

Users can enable MFA from **Dashboard → Security**:

1. Scan QR code with any TOTP app (Google Authenticator, Authy)
2. Confirm with a one-time code
3. Save backup recovery codes in a secure location

### Role-Based Access Control

| Role | Capabilities |
|------|-------------|
| `admin` | Full platform access |
| `editor` | Publish and manage all content |
| `author` | Create and manage own posts |
| `viewer` | Read-only access |
| `billing` | Manage subscription and billing |

---

## 💳 Billing & Monetization

Powered by **[Stripe](https://stripe.com/)** with full subscription lifecycle management.

### Pricing Tiers

| Plan | Posts | Storage | Seats | Domains | AI |
|------|-------|---------|-------|---------|-----|
| **Free** | 100 | 1 GB | 1 | None | ❌ |
| **Starter** | 1,000 | 10 GB | 5 | 1 | ✅ |
| **Pro** | Unlimited | 100 GB | 20 | 5 | ✅ |
| **Business** | Unlimited | Unlimited | 50 | Unlimited | ✅ |
| **Enterprise** | Unlimited | Unlimited | Unlimited | Unlimited | ✅ |

### Features

- **Automatic billing** via Stripe Checkout
- **Customer portal** for self-service plan changes
- **Prorated upgrades** — billed immediately
- **Invoice PDF download** from the billing dashboard
- **Usage-based alerts** when approaching plan limits
- **14-day free trial** on paid plans

---

## 📱 Mobile App

A full-featured React Native mobile application built with **Expo**.

### Setup

```bash
cd mobile
npm install

# Start development
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### Features

- **Offline Editing** — Write posts without internet access; syncs automatically
- **Push Notifications** — Real-time alerts for comments, mentions, and milestones  
- **Biometric Login** — Face ID and fingerprint unlock
- **Mobile Dashboard** — Analytics summary, draft list, and subscriber stats
- **Media Upload** — Camera roll integration for post images
- **Dark Mode** — Full system dark mode support

---

## 🛡️ Security

LogBook is built with security as a first principle.

### Authentication Security

- Passwords hashed with **Argon2id** (via Better Auth)
- CSRF protection on all forms
- Secure HttpOnly cookies for session tokens
- Automatic session invalidation on password change

### Multi-Factor Authentication

- TOTP (Time-based One-Time Passwords)
- 8 single-use backup recovery codes
- Trusted device management with 30-day remember

### Audit Logs

All security-relevant events are logged to the `AuditLog` table:

```
Login events    | Permission changes | Content modifications
API key usage   | Plan changes       | Custom domain adds
SSO events      | MFA changes        | Billing updates
```

### Rate Limiting

- Authentication endpoints: **10 requests/minute**
- API endpoints: **Plan-based limits** (see [Rate Limits](#rate-limits))
- Admin actions: **100 requests/minute**

### Enterprise Compliance

- GDPR-ready data export and deletion workflows
- SCIM 2.0 for automated user provisioning
- Immutable audit log retention
- IP allowlisting for admin access

---

## ⚡ Performance

### Edge Rendering

Public blog pages are rendered at the **Edge Runtime** — globally distributed across Vercel's edge network — targeting sub-100ms response times worldwide.

```ts
// edge-config.ts
export const runtime = "edge";

export function getCacheHeaders() {
  return {
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
  };
}
```

### Caching Strategy

| Resource | TTL | Strategy |
|----------|-----|----------|
| Blog posts | 24 hours | Edge CDN + ISR |
| Author pages | 1 hour | Edge CDN |
| Search results | 5 minutes | Redis |
| API responses | 1 minute | Redis |
| Session data | 7 days | PostgreSQL |

### Background Queue

CPU-intensive and time-consuming tasks are offloaded to a background queue system:

- Newsletter dispatch
- Webhook delivery (with automatic retry)
- AI agent job execution
- Email notifications
- Analytics aggregation

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Railway

1. Create a new Railway project
2. Add a PostgreSQL database service
3. Connect the GitHub repository
4. Add environment variables
5. Deploy!

### Docker

```bash
# Build the image
docker build -t logbook .

# Run the container
docker run -p 3000:3000 --env-file .env logbook
```

### Self-Hosted (VPS)

```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash
sudo apt install -y nodejs

# Clone and install
git clone https://github.com/me-hv/LogBook.git
cd LogBook && npm install

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "logbook" -- start
pm2 save
```

---

## 🐳 Docker Support

### `Dockerfile`

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

### `docker-compose.yml`

```yaml
version: "3.9"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: logbook
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: logbook
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down
```

---

## 🗺️ Roadmap

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| **01** | Foundation | Next.js setup, Prisma, Supabase configuration | ✅ Complete |
| **02** | Authentication | Better Auth, Google/GitHub OAuth, sessions | ✅ Complete |
| **03** | Core CMS | Post editor, Markdown, categories, tags | ✅ Complete |
| **04** | Admin Dashboard | Management UI, media library, user controls | ✅ Complete |
| **05** | SEO Engine | Meta tags, OpenGraph, sitemap, robots.txt | ✅ Complete |
| **06** | Newsletter | Subscriber list, campaign dispatch, unsubscribe | ✅ Complete |
| **07** | Analytics | Traffic tracking, engagement metrics | ✅ Complete |
| **08** | Comments | Reader commenting system with moderation | ✅ Complete |
| **09** | RSS & Feeds | RSS 2.0, Atom feed, JSON Feed generation | ✅ Complete |
| **10** | Public API | REST API v1 with API key authentication | ✅ Complete |
| **11** | Plugin System | Marketplace-ready plugin architecture | ✅ Complete |
| **12** | Webhooks | Event-driven external integrations | ✅ Complete |
| **13** | Multi-Tenant | Workspace isolation, custom subdomains | ✅ Complete |
| **14** | Team Collaboration | Invites, RBAC, editorial workflows | ✅ Complete |
| **15** | Billing & Subscriptions | Stripe integration, plan enforcement | ✅ Complete |
| **16** | Enterprise Security | MFA, SSO, SCIM, audit logs | ✅ Complete |
| **17** | Mobile Apps | React Native iOS + Android with offline sync | ✅ Complete |
| **18** | Global Infrastructure | Edge rendering, Redis, CDN, queues | ✅ Complete |
| **19** | Marketplace | Plugin/theme browser, developer console | ✅ Complete |
| **20** | White-Label | Custom branding, logos, colors, domains | ✅ Complete |
| **21** | AI Publishing Agents | Editorial, SEO, review, and analytics AI | ✅ Complete |
| **22** | Federated Network | Creator profiles, cross-publication feeds | 🔄 In Progress |
| **23** | Video Publishing | Embedded video, transcription, VOD support | 📋 Planned |
| **24** | Collaborative Editing | Real-time multi-author post editing (CRDT) | 📋 Planned |
| **25** | Advanced Analytics | Cohort analysis, revenue attribution | 📋 Planned |

---

## 📸 Screenshots

> Screenshots are from the live development build.

### Landing Page

```
[ Public-facing hero page with featured posts, categories, and newsletter signup ]
```

### Admin Dashboard

```
[ Full-featured admin panel with sidebar navigation and analytics overview ]
```

### Markdown Editor

```
[ Split-pane Markdown editor with live preview, toolbar, and AI suggestions sidebar ]
```

### Analytics Dashboard

```
[ Real-time page views, subscriber growth, engagement metrics, and AI trend analysis ]
```

### Mobile App

```
[ React Native dashboard screen with offline indicator and quick-compose button ]
```

---

## 🤝 Contributing

We welcome contributions! LogBook thrives because of its open-source community.

### Getting Started

1. **Fork the repository**

```bash
gh repo fork me-hv/LogBook
```

2. **Create a feature branch**

```bash
# Features
git checkout -b feature/my-feature-name

# Bug fixes
git checkout -b fix/issue-description

# Documentation
git checkout -b docs/update-readme
```

3. **Make your changes** following the [Development Guidelines](#-development-guidelines)

4. **Commit your changes**

```bash
git commit -m "feat: add newsletter unsubscribe confirmation page"
```

5. **Push and open a Pull Request**

```bash
git push origin feature/my-feature-name
```

### Pull Request Guidelines

- PRs must be opened against the `main` branch
- Provide a clear title and description
- Reference any related issues with `Closes #123`
- Include screenshots for UI changes
- Ensure all checks pass before requesting review

---

## 🧰 Development Guidelines

### TypeScript Standards

- **Strict mode** enabled — no `any` types without explicit justification
- All props interfaces must be defined and exported
- Use `type` for primitive unions, `interface` for objects
- Prefer `const` assertions for static data

### ESLint Configuration

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Commit Conventions

LogBook follows the **Conventional Commits** specification:

| Prefix | Description |
|--------|-------------|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style changes (formatting) |
| `refactor:` | Code refactoring without behavior change |
| `perf:` | Performance improvements |
| `test:` | Adding or updating tests |
| `chore:` | Build process or tooling changes |

### File Naming

- React components: `PascalCase.tsx`
- Utilities and helpers: `camelCase.ts`
- Route pages: `page.tsx` (Next.js App Router convention)
- Configuration files: `kebab-case.ts`

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

### End-to-End Tests (Playwright)

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Coverage Report

```bash
npm run test:coverage
```

---

## 📈 Benchmark Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time** | < 100ms (p95) | Edge-rendered endpoints |
| **Blog Page Load** | < 1 second (LCP) | Core Web Vitals |
| **Time to First Byte** | < 50ms | Edge Runtime |
| **Editor Time to Interactive** | < 2 seconds | Measured at client |
| **Search Response** | < 200ms | Full-text Postgres search |
| **Uptime** | 99.99% | Monthly SLA |
| **Concurrent Users** | 100,000+ | Horizontal scaling |

---

## 📄 License

```
MIT License

Copyright (c) 2025 Ekatra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

See [LICENSE](LICENSE) for the full license text.

---

## 🙏 Acknowledgements

LogBook draws inspiration from the best publishing platforms in the world:

| Platform | Inspiration |
|----------|-------------|
| **[Ghost](https://ghost.org/)** | Clean Markdown-first publishing philosophy |
| **[Hashnode](https://hashnode.com/)** | Developer-first community and API design |
| **[Substack](https://substack.com/)** | Newsletter monetization and subscriber experience |
| **[Notion](https://notion.so/)** | Block-based editor experience and workspace organization |
| **[Medium](https://medium.com/)** | Reader discovery and publication network |
| **[Mastodon](https://joinmastodon.org/)** | Federated social publishing concepts |

Special thanks to the incredible open-source libraries that power LogBook:
[Next.js](https://nextjs.org/) · [Prisma](https://prisma.io/) · [Better Auth](https://better-auth.com/) · [Supabase](https://supabase.com/) · [Stripe](https://stripe.com/) · [Expo](https://expo.dev/) · [Lucide Icons](https://lucide.dev/)

---

## 👤 Author

<div align="center">

### Ekatra

**Full-Stack Developer · Open-Source Creator · Music Maker**

[![GitHub](https://img.shields.io/badge/GitHub-me--hv-181717?logo=github&logoColor=white&style=for-the-badge)](https://github.com/me-hv)
[![YouTube](https://img.shields.io/badge/YouTube-ekatramusic-FF0000?logo=youtube&logoColor=white&style=for-the-badge)](https://www.youtube.com/@ekatramusic)

</div>

---

<div align="center">

## ⭐ Support

If LogBook has been useful to you, please consider giving the repository a star!

[![GitHub Stars](https://img.shields.io/github/stars/me-hv/LogBook?style=social)](https://github.com/me-hv/LogBook/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/me-hv/LogBook?style=social)](https://github.com/me-hv/LogBook/network/members)

---

*Built with Next.js, TypeScript, and countless cups of coffee. ☕*

**[⬆ Back to Top](#-logbook)**

</div>
