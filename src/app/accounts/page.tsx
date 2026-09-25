import type { Metadata } from "next";

import { AccountsPanel } from "@/components/accounts/accounts-panel";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Cuentas",
};

export default function AccountsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Cuentas"
        description="Cree una cuenta nueva o consulte una existente por ID o número. El saldo inicial y el número de cuenta los genera el backend."
      />
      <AccountsPanel />
    </div>
  );
}
