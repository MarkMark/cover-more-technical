import type { PoliciesPagination as PoliciesPaginationData } from "@/lib/api/policies";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
      <PaginationContent>
        {pagination.hasPreviousPage ? (
          <PaginationItem>
            <PaginationPrevious
              href={getPageHref(pagination.currentPage - 1)}
            />
          </PaginationItem>
        ) : null}
        {Array.from({ length: pagination.totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={getPageHref(page)}
                isActive={page === pagination.currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {pagination.hasNextPage ? (
          <PaginationItem>
            <PaginationNext href={getPageHref(pagination.currentPage + 1)} />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}

function getPageHref(page: number) {
  return page === 1 ? "/" : `/?page=${page}`;
}
