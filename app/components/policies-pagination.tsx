"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { usePoliciesPagination } from "@/app/components/policies-pagination-context";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

export function PoliciesPagination() {
  const { goToPage, isPending, pagination } = usePoliciesPagination();

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent className="gap-4">
        <PaginationItem>
          <Button
            aria-label="Go to previous page"
            className="rounded-full"
            disabled={isPending || !pagination.hasPreviousPage}
            onClick={() => goToPage(pagination.currentPage - 1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
        {Array.from({ length: pagination.totalPages }, (_, index) => {
          const page = index + 1;
          const isActive = page === pagination.currentPage;

          return (
            <PaginationItem key={page}>
              <Button
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "bg-primary hover:bg-primary rounded-full border-transparent text-white hover:text-white"
                    : "rounded-full border-neutral-900 bg-neutral-50 text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900"
                }
                disabled={isPending}
                onClick={() => goToPage(page)}
                size="icon"
                type="button"
                variant={isActive ? "outline" : "ghost"}
              >
                {page}
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <Button
            aria-label="Go to next page"
            className="rounded-full"
            disabled={isPending || !pagination.hasNextPage}
            onClick={() => goToPage(pagination.currentPage + 1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
