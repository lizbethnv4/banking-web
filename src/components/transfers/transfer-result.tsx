import {
  getTransferStatusClassName,
  getTransferStatusLabel,
} from "@/components/transfers/transfer-status";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/money";
import type { Transfer } from "@/types";

type TransferResultProps = {
  transfer: Transfer;
};

function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("es-DO");
}

export function TransferResult({ transfer }: TransferResultProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transferencia {transfer.reference}</CardTitle>
        <CardDescription>
          Resultado devuelto por el backend. El saldo no se recalcula en esta
          pantalla.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Estado</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={getTransferStatusClassName(transfer.status)}
              >
                {getTransferStatusLabel(transfer.status)}
              </Badge>

            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Monto</dt>
            <dd className="mt-1 font-medium">
              {formatMoney(transfer.amount, "DOP")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Referencia</dt>
            <dd className="mt-1 break-all font-medium">{transfer.reference}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">ID</dt>
            <dd className="mt-1 break-all font-medium">{transfer.id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Cuenta origen</dt>
            <dd className="mt-1 break-all font-medium">
              {transfer.sourceAccountId}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Cuenta destino</dt>
            <dd className="mt-1 break-all font-medium">
              {transfer.destinationAccountId}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Clave de idempotencia</dt>
            <dd className="mt-1 break-all font-medium">
              {transfer.idempotencyKey}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Completada en</dt>
            <dd className="mt-1 font-medium">
              {formatDateTime(transfer.completedAt)}
            </dd>
          </div>
        </dl>

        {transfer.status === "FAILED" && transfer.failureMessage ? (
          <p className="mt-4 text-sm text-destructive">
            {transfer.failureMessage}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
