"use client";

import { PolicyCard } from "@/app/components/policy-card";
import {
  PoliciesPaginationProvider,
  usePoliciesPagination,
} from "@/app/components/policies-pagination-context";
import { PoliciesPagination } from "@/app/components/policies-pagination";
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
