# In-Page Policy Pagination Design

## Task

Improve the My Policies pagination UX so changing pages does not update URL parameters, trigger route navigation, or cause a full page reload. Preserve the current server-rendered initial page and server-owned policy API.

## User Intent And Acceptance Criteria

- Pagination should happen in-page.
- The browser URL should not be used for pagination state.
- The first page of policies should continue to render through the existing server-rendered route flow.
- The policy API should remain server-owned and should not be imported directly into client components.
- The implementation should touch as little existing code as practical.
- A lightweight page-local context may be used around the policy list and pagination controls to avoid prop threading.
- Pagination requests should execute on the server and update the visible cards without a document reload.

## Relevant Project Context

The current implementation is a compact Next.js App Router page:

- `app/page.tsx` reads `searchParams.page`, normalizes it, and keys the `Suspense` boundary by page.
- `app/components/policies-content.tsx` is an async Server Component that calls `fetchPolicies`.
- `lib/api/policies.ts` is marked `server-only` and owns mocked policy fetching, active-policy filtering, sorting, and pagination.
- `app/components/policies-pagination.tsx` renders shadcn pagination links with `href` values such as `/?page=2`.
- The current link-based pagination preserves direct URLs but makes every page change a route navigation.

The new requirement prioritizes smooth in-page interaction over shareable pagination URLs.

## Decisions From Brainstorming

- Do not move policy fetching wholesale into the client.
- Keep `lib/api/policies.ts` server-only.
- Add a thin server action wrapper that calls the server-only `fetchPolicies` function.
- Replace URL-link pagination behavior with button-driven client interaction.
- Use a lightweight page-local context for the currently displayed page data and pagination actions.

## Recommended Approach

Use a server-rendered initial result plus a page-local pagination context and server action for subsequent in-page pagination.

`PoliciesContent` should remain the server entry point for policy data. It will fetch page 1 with `fetchPolicies({ page: 1, pageSize: 3, sortOrder: "ascending" })`, then pass that initial response into a small client component. The client component will provide a page-local pagination context. Policy cards and pagination controls can read the current response and page-change action from that context. When the user selects another page, the provider will call a server action that fetches that page on the server and returns the same response shape.

This keeps the existing data access boundary intact while removing route navigation from pagination clicks.

## Architecture

### Server Action

Add a page-owned action module, for example `app/actions/policies.ts`, with `"use server"`.

The action should:

- accept a requested page number,
- call `fetchPolicies({ page, pageSize: 3, sortOrder: "ascending" })`,
- return `FetchPoliciesResponse`,
- rely on `fetchPolicies` for invalid page normalization and high-page clamping.

The action should be intentionally thin so the domain behavior stays in `lib/api/policies.ts`.

### Initial Server Render

Update `app/page.tsx` and `PoliciesContent` so the initial page no longer depends on `searchParams.page`.

`app/page.tsx` should:

- remain a Server Component,
- keep the existing page shell and `Suspense` boundary,
- stop keying `Suspense` by the page query parameter,
- avoid treating URL query parameters as pagination state.

`PoliciesContent` should:

- remain an async Server Component,
- fetch the initial policy page from the server-only API,
- pass the returned policies and pagination metadata into the client policy list component.

### Client Pagination Context

Add a small page-local context module or colocated provider, for example `PoliciesPaginationProvider`.

The context should:

- accept the initial `FetchPoliciesResponse`,
- store the current response in `useState`,
- use `useTransition` while requesting another page,
- expose a `goToPage(page: number)` action that calls the server action,
- expose the current policies, pagination metadata, pending state, and any minimal error state,
- be scoped to the policy list instead of acting as a global application store.

### Client Policy List

Add or adapt a client component, for example `PoliciesClientContent`.

The component should:

- wrap the policy list and pagination controls in `PoliciesPaginationProvider`,
- render `PolicyCard` instances from the current response,
- render the pagination controls from the current pagination metadata,
- keep the previous page visible while a new page is loading,
- disable pagination controls during pending requests to avoid overlapping interactions.

### Pagination Controls

Update `PoliciesPagination` to support button-driven pagination.

The component should:

- continue using the shadcn pagination primitives for layout,
- render controls as buttons instead of URL links,
- read pagination metadata, pending state, and `goToPage` from the page-local context,
- preserve the active page state and accessible labels,
- avoid URL mutation.

## Data Flow

```txt
Initial request
  app/page.tsx
    -> PoliciesContent
      -> fetchPolicies({ page: 1 })
      -> PoliciesClientContent(initialResponse)
        -> PoliciesPaginationProvider(initialResponse)

Pagination click
  PoliciesPagination button
    -> PoliciesPaginationContext.goToPage(page)
      -> getPoliciesPage(page) server action
        -> fetchPolicies({ page })
      -> setCurrentResponse(nextResponse)
```

## Error Handling

- Invalid page values should continue to normalize or clamp inside `fetchPolicies`.
- Pagination controls should not request pages outside the available range.
- While pending, controls should be disabled or otherwise prevent duplicate page requests.
- If a server action request fails, keep the current page visible. A minimal inline error message is acceptable if it can be added without broad UI churn; otherwise, logging and preserving the current state is acceptable for this technical test.
- Empty policy results should continue to render the existing empty state.

## Testing And Verification

Implementation should be verified with:

- `npm run lint`,
- `npm run build`,
- `npm run format:check` when practical,
- browser verification when a dev server is available.

Manual verification should confirm:

- the first policies render still comes from the server component flow,
- clicking pagination does not change the URL,
- clicking pagination does not reload the full document,
- policy cards update to the selected page,
- pending pagination interactions do not create duplicate requests,
- page bounds still behave correctly,
- existing policy card layout and display rules remain unchanged.

## Prompt Log

### User Prompts And Responses

- Initial prompt: The user noted that pagination currently causes a full page reload because URL parameters are used for state management. They asked for a better in-page state-management approach.
- User response: The user clarified that in-page pagination is fine and shareable page URLs are not required.
- User response: The user specified that the implementation must touch as little as possible and must keep server rendering and API calls on the server.
- User response: The user asked whether using `"use server"` instead of making the API call directly server-only could avoid full page reloads without adding broader state infrastructure.
- User response: The user approved the server action approach and asked to create a plan.
- User response: The user asked to remove references to earlier state-management alternatives from the spec.
- User response: The user asked to use a very lightweight context around pagination as an optional requirement to avoid unnecessary prop threading.

### AI Response Summaries

- Inspected the current page, policy content, pagination component, policy API, architecture docs, package dependencies, and existing My Policies design/plan.
- Confirmed that the current URL-link pagination causes route navigation by design.
- Recommended a thin server action wrapper around the existing server-only policy API with a page-local context for the displayed page.
- Presented the approved design for server-rendered initial content plus in-page server-action pagination, then updated the spec to use a lightweight page-local context around the list and pagination controls.
