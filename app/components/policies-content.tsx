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
