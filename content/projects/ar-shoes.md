# AR Shoe Try-On

## Problem
Online shoe shoppers can't tell how a shoe will actually look on their own feet before buying, which is a common driver of sizing/style uncertainty and returns in footwear e-commerce. This is a minimalistic proof-of-concept storefront that lets a shopper browse a small shoe catalog and try on any shoe virtually, in real time, using their device's camera and augmented-reality foot tracking — plus a manager portal so a non-technical content owner can manage the catalog (products, colors, AR effect files) without touching code.

## My Role
I own this project end-to-end and built it solo: both codebases (Next.js frontend, Django backend), the data model and API, the AR integration, the manager/admin portal, and deployment of both services. It was built entirely using AI coding tools (agentic/AI-assisted development) rather than hand-written from scratch.

## Architecture
**Storefront (Next.js 16, App Router, React 19, TypeScript, Tailwind):** product grid and detail pages fetch the catalog from the Django API with no server-side pagination — at MVP scale (~50 products) the frontend fetches everything and paginates/filters client-side. The try-on page integrates DeepAR's web SDK (`src/ar/DeepARTryOn.tsx`) for real-time foot tracking and shoe overlay directly in the browser via the camera. The SDK's WASM/model assets are self-hosted from `/public/deepar-sdk` instead of DeepAR's CDN, to avoid multi-MB downloads over whatever connection a test device has. Effect loading is wrapped in a manual timeout with periodic progress logging, since DeepAR's `switchEffect()` has no built-in timeout and can otherwise hang silently; SDK init and effect-switch calls are also serialized through a module-level promise chain to work around React Strict Mode's dev-only double-invoke firing overlapping SDK calls on the same instance.

**Manager portal:** same Next.js app, under `/manage`, gated by a Django REST Framework auth token stored in an httpOnly cookie. All authenticated requests are proxied through server-only code (a `managerFetch` helper, Server Actions) so the token is never exposed to client-side JS. Managers and Content Uploaders (role-based, via Django auth groups) can create/edit products and per-color variants, each with its own thumbnail and DeepAR effect file.

**Uploads:** thumbnails and `.deepar` effect files upload straight from the browser to Cloudflare R2 via a short-lived presigned PUT URL issued by the backend (`PresignUploadView`), bypassing the Next.js server path entirely — Vercel serverless functions cap request bodies at 4.5MB, well under a real `.deepar` file, so the backend only ever hands out a scoped upload URL and never sees the file bytes.

**Backend (Django 5 + DRF, deployed on Render):** two core models, `Product` and `Variant` (color, thumbnail, DeepAR effect file, per-product available sizes), with custom DRF permission classes enforcing group-based access (Managers: full access; Content Uploaders: create/edit but not delete; public: read-only, active items only). Postgres in production (via `dj-database-url`) with SQLite for local dev; media storage swaps transparently between local disk (dev) and Cloudflare R2 (S3-compatible, via `django-storages`/`boto3`) based on whether R2 credentials are configured, so the same codebase runs unmodified in both environments.

## Tech Stack
- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- AR: DeepAR Web SDK (real-time foot tracking + AR shoe overlay)
- Backend: Python, Django 5, Django REST Framework, Gunicorn, WhiteNoise
- Database: PostgreSQL (production), SQLite (local dev)
- Storage: Cloudflare R2 (S3-compatible object storage) via `django-storages` + `boto3`, presigned direct-to-storage uploads
- Auth: DRF Token Authentication (manager portal) + Django auth groups for role-based permissions
- Deployment: Vercel (frontend), Render (backend)

## Impact / Results
This is a proof-of-concept at MVP scale (~50 products), not a production business with user-scale metrics to report. It's a fully working, deployed system: a live browser-based AR try-on experience with real-time foot tracking, and a working content-management portal that lets a non-technical operator manage the catalog independently of any code deploy. It demonstrates solo, AI-tool-driven delivery of a full-stack product — frontend, backend, third-party AR SDK integration, cloud object storage, and deployment — from scratch to live URLs.

## Links
- Live frontend: https://ar-shoes-try-on-mayavarta.vercel.app/
- Live backend API: https://ar-shoes-backend.onrender.com
- Frontend repo: https://github.com/priyanshuarora595/ar-shoes
- Backend repo: https://github.com/priyanshuarora595/ar-shoes-backend
