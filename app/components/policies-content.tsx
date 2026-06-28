import { fetchPolicies } from "@/lib/api/policies";
import { PolicyCard } from "@/app/components/policy-card";
import { PoliciesPagination } from "@/app/components/policies-pagination";

type PoliciesContentProps = {
  page: number;
};

export async function PoliciesContent({ page }: PoliciesContentProps) {
  const { policies, pagination } = await fetchPolicies({
    page,
    pageSize: 3,
    sortOrder: "ascending",
  });

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
      <PoliciesPagination pagination={pagination} />
    </div>
  );
}
