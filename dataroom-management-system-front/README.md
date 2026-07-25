# Data Room

SPA file browser (folders + PDF) built with React, TypeScript, Tailwind, and shadcn/ui. Talks to the Nest/Mongo backend over HTTP (`fetch`).

## Local development

```bash
npm install
cp .env.example .env
npm run dev
npm test
```

Set `VITE_API_URL` only if the API is not reachable via the Vite proxy (default target `http://localhost:3000`).

## Docker

See the root [README](../README.md) for `docker compose` setup (frontend + backend together).
