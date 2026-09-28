"use client";

import { useState } from "react";

import { TransferForm } from "@/components/transfers/transfer-form";
import { TransferResult } from "@/components/transfers/transfer-result";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Transfer } from "@/types";

type TransfersPanelProps = {
  initialSourceAccountId?: string;
};

export function TransfersPanel({
  initialSourceAccountId,
}: TransfersPanelProps) {
  const [transfer, setTransfer] = useState<Transfer | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva transferencia</CardTitle>
          <CardDescription>
            Seleccione las cuentas origen y destino. El backend valida fondos,
            estado de las cuentas e idempotencia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransferForm
            initialSourceAccountId={initialSourceAccountId}
            onSubmitStart={() => setTransfer(null)}
            onSuccess={setTransfer}
          />
        </CardContent>
      </Card>

      {transfer ? (
        <section aria-live="polite" aria-label="Resultado de la transferencia">
          <TransferResult transfer={transfer} />
        </section>
      ) : null}
    </div>
  );
}
