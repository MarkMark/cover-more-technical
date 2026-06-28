import { Skeleton } from "@/components/ui/skeleton";

export function PoliciesSkeleton() {
  return (
    <div className="grid gap-6" aria-label="Loading policies">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          className="bg-card ring-foreground/10 grid gap-8 rounded-xl p-4 ring-1 md:grid-cols-[1fr_16rem]"
          key={index}
        >
          <div className="grid gap-8">
            <Skeleton className="h-9 w-full max-w-md" />
            <div className="grid gap-4 md:grid-cols-2 md:gap-8">
              <div className="grid gap-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
              <div className="grid gap-3 md:border-l md:pl-8">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-44" />
            </div>
          </div>
          <div className="grid gap-4 self-start">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <Skeleton className="h-9 w-64 max-w-full" />
      </div>
    </div>
  );
}
