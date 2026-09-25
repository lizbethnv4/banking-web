import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Lotes",
};

export default function BatchesPage() {
  return (
    <PageHeader
      title="Lotes"
      description="Procese operaciones mediante archivos por lotes y consulte su estado."
    />
  );
}
