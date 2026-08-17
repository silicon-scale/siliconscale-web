# SiliconScale Client

## Project overview

Vite + React + TypeScript frontend for the SiliconScale application.

## Local development

**Requirements:** Node.js and pnpm — [install Node with nvm](https://github.com/nvm-sh/nvm#installing-and-updating), then `npm install -g pnpm`.

## Environment variables

Create a `.env.local` file in the project root (see `.env.example`).

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
pnpm install

# Start the frontend only (no /api routes)
pnpm run dev

# Start frontend + API (required for blog, admin, uploads)
pnpm run dev:full
```

## Tech stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Scripts

- `pnpm dev` — Vite frontend only (HMR). Blog/admin API calls will fail.
- `pnpm dev:full` — `vercel dev` — frontend + `/api/*` (use this for the blog)
- `pnpm build` — Production build
- `pnpm preview` — Preview production build locally
- `pnpm lint` — Run ESLint
