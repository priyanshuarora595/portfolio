# Expense Monitor — Offline-First Personal Finance PWA

## Problem
A personal expense-tracking tool for managing money across multiple sources (bank accounts, wallets, cash) — recording income/expenses per source, transferring funds between sources, categorizing spending, and reviewing monthly balances — that stays usable on a phone even with unreliable connectivity, and that doesn't require re-typing a password every time the app is reopened. Built as a personal tool for individual use rather than a multi-tenant SaaS product.

## My Role
Solo developer and sole owner of both the frontend and backend, end-to-end: application design, data model, REST API, offline/PWA behavior, and the biometric unlock layer.

## Architecture
**Backend (Django REST Framework, MySQL):** the domain is split into four Django apps — `accounts` (custom `Account` user model with a UUID primary key, built on `AbstractBaseUser`/`PermissionsMixin` with a custom manager and DRF `TokenAuthentication`), `transactions` (`Sources` = accounts/wallets, `Transactions` = credit/debit entries tagged to a `Commodity` category, `InternalTransactions` = transfers between sources), `balance` (a per-source, per-month `Balance` snapshot recording first-day and last-day amounts), and `api`. The core aggregation logic in `balance/tasks.py` (`calculate_expenditure`) sums credits, debits, and internal transfers per source and per spending category for a given month, computes a remaining balance, and — when run in monthly-rollover mode — writes the closing balance and automatically creates next month's opening `Balance` row per source. A standalone `scheduler.py` script bootstraps Django outside the request/response cycle and, run on the first of each month, emails every user who has opted in (`send_monthly_report`) an HTML expenditure report rendered from a Django template using the previous month's aggregated data.

**Frontend (vanilla JS PWA, no framework):** a set of page-per-view HTML files (dashboard, balance, balance detail/range views, commodities, sources, internal transactions, profile, auth pages) sharing `script.js` and `style.css`, installable as a PWA via `manifest.json`.

**Offline caching and write queueing:** the service worker precaches the full static app shell on install, and separately caches successful API GET responses at runtime so previously-viewed data (dashboard, balances, transaction lists) stays readable offline, falling back to a JSON 503 only when nothing is cached yet. For API writes (POST/PUT/DELETE) that fail because the device is offline, the request (URL, method, headers, body) is captured and stored in an IndexedDB-backed outbox (`offline-db.js`) instead of being lost, then automatically replayed once connectivity returns — via the Background Sync API (`sync-outbox` tag) where supported, with a page-level `online`-event/`FLUSH_OUTBOX` fallback for browsers without Background Sync (e.g. iOS Safari). Auth endpoints (login/logout/change-password) and account deletion are deliberately excluded from queueing, since those shouldn't fail silently and be retried later without the user seeing the result immediately.

**Biometric quick-unlock (`biometric.js`):** uses the WebAuthn platform authenticator (Touch ID/Face ID/Android fingerprint) purely as a device-local re-entry gate on top of the existing DRF token session — it does not talk to the backend or replace server login. After a password login, the user can opt in to register a platform credential; on later app opens, a lock overlay requires biometric verification before revealing the already-stored session, with a fallback to full logout and password login if the device doesn't support WebAuthn or verification fails.

## Tech Stack
- Frontend: HTML, CSS, vanilla JavaScript, PWA (Web App Manifest + Service Worker), IndexedDB, WebAuthn API
- Backend: Python, Django, Django REST Framework, django-filter, django-cors-headers
- Database: MySQL (`mysqlclient`, `mysql-connector-python`)
- Auth: DRF Token Authentication (server session) + WebAuthn (device-local biometric unlock)
- Other: Django templating + `EmailMultiAlternatives` for scheduled HTML email reports
- Hosting: GitHub Pages (frontend)

## Impact / Results
This is a personal project used for my own monthly budgeting rather than a metrics-driven product, so there are no user/scale numbers to report. Concretely, it's a fully working, installable PWA that keeps working through real connectivity drops (data loads from cache, writes queue and replay automatically), sends me an automated monthly expenditure email, and demonstrates a working WebAuthn integration layered onto a token-based backend without changing the server's auth model.

## Links
- Frontend repo: https://github.com/priyanshuarora595/expense-monitor
- Backend repo: https://github.com/priyanshuarora595/expense-monitor-backend
- Hosted frontend: https://priyanshuarora595.github.io/expense-monitor/index.html
