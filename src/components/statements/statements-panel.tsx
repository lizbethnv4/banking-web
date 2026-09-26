"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, FileDown } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";

import {
  getAccountStatusClassName,
  getAccountStatusLabel,
} from "@/components/accounts/account-status";
import {
  StatementForm,
  type StatementFormValue,
} from "@/components/statements/statement-form";
import {
  getStatementMonthLabel,
  type StatementMonth,
} from "@/components/statements/statement-month";
import {
  PAGE_SIZE_OPTIONS,
  StatementMovements,
} from "@/components/statements/statement-movements";
import { StatementSummary } from "@/components/statements/statement-summary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserErrorMessage, isApiError } from "@/lib/api";
import {
  downloadAccountStatementPdf,
  getAccountStatement,
} from "@/lib/statements";
import type { AccountStatement, GetAccountStatementQuery } from "@/types";

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;
const DEFAULT_PAGE_SIZE = 20;

type AppliedQuery = GetAccountStatementQuery & {
  account: string;
};

type StatementsPanelProps = {
  initialAccount?: string;
};

function currentFormValues(account = ""): StatementFormValue {
  const now = new Date();

  return {
    account,
    year: String(now.getFullYear()),
    month: (now.getMonth() + 1) as StatementMonth,
  };
}

function parseYear(value: string): number | null {
  const trimmed = value.trim();

  if (!/^\d{4}$/.test(trimmed)) {
    return null;
  }

  const year = Number(trimmed);

  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return null;
  }

  return year;
}

function getStatementErrorTitle(code?: string) {
  switch (code) {
    case "ACCOUNT_NOT_FOUND":
      return "No se encontró la cuenta";
    case "VALIDATION_ERROR":
      return "Parámetros inválidos";
    default:
      return "No se pudo consultar el estado de cuenta";
  }
}

function getPdfErrorTitle(code?: string) {
  switch (code) {
    case "ACCOUNT_NOT_FOUND":
      return "No se encontró la cuenta";
    case "VALIDATION_ERROR":
      return "Parámetros inválidos";
    default:
      return "No se pudo exportar el PDF";
  }
}

export function StatementsPanel({ initialAccount = "" }: StatementsPanelProps) {
  const [form, setForm] = useState<StatementFormValue>(
    currentFormValues(initialAccount),
  );
  const [applied, setApplied] = useState<AppliedQuery | null>(null);
  const [statement, setStatement] = useState<AccountStatement | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [isPaging, setIsPaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState(
    "No se pudo consultar el estado de cuenta",
  );
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const replaceAllRef = useRef(true);

  useEffect(() => {
    if (!applied) {
      return;
    }

    const query = applied;
    const replaceAll = replaceAllRef.current;
    let cancelled = false;

    async function load() {
      if (replaceAll) {
        setIsConsulting(true);
        setStatement(null);
      } else {
        setIsPaging(true);
      }
      setError(null);

      try {
        const response = await getAccountStatement(query.account, query);
        if (!cancelled) {
          setStatement(response);
        }
      } catch (caughtError) {
        if (!cancelled) {
          if (replaceAll) {
            setStatement(null);
          }
          setErrorTitle(
            getStatementErrorTitle(
              isApiError(caughtError) ? caughtError.code : undefined,
            ),
          );
          setError(getUserErrorMessage(caughtError));
        }
      } finally {
        if (!cancelled) {
          setIsConsulting(false);
          setIsPaging(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [applied]);

  function validateForm(values: StatementFormValue) {
    if (!values.account.trim()) {
      return "Seleccione una cuenta.";
    }

    if (parseYear(values.year) === null) {
      return `El año debe ser un entero entre ${String(MIN_YEAR)} y ${String(MAX_YEAR)}.`;
    }

    return null;
  }

  function handleConsult() {
    const validationError = validateForm(form);

    if (validationError) {
      setStatement(null);
      setApplied(null);
      setErrorTitle("No se pudo consultar el estado de cuenta");
      setError(validationError);
      return;
    }

    const year = parseYear(form.year);

    if (year === null) {
      return;
    }

    replaceAllRef.current = true;
    setApplied({
      account: form.account.trim(),
      year,
      month: form.month,
      page: 1,
      pageSize: applied?.pageSize ?? DEFAULT_PAGE_SIZE,
    });
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

    replaceAllRef.current = false;
    setApplied({
      ...applied,
      page: nextPageSize === applied.pageSize ? pagination.pageIndex + 1 : 1,
      pageSize: nextPageSize,
    });
  }

  async function handleExportPdf() {
    if (!applied || !statement || isExportingPdf) {
      return;
    }

    setIsExportingPdf(true);
    setError(null);

    try {
      await downloadAccountStatementPdf(
        applied.account,
        {
          year: applied.year,
          month: applied.month,
        },
        {
          filenameAccount: statement.account.accountNumber,
        },
      );
    } catch (caughtError) {
      setErrorTitle(
        getPdfErrorTitle(isApiError(caughtError) ? caughtError.code : undefined),
      );
      setError(getUserErrorMessage(caughtError));
    } finally {
      setIsExportingPdf(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consultar estado de cuenta</CardTitle>
          <CardDescription>
            El resumen mensual cubre todo el período. Los movimientos se piden
            por página al backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StatementForm
            values={form}
            isLoading={isConsulting}
            onChange={setForm}
            onSubmit={handleConsult}
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

      {isConsulting ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Card>
            <CardContent>
              <StatementMovements
                data={[]}
                page={applied?.page ?? 1}
                pageSize={applied?.pageSize ?? DEFAULT_PAGE_SIZE}
                pageCount={0}
                rowCount={0}
                currency="DOP"
                isLoading
                onPaginationChange={handlePaginationChange}
              />
            </CardContent>
          </Card>
        </div>
      ) : null}

      {statement && applied ? (
        <div className="space-y-6" aria-live="polite">
          <Card>
            <CardHeader>
              <CardTitle>Estado de cuenta</CardTitle>
              <CardDescription>
                {getStatementMonthLabel(statement.period.month)}{" "}
                {String(statement.period.year)}
              </CardDescription>
              <CardAction>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isExportingPdf}
                  onClick={() => {
                    void handleExportPdf();
                  }}
                >
                  <FileDown />
                  {isExportingPdf ? "Generando PDF..." : "Exportar PDF"}
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Del {statement.period.from} al {statement.period.to}
              </p>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Titular</dt>
                  <dd className="mt-1 font-medium">
                    {statement.account.holderName}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Número de cuenta</dt>
                  <dd className="mt-1 font-medium">
                    {statement.account.accountNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">ID</dt>
                  <dd className="mt-1 break-all font-medium">
                    {statement.account.id}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Moneda</dt>
                  <dd className="mt-1 font-medium">
                    {statement.account.currency}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Estado</dt>
                  <dd className="mt-1">
                    <Badge
                      variant="outline"
                      className={getAccountStatusClassName(
                        statement.account.status,
                      )}
                    >
                      {getAccountStatusLabel(statement.account.status)}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <StatementSummary
            summary={statement.summary}
            currency={statement.account.currency}
          />

          <Card>
            <CardHeader>
              <CardTitle>Movimientos del período</CardTitle>
              <CardDescription>
                Página solicitada al backend. El resumen no se recalcula en
                esta pantalla.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatementMovements
                data={isPaging ? [] : statement.movements.data}
                page={applied.page}
                pageSize={applied.pageSize}
                pageCount={statement.movements.pagination.totalPages}
                rowCount={statement.movements.pagination.total}
                currency={statement.account.currency}
                isLoading={isPaging}
                onPaginationChange={handlePaginationChange}
              />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
