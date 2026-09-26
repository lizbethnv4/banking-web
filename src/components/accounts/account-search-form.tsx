"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";

import { AccountCombobox } from "@/components/accounts/account-combobox";
import { getAccountByIdOrNumber } from "@/lib/accounts";
import { getUserErrorMessage, isApiError } from "@/lib/api";
import type { Account } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type AccountSearchFormProps = {
  onFound: (account: Account) => void;
  onNotFound: () => void;
};

export function AccountSearchForm({
  onFound,
  onNotFound,
}: AccountSearchFormProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState("No se pudo consultar la cuenta");
  const [isSearching, setIsSearching] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const idOrNumber = query.trim();

    if (!idOrNumber) {
      setErrorTitle("No se pudo consultar la cuenta");
      setError("Seleccione una cuenta.");
      return;
    }

    setError(null);
    setIsSearching(true);

    try {
      const account = await getAccountByIdOrNumber(idOrNumber);
      onFound(account);
    } catch (caughtError) {
      onNotFound();
      const notFound =
        isApiError(caughtError) && caughtError.code === "ACCOUNT_NOT_FOUND";
      setErrorTitle(
        notFound ? "No se encontró la cuenta" : "No se pudo consultar la cuenta",
      );
      setError(getUserErrorMessage(caughtError));
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="account-id-or-number">Cuenta</Label>
        <AccountCombobox
          id="account-id-or-number"
          name="idOrNumber"
          value={query}
          placeholder="Seleccionar cuenta"
          disabled={isSearching}
          invalid={Boolean(error)}
          onValueChange={setQuery}
        />
      </div>

      {error ? (
        <Alert id="search-account-error" variant="destructive">
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
