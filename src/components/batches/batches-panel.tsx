"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";

import { RoleGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth/auth-provider";
import { BatchItemsDataTable, PAGE_SIZE_OPTIONS } from "@/components/batches/batch-items-data-table";
import { BatchProgressCard } from "@/components/batches/batch-progress";
import { BatchSearchForm } from "@/components/batches/batch-search-form";
import { isTerminalBatchStatus } from "@/components/batches/batch-status";
import { BatchUploadForm } from "@/components/batches/batch-upload-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserErrorMessage, isApiError, isForbiddenError } from "@/lib/api";
import { createBatch, getBatch, getBatchItems, toBatchProcess } from "@/lib/batches";
import { isAdmin } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type {
  BatchItemStatus,
  BatchItemsResponse,
  BatchProcess,
} from "@/types";

const POLL_INTERVAL_MS = 2000;
const DEFAULT_PAGE_SIZE = 20;

function getBatchErrorTitle(code?: string, forbidden?: boolean) {
  if (forbidden) {
    return "Acceso no autorizado";
  }

  switch (code) {
    case "VALIDATION_ERROR":
      return "Archivo CSV inválido";
    case "BATCH_NOT_FOUND":
      return "No se encontró el lote";
    default:
      return "No se pudo procesar el lote";
  }
}

export function BatchesPanel() {
  const { user } = useAuth();
  const canCreateBatches = isAdmin(user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [batch, setBatch] = useState<BatchProcess | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState("No se pudo procesar el lote");
  const [itemsResult, setItemsResult] = useState<BatchItemsResponse | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<BatchItemStatus | "">("");
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const pollInFlightRef = useRef(false);

  const batchId = batch?.id ?? null;
  const shouldPoll = Boolean(batch && !isTerminalBatchStatus(batch.status));
  const isProcessing = shouldPoll;

  useEffect(() => {
    if (!batchId || !shouldPoll) {
      return;
    }

    const id = batchId;
    let cancelled = false;

    async function poll() {
      if (pollInFlightRef.current) {
        return;
      }

      pollInFlightRef.current = true;

      try {
        const nextBatch = await getBatch(id);
        if (!cancelled) {
          setBatch(nextBatch);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setErrorTitle(
            getBatchErrorTitle(
              isApiError(caughtError) ? caughtError.code : undefined,
              isForbiddenError(caughtError),
            ),
          );
          setError(getUserErrorMessage(caughtError));
        }
      } finally {
        pollInFlightRef.current = false;
      }
    }

    void poll();
    const intervalId = window.setInterval(() => {
      void poll();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [batchId, shouldPoll]);

  useEffect(() => {
    if (!batchId) {
      return;
    }

    const id = batchId;
    let cancelled = false;

    async function loadItems() {
      setIsLoadingItems(true);

      try {
        const response = await getBatchItems(id, {
          page,
          pageSize,
          status: statusFilter || undefined,
        });
        if (!cancelled) {
          setItemsResult(response);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setErrorTitle(
            getBatchErrorTitle(
              isApiError(caughtError) ? caughtError.code : undefined,
              isForbiddenError(caughtError),
            ),
          );
          setError(getUserErrorMessage(caughtError));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingItems(false);
        }
      }
    }

    void loadItems();

    return () => {
      cancelled = true;
    };
  }, [batchId, batch?.processedItems, batch?.status, page, pageSize, statusFilter]);

  function handleFileChange(file: File | null) {
    setSelectedFile(file);
    setError(null);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setErrorTitle("No se pudo procesar el lote");
      setError("Seleccione un archivo CSV.");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setErrorTitle("No se pudo procesar el lote");
      setError("Solo se permiten archivos CSV.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const created = await createBatch(selectedFile);
      setBatch(toBatchProcess(created));
      setPage(1);
      setStatusFilter("");
      setItemsResult(null);
    } catch (caughtError) {
      setErrorTitle(
        getBatchErrorTitle(
          isApiError(caughtError) ? caughtError.code : undefined,
          isForbiddenError(caughtError),
        ),
      );
      setError(getUserErrorMessage(caughtError));
    } finally {
      setIsUploading(false);
    }
  }

  function handleReset() {
    setSelectedFile(null);
    setBatch(null);
    setItemsResult(null);
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
    setStatusFilter("");
    setError(null);
  }

  function handleFound(nextBatch: BatchProcess) {
    setError(null);
    setBatch(nextBatch);
    setPage(1);
    setStatusFilter("");
    setItemsResult(null);
  }

  function handleStatusChange(nextStatus: BatchItemStatus | "") {
    setStatusFilter(nextStatus);
    setPage(1);
  }

  function handlePaginationChange(pagination: PaginationState) {
    const nextPageSize = PAGE_SIZE_OPTIONS.includes(
      pagination.pageSize as (typeof PAGE_SIZE_OPTIONS)[number],
    )
      ? pagination.pageSize
      : pageSize;

    setPage(nextPageSize === pageSize ? pagination.pageIndex + 1 : 1);
    setPageSize(nextPageSize);
  }

  return (
    <div className="space-y-6">
      <div
        className={cn("grid gap-6", canCreateBatches && "lg:grid-cols-2")}
      >
        <RoleGuard roles={["ADMIN"]}>
          <Card>
            <CardHeader>
              <CardTitle>Cargar archivo CSV</CardTitle>
              <CardDescription>
                El backend valida la estructura del archivo y procesa las
                transferencias de forma asíncrona.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BatchUploadForm
                selectedFile={selectedFile}
                isUploading={isUploading}
                isProcessing={isProcessing}
                onFileChange={handleFileChange}
                onSubmit={() => {
                  void handleUpload();
                }}
              />
            </CardContent>
          </Card>
        </RoleGuard>

        <Card>
          <CardHeader>
            <CardTitle>Consultar lote</CardTitle>
            <CardDescription>
              Seleccione un lote existente para consultar su estado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BatchSearchForm
              onFound={handleFound}
              onNotFound={() => setBatch(null)}
            />
          </CardContent>
        </Card>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {batch ? (
        <Card>
          <CardHeader>
            <CardTitle>Estado del procesamiento</CardTitle>
            <CardDescription>
              El progreso se actualiza cada 2 segundos hasta un estado final.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BatchProgressCard batch={batch} onReset={handleReset} />
          </CardContent>
        </Card>
      ) : null}

      {batch ? (
        <Card>
          <CardHeader>
            <CardTitle>Operaciones del lote</CardTitle>
            <CardDescription>
              Las operaciones se consultan paginadas. Esta pantalla no carga el
              lote completo en el navegador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BatchItemsDataTable
              data={itemsResult?.data ?? []}
              page={page}
              pageSize={pageSize}
              pageCount={itemsResult?.pagination.totalPages ?? 0}
              rowCount={itemsResult?.pagination.total ?? 0}
              status={statusFilter}
              isLoading={isLoadingItems}
              onStatusChange={handleStatusChange}
              onPaginationChange={handlePaginationChange}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
