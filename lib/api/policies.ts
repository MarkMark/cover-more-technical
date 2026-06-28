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
  if (value === undefined || !Number.isFinite(value) || value < 1) {
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
  const pageSize = normalisePositiveInteger(
    options.pageSize,
    DEFAULT_PAGE_SIZE,
  );
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

  return {
    policies: activePolicies.slice(startIndex, startIndex + pageSize),
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
