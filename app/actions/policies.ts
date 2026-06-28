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
