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
