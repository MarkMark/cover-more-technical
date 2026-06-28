import { Suspense } from "react";

import { PoliciesContent } from "@/app/components/policies-content";
import { PoliciesSkeleton } from "@/app/components/policies-skeleton";
import { parsePositivePage } from "@/lib/pagination";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const page = parsePositivePage((await searchParams).page);

  return (
    <div className="flex flex-1 flex-col bg-neutral-100">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Suspense key={page} fallback={<PoliciesSkeleton />}>
          <PoliciesContent page={page} />
        </Suspense>
      </main>
    </div>
  );
}
