"use client";

import { useState } from "react";

import { RoleGuard } from "@/components/auth/role-guard";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountCreateForm } from "@/components/accounts/account-create-form";
import { AccountSearchForm } from "@/components/accounts/account-search-form";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAdmin } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Account } from "@/types";

export function AccountsPanel() {
  const { user } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const canCreateAccounts = isAdmin(user);

  return (
    <div className="space-y-6">
      <div
        className={cn("grid gap-6", canCreateAccounts && "lg:grid-cols-2")}
      >
        <RoleGuard roles={["ADMIN"]}>
          <Card>
            <CardHeader>
              <CardTitle>Crear cuenta</CardTitle>
              <CardDescription>
                El número, la moneda y el saldo inicial los asigna el backend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountCreateForm onCreated={setAccount} />
            </CardContent>
          </Card>
        </RoleGuard>

        <Card>
          <CardHeader>
            <CardTitle>Buscar cuenta</CardTitle>
            <CardDescription>
              Seleccione una cuenta para consultar su detalle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountSearchForm
              onFound={setAccount}
              onNotFound={() => setAccount(null)}
            />
          </CardContent>
        </Card>
      </div>

      {account ? (
        <section aria-live="polite" aria-label="Resultado de la cuenta">
          <AccountCard account={account} />
        </section>
      ) : null}
    </div>
  );
}
