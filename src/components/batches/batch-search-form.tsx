"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";

import { getBatch } from "@/lib/batches";
import { getUserErrorMessage, isApiError, isForbiddenError } from "@/lib/api";
import type { BatchProcess } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BatchSearchFormProps = {
  onFound: (batch: BatchProcess) => void;
  onNotFound: () => void;
};

function getBatchSearchErrorTitle(code?: string, forbidden?: boolean) {
  if (forbidden) {
    return "Acceso no autorizado";
  }

  if (code === "BATCH_NOT_FOUND") {
    return "No se encontró el lote";
  }

  return "No se pudo consultar el lote";
}

export function BatchSearchForm({ onFound, onNotFound }: BatchSearchFormProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState("No se pudo consultar el lote");
  const [isSearching, setIsSearching] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = query.trim();

    if (!id) {
      setErrorTitle("No se pudo consultar el lote");
      setError("Ingrese el ID del lote.");
      return;
    }

    setError(null);
    setIsSearching(true);

    try {
      const batch = await getBatch(id);
      onFound(batch);
    } catch (caughtError) {
      onNotFound();
      const forbidden = isForbiddenError(caughtError);
      setErrorTitle(
        getBatchSearchErrorTitle(
          isApiError(caughtError) ? caughtError.code : undefined,
          forbidden,
        ),
      );
      setError(getUserErrorMessage(caughtError));
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="batch-id">ID del lote</Label>
        <Input
          id="batch-id"
          name="batchId"
          value={query}
          placeholder="UUID del lote"
          autoComplete="off"
          disabled={isSearching}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "search-batch-error" : undefined}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error ? (
        <Alert id="search-batch-error" variant="destructive">
          <AlertCircle />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isSearching}>
        {isSearching ? "Buscando..." : "Buscar"}
      </Button>
    </form>
  );
}
