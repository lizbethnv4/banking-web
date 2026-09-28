import Link from "next/link";
import { ArrowLeftRight, FileText, List } from "lucide-react";

import {
  getAccountStatusClassName,
  getAccountStatusLabel,
} from "@/components/accounts/account-status";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyableId } from "@/components/ui/copyable-id";
import { formatMoney } from "@/lib/money";
import type { Account } from "@/types";

type AccountCardProps = {
  account: Account;
};

export function AccountCard({ account }: AccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cuenta {account.accountNumber}</CardTitle>
        <CardDescription>{account.holderName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Saldo disponible</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">
          {formatMoney(account.balance, account.currency)}
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Número de cuenta</dt>
            <dd className="mt-1 font-medium">{account.accountNumber}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">ID</dt>
            <dd className="mt-1">
              <CopyableId value={account.id} label="ID de la cuenta" />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Moneda</dt>
            <dd className="mt-1 font-medium">{account.currency}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estado</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={getAccountStatusClassName(account.status)}
              >
                {getAccountStatusLabel(account.status)}
              </Badge>
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Link
          href={`/movements?account=${encodeURIComponent(account.id)}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <List />
          Ver movimientos
        </Link>
        <Link
          href={`/transfers?source=${encodeURIComponent(account.id)}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeftRight />
          Transferir
        </Link>
        <Link
          href={`/statements?account=${encodeURIComponent(account.id)}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <FileText />
          Estado de cuenta
        </Link>
      </CardFooter>
    </Card>
  );
}
