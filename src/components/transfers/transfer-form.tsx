"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";

import { AccountCombobox } from "@/components/accounts/account-combobox";
import { getTransferErrorTitle } from "@/components/transfers/transfer-status";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserErrorMessage, isApiError } from "@/lib/api";
import { createTransfer } from "@/lib/transfers";
import type { Transfer } from "@/types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const AMOUNT_PATTERN = /^\d+(\.\d{1,4})?$/;
const IDEMPOTENCY_KEY_MAX_LENGTH = 128;

type TransferFormProps = {
  initialSourceAccountId?: string;
  onSuccess: (transfer: Transfer) => void;
  onSubmitStart?: () => void;
};

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

export function TransferForm({
  initialSourceAccountId = "",
  onSuccess,
  onSubmitStart,
}: TransferFormProps) {
  const [sourceAccountId, setSourceAccountId] = useState(initialSourceAccountId);
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState(
    "No se pudo completar la transferencia",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const source = sourceAccountId.trim();
    const destination = destinationAccountId.trim();
    const amountValue = amount.trim();
    const key =
      idempotencyKey.trim() ||
      (typeof crypto !== "undefined" ? crypto.randomUUID() : "");

    if (!source) {
      setErrorTitle("No se pudo completar la transferencia");
      setError("Seleccione la cuenta origen.");
      return;
    }

    if (!isUuid(source)) {
      setErrorTitle("No se pudo completar la transferencia");
      setError("El ID de la cuenta origen debe ser un UUID.");
      return;
    }

    if (!destination) {
      setErrorTitle("No se pudo completar la transferencia");
      setError("Seleccione la cuenta destino.");
      return;
    }

    if (!isUuid(destination)) {
      setErrorTitle("No se pudo completar la transferencia");
      setError("El ID de la cuenta destino debe ser un UUID.");
      return;
    }

    if (!amountValue) {
      setErrorTitle("No se pudo completar la transferencia");
      setError("Ingrese el monto.");
      return;
    }

    if (!AMOUNT_PATTERN.test(amountValue)) {
      setErrorTitle("No se pudo completar la transferencia");
      setError(
        "El monto debe ser un decimal positivo con hasta 4 decimales, por ejemplo 1000.50.",
      );
      return;
    }

    if (!key) {
      setErrorTitle("No se pudo completar la transferencia");
      setError("Ingrese una clave de idempotencia.");
      return;
    }

    if (key.length > IDEMPOTENCY_KEY_MAX_LENGTH) {
      setErrorTitle("No se pudo completar la transferencia");
      setError("La clave de idempotencia no puede superar 128 caracteres.");
      return;
    }

    setIdempotencyKey(key);
    setError(null);
    onSubmitStart?.();
    setIsSubmitting(true);

    try {
      const transfer = await createTransfer({
        sourceAccountId: source,
        destinationAccountId: destination,
        amount: amountValue,
        idempotencyKey: key,
      });
      onSuccess(transfer);
      setAmount("");
      setIdempotencyKey(
        typeof crypto !== "undefined" ? crypto.randomUUID() : "",
      );
    } catch (caughtError) {
      setErrorTitle(
        getTransferErrorTitle(
          isApiError(caughtError) ? caughtError.code : undefined,
        ),
      );
      setError(getUserErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="source-account-id">Cuenta origen</Label>
        <AccountCombobox
          id="source-account-id"
          name="sourceAccountId"
          value={sourceAccountId}
          excludeAccountId={destinationAccountId || undefined}
          placeholder="Seleccionar cuenta"
          disabled={isSubmitting}
          invalid={Boolean(error)}
          onValueChange={setSourceAccountId}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination-account-id">Cuenta destino</Label>
        <AccountCombobox
          id="destination-account-id"
          name="destinationAccountId"
          value={destinationAccountId}
          excludeAccountId={sourceAccountId || undefined}
          placeholder="Seleccionar cuenta"
          disabled={isSubmitting}
          invalid={Boolean(error)}
          onValueChange={setDestinationAccountId}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transfer-amount">Monto</Label>
        <Input
          id="transfer-amount"
          name="amount"
          inputMode="decimal"
          value={amount}
          placeholder="Ej. 1000.50"
          autoComplete="off"
          disabled={isSubmitting}
          onChange={(event) => setAmount(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Envíe el monto como texto decimal, con hasta 4 decimales. El backend
          valida los fondos.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="idempotency-key">Clave de idempotencia</Label>
        <Input
          id="idempotency-key"
          name="idempotencyKey"
          value={idempotencyKey}
          maxLength={IDEMPOTENCY_KEY_MAX_LENGTH}
          placeholder="Opcional: se genera al enviar si queda vacía"
          autoComplete="off"
          disabled={isSubmitting}
          onChange={(event) => setIdempotencyKey(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Si reintenta exactamente la misma transferencia, use la misma clave.
          Si cambia origen, destino o monto, use una clave distinta.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Procesando..." : "Transferir"}
      </Button>
    </form>
  );
}
