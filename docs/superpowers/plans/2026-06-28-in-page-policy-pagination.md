# In-Page Policy Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace URL-driven My Policies pagination with in-page pagination that fetches each page through a server action and does not reload or navigate the route.

**Architecture:** Keep the first policy page fetched by the existing server component flow. Add a thin `"use server"` action that delegates to the existing server-only `fetchPolicies` API. Add a lightweight page-local client context around the policy list and pagination controls so page changes call the server action and update the visible cards without URL state.

**Tech Stack:** Next.js `16.2.9`, React `19.2.4`, TypeScript, Tailwind CSS, shadcn UI primitives, lucide-react.

## Global Constraints

- Read relevant local Next.js docs under `node_modules/next/dist/docs/` before changing Next.js APIs or file conventions.
- Use `$karpathy-guidelines` when writing, reviewing, or refactoring code.
- Create an AI development log before implementation code at `docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md`.
- Follow Tailwind class grouping from `docs/styling.md` for new and edited UI code.
- Pagination should happen in-page.
- The browser URL should not be used for pagination state.
- The first page of policies should continue to render through the existing server-rendered route flow.
- The policy API should remain server-owned and should not be imported directly into client components.
- The implementation should touch as little existing code as practical.
- A lightweight page-local context may be used around the policy list and pagination controls to avoid prop threading.
- Pagination requests should execute on the server and update the visible cards without a document reload.
- Keep `lib/api/policies.ts` server-only.
- Do not introduce new runtime dependencies.

---

## File Structure

- Create `docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md`: required AI development log for this pagination UX change.
- Create `app/actions/policies.ts`: dedicated server action file that client components may import.
- Create `app/components/policies-pagination-context.tsx`: lightweight page-local client context that owns current policy page data, pending state, and page-change action.
- Create `app/components/policies-client-content.tsx`: client wrapper that renders policy cards and pagination from the context.
- Modify `app/components/policies-content.tsx`: keep server fetch, but pass the initial response to the client wrapper.
- Modify `app/components/policies-pagination.tsx`: replace URL links with buttons that read from the page-local context.
- Modify `app/page.tsx`: remove URL page parsing and `Suspense` keying.

## Execution And Parallelization

- Task 1 must happen before implementation code because the repository requires an AI development log.
- Task 2 can run after Task 1 and is independent of UI work.
- Task 3 depends on Task 2 because the context calls the server action.
- Task 4 depends on Task 3 because pagination controls read from the context.
- Task 5 depends on Tasks 3 and 4 because the server content must pass the initial response into the new client wrapper.
- Task 6 runs after all code changes.
- Commit only this task's files. Leave unrelated existing changes in `AGENTS.md`, `skills-lock.json`, and `.agents/skills/git-commit/` untouched unless the user explicitly includes them.

---

### Task 1: Create The Pagination AI Development Log

**Files:**

- Create: `docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md`
- Read: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-server.md`
- Read: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
- Read: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
- Read: `docs/styling.md`
- Read: `docs/superpowers/specs/2026-06-28-in-page-policy-pagination-design.md`

**Interfaces:**

- Consumes: approved design spec and local Next.js 16 docs.
- Produces: development log required before implementation code begins.

- [ ] **Step 1: Read the approved spec**

Run:

```bash
sed -n '1,240p' docs/superpowers/specs/2026-06-28-in-page-policy-pagination-design.md
```

Expected: output includes `Use a server-rendered initial result plus a page-local pagination context and server action`.

- [ ] **Step 2: Read the local Next.js server/client boundary docs**

Run:

```bash
sed -n '1,180p' node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-server.md
sed -n '1,140p' node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md
sed -n '1,140p' node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md
sed -n '1,120p' docs/styling.md
```

Expected: docs confirm dedicated `"use server"` files can be imported by Client Components, `"use client"` marks the client boundary, pages are Server Components by default, and Tailwind classes should be grouped by styling concern.

- [ ] **Step 3: Create the AI development log**

Create `docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md` with:

```markdown
# In-Page Policy Pagination AI Development Log

## Task

Replace URL-driven My Policies pagination with in-page pagination that fetches policy pages through a server action and updates the visible cards without route navigation or a document reload.

## User Intent And Acceptance Criteria

- Pagination should happen in-page.
- The browser URL should not be used for pagination state.
- The first page of policies should continue to render through the existing server-rendered route flow.
- The policy API should remain server-owned and should not be imported directly into client components.
- The implementation should touch as little existing code as practical.
- A lightweight page-local context may be used around the policy list and pagination controls to avoid prop threading.
- Pagination requests should execute on the server and update the visible cards without a document reload.

## Relevant Brainstorming Summary

The approved design keeps `lib/api/policies.ts` server-only and adds a thin `"use server"` action that delegates to `fetchPolicies`. The initial policy page remains server-rendered through `PoliciesContent`. A small client-side provider owns the current page response, pending state, and `goToPage` action for the policy list and pagination controls.

## Plan Summary

1. Confirm the relevant local Next.js docs for `"use server"`, `"use client"`, and page conventions.
2. Add a dedicated policy server action.
3. Add a page-local pagination context and client content wrapper.
4. Convert pagination from URL links to buttons wired to the context.
5. Remove URL page state from the route and pass the initial server response into the client wrapper.
6. Verify lint, build, formatting, and browser behavior.

## Prompts Or Context Given To AI

- The user reported that pagination currently triggers full page navigation because URL parameters own the pagination state.
- The user clarified that in-page pagination is acceptable and shareable pagination URLs are not required.
- The user required the initial server rendering and server-owned API call shape to remain.
- The user approved a server action approach and then requested a lightweight context around pagination.
- The approved design spec is `docs/superpowers/specs/2026-06-28-in-page-policy-pagination-design.md`.

## AI Proposals

- Add `app/actions/policies.ts` with a thin server action wrapper around `fetchPolicies`.
- Keep the domain API in `lib/api/policies.ts`.
- Add a page-local client context for policy page data and pagination actions.
- Render pagination controls as buttons instead of URL links.

## Human Review Decisions

- Approved in-page pagination over URL-driven pagination.
- Approved preserving server-rendered initial data and server-owned policy API access.
- Approved using a lightweight page-local context around pagination.
- Approved removing references to earlier rejected state-management alternatives from the spec.

## Accepted Changes

- Server action for policy page fetches.
- Page-local pagination context.
- Button-driven pagination controls.
- Removal of route query parameter pagination state.

## Rejected Changes

- Moving policy fetching wholesale into the browser.
- Adding a new runtime dependency for this local interaction.
- Continuing to use URL parameters for pagination state.

## Tradeoffs

- Pagination pages are no longer directly shareable by URL, which is acceptable for this task.
- The client bundle gains a small context provider and interactive pagination controls.
- The previous page remains visible while the next page loads, avoiding layout disruption during the server action request.

## Implementation Notes To Revisit

- Confirm that Client Components import only the dedicated server action, not `lib/api/policies.ts`.
- Confirm that clicking pagination does not change `window.location.href`.
- Confirm that invalid page bounds still clamp through `fetchPolicies`.

## Prompt Log

### User Prompts And Responses

- Initial prompt: The user noted that pagination causes a full page reload because URL parameters are used for state management and asked for a better approach.
- User response: The user clarified that in-page pagination is fine.
- User response: The user required touching as little as possible while keeping server rendering and server-side API calls.
- User response: The user explored using `"use server"` to avoid full page reloads without broad state infrastructure.
- User response: The user approved the server action approach and asked to create a plan.
- User response: The user asked to remove references to earlier alternatives from the spec.
- User response: The user asked to use a very lightweight context around pagination.
- User response: The user approved the final spec.

### AI Response Summaries

- Inspected the current route, server content component, pagination links, policy API, architecture docs, and local Next.js docs.
- Recommended keeping the server-only policy API and adding a dedicated server action wrapper.
- Wrote, revised, self-reviewed, and committed the approved design spec.
- Created this implementation plan before writing implementation code.
```

- [ ] **Step 4: Verify the required log headings**

Run:

```bash
rg -n "## Task|## User Intent And Acceptance Criteria|## Prompt Log" docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md
```

Expected: output includes all three headings.

---

### Task 2: Add A Thin Policy Server Action

**Files:**

- Create: `app/actions/policies.ts`

**Interfaces:**

- Consumes: `fetchPolicies(options?: FetchPoliciesOptions): Promise<FetchPoliciesResponse>` from `lib/api/policies.ts`.
- Produces: `getPoliciesPage(page: number): Promise<FetchPoliciesResponse>`.

- [ ] **Step 1: Create the server action file**

Create `app/actions/policies.ts` with:

```tsx
"use server";

import { fetchPolicies, type FetchPoliciesResponse } from "@/lib/api/policies";

const POLICIES_PAGE_SIZE = 3;

export async function getPoliciesPage(
  page: number,
): Promise<FetchPoliciesResponse> {
  return fetchPolicies({
    page,
    pageSize: POLICIES_PAGE_SIZE,
    sortOrder: "ascending",
  });
}
```

- [ ] **Step 2: Verify the action exports the expected function**

Run:

```bash
rg -n "use server|getPoliciesPage|POLICIES_PAGE_SIZE" app/actions/policies.ts
```

Expected: output includes the `"use server"` directive, `getPoliciesPage`, and `POLICIES_PAGE_SIZE`.

---

### Task 3: Add The Page-Local Pagination Context

**Files:**

- Create: `app/components/policies-pagination-context.tsx`

**Interfaces:**

- Consumes: `getPoliciesPage(page: number): Promise<FetchPoliciesResponse>` from `app/actions/policies.ts`.
- Consumes: `FetchPoliciesResponse`, `PoliciesPagination`, and `Policy` types from `lib/api/policies.ts`.
- Produces:
  - `PoliciesPaginationProvider({ initialResponse, children }: PoliciesPaginationProviderProps): JSX.Element`
  - `usePoliciesPagination(): PoliciesPaginationContextValue`
  - `PoliciesPaginationContextValue.policies: Policy[]`
  - `PoliciesPaginationContextValue.pagination: PoliciesPagination`
  - `PoliciesPaginationContextValue.isPending: boolean`
  - `PoliciesPaginationContextValue.errorMessage: string | null`
  - `PoliciesPaginationContextValue.goToPage(page: number): void`

- [ ] **Step 1: Create the client context file**

Create `app/components/policies-pagination-context.tsx` with:

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import { getPoliciesPage } from "@/app/actions/policies";
import type {
  FetchPoliciesResponse,
  PoliciesPagination,
  Policy,
} from "@/lib/api/policies";

type PoliciesPaginationContextValue = {
  errorMessage: string | null;
  goToPage: (page: number) => void;
  isPending: boolean;
  pagination: PoliciesPagination;
  policies: Policy[];
};

type PoliciesPaginationProviderProps = {
  children: ReactNode;
  initialResponse: FetchPoliciesResponse;
};

const PoliciesPaginationContext =
  createContext<PoliciesPaginationContextValue | null>(null);

export function PoliciesPaginationProvider({
  children,
  initialResponse,
}: PoliciesPaginationProviderProps) {
  const [response, setResponse] =
    useState<FetchPoliciesResponse>(initialResponse);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const goToPage = useCallback(
    (page: number) => {
      if (page === response.pagination.currentPage || isPending) {
        return;
      }

      setErrorMessage(null);

      startTransition(async () => {
        try {
          const nextResponse = await getPoliciesPage(page);

          setResponse(nextResponse);
        } catch {
          setErrorMessage("We couldn't load that page. Please try again.");
        }
      });
    },
    [isPending, response.pagination.currentPage],
  );

  const value = useMemo<PoliciesPaginationContextValue>(
    () => ({
      errorMessage,
      goToPage,
      isPending,
      pagination: response.pagination,
      policies: response.policies,
    }),
    [errorMessage, goToPage, isPending, response],
  );

  return (
    <PoliciesPaginationContext.Provider value={value}>
      {children}
    </PoliciesPaginationContext.Provider>
  );
}

export function usePoliciesPagination() {
  const context = useContext(PoliciesPaginationContext);

  if (context === null) {
    throw new Error(
      "usePoliciesPagination must be used within PoliciesPaginationProvider",
    );
  }

  return context;
}
```

- [ ] **Step 2: Verify the client boundary and server action import**

Run:

```bash
rg -n "use client|getPoliciesPage|PoliciesPaginationProvider|usePoliciesPagination|goToPage" app/components/policies-pagination-context.tsx
```

Expected: output includes the `"use client"` directive, the imported server action, the provider, the hook, and `goToPage`.

---

### Task 4: Add The Client Policy Content Wrapper

**Files:**

- Create: `app/components/policies-client-content.tsx`

**Interfaces:**

- Consumes: `FetchPoliciesResponse` from `lib/api/policies.ts`.
- Consumes: `PolicyCard({ policy }: { policy: Policy })` from `app/components/policy-card.tsx`.
- Consumes: `PoliciesPagination()` from `app/components/policies-pagination.tsx`.
- Consumes: `PoliciesPaginationProvider` and `usePoliciesPagination` from `app/components/policies-pagination-context.tsx`.
- Produces: `PoliciesClientContent({ initialResponse }: PoliciesClientContentProps): JSX.Element`.

- [ ] **Step 1: Create the client content wrapper**

Create `app/components/policies-client-content.tsx` with:

```tsx
"use client";

import { PolicyCard } from "@/app/components/policy-card";
import { PoliciesPagination } from "@/app/components/policies-pagination";
import {
  PoliciesPaginationProvider,
  usePoliciesPagination,
} from "@/app/components/policies-pagination-context";
import type { FetchPoliciesResponse } from "@/lib/api/policies";

type PoliciesClientContentProps = {
  initialResponse: FetchPoliciesResponse;
};

export function PoliciesClientContent({
  initialResponse,
}: PoliciesClientContentProps) {
  return (
    <PoliciesPaginationProvider initialResponse={initialResponse}>
      <PoliciesClientList />
    </PoliciesPaginationProvider>
  );
}

function PoliciesClientList() {
  const { errorMessage, policies } = usePoliciesPagination();

  if (policies.length === 0) {
    return (
      <p className="text-muted-foreground rounded-xl border border-dashed bg-white p-8 text-center">
        No active policies found.
      </p>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-6">
        {policies.map((policy) => (
          <PolicyCard key={policy.policyNumber} policy={policy} />
        ))}
      </div>
      <div className="grid gap-3">
        <PoliciesPagination />
        {errorMessage ? (
          <p className="text-destructive text-center text-sm" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the wrapper uses the context**

Run:

```bash
rg -n "use client|PoliciesPaginationProvider|PoliciesClientList|usePoliciesPagination|role=\"alert\"" app/components/policies-client-content.tsx
```

Expected: output includes the client directive, provider usage, context hook usage, and alert role.

---

### Task 5: Convert Pagination Controls From Links To Buttons

**Files:**

- Modify: `app/components/policies-pagination.tsx`

**Interfaces:**

- Consumes: `usePoliciesPagination()` from `app/components/policies-pagination-context.tsx`.
- Produces: `PoliciesPagination(): JSX.Element | null` with no props.

- [ ] **Step 1: Replace `app/components/policies-pagination.tsx`**

Replace the full file content with:

```tsx
"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { usePoliciesPagination } from "@/app/components/policies-pagination-context";

export function PoliciesPagination() {
  const { goToPage, isPending, pagination } = usePoliciesPagination();

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent className="gap-4">
        {pagination.hasPreviousPage ? (
          <PaginationItem>
            <Button
              aria-label="Go to previous page"
              className="rounded-full"
              disabled={isPending}
              onClick={() => goToPage(pagination.currentPage - 1)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </Button>
          </PaginationItem>
        ) : null}
        {Array.from({ length: pagination.totalPages }, (_, index) => {
          const page = index + 1;
          const isActive = page === pagination.currentPage;

          return (
            <PaginationItem key={page}>
              <Button
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "bg-primary hover:bg-primary rounded-full border-transparent text-white hover:text-white"
                    : "rounded-full border-neutral-900 bg-neutral-50 text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900"
                }
                disabled={isPending}
                onClick={() => goToPage(page)}
                size="icon"
                type="button"
                variant={isActive ? "outline" : "ghost"}
              >
                {page}
              </Button>
            </PaginationItem>
          );
        })}
        {pagination.hasNextPage ? (
          <PaginationItem>
            <Button
              aria-label="Go to next page"
              className="rounded-full"
              disabled={isPending}
              onClick={() => goToPage(pagination.currentPage + 1)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ChevronRightIcon aria-hidden="true" />
            </Button>
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
```

- [ ] **Step 2: Verify pagination uses button controls**

Run:

```bash
rg -n "usePoliciesPagination|type=\"button\"" app/components/policies-pagination.tsx
```

Expected: output includes `usePoliciesPagination` and `type="button"`.

- [ ] **Step 3: Verify no URL href helper remains**

Run:

```bash
rg -n "href|getPageHref|PaginationLink" app/components/policies-pagination.tsx
```

Expected: no output.

---

### Task 6: Wire The Server Initial Response Into The Client Wrapper

**Files:**

- Modify: `app/components/policies-content.tsx`
- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `fetchPolicies(options?: FetchPoliciesOptions): Promise<FetchPoliciesResponse>`.
- Consumes: `PoliciesClientContent({ initialResponse }: { initialResponse: FetchPoliciesResponse })`.
- Produces: `PoliciesContent(): Promise<JSX.Element>`.

- [ ] **Step 1: Replace `app/components/policies-content.tsx`**

Replace the full file content with:

```tsx
import { PoliciesClientContent } from "@/app/components/policies-client-content";
import { fetchPolicies } from "@/lib/api/policies";

export async function PoliciesContent() {
  const initialResponse = await fetchPolicies({
    page: 1,
    pageSize: 3,
    sortOrder: "ascending",
  });

  return <PoliciesClientContent initialResponse={initialResponse} />;
}
```

- [ ] **Step 2: Replace `app/page.tsx`**

Replace the full file content with:

```tsx
import { Suspense } from "react";

import { PoliciesContent } from "@/app/components/policies-content";
import { PoliciesSkeleton } from "@/app/components/policies-skeleton";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-100">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<PoliciesSkeleton />}>
          <PoliciesContent />
        </Suspense>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify URL page parsing is removed from the route**

Run:

```bash
rg -n "searchParams|parsePositivePage|key=\\{page\\}|PoliciesContent page" app/page.tsx app/components/policies-content.tsx
```

Expected: no output.

---

### Task 7: Verify Behavior And Commit The Implementation

**Files:**

- Verify: `app/actions/policies.ts`
- Verify: `app/components/policies-pagination-context.tsx`
- Verify: `app/components/policies-client-content.tsx`
- Verify: `app/components/policies-pagination.tsx`
- Verify: `app/components/policies-content.tsx`
- Verify: `app/page.tsx`
- Verify: `docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md`

**Interfaces:**

- Consumes: all files created or modified by Tasks 1-6.
- Produces: verified implementation commit.

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: exits with status 0.

- [ ] **Step 2: Run format check**

Run:

```bash
npm run format:check
```

Expected: exits with status 0. If it fails only due to formatting in touched files, run `npx prettier --write` on the touched files and run this command again.

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: exits with status 0.

- [ ] **Step 4: Start the development server for browser verification**

Run:

```bash
npm run dev
```

Expected: Next.js starts and prints a local URL, usually `http://localhost:3000`.

- [ ] **Step 5: Verify the browser behavior**

Open the local URL from Step 4 and confirm:

- The first page renders policy cards.
- Clicking page `2` updates the visible policy cards.
- The browser URL remains `/`.
- The page does not perform a full document reload.
- Pagination buttons are disabled while the next page request is pending.
- Existing policy card layout and display rules remain unchanged.

- [ ] **Step 6: Stop the development server**

Stop the `npm run dev` process with `Ctrl-C`.

Expected: the dev server exits cleanly.

- [ ] **Step 7: Inspect the final diff**

Run:

```bash
git diff -- app/actions/policies.ts app/components/policies-pagination-context.tsx app/components/policies-client-content.tsx app/components/policies-pagination.tsx app/components/policies-content.tsx app/page.tsx docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md
```

Expected: diff contains only this implementation and the new development log.

- [ ] **Step 8: Stage only this task's files**

Run:

```bash
git add app/actions/policies.ts app/components/policies-pagination-context.tsx app/components/policies-client-content.tsx app/components/policies-pagination.tsx app/components/policies-content.tsx app/page.tsx docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md
```

Expected: command exits with status 0.

- [ ] **Step 9: Confirm unrelated files are not staged**

Run:

```bash
git diff --staged --name-only
```

Expected staged files:

```txt
app/actions/policies.ts
app/components/policies-pagination-context.tsx
app/components/policies-client-content.tsx
app/components/policies-pagination.tsx
app/components/policies-content.tsx
app/page.tsx
docs/dev-logs/2026-06-28-in-page-policy-pagination-ai-development-log.md
```

- [ ] **Step 10: Commit the implementation**

Run:

```bash
git commit -m "feat(pagination): fetch policy pages in place"
```

Expected: commit succeeds.
