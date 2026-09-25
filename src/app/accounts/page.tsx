import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Cuentas",
};

export default function AccountsPage() {
  return (
    <PageHeader
      title="Cuentas"
      description="Consulte y administre las cuentas bancarias del sistema."
    />
  );
}
