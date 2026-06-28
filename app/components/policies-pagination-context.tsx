"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import { getPoliciesPage } from "@/app/actions/policies";
import type {
  FetchPoliciesResponse,
  PoliciesPagination,
  Policy,
} from "@/lib/api/policies";

type PoliciesPaginationContextValue = {
  errorMessage: string | null;
  goToPage: (page: number) => void;
  isPending: boolean;
  pagination: PoliciesPagination;
  policies: Policy[];
};

type PoliciesPaginationProviderProps = {
  children: ReactNode;
  initialResponse: FetchPoliciesResponse;
};

const PoliciesPaginationContext =
  createContext<PoliciesPaginationContextValue | null>(null);

export function PoliciesPaginationProvider({
  children,
  initialResponse,
}: PoliciesPaginationProviderProps) {
  const [response, setResponse] =
    useState<FetchPoliciesResponse>(initialResponse);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const goToPage = useCallback(
    (page: number) => {
      if (page === response.pagination.currentPage || isPending) {
        return;
      }

      setErrorMessage(null);

      startTransition(async () => {
        try {
          const nextResponse = await getPoliciesPage(page);

          setResponse(nextResponse);
        } catch {
          setErrorMessage("We couldn't load that page. Please try again.");
        }
      });
    },
    [isPending, response.pagination.currentPage, startTransition],
  );

  const value = useMemo<PoliciesPaginationContextValue>(
    () => ({
      errorMessage,
      goToPage,
      isPending,
      pagination: response.pagination,
      policies: response.policies,
    }),
    [errorMessage, goToPage, isPending, response],
  );

  return (
    <PoliciesPaginationContext.Provider value={value}>
      {children}
    </PoliciesPaginationContext.Provider>
  );
}

export function usePoliciesPagination() {
  const context = useContext(PoliciesPaginationContext);

  if (context === null) {
    throw new Error(
      "usePoliciesPagination must be used within PoliciesPaginationProvider",
    );
  }

  return context;
}
