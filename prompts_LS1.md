# prompts_LS1.md

## Prompt LS1_1

### Context
- Data persistence tests outlined in `test_specs_LS1.md` requiring robust MongoDB schemas for User, ActivityLog, FootballTeam.
- Standalone Next.js backend with API routes in `pages/api` and `backend/src`.

### Task
Define TypeScript Mongoose schemas and interfaces for User, ActivityLog, and FootballTeam models.

### Requirements
- Use Mongoose schema definitions with validation rules matching test specs.
- Include createdAt, updatedAt timestamps.
- Export TypeScript interfaces for each model.

### Expected Output
- `backend/src/models/User.ts`, `ActivityLog.ts`, `FootballTeam.ts` with schema and interface.

## Prompt LS1_2

### Context
- API route tests require auth, AIMarker, and football endpoints matching test specs.

### Task
Implement Next.js API route handlers and Express controllers for:
- `POST /api/auth/signup`, `login`, `refresh`.
- `POST /api/aimarker/submit`, `GET /aimarker/stream`, `GET /aimarker/history`.
- `POST /api/football/import-csv`, `save-team`, `GET /football/export-team/:teamId`.

### Requirements
- Validate inputs and handle errors with appropriate HTTP status codes.
- Use JWT for auth flows, leveraging middleware for token verification.
- Use typed request/response objects.

### Expected Output
- Fully typed route files in `pages/api` and Express controllers in `backend/src/controllers`.

## Prompt LS1_3

### Context
- Frontend component tests for `QuestionForm`, `ActivityHistory`, and team views need passing React Testing Library tests.

### Task
Refactor React components to:
- Decompose large pages into `QuestionForm`, `ResultList`, `TeamCreator`, `CSVImporter`.
- Convert to TypeScript with proper props interfaces.
- Implement form validation and error messages.
- Use `react-hook-form` or `Formik` for form state.

### Requirements
- Ensure buttons and inputs have accessible labels.
- Components receive typed props and default props where needed.
- Pass all existing RTL tests without modification.

### Expected Output
- Updated `.tsx` files under `app` and `components` directories.

## Prompt LS1_4

### Context
- Code modernization requires TypeScript adoption across Next.js app and backend.
- Existing JS files need type safety and TS config.

### Task
- Initialize `tsconfig.json` for both Next.js and backend.
- Rename `.js` and `.jsx` files to `.ts` and `.tsx`.
- Add type annotations to utility functions and hooks.

### Requirements
- Preserve existing ESLint and Prettier settings.
- Ensure type-strict settings (`strict: true`).

### Expected Output
- `tsconfig.json` updates and all source files converted without type errors.

## Prompt LS1_5

### Context
- Frontend data fetching tests require React Query integration for caching and error handling.

### Task
- Install and configure React Query (`@tanstack/react-query`).
- Implement data hooks `useCurrentUser`, `useActivityHistory`, `useTeams`.
- Replace existing `fetch` calls with React Query hooks in components.

### Requirements
- Provide loading and error UI states.
- Ensure queries are typed with correct generics.

### Expected Output
- `lib/api-helpers.ts` and custom hooks under `app/hooks`, with React Query setup.

## Prompt LS1_6

### Context
- Project deployment needs containerization for consistent environments.

### Task
- Create `Dockerfile` for Next.js frontend and one for backend.
- Write `docker-compose.yml` to orchestrate frontend, backend, and MongoDB services.
- Include development and production profiles.

### Requirements
- Frontend image uses `node:18-alpine`.
- Backend image includes environment variables and port exposure.
- Compose file defines volumes for code and data persistence.

### Expected Output
- `Dockerfile`, `Dockerfile.backend`, and `docker-compose.yml` in project root.