# Architecture

This repository is a one-page technical test, so the policy page can keep its page-specific components close to the route that owns them.

For this task:

- The main route lives in `app/page.tsx`.
- Page-specific components live in `app/components/*`.
- Page-specific utils should live in `app/lib/*`
- Shared UI primitives from shadcn live in `components/ui/*`.
- Shared data access lives in `lib/*`, including `lib/api/policies.ts`.

If this grew into a fuller routed application, the same rule should scale by ownership:

- Reusable global components should live in `components/*`.
- Reusable global libraries should live in `lib/*`.
- Route-scoped components and libraries should live near the route or feature that owns them, for example `home/components/*` and `home/lib/*`.

Data should be fetched in server-rendered pages or server components, then passed into child components. Child components can become client components later when interaction requires client-side state, event handlers, or browser APIs.
