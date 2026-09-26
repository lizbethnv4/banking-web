"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";

import {
  AccountCombobox,
  formatAccountOptionLabel,
} from "@/components/accounts/account-combobox";
import { getTransferErrorTitle } from "@/components/transfers/transfer-status";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccountOptions } from "@/hooks/use-account-options";
import { getUserErrorMessage, isApiError } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import { createTransfer } from "@/lib/transfers";
import type { CreateTransferRequest, Transfer } from "@/types";

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
  const { accounts } = useAccountOptions();
  const [sourceAccountId, setSourceAccountId] = useState(initialSourceAccountId);
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [pendingTransfer, setPendingTransfer] =
    useState<CreateTransferRequest | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState(
    "No se pudo completar la transferencia",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sourceAccount = accounts.find(
    (account) => account.id === pendingTransfer?.sourceAccountId,
  );
  const destinationAccount = accounts.find(
    (account) => account.id === pendingTransfer?.destinationAccountId,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    setPendingTransfer({
      sourceAccountId: source,
      destinationAccountId: destination,
      amount: amountValue,
      idempotencyKey: key,
    });
    setConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!pendingTransfer || isSubmitting) {
      return;
    }

    onSubmitStart?.();
    setIsSubmitting(true);

    try {
      const transfer = await createTransfer(pendingTransfer);
      setConfirmOpen(false);
      setPendingTransfer(null);
      onSuccess(transfer);
      setAmount("");
      setIdempotencyKey(
        typeof crypto !== "undefined" ? crypto.randomUUID() : "",
      );
    } catch (caughtError) {
      setConfirmOpen(false);
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
    <>
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

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (isSubmitting) {
            return;
          }

          setConfirmOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar transferencia</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingTransfer
                ? `¿Está seguro que desea transferir ${formatMoney(pendingTransfer.amount, "DOP")}?`
                : "¿Está seguro que desea realizar esta transferencia?"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingTransfer ? (
            <dl className="mt-4 grid gap-3">
              <div>
                <dt className="text-muted-foreground">Cuenta origen</dt>
                <dd className="mt-1 font-medium">
                  {sourceAccount
                    ? formatAccountOptionLabel(sourceAccount)
                    : "Cuenta seleccionada"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Cuenta destino</dt>
                <dd className="mt-1 font-medium">
                  {destinationAccount
                    ? formatAccountOptionLabel(destinationAccount)
                    : "Cuenta seleccionada"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Monto</dt>
                <dd className="mt-1 font-medium">
                  {formatMoney(pendingTransfer.amount, "DOP")}
                </dd>
              </div>
            </dl>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogClose
              disabled={isSubmitting}
              render={<Button type="button" variant="outline" />}
            >
              Cancelar
            </AlertDialogClose>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                void handleConfirm();
              }}
            >
              {isSubmitting ? "Procesando..." : "Sí, transferir"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
