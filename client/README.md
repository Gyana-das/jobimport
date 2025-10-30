# Artha Job Board - Frontend (Next.js Admin UI)

This is the frontend for the scalable job import system. It provides an Admin UI to trigger imports and view import history.

## Setup

1. Ensure backend is running on `http://localhost:5000`.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open `http://localhost:3000`

## Features
- Button to trigger job import via `/api/jobs/import`.
- Table displaying import history from `/api/jobs/history`.
- Modular structure: Components for table, utils for API calls.

## Assumptions
- History API returns JSON array of objects with keys: `filename`, `timestamp`, `totalFetched`, `newJobs`, `updatedJobs`, `failedJobs`.
- Import API is GET; adjust `utils/api.js` if POST/body needed.
- No auth; add in production.
- Failed reasons not displayed; extend table if needed.

## Architecture Notes
- Uses Next.js App Router for modern routing.
- Modular: Separate components and utils for scalability.
- CSS: Vanilla for simplicity; Tailwind optional.
- Evolves to microservices: API utils can be swapped for GraphQL/etc.

For full repo structure, see root README.md.