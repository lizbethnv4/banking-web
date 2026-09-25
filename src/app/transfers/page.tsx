import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Transferir",
};

export default function TransfersPage() {
  return (
    <PageHeader
      title="Transferir"
      description="Registre transferencias entre cuentas. Las validaciones de fondos y el cálculo de saldos se resuelven en el backend."
    />
  );
}
