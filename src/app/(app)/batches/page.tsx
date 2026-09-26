import type { Metadata } from "next";

import { BatchesPanel } from "@/components/batches/batches-panel";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Lotes",
};

export default function BatchesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Lotes"
        description="Seleccione un lote para consultar su estado. Los administradores pueden cargar un CSV de transferencias."
      />
      <BatchesPanel />
    </div>
  );
}
