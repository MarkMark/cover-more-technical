# My Policies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a server-rendered My Policies page that fetches active policies from a typed mock API, sorts and paginates them, and renders responsive policy cards.

**Architecture:** `app/page.tsx` stays a Server Component and reads URL pagination from `searchParams`. `PoliciesContent` performs the async policy fetch inside a `Suspense` boundary. Shared API and formatting helpers live under `lib/*`, while page-owned UI lives under `app/components/*`.

**Tech Stack:** Next.js `16.2.9`, React `19.2.4`, TypeScript, Tailwind CSS, shadcn UI primitives, lucide-react.

## Global Constraints

- Read relevant local Next.js docs under `node_modules/next/dist/docs/` before changing Next.js APIs or file conventions.
- Use `$karpathy-guidelines` when writing, reviewing, or refactoring code. If the skill file is unavailable, apply its stated discipline: small surgical edits, no speculative abstractions, explicit assumptions, and verifiable success criteria.
- Create an AI development log before implementation code at `docs/dev-logs/2026-06-28-my-policies-ai-development-log.md`.
- Page-specific components live under `app/components/*`.
- Reusable helpers live under `lib/*`.
- Shared data access lives under `lib/*`, including `lib/api/policies.ts`.
- Use the existing mocked data at `lib/api/mock-policies.json`.
- Fetch policies through a server-only function.
- Return only policies with `status: "Active"`.
- Sort policies by `policyStart`; default sort order is ascending.
- Paginate policies at three policies per page by default.
- Support direct page navigation through `?page=N`.
- Keep shadcn primitive component source and default styling unchanged.
- Use mobile-first Tailwind layout classes inside page-owned components.
- Single Trip policy plan text is `International comprehensive`.
- Annual raw `type: "Annual"` displays as `Annual Multi-trip`.
- Date format is `24 Dec 2025`.
- Excess format is `$200`.

---

## File Structure

- Create `docs/dev-logs/2026-06-28-my-policies-ai-development-log.md`: AI usage log required before implementation code.
- Create `lib/format.ts`: shared date, date-range, and currency formatting helpers.
- Create `lib/pagination.ts`: shared positive page parameter parsing helper.
- Create `lib/api/policies.ts`: server-only policy data access, typing, filtering, sorting, and pagination.
- Create `app/components/policy-card.tsx`: domain-specific card and private compound helpers.
- Create `app/components/policies-pagination.tsx`: URL-based shadcn pagination rendering.
- Create `app/components/policies-skeleton.tsx`: Suspense fallback using shadcn Skeleton.
- Create `app/components/policies-content.tsx`: async Server Component that fetches and renders policies.
- Modify `app/page.tsx`: replace starter page with My Policies shell and Suspense boundary.

## Execution And Parallelization

- Prefer parallel agents where task dependencies allow it.
- Task 1, Task 2, and Task 3 can run in parallel because they write independent files.
- Task 4 must wait for Task 2 and Task 3 because it consumes shared formatting helpers and the policy API type.
- Task 5 must wait for Task 3 and Task 4 because it consumes the API and `PolicyCard`.
- Task 6 runs after Tasks 1-5 complete.
- Tasks that write or modify application code must use model `5.5`.
- Do not commit after every task. Review and commit the complete implementation only after final verification, unless the user explicitly asks for intermediate commits.
- Do not require starting a development server for this plan. Browser verification may be performed only if a suitable local server is already running separately.

---

### Task 1: Create The AI Development Log

**Files:**
- Create: `docs/dev-logs/2026-06-28-my-policies-ai-development-log.md`

**Interfaces:**
- Consumes: Approved design spec at `docs/superpowers/specs/2026-06-28-my-policies-design.md`
- Produces: Required development log for reviewers before implementation code begins.

- [ ] **Step 1: Create the dev-log directory**

Run:

```bash
mkdir -p docs/dev-logs
```

Expected: command exits with status 0.

- [ ] **Step 2: Write the AI development log**

Create `docs/dev-logs/2026-06-28-my-policies-ai-development-log.md` with:

```markdown
# My Policies AI Development Log

## Task

Create a My Policies page that fetches active policies from a typed server-only mock API, sorts them by policy start date, paginates them three per page, and renders responsive policy cards.

## User Intent And Acceptance Criteria

- Fetch policies from an API-shaped server-only function backed by `lib/api/mock-policies.json`.
- Return and render only policies with `status: "Active"`.
- Sort rendered policies by `policyStart` ascending by default.
- Support direct URL pagination with three policies per page.
- Render different facts for Single Trip and Annual Multi-trip policies.
- Use shadcn Card, Skeleton, Button, and Pagination primitives without changing their default source styling.
- Use Tailwind for page-owned responsive layout: vertical stack on mobile, horizontal card layout on desktop.

## Relevant Brainstorming Summary

The approved design uses a server-first URL pagination approach. `app/page.tsx` reads `searchParams`, renders a static shell, and wraps async policy content in a `Suspense` boundary. `PoliciesContent` fetches the current policy page and renders `PolicyCard` instances plus pagination.

## Plan Summary

1. Create shared format and pagination helpers.
2. Create the typed server-only policy fetch function.
3. Build the policy card and its private compound helpers.
4. Build policy list content, skeleton fallback, pagination, and page shell.
5. Verify with lint, build, formatting, and browser checks.

## Prompts Or Context Given To AI

- The user provided the feature acceptance criteria and architecture constraints.
- The user invoked `$brainstorming`.
- The user approved URL-based pagination.
- The user clarified shared helpers should live under `lib/*`.
- The user clarified Single Trip policies should display `International comprehensive`.
- The user provided desktop and mobile card designs showing horizontal desktop layout and vertical mobile layout.
- The user approved the written design spec.

## AI Proposals

- Use a server-first URL pagination approach instead of client-side pagination.
- Isolate mock JSON and artificial delay behind a small source helper for easy replacement later.
- Centralize card display rules in `getPolicyCardModel`.
- Use Tailwind only in page-owned layout wrappers, leaving shadcn primitives unchanged.

## Human Review Decisions

- Approved URL-based pagination.
- Approved the architecture, data flow, rendering, layout, and verification design.
- Requested reusable helpers under `lib/*`.
- Requested Single Trip plan display as `International comprehensive`.

## Accepted Changes

- Server-first URL pagination.
- Typed `lib/api/policies.ts` data access.
- `app/components/*` policy UI components.
- Shared `lib/*` helpers.
- Responsive card layout based on supplied designs.

## Rejected Changes

- Client-side pagination was considered but rejected because it adds unnecessary client JavaScript and does not fit the server-first acceptance criteria.
- Fetching in `app/page.tsx` before the Suspense boundary was considered but rejected because it would reduce the usefulness of the streaming fallback.

## Tradeoffs

- Server navigation for each pagination click is acceptable because it preserves direct links and keeps the feature server-rendered.
- A card model adds a small abstraction, but it keeps policy-type rules in one testable place.
- The artificial delay helps verify Suspense behavior now and should be removed when replacing the mock source with a real API.

## Implementation Notes To Revisit

- Confirm whether `server-only` is available through Next.js during build.
- Confirm `mock-policies.json` raw `type: "Annual"` is consistently mapped to Annual Multi-trip display.
- Confirm page values beyond the last page clamp predictably.

## Prompt Log

### User Prompts And Responses

- Initial prompt: Build the My Policies page with mocked API fetching, active-policy filtering, start-date sorting, pagination, shadcn primitives, and policy-type-specific rendering.
- User response: Agreed to URL-based pagination.
- User response: Agreed to the proposed architecture and clarified helpers should live under `lib/*` because they are likely global.
- User response: Clarified Single Trip policies should display `International comprehensive`.
- User response: Provided desktop and mobile designs and confirmed Tailwind should handle responsive layout without changing shadcn defaults.
- User response: Approved the complete design and then approved the written spec.

### AI Response Summaries

- Explored project context, local architecture docs, mock policy data, shadcn primitives, and relevant local Next.js 16 docs.
- Proposed server-first URL pagination as the recommended approach.
- Presented and revised design sections based on user feedback.
- Wrote, self-reviewed, and committed the design spec.
- Wrote this implementation plan before implementation code.
```

- [ ] **Step 3: Review the log for required sections**

Run:

```bash
rg -n "## Task|## User Intent And Acceptance Criteria|## Prompt Log" docs/dev-logs/2026-06-28-my-policies-ai-development-log.md
```

Expected output includes all three headings.

---

### Task 2: Add Shared Formatting And Pagination Helpers

**Required model:** `5.5`

**Files:**
- Create: `lib/format.ts`
- Create: `lib/pagination.ts`

**Interfaces:**
- Consumes: ISO date strings in `YYYY-MM-DD` format; query values of type `string | string[] | undefined`.
- Produces:
  - `formatDate(value: string): string`
  - `formatDateRange(start: string, end: string): string`
  - `formatCurrency(value: number): string`
  - `parsePositivePage(value: string | string[] | undefined): number`

- [ ] **Step 1: Run build before implementation to capture missing module state**

Run:

```bash
npm run build
```

Expected: build may pass from the starter app or fail because implementation modules are not present yet. Record the result in the task notes.

- [ ] **Step 2: Create `lib/format.ts`**

Add:

```ts
const DATE_FORMATTER = new Intl.DateTimeFormat("en-AU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-AU", {
  currency: "AUD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
});

function parseIsoDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function formatDate(value: string) {
  return DATE_FORMATTER.format(parseIsoDate(value));
}

export function formatDateRange(start: string, end: string) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value);
}
```

- [ ] **Step 3: Create `lib/pagination.ts`**

Add:

```ts
export function parsePositivePage(value: string | string[] | undefined) {
  const pageValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(pageValue ?? "", 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}
```

- [ ] **Step 4: Verify helper behavior with TypeScript execution**

Run:

```bash
npx tsx -e 'import { formatCurrency, formatDate, formatDateRange } from "./lib/format"; import { parsePositivePage } from "./lib/pagination"; console.log(formatDate("2025-12-24")); console.log(formatDateRange("2026-06-01", "2026-06-15")); console.log(formatCurrency(200)); console.log([parsePositivePage("2"), parsePositivePage("0"), parsePositivePage(["3"]), parsePositivePage(undefined)].join(","));'
```

Expected output:

```text
24 Dec 2025
01 Jun 2026 - 15 Jun 2026
$200
2,1,3,1
```

---

### Task 3: Add Typed Server-Only Policy API

**Required model:** `5.5`

**Files:**
- Create: `lib/api/policies.ts`
- Uses existing: `lib/api/mock-policies.json`

**Interfaces:**
- Consumes:
  - `formatDate` is not consumed here; API returns raw dates for UI modeling.
  - `lib/api/mock-policies.json`
- Produces:
  - `type PolicySortOrder = "ascending" | "descending"`
  - `type PolicyStatus = "Active" | "Expired"`
  - `type PolicyType = "Single Trip" | "Annual"`
  - `type Policy`
  - `type FetchPoliciesOptions`
  - `type FetchPoliciesResponse`
  - `async function fetchPolicies(options?: FetchPoliciesOptions): Promise<FetchPoliciesResponse>`

- [ ] **Step 1: Create the initial API module**

Add `lib/api/policies.ts`:

```ts
import "server-only";

import mockPolicies from "./mock-policies.json";

export type PolicySortOrder = "ascending" | "descending";
export type PolicyStatus = "Active" | "Expired";
export type PolicyType = "Single Trip" | "Annual";

export type PolicyDestination = {
  code: string;
  name: string;
};

export type Policy = {
  policyNumber: string;
  policyStart: string;
  policyEnd: string;
  primaryTravellerFirstname: string;
  primaryTravellerLastName: string;
  primaryTravellerPhoneNumber: string;
  status: PolicyStatus;
  destinations: PolicyDestination[];
  alphaCode: string;
  iSO3CountryOfResidence: string;
  underwriterCode: string;
  groupCode: string;
  type: PolicyType;
  excess: number;
  maxTripDuration: number;
  planName: string;
};

export type FetchPoliciesOptions = {
  page?: number;
  pageSize?: number;
  sortOrder?: PolicySortOrder;
};

export type PoliciesPagination = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type FetchPoliciesResponse = {
  policies: Policy[];
  pagination: PoliciesPagination;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 3;
const DEFAULT_SORT_ORDER: PolicySortOrder = "ascending";
const MOCK_API_DELAY_MS = 400;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchPoliciesFromMockSource(): Promise<Policy[]> {
  await delay(MOCK_API_DELAY_MS);
  return mockPolicies as Policy[];
}

function normalisePositiveInteger(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value) || value === undefined || value < 1) {
    return fallback;
  }

  return Math.floor(value);
}

function comparePolicyStartDates(sortOrder: PolicySortOrder) {
  return (first: Policy, second: Policy) => {
    const firstTime = Date.parse(first.policyStart);
    const secondTime = Date.parse(second.policyStart);

    return sortOrder === "ascending"
      ? firstTime - secondTime
      : secondTime - firstTime;
  };
}

export async function fetchPolicies(
  options: FetchPoliciesOptions = {},
): Promise<FetchPoliciesResponse> {
  const pageSize = normalisePositiveInteger(options.pageSize, DEFAULT_PAGE_SIZE);
  const requestedPage = normalisePositiveInteger(options.page, DEFAULT_PAGE);
  const sortOrder = options.sortOrder ?? DEFAULT_SORT_ORDER;

  const activePolicies = (await fetchPoliciesFromMockSource())
    .filter((policy) => policy.status === "Active")
    .sort(comparePolicyStartDates(sortOrder));

  const totalItems = activePolicies.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage =
    totalPages === 0 ? DEFAULT_PAGE : Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const policies = activePolicies.slice(startIndex, startIndex + pageSize);

  return {
    policies,
    pagination: {
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}
```

- [ ] **Step 2: Verify API behavior with TypeScript execution**

Run:

```bash
npx tsx -e 'import { fetchPolicies } from "./lib/api/policies"; const page1 = await fetchPolicies({ page: 1, pageSize: 3, sortOrder: "ascending" }); const page3 = await fetchPolicies({ page: 999, pageSize: 3, sortOrder: "ascending" }); console.log(page1.policies.map((policy) => `${policy.policyNumber}:${policy.status}:${policy.policyStart}`).join("\n")); console.log(JSON.stringify(page1.pagination)); console.log(JSON.stringify(page3.pagination));'
```

Expected:

- every printed policy status is `Active`,
- the first page policy dates are in ascending order,
- `page1.pagination.pageSize` is `3`,
- `page3.pagination.currentPage` is clamped to the last available page.

- [ ] **Step 3: Run build to catch server-only or JSON import issues**

Run:

```bash
npm run build
```

Expected: build succeeds, or fails only because later UI files are not implemented yet. It must not fail because of `lib/api/policies.ts`.

---

### Task 4: Build The Policy Card Component

**Required model:** `5.5`

**Files:**
- Create: `app/components/policy-card.tsx`

**Interfaces:**
- Consumes:
  - `type Policy` from `@/lib/api/policies`
  - `formatCurrency`, `formatDate`, and `formatDateRange` from `@/lib/format`
  - shadcn `Button`, `Card`, `CardContent`, `CardHeader`, and `CardTitle`
  - lucide-react `ExternalLink`
- Produces:
  - `function PolicyCard({ policy }: { policy: Policy }): JSX.Element`

- [ ] **Step 1: Create `app/components/policy-card.tsx`**

Add:

```tsx
import { ExternalLink } from "lucide-react";

import type { Policy } from "@/lib/api/policies";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PolicyCardModel = {
  documents: Array<{ href: string; label: string }>;
  factGroups: Array<Array<{ label: string; value: string }>>;
  policyNumber: string;
};

type PolicyCardProps = {
  policy: Policy;
};

export function PolicyCard({ policy }: PolicyCardProps) {
  const model = getPolicyCardModel(policy);

  return (
    <PolicyCardRoot>
      <PolicyCardMain>
        <PolicyCardHeader policyNumber={model.policyNumber} />
        <PolicyCardFacts factGroups={model.factGroups} />
        <PolicyCardDocuments documents={model.documents} />
      </PolicyCardMain>
      <PolicyCardActions />
    </PolicyCardRoot>
  );
}

function PolicyCardRoot({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="grid gap-8 md:grid-cols-[1fr_16rem] md:items-start">
        {children}
      </CardContent>
    </Card>
  );
}

function PolicyCardMain({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-8">{children}</div>;
}

function PolicyCardHeader({ policyNumber }: { policyNumber: string }) {
  return (
    <CardHeader className="px-0">
      <CardTitle className="text-3xl">
        <span className="text-primary font-semibold">Policy number:</span>{" "}
        <span className="font-normal text-foreground">{policyNumber}</span>
      </CardTitle>
    </CardHeader>
  );
}

function PolicyCardFacts({
  factGroups,
}: {
  factGroups: PolicyCardModel["factGroups"];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8">
      {factGroups.map((facts, index) => (
        <PolicyCardFactGroup
          // The group order is fixed by the card model and has no separate id.
          key={index}
          hasDivider={index > 0}
        >
          {facts.map((fact) => (
            <PolicyCardFact key={fact.label} {...fact} />
          ))}
        </PolicyCardFactGroup>
      ))}
    </div>
  );
}

function PolicyCardFactGroup({
  children,
  hasDivider,
}: {
  children: React.ReactNode;
  hasDivider: boolean;
}) {
  return (
    <dl
      className={
        hasDivider
          ? "grid gap-3 md:border-l md:pl-8"
          : "grid gap-3"
      }
    >
      {children}
    </dl>
  );
}

function PolicyCardFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-base">
      <dt className="inline font-semibold">{label}: </dt>
      <dd className="inline">{value}</dd>
    </div>
  );
}

function PolicyCardDocuments({
  documents,
}: {
  documents: PolicyCardModel["documents"];
}) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      {documents.map((document) => (
        <a
          className="inline-flex items-center gap-2 text-sm underline underline-offset-2"
          href={document.href}
          key={document.label}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          {document.label}
        </a>
      ))}
    </div>
  );
}

function PolicyCardActions() {
  return (
    <div className="grid gap-4 md:pt-2">
      <Button>Make a claim</Button>
      <Button variant="outline">Manage my policy</Button>
    </div>
  );
}

function getPolicyCardModel(policy: Policy): PolicyCardModel {
  const destination = policy.destinations
    .map((policyDestination) => policyDestination.name)
    .join(", ");

  const sharedFacts = [
    { label: "Destination", value: destination },
    { label: "Plan", value: getPolicyPlanLabel(policy) },
    { label: "Excess", value: formatCurrency(policy.excess) },
  ];

  const typeSpecificFacts =
    policy.type === "Annual"
      ? [
          {
            label: "Policy start date",
            value: formatDate(policy.policyStart),
          },
          {
            label: "Maximum trip duration",
            value: `Up to ${policy.maxTripDuration} days`,
          },
        ]
      : [
          {
            label: "Travel date",
            value: formatDateRange(policy.policyStart, policy.policyEnd),
          },
        ];

  const firstGroup =
    policy.type === "Annual"
      ? [sharedFacts[0], ...typeSpecificFacts]
      : [sharedFacts[0], ...typeSpecificFacts];

  const secondGroup = [sharedFacts[1], sharedFacts[2]];

  return {
    documents: [
      { href: "#view-pds", label: "View PDS" },
      {
        href: "#certificate-of-insurance",
        label: "Certificate of Insurance",
      },
    ],
    factGroups: [firstGroup, secondGroup],
    policyNumber: policy.policyNumber,
  };
}

function getPolicyPlanLabel(policy: Policy) {
  if (policy.type === "Annual") {
    return "Annual Multi-trip";
  }

  return "International comprehensive";
}
```

- [ ] **Step 2: Run lint for the component**

Run:

```bash
npm run lint
```

Expected: no lint errors from `app/components/policy-card.tsx`.

- [ ] **Step 3: Run build for type checking**

Run:

```bash
npm run build
```

Expected: build succeeds, or fails only because the page integration components are not implemented yet. It must not fail because of `PolicyCard`.

---

### Task 5: Build Policy Content, Pagination, Skeleton, And Page Shell

**Required model:** `5.5`

**Files:**
- Create: `app/components/policies-content.tsx`
- Create: `app/components/policies-pagination.tsx`
- Create: `app/components/policies-skeleton.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes:
  - `fetchPolicies` from `@/lib/api/policies`
  - `parsePositivePage` from `@/lib/pagination`
  - `PolicyCard` from `@/app/components/policy-card`
  - shadcn Skeleton and Pagination primitives
- Produces:
  - `async function PoliciesContent({ page }: { page: number }): Promise<JSX.Element>`
  - `function PoliciesPagination({ currentPage, totalPages, hasPreviousPage, hasNextPage }: PoliciesPaginationProps): JSX.Element | null`
  - `function PoliciesSkeleton(): JSX.Element`
  - root My Policies page at `/`

- [ ] **Step 1: Create `app/components/policies-pagination.tsx`**

Add:

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PoliciesPaginationProps = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
};

export function PoliciesPagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  totalPages,
}: PoliciesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Pagination>
      <PaginationContent>
        {hasPreviousPage ? (
          <PaginationItem>
            <PaginationPrevious href={getPageHref(currentPage - 1)} />
          </PaginationItem>
        ) : null}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={getPageHref(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {hasNextPage ? (
          <PaginationItem>
            <PaginationNext href={getPageHref(currentPage + 1)} />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}

function getPageHref(page: number) {
  return page === 1 ? "/" : `/?page=${page}`;
}
```

- [ ] **Step 2: Create `app/components/policies-skeleton.tsx`**

Add:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function PoliciesSkeleton() {
  return (
    <div className="grid gap-6">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          className="rounded-xl border bg-card p-6"
          key={index}
        >
          <Skeleton className="h-9 w-64" />
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_16rem]">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-3">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-72" />
              </div>
              <div className="grid gap-3 md:border-l md:pl-8">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <div className="grid gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      ))}
      <Skeleton className="mx-auto h-9 w-64" />
    </div>
  );
}
```

- [ ] **Step 3: Create `app/components/policies-content.tsx`**

Add:

```tsx
import { fetchPolicies } from "@/lib/api/policies";
import { PolicyCard } from "@/app/components/policy-card";
import { PoliciesPagination } from "@/app/components/policies-pagination";

type PoliciesContentProps = {
  page: number;
};

export async function PoliciesContent({ page }: PoliciesContentProps) {
  const { pagination, policies } = await fetchPolicies({
    page,
    pageSize: 3,
    sortOrder: "ascending",
  });

  if (policies.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-card-foreground">
        No active policies found.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6">
        {policies.map((policy) => (
          <PolicyCard key={policy.policyNumber} policy={policy} />
        ))}
      </div>
      <PoliciesPagination
        currentPage={pagination.currentPage}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx`**

Set `app/page.tsx` to:

```tsx
import { Suspense } from "react";

import { PoliciesContent } from "@/app/components/policies-content";
import { PoliciesSkeleton } from "@/app/components/policies-skeleton";
import { parsePositivePage } from "@/lib/pagination";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const currentPage = parsePositivePage(page);

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto grid max-w-6xl gap-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">
            My Policies
          </h1>
        </header>
        <Suspense fallback={<PoliciesSkeleton />}>
          <PoliciesContent page={currentPage} />
        </Suspense>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run lint**

Run:

```bash
npm run lint
```

Expected: lint succeeds.

- [ ] **Step 6: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

### Task 6: Final Verification And Polish

**Required model for any code fixes:** `5.5`

**Files:**
- Modify only files from Tasks 2-5 if verification exposes defects.

**Interfaces:**
- Consumes: completed My Policies implementation.
- Produces: verified page and any small fixes required by lint, build, formatting, or browser review.

- [ ] **Step 1: Run formatting check**

Run:

```bash
npm run format:check
```

Expected: all checked files are formatted. If this fails, run `npx prettier --write` on only the changed files, then rerun `npm run format:check`.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: lint succeeds.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Verify page behavior without starting a development server**

Use build output, source review, and, if a suitable local server is already running separately, browser review. Do not start a development server as part of this plan.

Confirm:

- The heading reads `My Policies`.
- Exactly three policy cards render on page 1.
- Every visible policy is active.
- Policy start dates are in ascending order.
- Annual policies show `Annual Multi-trip`.
- Single Trip policies show `International comprehensive`.
- Document links include an external-link icon.
- Action buttons read `Make a claim` and `Manage my policy`.

- [ ] **Step 5: Verify direct pagination behavior**

Review source behavior and, if a suitable server is already running separately, open:

```text
http://localhost:3000/?page=2
```

Expected:

- The page renders the second set of active policies.
- Pagination shows page 2 as active.
- Previous and next links appear only when available.

Also verify:

```text
http://localhost:3000/?page=999
```

Expected:

- The rendered pagination is clamped to the last available page.
- The page does not crash.

- [ ] **Step 6: Verify responsive layout**

Check desktop width:

- Cards lay out policy details on the left and actions on the right.
- Fact groups can display in two columns.
- Document links sit below the facts on the left.

Check mobile width:

- Card content stacks vertically.
- Facts render in one column.
- Document links render above actions.
- Action buttons are full-width and stacked.

- [ ] **Step 7: Prepare final commit when requested**

When the user asks for a commit, stage the complete implementation together:

```bash
git add docs/dev-logs/2026-06-28-my-policies-ai-development-log.md app/components app/page.tsx lib/format.ts lib/pagination.ts lib/api/policies.ts
git commit -m "feat: add my policies page"
```

Expected: commit succeeds with the full implementation staged. Do not create a commit unless requested.

---

## Self-Review

### Spec Coverage

- Server-only typed policy fetch: Task 3.
- Mock JSON and artificial delay: Task 3.
- Active-only filtering: Task 3.
- Ascending date sort and configurable sort order: Task 3.
- Page size and current page options: Task 3.
- URL pagination: Task 5 and Task 6.
- Server Component page and async content: Task 5.
- Suspense with shadcn Skeleton fallback: Task 5.
- Policy card private compound component structure: Task 4.
- Type-specific display rules: Task 4.
- Date and currency formatting: Task 2 and Task 4.
- Document links with Lucide ExternalLink: Task 4.
- Actions with default and outline Button variants: Task 4.
- Mobile-first responsive layout: Task 4, Task 5, and Task 6.
- AI development log before implementation: Task 1.

### Placeholder Scan

All task steps include concrete file paths, commands, code blocks, and expected outcomes. Verification failures are handled by specific commands and expected outcomes.

### Type Consistency

The plan defines and consistently consumes `Policy`, `FetchPoliciesOptions`, `FetchPoliciesResponse`, `PoliciesPagination`, `formatDate`, `formatDateRange`, `formatCurrency`, `parsePositivePage`, `PolicyCard`, `PoliciesPagination`, `PoliciesSkeleton`, and `PoliciesContent`.
