# My Policies Page Design

## Task

Create a My Policies page that fetches policies from a typed server-only API function backed by the provided mock JSON, renders only active policies, sorts them by policy start date, and paginates them three per page.

## User Intent And Acceptance Criteria

The page should show a customer their active policies in date order with information tailored to each policy type.

- Policies are fetched through an API-shaped function, with `lib/api/mock-policies.json` used as the temporary data source.
- Only policies with `status: "Active"` render.
- Rendered policies sort by `policyStart`, ascending by default.
- Pagination returns three policies per page and supports direct navigation to a specific page through the URL.
- The API function accepts configurable `sortOrder`, `pageSize`, and `page` options.
- The initial page and policy content render as Server Components.
- Policy content is wrapped in a `Suspense` boundary with a shadcn `Skeleton` fallback.
- Each policy renders through a dedicated `PolicyCard` component rooted in the shadcn `Card` primitive.
- Pagination renders beneath the loaded policy cards using the shadcn `Pagination` primitive.

## Relevant Project Context

The app is a compact Next.js App Router project using Next `16.2.9`, React `19.2.4`, Tailwind CSS, lucide-react, and shadcn components.

Relevant existing files:

- `app/page.tsx` currently contains the starter page and will become the My Policies route.
- `docs/architecture.md` states that page-specific components should live under `app/components/*`.
- Shared shadcn primitives live under `components/ui/*`.
- Shared data access belongs under `lib/*`, including `lib/api/policies.ts`.
- The provided policy fixture is `lib/api/mock-policies.json`.

The local Next.js 16 docs confirm that pages are Server Components by default, `searchParams` is a promise, and `searchParams` should be used for data-affecting pagination.

## Decisions From Brainstorming

- Use URL-based pagination with `?page=N`.
- Keep page-owned rendering components under `app/components/*`.
- Put reusable helpers under `lib/*`, not `app/lib/*`, because date, currency, and page parsing utilities are likely to become global helpers.
- Treat raw policy `type: "Annual"` as the Annual Multi-trip policy type for display.
- Display Single Trip plans as `International comprehensive`, regardless of the raw `planName`.
- Follow the supplied designs as layout guidance: mobile stacks vertically, desktop lays out policy details and actions horizontally.
- Use Tailwind classes for page/component layout only. Do not modify the default shadcn primitive source or styling.

## Recommended Approach

Use a server-first URL pagination approach.

`app/page.tsx` will read the `page` search parameter, normalize it, render the page shell, and place `PoliciesContent` inside a `Suspense` boundary. `PoliciesContent` will be an async Server Component that fetches the relevant page of policies and renders cards plus pagination links.

This approach keeps data access server-only, supports direct page navigation, avoids unnecessary client-side state, and gives the Suspense boundary useful work to stream.

## Architecture

### Route

`app/page.tsx` will:

- remain a Server Component,
- await `searchParams` according to the Next.js 16 page convention,
- normalize `page` to a positive integer,
- render a My Policies heading and static shell,
- render `<Suspense fallback={<PoliciesSkeleton />}>`,
- pass the normalized page into `PoliciesContent`.

### Data Access

Create `lib/api/policies.ts`.

The module will:

- be server-only,
- export fully typed raw policy, normalized policy, pagination, options, and response types,
- import the mock JSON fixture,
- isolate the temporary mock-source behavior behind a small helper,
- introduce a small artificial delay in that mock-source helper,
- filter active policies,
- sort by `policyStart`,
- paginate after filtering and sorting,
- return the current page of policies plus pagination metadata.

The response shape should include:

- `policies`,
- `pagination.currentPage`,
- `pagination.pageSize`,
- `pagination.totalItems`,
- `pagination.totalPages`,
- `pagination.hasPreviousPage`,
- `pagination.hasNextPage`.

If the requested page is higher than the available page count, the API response should clamp to the last available page. If there are no active policies, current page can remain page 1 with zero total pages.

### Shared Helpers

Reusable helpers under `lib/*` should cover:

- date formatting, e.g. `24 Dec 2025`,
- travel-date range formatting,
- currency formatting, e.g. `$200`,
- positive integer page parameter parsing.

## Components

Create page-specific components under `app/components/*`.

### PoliciesContent

`PoliciesContent` will:

- accept the requested page number,
- call `fetchPolicies({ page, pageSize: 3, sortOrder: "ascending" })`,
- render a list of `PolicyCard` components,
- render `PoliciesPagination` beneath the cards when pagination is needed,
- render a minimal empty state when no active policies are available.

### PoliciesSkeleton

`PoliciesSkeleton` will use the shadcn `Skeleton` primitive to approximate three policy cards and a pagination row.

### PoliciesPagination

`PoliciesPagination` will use shadcn pagination primitives and generate links for direct navigation:

- previous page when available,
- numbered pages,
- next page when available.

The active page should set `aria-current="page"` through the shadcn `PaginationLink` active state.

### PolicyCard

`PolicyCard` will be a domain-specific component rooted in the shadcn `Card` primitive. Its top-level render should read like a private compound component using:

- `PolicyCardRoot`
- `PolicyCardMain`
- `PolicyCardHeader`
- `PolicyCardFacts`
- `PolicyCardFactGroup`
- `PolicyCardFact`
- `PolicyCardDocuments`
- `PolicyCardActions`
- `getPolicyCardModel`

`getPolicyCardModel` centralizes the display rules and returns a render-ready model instead of spreading formatting decisions through JSX.

## Policy Card Display Rules

Every card:

- uses the policy number as the heading,
- displays destination names joined with commas,
- displays plan,
- displays excess as currency,
- includes `View PDS` and `Certificate of Insurance` links with the Lucide `ExternalLink` icon,
- includes `Make a claim` using the shadcn Button default variant,
- includes `Manage my policy` using the shadcn Button outline variant.

Annual Multi-trip policies:

- are identified from raw `type: "Annual"`,
- display plan as `Annual Multi-trip`,
- display destination, policy start date, maximum trip duration, plan, and excess,
- display maximum trip duration as `Up to N days`.

Single Trip policies:

- are identified from raw `type: "Single Trip"`,
- display plan as `International comprehensive`,
- display destination, travel date, plan, and excess,
- display travel date as a start-to-end range.

## Layout And Styling

The implementation should use mobile-first Tailwind layout classes inside page-owned components.

Mobile:

- cards stack vertically,
- policy heading label and number wrap naturally,
- facts render in one column,
- document links render below facts,
- actions render below document links,
- actions are full-width and stacked.

Desktop:

- card content lays out horizontally,
- the main policy details occupy the left side,
- actions sit on the right in a fixed-width vertical stack,
- facts can split into two columns with a subtle divider between groups,
- document links stay under the facts on the left.

Do not change the shadcn primitive component source. Styling improvements beyond layout are out of scope for this implementation.

## Error Handling

- Missing, non-numeric, or invalid `page` query values normalize to page 1.
- Requested pages beyond the available range are clamped by the API response.
- No active policies renders a simple empty state.
- The mock-source helper keeps the artificial delay and JSON import easy to remove when switching to a real API.

## Testing And Verification

Implementation should be verified with:

- `npm run lint`,
- `npm run build`,
- `npm run format:check` when practical,
- browser verification of the rendered page.

Manual verification should confirm:

- only active policies render,
- policies sort by start date ascending,
- pagination shows three policies per page,
- `?page=N` direct navigation works,
- Annual and Single Trip policies display the correct facts,
- Single Trip plan text is `International comprehensive`,
- Annual plan text is `Annual Multi-trip`,
- mobile layout stacks vertically,
- desktop layout places details and actions horizontally.

## Tradeoffs

- Server-first pagination avoids client-side state and keeps direct navigation simple, but it means each page change triggers a server navigation.
- The card model adds a small abstraction, but it keeps policy-type display rules in one place and makes the JSX easier to scan.
- The mock API delay is useful for Suspense verification now, but it should be removed when replacing the fixture with a real API call.

## Prompt Log

### User Prompts And Decisions

- Initial request: Build a My Policies page. Fetch policies through a mocked API using the provided JSON, render only active policies, sort by policy start date, support Single Trip and Annual Multi-trip display rules, use shadcn Card, Skeleton, and Pagination components, and keep page-specific code in the requested locations.
- User agreed that pagination should use URL query parameters such as `?page=2`.
- User agreed with the server-first URL pagination architecture.
- User clarified that reusable helpers should live under `lib/*` because they are likely global helpers.
- User clarified that Single Trip policies should display the plan as `International comprehensive`.
- User provided desktop and mobile policy card designs showing horizontal desktop layout and vertical mobile layout.
- User confirmed Tailwind should provide the responsive layout, while shadcn component defaults should remain unchanged.
- User approved the complete design.

### AI Response Summary

- Read the brainstorming instructions and project context.
- Inspected the architecture document, existing app files, shadcn primitives, mock policy data, package versions, and relevant local Next.js 16 documentation.
- Identified that raw annual policies use `type: "Annual"` while the UI should display `Annual Multi-trip`.
- Proposed three approaches and recommended server-first URL pagination.
- Presented design sections for architecture, data flow, rendering/components, responsive layout, and verification.
- Incorporated user clarifications into the final design.
