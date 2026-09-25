import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Movimientos",
};

export default function MovementsPage() {
  return (
    <PageHeader
      title="Movimientos"
      description="Consulte el historial de movimientos asociados a las cuentas."
    />
  );
}
