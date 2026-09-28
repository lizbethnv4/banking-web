"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";

import { createAccount } from "@/lib/accounts";
import { getUserErrorMessage, isForbiddenError } from "@/lib/api";
import type { Account } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HOLDER_NAME_MAX_LENGTH = 200;

type AccountCreateFormProps = {
  onCreated: (account: Account) => void;
};

export function AccountCreateForm({ onCreated }: AccountCreateFormProps) {
  const [holderName, setHolderName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState("No se pudo crear la cuenta");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = holderName.trim();

    if (!trimmedName) {
      setErrorTitle("No se pudo crear la cuenta");
      setError("Ingrese el nombre del titular.");
      return;
    }

    if (trimmedName.length > HOLDER_NAME_MAX_LENGTH) {
      setErrorTitle("No se pudo crear la cuenta");
      setError("El nombre del titular no puede superar 200 caracteres.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const account = await createAccount({ holderName: trimmedName });
      setHolderName("");
      onCreated(account);
    } catch (caughtError) {
      setErrorTitle(
        isForbiddenError(caughtError)
          ? "Acceso no autorizado"
          : "No se pudo crear la cuenta",
      );
      setError(getUserErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="holder-name">Nombre del titular</Label>
        <Input
          id="holder-name"
          name="holderName"
          value={holderName}
          maxLength={HOLDER_NAME_MAX_LENGTH}
          placeholder="Ej. María Pérez"
          autoComplete="name"
          disabled={isSubmitting}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "create-account-error" : undefined}
          onChange={(event) => setHolderName(event.target.value)}
        />
      </div>

      {error ? (
        <Alert id="create-account-error" variant="destructive">
          <AlertCircle />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creando..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
