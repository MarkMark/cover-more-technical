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

---

### Initial prompt

This didn't get populated so I'm manually copying it across:

# My Policies Page

We are creating a **"My Policies"** page.

## Acceptance Criteria

- Policies must be fetched from an API. For this task, mock the API response using the provided JSON.
- Policies must display different information depending on their type:

  - `Single Trip`
  - `Annual Multi-trip`

- Rendered policies must be sorted in ascending order by their policy start date.
- Rendered policies must only include policies with an `Active` status.

---

# Architecture

For this feature, the page can live directly within the `app/` directory.

An overview of the application architecture is available at:

`docs/architecture.md`

### File locations

- Page-specific components should live under `app/components/*`.
- Page-specific utilities should live under `app/lib/*`.

---

# Implementation

## Fetching policies

Under `lib/api/`:

- Create a **server-only** function responsible for fetching policies.
- Use the existing mocked data located at:

  - `lib/api/mock-policies.json`

- The function should be fully typed, including the response type.
- Introduce a small artificial delay to simulate a real-world network request.
- Structure the implementation so that the mocked data and artificial delay can easily be removed when transitioning to a real API.
- Only return policies with an `Active` status.
- Introduce pagination:

  - Return 3 policies per page.
  - Support navigating directly to a specific page.

- Include configurable parameters for:

  - Sort order (`ascending` / `descending`)
  - Page size
  - Current page

These parameters should be straightforward to update in the future.

---

## Consuming the data

- The page should be a **Server Component** and perform the initial data fetch.
- Wrap the content in a `Suspense` boundary.
- Use the shadcn `Skeleton` component as the fallback.
- The `Suspense` children should be a `PoliciesContent` component located under `app/components/*`.
- Iterate over the response and render each policy using a dedicated `PolicyCard` component.

---

# Policy Card

Use the shadcn `Card` component as the root primitive.

The `PolicyCard` should be domain-specific and structured using private helpers:

- `PolicyCardRoot`
- `PolicyCardMain`
- `PolicyCardHeader`
- `PolicyCardFacts`
- `PolicyCardFactGroup`
- `PolicyCardFact`
- `PolicyCardDocuments`
- `PolicyCardActions`
- `getPolicyCardModel`

The top-level render should read like a private compound component.

### Formatting

- Dates should be formatted as:

  - `24 Dec 2025`

- Excess values should be displayed as currency:

  - `$200`
  - `$400`

### Display rules

For **Annual Multi-trip** policies:

- Display:

  - Maximum trip duration
  - Policy start date

- The plan should display as:

  - `Annual Multi-trip`

For **Single Trip** policies:

- Display:

  - Travel date

- The plan should display the plan name (for example):

  - `International Comprehensive`

The remaining facts shown on every policy are:

- Destination
- Plan
- Excess

### Actions

Include two action buttons:

- **Make a claim** (`default` / primary variant)
- **Manage my policy** (`outline` variant)

Include two document links with the Lucide **External Link** icon:

- View PDS
- Certificate of Insurance

The policy number should be used as the card heading.

---

# Pagination

Use the shadcn `Pagination` component.

The pagination should be rendered beneath the loaded policy cards.
