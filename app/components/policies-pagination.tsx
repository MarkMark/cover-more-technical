import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { PoliciesPagination as PoliciesPaginationData } from "@/lib/api/policies";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

type PoliciesPaginationProps = {
  pagination: PoliciesPaginationData;
};

export function PoliciesPagination({ pagination }: PoliciesPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent className="gap-4">
        {pagination.hasPreviousPage ? (
          <PaginationItem>
            <PaginationLink
              aria-label="Go to previous page"
              className="rounded-full"
              href={getPageHref(pagination.currentPage - 1)}
            >
              <ChevronLeftIcon aria-hidden="true" />
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {Array.from({ length: pagination.totalPages }, (_, index) => {
          const page = index + 1;
          const isActive = page === pagination.currentPage;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                className={
                  isActive
                    ? "bg-primary hover:bg-primary rounded-full border-transparent text-white hover:text-white"
                    : "rounded-full border-neutral-900 bg-neutral-50 text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900"
                }
                href={getPageHref(page)}
                isActive={isActive}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {pagination.hasNextPage ? (
          <PaginationItem>
            <PaginationLink
              aria-label="Go to next page"
              className="rounded-full"
              href={getPageHref(pagination.currentPage + 1)}
            >
              <ChevronRightIcon aria-hidden="true" />
            </PaginationLink>
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}

function getPageHref(page: number) {
  return page === 1 ? "/" : `/?page=${page}`;
}
