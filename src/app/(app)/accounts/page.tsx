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
        description="Consulte una cuenta por ID o número. Los administradores pueden crear cuentas nuevas."
      />
      <AccountsPanel />
    </div>
  );
}
