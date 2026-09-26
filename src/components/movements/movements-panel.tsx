"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";

import {
  MovementsFilters,
  type MovementFiltersValue,
} from "@/components/movements/movements-filters";
import {
  MovementsDataTable,
  PAGE_SIZE_OPTIONS,
} from "@/components/movements/movements-data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserErrorMessage, isApiError } from "@/lib/api";
import { getAccountMovements } from "@/lib/movements";
import type {
  AccountMovementsResponse,
  GetAccountMovementsQuery,
} from "@/types";

const AMOUNT_PATTERN = /^\d+(\.\d{1,4})?$/;
const DEFAULT_PAGE_SIZE = 20;

type AppliedQuery = GetAccountMovementsQuery & {
  account: string;
};

type MovementsPanelProps = {
  initialAccount?: string;
};

function emptyFilters(account = ""): MovementFiltersValue {
  return {
    account,
    from: "",
    to: "",
    type: "",
    minAmount: "",
    maxAmount: "",
  };
}

function toAppliedQuery(
  filters: MovementFiltersValue,
  page: number,
  pageSize: number,
): AppliedQuery {
  return {
    account: filters.account.trim(),
    page,
    pageSize,
    from: filters.from || undefined,
    to: filters.to || undefined,
    type: filters.type || undefined,
    minAmount: filters.minAmount.trim() || undefined,
    maxAmount: filters.maxAmount.trim() || undefined,
  };
}

function getMovementsErrorTitle(code?: string) {
  switch (code) {
    case "ACCOUNT_NOT_FOUND":
      return "No se encontró la cuenta";
    case "VALIDATION_ERROR":
      return "Filtros inválidos";
    default:
      return "No se pudieron consultar los movimientos";
  }
}

export function MovementsPanel({ initialAccount = "" }: MovementsPanelProps) {
  const [filters, setFilters] = useState<MovementFiltersValue>(
    emptyFilters(initialAccount),
  );
  const [applied, setApplied] = useState<AppliedQuery | null>(
    initialAccount
      ? toAppliedQuery(emptyFilters(initialAccount), 1, DEFAULT_PAGE_SIZE)
      : null,
  );
  const [result, setResult] = useState<AccountMovementsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState(
    "No se pudieron consultar los movimientos",
  );

  useEffect(() => {
    if (!applied) {
      return;
    }

    const query = applied;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAccountMovements(query.account, query);
        if (!cancelled) {
          setResult(response);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setResult(null);
          setErrorTitle(
            getMovementsErrorTitle(
              isApiError(caughtError) ? caughtError.code : undefined,
            ),
          );
          setError(getUserErrorMessage(caughtError));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [applied]);

  function validateFilters(nextFilters: MovementFiltersValue) {
    if (!nextFilters.account.trim()) {
      return "Seleccione una cuenta.";
    }

    if (nextFilters.minAmount && !AMOUNT_PATTERN.test(nextFilters.minAmount.trim())) {
      return "El monto mínimo debe ser un decimal con hasta 4 decimales.";
    }

    if (nextFilters.maxAmount && !AMOUNT_PATTERN.test(nextFilters.maxAmount.trim())) {
      return "El monto máximo debe ser un decimal con hasta 4 decimales.";
    }

    return null;
  }

  function handleSearch() {
    const validationError = validateFilters(filters);
    if (validationError) {
      setErrorTitle("No se pudieron consultar los movimientos");
      setError(validationError);
      return;
    }

    setApplied(toAppliedQuery(filters, 1, applied?.pageSize ?? DEFAULT_PAGE_SIZE));
  }

  function handleClear() {
    const nextFilters = emptyFilters(filters.account);
    setFilters(nextFilters);

    if (!nextFilters.account.trim()) {
      setApplied(null);
      setResult(null);
      setError(null);
      return;
    }

    setApplied(
      toAppliedQuery(nextFilters, 1, applied?.pageSize ?? DEFAULT_PAGE_SIZE),
    );
  }

  function handlePaginationChange(pagination: PaginationState) {
    if (!applied) {
      return;
    }

    const nextPageSize = PAGE_SIZE_OPTIONS.includes(
      pagination.pageSize as (typeof PAGE_SIZE_OPTIONS)[number],
    )
      ? pagination.pageSize
      : applied.pageSize;

    setApplied({
      ...applied,
      page: nextPageSize === applied.pageSize ? pagination.pageIndex + 1 : 1,
      pageSize: nextPageSize,
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consulta de movimientos</CardTitle>
          <CardDescription>
            Los filtros y la paginación se envían al backend. Esta pantalla no
            carga el historial completo en el navegador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MovementsFilters
            values={filters}
            isLoading={isLoading}
            onChange={setFilters}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {applied && (isLoading || result || !error) ? (
        <Card>
          <CardContent>
            <MovementsDataTable
              data={result?.data ?? []}
              page={applied.page}
              pageSize={applied.pageSize}
              pageCount={result?.pagination.totalPages ?? 0}
              rowCount={result?.pagination.total ?? 0}
              isLoading={isLoading}
              onPaginationChange={handlePaginationChange}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
